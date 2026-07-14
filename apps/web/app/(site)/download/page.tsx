import type { Metadata } from "next";
import { DownloadPage } from "@/components/pages/DownloadPage";

export const metadata: Metadata = {
	title: "Download — FlowReco",
};

export default function App() {
	return <DownloadPage />;
}
