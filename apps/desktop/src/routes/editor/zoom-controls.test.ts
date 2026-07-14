import { describe, expect, it } from "vitest";
import type { ZoomSegment } from "~/utils/tauri";
import {
	applyZoomFocusToSelection,
	applyZoomSettings,
	clampEdgeSafeMargin,
	clampZoomAmount,
	formatZoomAmount,
	parseZoomAmount,
	preserveZoomsOnEmptyGeneration,
	resetZoomSettings,
	settingsFromZoom,
} from "./zoom-controls";

const segment = (overrides: Partial<ZoomSegment> = {}): ZoomSegment => ({
	start: 1,
	end: 3,
	amount: 1.5,
	mode: "auto",
	...overrides,
});

describe("zoom controls", () => {
	it("validates custom zoom amounts to the supported 1x–4x range", () => {
		expect(clampZoomAmount(-4)).toBe(1);
		expect(clampZoomAmount(2.75)).toBe(2.75);
		expect(clampZoomAmount(20)).toBe(4);
		expect(clampZoomAmount(Number.NaN)).toBe(2);
		expect(parseZoomAmount("3.25")).toBe(3.25);
		expect(parseZoomAmount("not a number")).toBeNull();
		expect(formatZoomAmount(1.5)).toBe("1.5x");
	});

	it("bounds edge-safe margin and manual focus coordinates", () => {
		expect(clampEdgeSafeMargin(-1)).toBe(0);
		expect(clampEdgeSafeMargin(0.4)).toBe(0.25);
		const updated = applyZoomFocusToSelection([segment(), segment()], [1], {
			x: -3,
			y: 4,
		});
		expect(updated[0].mode).toBe("auto");
		expect(updated[1].mode).toEqual({ manual: { x: 0, y: 1 } });
	});

	it("copies style settings without copying timeline timing", () => {
		const source = segment({
			amount: 3,
			mode: { manual: { x: 0.2, y: 0.8 } },
			instantAnimation: true,
			edgeSnapRatio: 0.12,
		});
		const target = segment({ start: 8, end: 12 });
		const pasted = applyZoomSettings(target, settingsFromZoom(source));

		expect(pasted).toMatchObject({
			start: 8,
			end: 12,
			amount: 3,
			mode: { manual: { x: 0.2, y: 0.8 } },
			instantAnimation: true,
			edgeSnapRatio: 0.12,
		});
	});

	it("resets a zoom to deterministic automatic defaults", () => {
		expect(
			resetZoomSettings(
				segment({ amount: 4, mode: { manual: { x: 0, y: 1 } } }),
			),
		).toMatchObject({
			start: 1,
			end: 3,
			amount: 2,
			mode: "auto",
			instantAnimation: false,
			edgeSnapRatio: 0.08,
		});
	});

	it("never destroys existing zooms when regeneration finds no suggestions", () => {
		const current = [segment()];
		const empty = preserveZoomsOnEmptyGeneration(current, []);
		expect(empty).toEqual({ segments: current, replaced: false });

		const generated = [segment({ start: 10, end: 11 })];
		expect(preserveZoomsOnEmptyGeneration(current, generated)).toEqual({
			segments: generated,
			replaced: true,
		});
	});
});
