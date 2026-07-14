import type { XY, ZoomMode, ZoomSegment } from "~/utils/tauri";

export const ZOOM_AMOUNT_MIN = 1;
export const ZOOM_AMOUNT_MAX = 4;
export const ZOOM_AMOUNT_DEFAULT = 2;
export const ZOOM_AMOUNT_PRESETS = [1.25, 1.5, 1.8, 2, 2.5, 3] as const;

export const EDGE_SAFE_MARGIN_MIN = 0;
export const EDGE_SAFE_MARGIN_MAX = 0.25;
export const EDGE_SAFE_MARGIN_DEFAULT = 0.08;

export type ZoomTransitionStyle = "smooth" | "instant";

export type ZoomSettings = Pick<ZoomSegment, "amount" | "mode"> & {
	transition: ZoomTransitionStyle;
	edgeSafeMargin: number;
};

let copiedZoomSettings: ZoomSettings | null = null;

function finiteOr(value: number, fallback: number) {
	return Number.isFinite(value) ? value : fallback;
}

export function clampZoomAmount(value: number) {
	return Math.min(
		ZOOM_AMOUNT_MAX,
		Math.max(ZOOM_AMOUNT_MIN, finiteOr(value, ZOOM_AMOUNT_DEFAULT)),
	);
}

export function clampEdgeSafeMargin(value: number) {
	return Math.min(
		EDGE_SAFE_MARGIN_MAX,
		Math.max(EDGE_SAFE_MARGIN_MIN, finiteOr(value, EDGE_SAFE_MARGIN_DEFAULT)),
	);
}

export function clampZoomFocus(focus: XY<number>): XY<number> {
	return {
		x: Math.min(1, Math.max(0, finiteOr(focus.x, 0.5))),
		y: Math.min(1, Math.max(0, finiteOr(focus.y, 0.5))),
	};
}

export function parseZoomAmount(value: string) {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? clampZoomAmount(parsed) : null;
}

export function formatZoomAmount(value: number) {
	return `${clampZoomAmount(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}x`;
}

function cloneMode(mode: ZoomMode): ZoomMode {
	if (mode === "auto") return mode;
	return { manual: clampZoomFocus(mode.manual) };
}

export function settingsFromZoom(segment: ZoomSegment): ZoomSettings {
	return {
		amount: clampZoomAmount(segment.amount),
		mode: cloneMode(segment.mode),
		transition: segment.instantAnimation ? "instant" : "smooth",
		edgeSafeMargin: clampEdgeSafeMargin(
			segment.edgeSnapRatio ?? EDGE_SAFE_MARGIN_DEFAULT,
		),
	};
}

export function applyZoomSettings(
	segment: ZoomSegment,
	settings: ZoomSettings,
): ZoomSegment {
	return {
		...segment,
		amount: clampZoomAmount(settings.amount),
		mode: cloneMode(settings.mode),
		instantAnimation: settings.transition === "instant",
		edgeSnapRatio: clampEdgeSafeMargin(settings.edgeSafeMargin),
	};
}

export function resetZoomSettings(segment: ZoomSegment): ZoomSegment {
	return applyZoomSettings(segment, {
		amount: ZOOM_AMOUNT_DEFAULT,
		mode: "auto",
		transition: "smooth",
		edgeSafeMargin: EDGE_SAFE_MARGIN_DEFAULT,
	});
}

export function copyZoomSettings(segment: ZoomSegment) {
	copiedZoomSettings = settingsFromZoom(segment);
}

export function readCopiedZoomSettings() {
	return copiedZoomSettings;
}

export function clearCopiedZoomSettings() {
	copiedZoomSettings = null;
}

export function applyZoomAmountToSelection(
	segments: ZoomSegment[],
	indices: Iterable<number>,
	amount: number,
) {
	const selected = new Set(indices);
	const safeAmount = clampZoomAmount(amount);
	return segments.map((segment, index) =>
		selected.has(index) ? { ...segment, amount: safeAmount } : segment,
	);
}

export function applyZoomFocusToSelection(
	segments: ZoomSegment[],
	indices: Iterable<number>,
	focus: XY<number>,
) {
	const selected = new Set(indices);
	const safeFocus = clampZoomFocus(focus);
	return segments.map((segment, index) =>
		selected.has(index)
			? { ...segment, mode: { manual: { ...safeFocus } } }
			: segment,
	);
}

export function preserveZoomsOnEmptyGeneration(
	current: ZoomSegment[],
	generated: ZoomSegment[],
) {
	return generated.length > 0
		? { segments: generated, replaced: true }
		: { segments: current, replaced: false };
}
