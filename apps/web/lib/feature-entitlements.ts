export function requiresHostedPlanUpgrade(
	isHostedCapDeployment: string | undefined,
	isPro: boolean | undefined,
) {
	return isHostedCapDeployment === "true" && !isPro;
}
