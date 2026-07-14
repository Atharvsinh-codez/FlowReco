import { describe, expect, it } from "vitest";
import { requiresHostedPlanUpgrade } from "@/lib/feature-entitlements";

describe("hosted feature entitlements", () => {
	it("keeps hosted FlowReco upgrade checks for standard accounts", () => {
		expect(requiresHostedPlanUpgrade("true", false)).toBe(true);
	});

	it("allows hosted FlowReco Pro accounts", () => {
		expect(requiresHostedPlanUpgrade("true", true)).toBe(false);
	});

	it.each([undefined, "false"])(
		"does not apply hosted billing checks to FlowReco/self-hosted deployments (%s)",
		(isHostedCapDeployment) => {
			expect(requiresHostedPlanUpgrade(isHostedCapDeployment, false)).toBe(
				false,
			);
		},
	);
});
