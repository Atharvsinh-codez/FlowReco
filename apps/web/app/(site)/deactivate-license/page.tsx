import type { Metadata } from "next";
import { LicenseDeactivationPage } from "@/components/pages/LicenseDeactivationPage";

export const metadata: Metadata = {
	title: "Deactivate License — FlowReco",
	description:
		"Deactivate your FlowReco commercial license from its current device to use it elsewhere.",
};

export default function App() {
	return <LicenseDeactivationPage />;
}
