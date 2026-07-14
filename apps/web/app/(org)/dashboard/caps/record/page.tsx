import type { Metadata } from "next";
import { RecordVideoPage } from "./RecordVideoPage";

export const metadata: Metadata = {
	title: "New Recording — FlowReco",
};

export default function RecordVideoRoute() {
	return <RecordVideoPage />;
}
