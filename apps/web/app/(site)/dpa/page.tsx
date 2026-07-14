import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Data processing agreements — FlowReco",
};

export default function DataProcessingAgreementPage() {
	return (
		<div className="wrapper wrapper-sm py-32 md:py-40">
			<article className="legal-body mx-auto max-w-3xl">
				<h1>Data processing agreements</h1>
				<p>
					The FlowReco open-source project does not advertise a managed hosting
					company and cannot sign a data processing agreement for independent
					deployments.
				</p>
				<p>
					If you use a hosted FlowReco instance, request the applicable privacy
					terms and data processing agreement from that server's operator. If
					you self-host, your organization is responsible for its controller and
					processor obligations and for agreements with configured storage,
					email, authentication, analytics, and AI providers.
				</p>
			</article>
		</div>
	);
}
