import type { Metadata } from "next";
import { OnlineClassroomToolsPage } from "@/components/pages/seo/OnlineClassroomToolsPage";

export const metadata: Metadata = {
	title: "Online Classroom Tools: Empower Remote Teaching with FlowReco",
	description:
		"Searching for online classroom tools? Learn how FlowReco's screen recorder helps educators create engaging lessons, manage student feedback, and streamline remote learning.",
	openGraph: {
		title: "Online Classroom Tools: Empower Remote Teaching with FlowReco",
		description:
			"Learn how FlowReco's screen recorder helps educators create engaging lessons, manage student feedback, and streamline remote learning.",
		url: "https://cap.so/solutions/online-classroom-tools",
		siteName: "FlowReco",
		images: [
			{
				url: "https://cap.so/og.png",
				width: 1200,
				height: 630,
				alt: "FlowReco: Online Classroom Tools",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Online Classroom Tools | FlowReco Screen Recorder",
		description:
			"Learn how FlowReco's screen recorder helps educators create engaging lessons, manage student feedback, and streamline remote learning.",
		images: ["https://cap.so/og.png"],
	},
	alternates: {
		canonical: "https://cap.so/solutions/online-classroom-tools",
	},
};

export default OnlineClassroomToolsPage;
