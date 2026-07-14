import { buildEnv } from "@cap/env";

export const FLOWRECO_SOURCE_REPOSITORY =
	"https://github.com/Atharvsinh-codez/FlowReco";
export const FLOWRECO_ISSUES_URL = `${FLOWRECO_SOURCE_REPOSITORY}/issues`;
export const FLOWRECO_RELEASES_URL = `${FLOWRECO_SOURCE_REPOSITORY}/releases`;

export const absoluteWebUrl = (path = "/") =>
	new URL(
		path,
		`${buildEnv.NEXT_PUBLIC_WEB_URL.replace(/\/$/, "")}/`,
	).toString();
