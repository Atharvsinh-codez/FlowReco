import type { Metadata } from "next";
import { ImportLoomPage } from "./ImportLoomPage";

export const metadata: Metadata = {
	title: "Import from Loom — FlowReco",
};

export default function Page() {
	return <ImportLoomPage />;
}
