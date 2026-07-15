# FlowReco UI direction

FlowReco should feel like a precise creative tool: calm while idle, fast while recording, and cinematic without being decorative. The interface is original; the supplied visual is used only to understand control density and editing behavior.

## Product character

- **Quiet confidence:** compact controls, strong hierarchy, restrained emphasis.
- **Canvas first:** the media remains the visual center; chrome supports it.
- **Progressive depth:** useful defaults for beginners, direct numeric control for experts.
- **State is visible:** recording, autosave, upload, privacy, export, and recovery states must never be implicit.
- **Local-first trust:** distinguish local, connected, uploading, and published states in plain language.

## Visual system

Light-first product chrome (see D021). Marketing may use Instrument Serif for editorial display; in-app UI stays Geist / system sans for density and control labels.

| Token | Direction |
| --- | --- |
| Page / shell surface | White `#ffffff` |
| Raised / secondary surface | Light gray `#f5f5f5` |
| Subtle fill | `#eceef1` |
| Border | `#e6e6e6` |
| Primary text | Near-black `#252b31` |
| Secondary text | `#6b7280` |
| Muted / caption text | `#879192` |
| Primary action/accent | Blue `#0084d1` (single strongest action per view) |
| Success/warning/error | Semantic colors used sparingly and never as the only signal |
| Grid | 8 px base; common spacing 4/8/12/16/20/24/32/40/48 px |
| Type (app) | Geist or the checked-in system fallback stack |
| Type (marketing display) | Instrument Serif for large headlines only |
| Corners | Soft rounded system: 6–12 px controls, 16–20 px cards, pills 20–28 px |
| Elevation | Flat by default; thin borders over heavy shadow stacks |
| Motion | Short, interruptible, transform/opacity first; honor reduced motion |

Avoid decorative gradients, oversized marketing typography inside dense editor chrome, unrelated illustrations, dense shadow stacks, and generic dashboard card grids. Dark theme remaps the same roles; it is optional, not the default product look.

## Application layout

### Recorder

The source preview is dominant. Device/source controls form one clear preparation path, followed by a single recording action. Show selected display/window/region, mode, microphone, system audio, camera, levels, permissions, countdown, storage target, and upload intent before capture begins.

### Editor

Use a stable three-zone layout (Recordly-inspired control density, FlowReco chrome):

1. Header: project identity, save state, undo/redo, preview quality, share/export.
2. Body row: **inspector on the left** (config / clips), **preview canvas on the right** with maximum usable area, playback adjacent, direct manipulation with safe-area guides.
3. Timeline: multi-track strip full-width under the body row.

The selected region owns the inspector. Do not scatter the same property across several panels. Zoom presets (`1.25×`, `1.5×`, `1.8×`, `2×`, `2.5×`, `3×`) are one-tap options backed by a bounded numeric field.

### Web dashboard

Use a content-forward library with compact rows or thumbnails, clear filters, folders/workspaces, batch actions, and explicit access labels. Sharing pages prioritize the player, transcript/chapters, and timestamped conversation.

## Interaction rules

- Every icon-only control has an accessible name and tooltip.
- A destructive action requires a confirmation appropriate to reversibility.
- Autosave communicates `Saving`, `Saved`, or a recoverable error without interrupting playback.
- Sliders always have keyboard control and a numeric value; precision properties allow direct entry.
- Timeline drag operations show the resulting timecode and snapping target.
- Disabled controls explain why when the reason is not obvious.
- Async actions cannot report success after rejection; retry preserves local state.
- Focus indicators are always visible for keyboard navigation.
- Minimum pointer target is 36 × 36 px in dense desktop UI; touch surfaces use at least 44 × 44 px.
- Error messages say what happened, what stayed safe, and what the user can do next.

## Motion and cinematic behavior

Camera motion must be spatially coherent. Zoom interpolation, cursor smoothing, click feedback, webcam avoidance, and export transforms all use shared timing definitions. The UI may preview edit handles but cannot invent a transform unavailable to the renderer.

Reduced-motion mode shortens or removes editor chrome animation and selects gentler camera defaults; it does not change project timing without explicit confirmation.

## Accessibility checklist

- WCAG 2.2 AA contrast for product text and controls.
- Keyboard completion of record setup, pause/resume/stop, common edits, save, and export.
- Screen-reader names, descriptions, validation, progress, and live recording state.
- Timecode and region bounds available without relying on color or pixel position.
- Caption editing and transcript navigation work with keyboard and assistive technology.
- Waveforms, meters, and analytics have textual equivalents.
- No flashing effects; click highlights remain below hazardous thresholds.

## Original-brand asset policy

FlowReco marks, icons, cursor artwork, backgrounds, tray assets, installer art, and sound cues must be generated from checked-in FlowReco sources or documented compatible third-party inputs. Upstream names may remain only where technically necessary for compatibility or required attribution—not as public brand presentation.

