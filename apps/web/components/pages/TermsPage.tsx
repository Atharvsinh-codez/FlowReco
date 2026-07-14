import Link from "next/link";
import { FLOWRECO_SOURCE_REPOSITORY } from "@/utils/brand";

export const TermsPage = () => (
	<div className="wrapper wrapper-sm py-32 md:py-40">
		<article className="legal-body mx-auto max-w-3xl">
			<h1>Project and deployment terms</h1>
			<p>
				FlowReco is open-source software. Your use, copying, and distribution of
				the source and binaries is governed by the license files and third-party
				notices in the repository, not by an advertised FlowReco subscription.
			</p>
			<h2>Hosted deployments</h2>
			<p>
				A FlowReco server can be operated by anyone. The person or organization
				running the server you connect to controls its accounts, storage,
				retention, availability, and acceptable-use terms. This project page
				does not create terms on behalf of independent deployers.
			</p>
			<h2>Your recordings</h2>
			<p>
				You are responsible for having permission to record, upload, and share
				content. Local projects are not uploaded unless you choose a publish or
				sharing workflow. Review a server operator's policies before publishing.
			</p>
			<h2>No managed-service promise</h2>
			<p>
				The open-source project is provided under the warranty terms in its
				licenses. It does not advertise a hosted-service SLA, paid support plan,
				or commercial license separate from those repository licenses.
			</p>
			<p>
				Read the authoritative files in the{" "}
				<Link href={FLOWRECO_SOURCE_REPOSITORY}>FlowReco repository</Link>.
			</p>
		</article>
	</div>
);
