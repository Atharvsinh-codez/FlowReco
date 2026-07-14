import { describe, expect, it } from "vitest";
import {
	hasDownloads,
	parseDownloadsFromBody,
	releaseDownloadKeys,
} from "@/utils/releases";

describe("release downloads", () => {
	it("parses supported release download URLs from the release body", () => {
		const downloads = parseDownloadsFromBody(`
			<!-- DOWNLOADS_JSON {"macos-arm64":"https://example.com/FlowReco.dmg","linux-appimage":"https://example.com/FlowReco.AppImage","linux-deb":"https://example.com/FlowReco.deb","linux-rpm":"https://example.com/FlowReco.rpm"} -->
		`);

		expect(downloads["macos-arm64"]).toBe("https://example.com/FlowReco.dmg");
		expect(downloads["linux-deb"]).toBe("https://example.com/FlowReco.deb");
		expect(hasDownloads(downloads)).toBe(true);
	});

	it("maps generic Linux release metadata to the deb download slot", () => {
		const downloads = parseDownloadsFromBody(`
			<!-- DOWNLOADS_JSON {"linux":"https://example.com/FlowReco.deb"} -->
		`);

		expect(downloads["linux-deb"]).toBe("https://example.com/FlowReco.deb");
		expect(hasDownloads(downloads)).toBe(true);
	});

	it("ignores unsupported Linux-only release metadata", () => {
		const downloads = parseDownloadsFromBody(`
			<!-- DOWNLOADS_JSON {"linux-appimage":"https://example.com/FlowReco.AppImage","linux-rpm":"https://example.com/FlowReco.rpm"} -->
		`);

		expect(downloads["linux-deb"]).toBeUndefined();
		expect(hasDownloads(downloads)).toBe(false);
	});

	it("keeps the release download key list in platform order", () => {
		expect(releaseDownloadKeys).toEqual([
			"macos-arm64",
			"macos-x64",
			"windows",
			"linux-deb",
		]);
	});
});
