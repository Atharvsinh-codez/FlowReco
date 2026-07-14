import { loadSettings } from "./storage";

export const PAGE_NAV_LINKS = [
	{ id: "welcome", label: "Welcome", href: "welcome.html" },
	{ id: "how-it-works", label: "How it works", href: "how-it-works.html" },
	{ id: "camera", label: "Camera access", href: "camera-permission.html" },
	{ id: "options", label: "Options", href: "options.html" },
] as const;

export type PageNavId = (typeof PAGE_NAV_LINKS)[number]["id"];

const buildEnv = import.meta.env as {
	readonly VITE_FLOWRECO_SERVER_URL?: string;
	readonly VITE_CAP_SERVER_URL?: string;
};
const DEFAULT_DASHBOARD_URL = new URL(
	"/dashboard",
	buildEnv.VITE_FLOWRECO_SERVER_URL ??
		buildEnv.VITE_CAP_SERVER_URL ??
		"http://localhost:3000",
).toString();

export const mountPageNav = (active: PageNavId) => {
	if (document.querySelector(".page-nav")) return;

	const nav = document.createElement("nav");
	nav.className = "page-nav";
	nav.setAttribute("aria-label", "FlowReco extension pages");

	const inner = document.createElement("div");
	inner.className = "page-nav-inner";

	const brand = document.createElement("a");
	brand.className = "page-nav-brand";
	brand.href = "welcome.html";
	brand.setAttribute("aria-label", "FlowReco");
	const brandImage = document.createElement("img");
	brandImage.className = "page-nav-logo";
	brandImage.src = chrome.runtime.getURL("icons/flowreco-wordmark.svg");
	brandImage.alt = "";
	brand.append(brandImage);

	const links = document.createElement("div");
	links.className = "page-nav-links";
	for (const link of PAGE_NAV_LINKS) {
		const anchor = document.createElement("a");
		anchor.className =
			link.id === active ? "page-nav-link is-active" : "page-nav-link";
		anchor.href = link.href;
		anchor.textContent = link.label;
		if (link.id === active) {
			anchor.setAttribute("aria-current", "page");
		}
		links.append(anchor);
	}

	const dashboard = document.createElement("a");
	dashboard.className = "page-nav-link";
	dashboard.href = DEFAULT_DASHBOARD_URL;
	dashboard.target = "_blank";
	dashboard.rel = "noopener";
	dashboard.textContent = "Dashboard";
	links.append(dashboard);
	// The user may point the extension at a self-hosted instance, so resolve
	// the real base URL once settings load and leave the default until then.
	void loadSettings()
		.then((settings) => {
			dashboard.href = new URL("/dashboard", settings.apiBaseUrl).toString();
		})
		.catch(() => undefined);

	inner.append(brand, links);
	nav.append(inner);
	document.body.prepend(nav);
};
