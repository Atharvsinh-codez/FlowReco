import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createFAQSchema } from "@/utils/web-schema";

const pageSource = readFileSync(
	join(process.cwd(), "app/(site)/(seo)/self-hosted-screen-recording/page.tsx"),
	"utf-8",
);

const componentSource = readFileSync(
	join(process.cwd(), "components/pages/seo/SelfHostedScreenRecordingPage.tsx"),
	"utf-8",
);

describe("SelfHostedScreenRecordingPage metadata", () => {
	it("contains canonical URL", () => {
		expect(pageSource).toContain(
			'canonical: "https://cap.so/self-hosted-screen-recording"',
		);
	});

	it("contains OG url field", () => {
		expect(pageSource).toContain(
			'url: "https://cap.so/self-hosted-screen-recording"',
		);
	});

	it("contains OG siteName field", () => {
		expect(pageSource).toContain('siteName: "FlowReco"');
	});

	it("contains OG locale field", () => {
		expect(pageSource).toContain('locale: "en_US"');
	});

	it("contains full OG image URL", () => {
		expect(pageSource).toContain('"https://cap.so/og.png"');
	});

	it("title targets self-hosted screen recording keyword", () => {
		expect(pageSource.toLowerCase()).toContain("self-host");
	});
});

describe("SelfHostedScreenRecordingPage component content", () => {
	it("targets self-hosted keyword in title", () => {
		expect(componentSource.toLowerCase()).toContain("self-host");
	});

	it("includes comparison table", () => {
		expect(componentSource).toContain("comparisonTable");
	});

	it("includes recording modes section", () => {
		expect(componentSource).toContain("recordingModes");
	});

	it("mentions S3-compatible storage", () => {
		expect(componentSource).toContain("S3");
	});

	it("mentions AWS S3", () => {
		expect(componentSource).toContain("AWS S3");
	});

	it("mentions Cloudflare R2", () => {
		expect(componentSource).toContain("Cloudflare R2");
	});

	it("includes migration guide", () => {
		expect(componentSource).toContain("migrationGuide");
	});

	it("mentions open source and MIT license", () => {
		expect(componentSource.toLowerCase()).toContain("open source");
		expect(componentSource.toLowerCase()).toContain("mit");
	});

	it("has badge set", () => {
		expect(componentSource).toContain("badge");
	});

	it("references the loom-alternative internal link", () => {
		expect(componentSource).toContain("/loom-alternative");
	});

	it("references the hipaa-compliant-screen-recording internal link", () => {
		expect(componentSource).toContain("/hipaa-compliant-screen-recording");
	});
});

describe("SelfHostedScreenRecordingPage FAQ schema", () => {
	const faqs = [
		{
			question: "Can FlowReco be self-hosted?",
			answer:
				"Yes. FlowReco supports two levels of self-hosting. First, you can configure FlowReco to use your own S3-compatible storage bucket.",
		},
		{
			question: "What storage providers does FlowReco support for self-hosting?",
			answer:
				"FlowReco supports any S3-compatible object storage provider, including AWS S3, Cloudflare R2, Backblaze B2, Wasabi, and MinIO.",
		},
		{
			question:
				"Do recordings touch FlowReco's servers when using self-hosted storage?",
			answer:
				"No. When self-hosted storage is configured, the FlowReco desktop app uploads recordings directly to your S3 bucket.",
		},
		{
			question: "How do I configure self-hosted storage in FlowReco?",
			answer:
				"Open FlowReco's settings, navigate to the storage section, and enter your S3 bucket name, region, access key, secret key, and optional custom endpoint URL.",
		},
		{
			question: "Can I self-host the entire FlowReco platform, not just storage?",
			answer:
				"Yes. FlowReco is fully open source under the MIT license. You can deploy the complete FlowReco platform on your own infrastructure.",
		},
		{
			question: "Is self-hosted FlowReco suitable for HIPAA compliance?",
			answer:
				"FlowReco with self-hosted AWS S3 storage (covered under your AWS BAA) can support HIPAA-compliant recording workflows.",
		},
		{
			question:
				"Does self-hosted storage still give me instant shareable links?",
			answer:
				"Yes. The instant sharing experience works the same way with self-hosted storage.",
		},
		{
			question: "What is the best self-hosted screen recorder?",
			answer:
				"FlowReco is the best self-hosted screen recorder for teams that need both data control and a modern async video experience.",
		},
	];

	it("produces valid FAQPage schema with 8 questions", () => {
		const schema = createFAQSchema(faqs);

		expect(schema["@context"]).toBe("https://schema.org");
		expect(schema["@type"]).toBe("FAQPage");
		expect(schema.mainEntity).toHaveLength(8);
	});

	it("maps each FAQ to a Question entity with acceptedAnswer", () => {
		const schema = createFAQSchema(faqs);

		expect(schema.mainEntity[0]).toEqual({
			"@type": "Question",
			name: "Can FlowReco be self-hosted?",
			acceptedAnswer: {
				"@type": "Answer",
				text: faqs[0]?.answer,
			},
		});
	});

	it("produces JSON-serializable output", () => {
		const schema = createFAQSchema(faqs);
		expect(() => JSON.stringify(schema)).not.toThrow();
		const parsed = JSON.parse(JSON.stringify(schema));
		expect(parsed["@type"]).toBe("FAQPage");
		expect(parsed.mainEntity).toHaveLength(8);
	});
});

describe("SelfHostedScreenRecordingPage SEO registry", () => {
	it("is registered in seo-pages.ts", () => {
		const seoPagesSource = readFileSync(
			join(process.cwd(), "lib/seo-pages.ts"),
			"utf-8",
		);
		expect(seoPagesSource).toContain('"self-hosted-screen-recording"');
	});

	it("is registered in seo-metadata.ts", () => {
		const seoMetadataSource = readFileSync(
			join(process.cwd(), "lib/seo-metadata.ts"),
			"utf-8",
		);
		expect(seoMetadataSource).toContain('"self-hosted-screen-recording"');
	});
});
