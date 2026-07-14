import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
	title: "About — FlowReco",
	description:
		"FlowReco is the open source alternative to Loom. Learn why we started FlowReco and our commitment to privacy, transparency, and community-driven development.",
};

export default function App() {
	return <AboutPage />;
}
