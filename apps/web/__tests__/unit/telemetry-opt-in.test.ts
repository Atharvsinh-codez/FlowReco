import { describe, expect, it } from "vitest";
import { isTelemetryEnabled } from "@/lib/telemetry";

describe("telemetry opt-in", () => {
	it("enables telemetry only for the exact explicit value", () => {
		expect(isTelemetryEnabled("true")).toBe(true);
	});

	it.each([undefined, null, "", "false", "TRUE"])(
		"keeps telemetry disabled for %s",
		(value) => {
			expect(isTelemetryEnabled(value)).toBe(false);
		},
	);
});
