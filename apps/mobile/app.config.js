const disableAssociatedDomains =
	process.env.FLOWRECO_MOBILE_DISABLE_ASSOCIATED_DOMAINS === "1" ||
	process.env.CAP_MOBILE_DISABLE_ASSOCIATED_DOMAINS === "1";
const configuredAssociatedDomains =
	process.env.FLOWRECO_MOBILE_ASSOCIATED_DOMAINS ??
	process.env.CAP_MOBILE_ASSOCIATED_DOMAINS;
const associatedDomains = disableAssociatedDomains
	? []
	: (configuredAssociatedDomains ?? "")
			.split(",")
			.map((domain) => domain.trim())
			.filter(Boolean);
const bundleIdentifier = "app.flowreco.mobile";
const ios = {
	bundleIdentifier,
	supportsTablet: false,
	infoPlist: {
		NSPhotoLibraryUsageDescription:
			"FlowReco imports videos from Photos for upload.",
		NSPhotoLibraryAddUsageDescription:
			"FlowReco saves downloaded videos to Photos.",
		UIBackgroundModes: ["processing"],
	},
};

if (associatedDomains.length > 0) {
	ios.associatedDomains = associatedDomains;
}

module.exports = ({ config }) => ({
	...config,
	name: "FlowReco",
	slug: "flowreco-mobile",
	scheme: "flowreco",
	version: "0.1.0",
	orientation: "portrait",
	platforms: ["ios"],
	userInterfaceStyle: "light",
	icon: "./assets/icon.png",
	splash: {
		image: "./assets/splash-icon.png",
		resizeMode: "contain",
		backgroundColor: "#f4f5f6",
	},
	ios,
	experiments: {
		typedRoutes: true,
	},
	plugins: [
		"expo-router",
		[
			"expo-secure-store",
			{
				faceIDPermission: "Allow FlowReco to protect your account key.",
			},
		],
	],
	extra: {
		apiBaseUrl:
			process.env.EXPO_PUBLIC_FLOWRECO_WEB_URL ??
			process.env.EXPO_PUBLIC_CAP_WEB_URL ??
			"http://localhost:3000",
	},
});
