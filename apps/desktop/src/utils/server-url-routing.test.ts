import { describe, expect, it } from "vitest";
import {
	resolveServerRequestPath,
	shouldUseLocalServerSessionForUrl,
} from "./server-url-routing";

describe("server-url-routing", () => {
	it("uses a local callback for FlowReco's local-first default", () => {
		expect(
			shouldUseLocalServerSessionForUrl(
				"http://localhost:3000",
				"http://localhost:3000",
				false,
			),
		).toBe(true);
	});

	it("keeps an explicitly packaged HTTPS host on the hybrid auth path", () => {
		expect(
			shouldUseLocalServerSessionForUrl(
				"https://hosted.flowreco.invalid/",
				"https://hosted.flowreco.invalid",
				false,
			),
		).toBe(false);
	});

	it("uses the local callback session for custom production origins", () => {
		expect(
			shouldUseLocalServerSessionForUrl(
				"https://recordings.example.com",
				"https://hosted.flowreco.invalid",
				false,
			),
		).toBe(true);
	});

	it("keeps development on the local callback session", () => {
		expect(
			shouldUseLocalServerSessionForUrl(
				"https://hosted.flowreco.invalid",
				"https://hosted.flowreco.invalid",
				true,
			),
		).toBe(true);
	});

	it("does not rewrite API requests for the packaged origin", () => {
		const path = "http://localhost:3000/api/desktop/user/profile";

		expect(
			resolveServerRequestPath(
				path,
				"http://localhost:3000",
				"http://localhost:3000",
			),
		).toBe(path);
	});

	it("does not rewrite API requests for equivalent origins", () => {
		const path = "https://hosted.flowreco.invalid/api/desktop/user/profile";

		expect(
			resolveServerRequestPath(
				path,
				"https://hosted.flowreco.invalid/",
				"https://hosted.flowreco.invalid",
			),
		).toBe(path);
	});

	it("rewrites packaged API requests to custom origins", () => {
		expect(
			resolveServerRequestPath(
				"https://hosted.flowreco.invalid/api/desktop/user/profile?refresh=true#profile",
				"https://recordings.example.com",
				"https://hosted.flowreco.invalid",
			),
		).toBe(
			"https://recordings.example.com/api/desktop/user/profile?refresh=true#profile",
		);
	});

	it("does not rewrite external API requests", () => {
		const path = "https://licenses.example.net/api/license/activate";

		expect(
			resolveServerRequestPath(
				path,
				"https://recordings.example.com",
				"https://hosted.flowreco.invalid",
			),
		).toBe(path);
	});
});
