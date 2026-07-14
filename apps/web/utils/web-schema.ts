import { absoluteWebUrl, FLOWRECO_SOURCE_REPOSITORY } from "./brand";

const organizationId = absoluteWebUrl("/#organization");

export const createOrganizationSchema = () => ({
	"@context": "https://schema.org",
	"@type": "Organization",
	"@id": organizationId,
	name: "FlowReco",
	url: absoluteWebUrl(),
	logo: {
		"@type": "ImageObject",
		url: absoluteWebUrl("/flowreco-mark.svg"),
	},
	description:
		"FlowReco is a local-first, open-source screen recorder and cinematic editor.",
	sameAs: [FLOWRECO_SOURCE_REPOSITORY],
});

export const createWebSiteSchema = () => ({
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": absoluteWebUrl("/#website"),
	url: absoluteWebUrl(),
	name: "FlowReco",
	description: "Local-first screen recording, editing, and optional sharing.",
	publisher: { "@id": organizationId },
});

export const createSoftwareApplicationSchema = () => ({
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	"@id": absoluteWebUrl("/#software"),
	name: "FlowReco",
	applicationCategory: "MultimediaApplication",
	operatingSystem: ["macOS", "Windows"],
	description:
		"An open-source screen recorder and editor with local projects, automatic zooms, and optional self-hosted sharing.",
	url: absoluteWebUrl(),
	downloadUrl: absoluteWebUrl("/download"),
	codeRepository: FLOWRECO_SOURCE_REPOSITORY,
	featureList: [
		"Local-first recording",
		"Non-destructive editing",
		"Automatic and manual zooms",
		"Cursor and webcam composition",
		"MP4 and GIF export",
		"Optional self-hosted sharing",
	],
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
		name: "Open-source application",
	},
	creator: { "@id": organizationId },
});

export const createBreadcrumbSchema = (
	items: Array<{ name: string; url?: string }>,
) => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		...(item.url && { item: new URL(item.url, absoluteWebUrl()).toString() }),
	})),
});

export const createVideoObjectSchema = (video: {
	name: string;
	description: string;
	thumbnailUrl: string;
	uploadDate?: string;
	duration?: string;
	embedUrl?: string;
}) => ({
	"@context": "https://schema.org",
	"@type": "VideoObject",
	name: video.name,
	description: video.description,
	thumbnailUrl: video.thumbnailUrl,
	uploadDate: video.uploadDate || new Date().toISOString(),
	duration: video.duration || "PT2M",
	embedUrl: video.embedUrl,
	publisher: { "@id": organizationId },
});

export const createFAQSchema = (
	faqs: Array<{ question: string; answer: string }>,
) => ({
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faqs.map((faq) => ({
		"@type": "Question",
		name: faq.question,
		acceptedAnswer: {
			"@type": "Answer",
			text: faq.answer.replace(/<\/?[^>]+(>|$)/g, ""),
		},
	})),
});

export const createProductSchema = () => ({
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: "FlowReco Screen Recorder",
	description:
		"Open-source screen recording and editing software with optional self-hosted sharing.",
	url: absoluteWebUrl(),
	codeRepository: FLOWRECO_SOURCE_REPOSITORY,
	offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
});

export const createComparisonTableSchema = () => ({
	"@context": "https://schema.org",
	"@type": "Table",
	about: "FlowReco screen recorder capabilities",
	mainEntity: {
		"@type": "ItemList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Open source",
				item: { "@type": "PropertyValue", name: "FlowReco", value: "Yes" },
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Local projects",
				item: {
					"@type": "PropertyValue",
					name: "FlowReco",
					value: "Supported",
				},
			},
		],
	},
});

export const createHowToSchema = (params: {
	name: string;
	description: string;
	totalTime?: string;
	steps: Array<{ name: string; text: string }>;
}) => ({
	"@context": "https://schema.org",
	"@type": "HowTo",
	name: params.name,
	description: params.description,
	totalTime: params.totalTime || "PT2M",
	step: params.steps.map((step, index) => ({
		"@type": "HowToStep",
		position: index + 1,
		name: step.name,
		text: step.text,
	})),
});

export const createLocalBusinessSchema = () => createOrganizationSchema();
