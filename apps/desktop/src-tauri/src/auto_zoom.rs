//! Deterministic, privacy-preserving automatic zoom suggestions.
//!
//! The recorder already stores cursor geometry and button transitions. This
//! module turns that event stream into ordinary, editable `ZoomSegment`s. It
//! deliberately does not inspect typed text, accessibility labels, or other
//! content.

use std::collections::BTreeMap;

use cap_project::{
    CursorClickEvent, CursorMoveEvent, GlideDirection, ZoomMode, ZoomSegment,
};

const MS_PER_SECOND: f64 = 1_000.0;
const TIME_QUANTUM_MS: f64 = 1.0;
const COORD_QUANTUM: f64 = 1_000_000.0;
const START_MIN_MS: i64 = 1;

/// A normalized, source-frame rectangle that should not contain an automatic
/// focal point (for example, the current webcam or caption safe area).
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct AvoidanceRect {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

/// Product defaults and safety controls for automatic zoom suggestions.
#[derive(Clone, Debug, PartialEq)]
pub struct AutoZoomConfig {
    pub lead_ms: f64,
    pub hold_ms: f64,
    pub merge_threshold_ms: f64,
    pub trailing_guard_ms: f64,
    pub tail_clearance_ms: f64,
    pub zoom_amount: f64,
    pub max_long_press_ms: f64,
    pub dwell_min_ms: f64,
    pub dwell_radius: f64,
    pub approach_distance: f64,
    pub approach_window_ms: f64,
    pub edge_safe_margin: f64,
    pub avoidance_gap: f64,
    pub avoidance_rects: Vec<AvoidanceRect>,
    pub reduced_motion: bool,
    pub reduced_motion_max_scale: f64,
}

impl Default for AutoZoomConfig {
    fn default() -> Self {
        Self {
            lead_ms: 300.0,
            hold_ms: 2_500.0,
            merge_threshold_ms: 2_500.0,
            trailing_guard_ms: 1_000.0,
            tail_clearance_ms: 800.0,
            zoom_amount: 2.0,
            max_long_press_ms: 2_000.0,
            dwell_min_ms: 650.0,
            dwell_radius: 0.018,
            approach_distance: 0.08,
            approach_window_ms: 750.0,
            edge_safe_margin: 0.08,
            avoidance_gap: 0.025,
            avoidance_rects: Vec::new(),
            reduced_motion: false,
            reduced_motion_max_scale: 1.5,
        }
    }
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct NormalizedClick {
    time_ms: i64,
    // Sort button-down before button-up at the same timestamp so pairing never
    // depends on input order.
    up_sort_key: u8,
    cursor_num: u8,
    cursor_id: String,
    active_modifiers: Vec<String>,
}

impl NormalizedClick {
    fn is_down(&self) -> bool {
        self.up_sort_key == 0
    }
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct NormalizedMove {
    time_ms: i64,
    x: i64,
    y: i64,
    cursor_id: String,
    active_modifiers: Vec<String>,
}

impl NormalizedMove {
    fn point(&self) -> (f64, f64) {
        (
            self.x as f64 / COORD_QUANTUM,
            self.y as f64 / COORD_QUANTUM,
        )
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
enum IntentKind {
    Dwell,
    Click,
}

#[derive(Clone, Debug)]
struct Intent {
    start_ms: i64,
    end_ms: i64,
    intent_ms: i64,
    focus: (f64, f64),
    kind: IntentKind,
}

#[derive(Clone, Copy, Debug)]
struct SafeRect {
    left: f64,
    top: f64,
    right: f64,
    bottom: f64,
}

/// Generates deterministic, editable zoom suggestions from a cursor event
/// stream. Invalid events are ignored, and all accepted values are quantized
/// before ordering so the result is stable across platforms and runs.
pub fn generate_zoom_segments(
    clicks: &[CursorClickEvent],
    moves: &[CursorMoveEvent],
    recording_duration_secs: f64,
    config: &AutoZoomConfig,
) -> Vec<ZoomSegment> {
    if !recording_duration_secs.is_finite() || recording_duration_secs <= 0.0 {
        return Vec::new();
    }

    let config = sanitize_config(config);
    let duration_ms = quantize_time(recording_duration_secs * MS_PER_SECOND);
    let click_cutoff_ms = duration_ms - quantize_time(config.trailing_guard_ms);
    let end_limit_ms = duration_ms - quantize_time(config.tail_clearance_ms);
    if click_cutoff_ms <= 0 || end_limit_ms <= START_MIN_MS {
        return Vec::new();
    }

    let moves = normalize_moves(moves, duration_ms);
    let clicks = normalize_clicks(clicks, duration_ms);
    let mut click_intents = click_intents(&clicks, &moves, click_cutoff_ms, &config);
    let mut dwell_intents = dwell_intents(&moves, click_cutoff_ms, &config);

    // A click is stronger evidence of intent than a dwell. Avoid creating two
    // suggestions for the same interaction, even if their detected timestamps
    // are slightly different.
    dwell_intents.retain(|dwell| {
        !click_intents
            .iter()
            .any(|click| intervals_overlap(dwell, click))
    });

    click_intents.extend(dwell_intents);
    click_intents.sort_by(intent_order);

    let merge_threshold_ms = quantize_time(config.merge_threshold_ms);
    let mut merged: Vec<Intent> = Vec::new();
    for mut intent in click_intents {
        intent.start_ms = intent.start_ms.max(START_MIN_MS);
        intent.end_ms = intent.end_ms.min(end_limit_ms);
        if intent.end_ms <= intent.start_ms {
            continue;
        }

        if let Some(previous) = merged.last_mut()
            && intent.start_ms <= previous.end_ms.saturating_add(merge_threshold_ms)
        {
            previous.end_ms = previous.end_ms.max(intent.end_ms);
            // Clicks win over dwells. Within the same class, the later intent
            // provides the final framing for the merged interaction.
            if intent.kind > previous.kind
                || (intent.kind == previous.kind && intent.intent_ms >= previous.intent_ms)
            {
                previous.intent_ms = intent.intent_ms;
                previous.focus = intent.focus;
                previous.kind = intent.kind;
            }
            continue;
        }

        merged.push(intent);
    }

    let amount = if config.reduced_motion {
        config.zoom_amount.min(config.reduced_motion_max_scale)
    } else {
        config.zoom_amount
    };

    merged
        .into_iter()
        .map(|intent| {
            let focus = if config.reduced_motion {
                // Reduced motion deliberately avoids panning between targets.
                (0.5, 0.5)
            } else {
                safe_focus(intent.focus, &config)
            };

            ZoomSegment {
                start: intent.start_ms as f64 / MS_PER_SECOND,
                end: intent.end_ms as f64 / MS_PER_SECOND,
                amount,
                mode: ZoomMode::Manual {
                    x: focus.0 as f32,
                    y: focus.1 as f32,
                },
                glide_direction: GlideDirection::None,
                glide_speed: 0.5,
                instant_animation: false,
                edge_snap_ratio: 0.25,
            }
        })
        .collect()
}

fn normalize_clicks(clicks: &[CursorClickEvent], duration_ms: i64) -> Vec<NormalizedClick> {
    let mut normalized = clicks
        .iter()
        .filter(|click| click.time_ms.is_finite())
        .filter_map(|click| {
            let time_ms = quantize_time(click.time_ms);
            (time_ms >= 0 && time_ms <= duration_ms).then_some(NormalizedClick {
                time_ms,
                up_sort_key: u8::from(!click.down),
                cursor_num: click.cursor_num,
                cursor_id: click.cursor_id.clone(),
                active_modifiers: click.active_modifiers.clone(),
            })
        })
        .collect::<Vec<_>>();
    normalized.sort();
    normalized
}

fn normalize_moves(moves: &[CursorMoveEvent], duration_ms: i64) -> Vec<NormalizedMove> {
    let mut normalized = moves
        .iter()
        .filter(|event| event.time_ms.is_finite() && event.x.is_finite() && event.y.is_finite())
        .filter_map(|event| {
            let time_ms = quantize_time(event.time_ms);
            (time_ms >= 0 && time_ms <= duration_ms).then_some(NormalizedMove {
                time_ms,
                x: quantize_coordinate(event.x.clamp(0.0, 1.0)),
                y: quantize_coordinate(event.y.clamp(0.0, 1.0)),
                cursor_id: event.cursor_id.clone(),
                active_modifiers: event.active_modifiers.clone(),
            })
        })
        .collect::<Vec<_>>();
    normalized.sort();
    normalized.dedup();
    normalized
}

fn click_intents(
    clicks: &[NormalizedClick],
    moves: &[NormalizedMove],
    click_cutoff_ms: i64,
    config: &AutoZoomConfig,
) -> Vec<Intent> {
    let lead_ms = quantize_time(config.lead_ms);
    let hold_ms = quantize_time(config.hold_ms);
    let max_long_press_ms = quantize_time(config.max_long_press_ms);
    // `cursor_id` identifies the rendered cursor shape, not the physical
    // pointer, so it may legitimately change between button-down and button-up.
    let mut pending = BTreeMap::<u8, NormalizedClick>::new();
    let mut intents = Vec::new();

    let mut push_press = |down: NormalizedClick, release_ms: i64| {
        if down.time_ms >= click_cutoff_ms {
            return;
        }
        let bounded_release = release_ms
            .max(down.time_ms)
            .min(down.time_ms.saturating_add(max_long_press_ms));
        intents.push(Intent {
            start_ms: down.time_ms.saturating_sub(lead_ms),
            end_ms: bounded_release.saturating_add(hold_ms),
            intent_ms: down.time_ms,
            focus: nearest_focus(moves, down.time_ms, &down.cursor_id),
            kind: IntentKind::Click,
        });
    };

    for click in clicks {
        let key = click.cursor_num;
        if click.is_down() {
            if let Some(previous_down) = pending.insert(key, click.clone()) {
                let release_ms = previous_down.time_ms;
                push_press(previous_down, release_ms);
            }
        } else if let Some(down) = pending.remove(&key) {
            push_press(down, click.time_ms);
        }
    }

    for (_, down) in pending {
        let release_ms = down.time_ms;
        push_press(down, release_ms);
    }

    intents.sort_by(intent_order);
    intents
}

fn dwell_intents(
    moves: &[NormalizedMove],
    click_cutoff_ms: i64,
    config: &AutoZoomConfig,
) -> Vec<Intent> {
    let lead_ms = quantize_time(config.lead_ms);
    let hold_ms = quantize_time(config.hold_ms);
    let dwell_min_ms = quantize_time(config.dwell_min_ms);
    let approach_window_ms = quantize_time(config.approach_window_ms);
    let dwell_radius_sq = config.dwell_radius * config.dwell_radius;
    let approach_distance_sq = config.approach_distance * config.approach_distance;
    let mut intents = Vec::new();
    let mut i = 0;

    while i < moves.len() {
        let target = &moves[i];
        if target.time_ms >= click_cutoff_ms {
            break;
        }

        let approached = moves[..i].iter().rev().any(|prior| {
            let elapsed = target.time_ms - prior.time_ms;
            elapsed > 0
                && elapsed <= approach_window_ms
                && point_distance_sq(prior.point(), target.point()) >= approach_distance_sq
        });
        if !approached {
            i += 1;
            continue;
        }

        let mut confirmation_index = None;
        for (offset, candidate) in moves[i + 1..].iter().enumerate() {
            if point_distance_sq(candidate.point(), target.point()) > dwell_radius_sq {
                break;
            }
            if candidate.time_ms - target.time_ms >= dwell_min_ms {
                confirmation_index = Some(i + 1 + offset);
                break;
            }
        }

        let Some(confirmation_index) = confirmation_index else {
            i += 1;
            continue;
        };
        let confirmation_ms = moves[confirmation_index].time_ms;
        intents.push(Intent {
            start_ms: target.time_ms.saturating_sub(lead_ms),
            end_ms: confirmation_ms.saturating_add(hold_ms),
            intent_ms: target.time_ms,
            focus: target.point(),
            kind: IntentKind::Dwell,
        });
        // This dwell has been consumed. Continuing after its confirmation
        // prevents a stationary cluster from producing repeated suggestions.
        i = confirmation_index + 1;
    }

    intents
}

fn nearest_focus(moves: &[NormalizedMove], time_ms: i64, cursor_id: &str) -> (f64, f64) {
    let matching_cursor_exists = moves.iter().any(|event| event.cursor_id == cursor_id);
    moves
        .iter()
        .filter(|event| !matching_cursor_exists || event.cursor_id == cursor_id)
        .min_by(|a, b| {
            a.time_ms
                .abs_diff(time_ms)
                .cmp(&b.time_ms.abs_diff(time_ms))
                .then(u8::from(a.time_ms > time_ms).cmp(&u8::from(b.time_ms > time_ms)))
                .then(a.time_ms.cmp(&b.time_ms))
                .then(a.x.cmp(&b.x))
                .then(a.y.cmp(&b.y))
                .then(a.cursor_id.cmp(&b.cursor_id))
        })
        .map(NormalizedMove::point)
        .unwrap_or((0.5, 0.5))
}

fn safe_focus(focus: (f64, f64), config: &AutoZoomConfig) -> (f64, f64) {
    let margin = config.edge_safe_margin;
    let mut focus = (
        focus.0.clamp(margin, 1.0 - margin),
        focus.1.clamp(margin, 1.0 - margin),
    );

    for rect in config.avoidance_rects.iter().filter_map(sanitize_rect) {
        if !rect_contains(rect, focus) {
            continue;
        }

        let gap = config.avoidance_gap;
        let candidates = [
            ((rect.left - gap).max(margin), focus.1, 0_u8),
            ((rect.right + gap).min(1.0 - margin), focus.1, 1_u8),
            (focus.0, (rect.top - gap).max(margin), 2_u8),
            (focus.0, (rect.bottom + gap).min(1.0 - margin), 3_u8),
        ];

        if let Some((x, y, _)) = candidates
            .into_iter()
            .filter(|(x, y, _)| !rect_contains(rect, (*x, *y)))
            .min_by(|a, b| {
                let a_distance = point_distance_sq((a.0, a.1), focus);
                let b_distance = point_distance_sq((b.0, b.1), focus);
                a_distance.total_cmp(&b_distance).then(a.2.cmp(&b.2))
            })
        {
            focus = (x, y);
        }
    }

    focus
}

fn sanitize_config(config: &AutoZoomConfig) -> AutoZoomConfig {
    let defaults = AutoZoomConfig::default();
    let dwell_radius = finite_or(config.dwell_radius, defaults.dwell_radius).clamp(0.001, 0.25);
    AutoZoomConfig {
        lead_ms: finite_or(config.lead_ms, defaults.lead_ms).clamp(0.0, 10_000.0),
        hold_ms: finite_or(config.hold_ms, defaults.hold_ms).clamp(0.0, 30_000.0),
        merge_threshold_ms: finite_or(
            config.merge_threshold_ms,
            defaults.merge_threshold_ms,
        )
        .clamp(0.0, 30_000.0),
        trailing_guard_ms: finite_or(config.trailing_guard_ms, defaults.trailing_guard_ms)
            .clamp(0.0, 30_000.0),
        tail_clearance_ms: finite_or(config.tail_clearance_ms, defaults.tail_clearance_ms)
            .clamp(0.0, 30_000.0),
        zoom_amount: finite_or(config.zoom_amount, defaults.zoom_amount).clamp(1.0, 6.0),
        max_long_press_ms: finite_or(config.max_long_press_ms, defaults.max_long_press_ms)
            .clamp(0.0, 10_000.0),
        dwell_min_ms: finite_or(config.dwell_min_ms, defaults.dwell_min_ms)
            .clamp(100.0, 5_000.0),
        dwell_radius,
        approach_distance: finite_or(config.approach_distance, defaults.approach_distance)
            .clamp(dwell_radius * 2.0, 1.0),
        approach_window_ms: finite_or(config.approach_window_ms, defaults.approach_window_ms)
            .clamp(100.0, 5_000.0),
        edge_safe_margin: finite_or(config.edge_safe_margin, defaults.edge_safe_margin)
            .clamp(0.0, 0.45),
        avoidance_gap: finite_or(config.avoidance_gap, defaults.avoidance_gap).clamp(0.0, 0.2),
        avoidance_rects: config.avoidance_rects.clone(),
        reduced_motion: config.reduced_motion,
        reduced_motion_max_scale: finite_or(
            config.reduced_motion_max_scale,
            defaults.reduced_motion_max_scale,
        )
        .clamp(1.0, 2.0),
    }
}

fn sanitize_rect(rect: &AvoidanceRect) -> Option<SafeRect> {
    if !rect.x.is_finite()
        || !rect.y.is_finite()
        || !rect.width.is_finite()
        || !rect.height.is_finite()
    {
        return None;
    }

    let opposite_x = rect.x + rect.width;
    let opposite_y = rect.y + rect.height;
    if !opposite_x.is_finite() || !opposite_y.is_finite() {
        return None;
    }

    let left = rect.x.min(opposite_x).clamp(0.0, 1.0);
    let right = rect.x.max(opposite_x).clamp(0.0, 1.0);
    let top = rect.y.min(opposite_y).clamp(0.0, 1.0);
    let bottom = rect.y.max(opposite_y).clamp(0.0, 1.0);
    (right > left && bottom > top).then_some(SafeRect {
        left,
        top,
        right,
        bottom,
    })
}

fn intervals_overlap(a: &Intent, b: &Intent) -> bool {
    a.start_ms <= b.end_ms && b.start_ms <= a.end_ms
}

fn intent_order(a: &Intent, b: &Intent) -> std::cmp::Ordering {
    a.start_ms
        .cmp(&b.start_ms)
        .then(a.intent_ms.cmp(&b.intent_ms))
        .then(b.kind.cmp(&a.kind))
        .then_with(|| a.focus.0.total_cmp(&b.focus.0))
        .then_with(|| a.focus.1.total_cmp(&b.focus.1))
}

fn rect_contains(rect: SafeRect, point: (f64, f64)) -> bool {
    point.0 >= rect.left
        && point.0 <= rect.right
        && point.1 >= rect.top
        && point.1 <= rect.bottom
}

fn point_distance_sq(a: (f64, f64), b: (f64, f64)) -> f64 {
    let dx = a.0 - b.0;
    let dy = a.1 - b.1;
    dx * dx + dy * dy
}

fn finite_or(value: f64, fallback: f64) -> f64 {
    if value.is_finite() {
        value
    } else {
        fallback
    }
}

fn quantize_time(time_ms: f64) -> i64 {
    (time_ms / TIME_QUANTUM_MS).round() as i64
}

fn quantize_coordinate(value: f64) -> i64 {
    (value * COORD_QUANTUM).round() as i64
}

#[cfg(test)]
mod tests {
    use super::*;

    fn click(time_ms: f64, down: bool) -> CursorClickEvent {
        CursorClickEvent {
            active_modifiers: Vec::new(),
            cursor_num: 0,
            cursor_id: "pointer".to_owned(),
            time_ms,
            down,
        }
    }

    fn move_to(time_ms: f64, x: f64, y: f64) -> CursorMoveEvent {
        CursorMoveEvent {
            active_modifiers: Vec::new(),
            cursor_id: "pointer".to_owned(),
            time_ms,
            x,
            y,
        }
    }

    fn manual_focus(segment: &ZoomSegment) -> (f32, f32) {
        match segment.mode {
            ZoomMode::Manual { x, y } => (x, y),
            ZoomMode::Auto => panic!("automatic suggestions must have an editable focal point"),
        }
    }

    #[test]
    fn output_is_deterministic_under_input_order_and_quantization() {
        let ordered_clicks = vec![click(1_000.4, true), click(1_120.4, false)];
        let reversed_clicks = ordered_clicks.iter().cloned().rev().collect::<Vec<_>>();
        let ordered_moves = vec![
            move_to(700.2, 0.100_000_1, 0.2),
            move_to(999.7, 0.800_000_1, 0.7),
        ];
        let reversed_moves = ordered_moves.iter().cloned().rev().collect::<Vec<_>>();

        let a = generate_zoom_segments(
            &ordered_clicks,
            &ordered_moves,
            10.0,
            &AutoZoomConfig::default(),
        );
        let b = generate_zoom_segments(
            &reversed_clicks,
            &reversed_moves,
            10.0,
            &AutoZoomConfig::default(),
        );

        assert_eq!(a.len(), 1);
        assert_eq!(a[0].start, b[0].start);
        assert_eq!(a[0].end, b[0].end);
        assert_eq!(a[0].amount, b[0].amount);
        assert_eq!(manual_focus(&a[0]), manual_focus(&b[0]));
    }

    #[test]
    fn long_press_duration_is_bounded() {
        let segments = generate_zoom_segments(
            &[click(1_000.0, true), click(9_000.0, false)],
            &[move_to(1_000.0, 0.4, 0.4)],
            15.0,
            &AutoZoomConfig::default(),
        );

        assert_eq!(segments.len(), 1);
        assert_eq!(segments[0].start, 0.7);
        assert_eq!(segments[0].end, 5.5);
    }

    #[test]
    fn config_controls_lead_hold_and_merge_timing() {
        let config = AutoZoomConfig {
            lead_ms: 100.0,
            hold_ms: 700.0,
            merge_threshold_ms: 0.0,
            ..AutoZoomConfig::default()
        };
        let segments = generate_zoom_segments(
            &[click(2_000.0, true), click(4_000.0, true)],
            &[],
            10.0,
            &config,
        );

        assert_eq!(segments.len(), 2);
        assert_eq!((segments[0].start, segments[0].end), (1.9, 2.7));
        assert_eq!((segments[1].start, segments[1].end), (3.9, 4.7));
    }

    #[test]
    fn detects_approach_and_dwell_but_not_micro_jitter() {
        let dwell = generate_zoom_segments(
            &[],
            &[
                move_to(400.0, 0.1, 0.1),
                move_to(900.0, 0.72, 0.64),
                move_to(1_600.0, 0.725, 0.642),
            ],
            10.0,
            &AutoZoomConfig::default(),
        );
        assert_eq!(dwell.len(), 1);
        assert_eq!((dwell[0].start, dwell[0].end), (0.6, 4.1));

        let jitter = (0..30)
            .map(|index| {
                move_to(
                    1_000.0 + f64::from(index) * 35.0,
                    0.5 + f64::from(index) * 0.0002,
                    0.5,
                )
            })
            .collect::<Vec<_>>();
        assert!(
            generate_zoom_segments(&[], &jitter, 10.0, &AutoZoomConfig::default()).is_empty()
        );
    }

    #[test]
    fn click_suppresses_overlapping_dwell_intent() {
        let segments = generate_zoom_segments(
            &[click(1_500.0, true)],
            &[
                move_to(400.0, 0.1, 0.1),
                move_to(900.0, 0.7, 0.7),
                move_to(1_600.0, 0.7, 0.7),
            ],
            10.0,
            &AutoZoomConfig::default(),
        );

        assert_eq!(segments.len(), 1);
        assert_eq!((segments[0].start, segments[0].end), (1.2, 4.0));
    }

    #[test]
    fn reduced_motion_caps_scale_and_fixes_center() {
        let config = AutoZoomConfig {
            zoom_amount: 3.0,
            reduced_motion: true,
            reduced_motion_max_scale: 1.4,
            ..AutoZoomConfig::default()
        };
        let segments = generate_zoom_segments(
            &[click(1_000.0, true)],
            &[move_to(1_000.0, 0.9, 0.1)],
            10.0,
            &config,
        );

        assert_eq!(segments[0].amount, 1.4);
        assert_eq!(manual_focus(&segments[0]), (0.5, 0.5));
    }

    #[test]
    fn focus_is_edge_safe_and_avoids_normalized_rectangles() {
        let config = AutoZoomConfig {
            edge_safe_margin: 0.1,
            avoidance_gap: 0.03,
            avoidance_rects: vec![AvoidanceRect {
                x: 1.0,
                y: 1.0,
                width: -0.25,
                height: -0.25,
            }],
            ..AutoZoomConfig::default()
        };
        let segments = generate_zoom_segments(
            &[click(1_000.0, true)],
            &[move_to(1_000.0, 0.99, 0.99)],
            10.0,
            &config,
        );

        let (x, y) = manual_focus(&segments[0]);
        assert!(x >= 0.1 && x <= 0.9 && y >= 0.1 && y <= 0.9);
        assert!(x < 0.75 || y < 0.75, "focus remained inside avoidance area");
    }

    #[test]
    fn corrupt_and_nonfinite_input_is_sanitized() {
        let mut config = AutoZoomConfig {
            lead_ms: f64::NAN,
            hold_ms: f64::INFINITY,
            zoom_amount: f64::NEG_INFINITY,
            avoidance_rects: vec![AvoidanceRect {
                x: f64::NAN,
                y: 0.0,
                width: 1.0,
                height: 1.0,
            }],
            ..AutoZoomConfig::default()
        };
        config.edge_safe_margin = -10.0;
        let segments = generate_zoom_segments(
            &[
                click(f64::NAN, true),
                click(1_000.0, true),
                click(f64::INFINITY, false),
            ],
            &[
                move_to(500.0, f64::NAN, 0.5),
                move_to(1_000.0, 9_000.0, -9_000.0),
            ],
            10.0,
            &config,
        );

        assert_eq!(segments.len(), 1);
        assert_eq!((segments[0].start, segments[0].end), (0.7, 3.5));
        assert_eq!(segments[0].amount, 2.0);
        assert_eq!(manual_focus(&segments[0]), (1.0, 0.0));
        assert!(generate_zoom_segments(
            &[click(1_000.0, true)],
            &[],
            f64::NAN,
            &AutoZoomConfig::default()
        )
        .is_empty());
    }
}
