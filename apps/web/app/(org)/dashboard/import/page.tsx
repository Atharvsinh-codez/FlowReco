import type { Metadata } from "next";
import { ImportPage } from "./ImportPage";

export const metadata: Metadata = {
	title: "Import — FlowReco",
};

export default function Page() {
	return <ImportPage />;
}
