import { Store } from "@tauri-apps/plugin-store";
import posthog from "posthog-js";
import { v4 as uuid } from "uuid";

const key = import.meta.env.VITE_POSTHOG_KEY as string;
const host = import.meta.env.VITE_POSTHOG_HOST as string;
const TELEMETRY_OPT_IN_MIGRATION_KEY = "reco_telemetry_explicit_opt_in_v1";

let isPostHogInitialized = false;
let telemetryEnabledCache = false;

export function hasStoredTelemetryOptIn(
	settings: { enableTelemetry?: boolean } | null | undefined,
	migrationComplete: boolean | null | undefined,
): boolean {
	return settings?.enableTelemetry === true && migrationComplete === true;
}

async function readStoredTelemetryOptIn(): Promise<boolean> {
	try {
		const store = await Store.load("store");
		const [settings, migrationComplete] = await Promise.all([
			store.get<{ enableTelemetry?: boolean }>("general_settings"),
			store.get<boolean>(TELEMETRY_OPT_IN_MIGRATION_KEY),
		]);
		telemetryEnabledCache = hasStoredTelemetryOptIn(
			settings,
			migrationComplete,
		);
	} catch {
		// A missing or unreadable store is never treated as consent.
		telemetryEnabledCache = false;
	}

	return telemetryEnabledCache;
}

async function ensurePostHogInitialized(): Promise<boolean> {
	if (!key || !host || !(await readStoredTelemetryOptIn())) return false;
	if (isPostHogInitialized) return true;

	try {
		posthog.init(key, {
			api_host: host,
			autocapture: false,
			capture_pageview: false,
			capture_pageleave: false,
			disable_session_recording: true,
			opt_out_capturing_by_default: true,
			opt_out_persistence_by_default: true,
			loaded: () => {
				isPostHogInitialized = true;
			},
		});
		isPostHogInitialized = true;
		posthog.opt_in_capturing({ captureEventName: false });
		return true;
	} catch (error) {
		console.error("Failed to initialize telemetry:", error);
		return false;
	}
}

export async function applyStoredTelemetryPreference(): Promise<void> {
	const enabled = await readStoredTelemetryOptIn();
	if (!enabled) {
		if (isPostHogInitialized) posthog.opt_out_capturing();
		return;
	}

	if (await ensurePostHogInitialized()) {
		posthog.opt_in_capturing({ captureEventName: false });
	}
}

export function initAnonymousUser() {
	void (async () => {
		if (!(await ensurePostHogInitialized())) return;

		try {
			const anonymousId = localStorage.getItem("anonymous_id") ?? uuid();
			localStorage.setItem("anonymous_id", anonymousId);
			posthog.identify(anonymousId);
		} catch (error) {
			console.error("Error initializing anonymous telemetry identity:", error);
		}
	})();
}

export function identifyUser(
	userId: string,
	properties?: Record<string, unknown>,
) {
	void (async () => {
		if (!(await ensurePostHogInitialized())) return;

		try {
			const currentId = posthog.get_distinct_id();
			const anonymousId = localStorage.getItem("anonymous_id");

			if (currentId === userId) return;
			if (anonymousId && currentId === anonymousId) {
				posthog.alias(userId, anonymousId);
			}
			posthog.identify(userId);
			if (properties) posthog.people.set(properties);
			localStorage.removeItem("anonymous_id");
		} catch (error) {
			console.error("Error identifying telemetry user:", error);
		}
	})();
}

export function trackEvent(
	eventName: string,
	properties?: Record<string, unknown>,
) {
	void (async () => {
		if (!(await ensurePostHogInitialized())) return;

		try {
			posthog.capture(eventName, { ...properties, platform: "desktop" });
		} catch (error) {
			console.error(`Error capturing event ${eventName}:`, error);
		}
	})();
}
