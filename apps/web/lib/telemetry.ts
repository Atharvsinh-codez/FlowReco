/**
 * Browser analytics are disabled unless a deployment explicitly opts in.
 * Keeping this strict avoids surprising self-hosted and local-first users.
 */
export const isTelemetryEnabled = (value: string | undefined | null) =>
	value === "true";
