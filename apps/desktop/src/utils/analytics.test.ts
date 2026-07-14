import { describe, expect, it } from "vitest";

import { hasStoredTelemetryOptIn } from "~/utils/analytics";

describe("analytics consent", () => {
	it("defaults to no consent when settings or migration marker are absent", () => {
		expect(hasStoredTelemetryOptIn(undefined, undefined)).toBe(false);
		expect(hasStoredTelemetryOptIn({}, true)).toBe(false);
	});

	it("rejects inherited telemetry values before the one-time migration", () => {
		expect(hasStoredTelemetryOptIn({ enableTelemetry: true }, false)).toBe(
			false,
		);
	});

	it("accepts only an explicit enabled value after migration", () => {
		expect(hasStoredTelemetryOptIn({ enableTelemetry: false }, true)).toBe(
			false,
		);
		expect(hasStoredTelemetryOptIn({ enableTelemetry: true }, true)).toBe(true);
	});
});
