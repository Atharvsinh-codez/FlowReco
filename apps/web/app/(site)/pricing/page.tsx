import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/PricingPage";

export const metadata: Metadata = {
	title: "Pricing — FlowReco",
};

export default function App() {
	return <PricingPage />;
}
