import type { Metadata } from "next";
import Link from "next/link";
import { FLOWRECO_SOURCE_REPOSITORY } from "@/utils/brand";

export const metadata: Metadata = { title: "Privacy — FlowReco" };

export default function PrivacyPage() {
	return (
		<div className="wrapper wrapper-sm py-32 md:py-40">
			<article className="legal-body mx-auto max-w-3xl">
				<h1>Privacy and deployment boundaries</h1>
				<p>
					FlowReco is local-first: source recordings and projects remain local
					unless you deliberately use a publish, cloud, integration, or sharing
					workflow.
				</p>
				<h2>Desktop application</h2>
				<p>
					Screen, camera, microphone, system-audio, and interaction metadata are
					captured only for features you enable and permissions you grant.
					Enhanced interaction capture uses timing and geometry; it must not
					store typed content, passwords, or clipboard contents by default.
				</p>
				<h2>Web and sharing service</h2>
				<p>
					This repository can be self-hosted. A deployment may process account
					information, recording media, comments, analytics, cookies, and logs
					to provide the features its operator enables. The operator of the
					server you use is responsible for publishing its own accurate privacy
					and retention policy.
				</p>
				<h2>Optional providers</h2>
				<p>
					Storage, email, transcription, AI, authentication, and analytics
					providers are optional and deployment-configurable. Media must not be
					sent to an AI provider silently. Review the settings of your chosen
					server before publishing sensitive material.
				</p>
				<h2>Project questions</h2>
				<p>
					Use the{" "}
					<Link href={`${FLOWRECO_SOURCE_REPOSITORY}/issues`}>
						public issue tracker
					</Link>{" "}
					for code-level privacy reports. Contact your server operator for
					account or data requests concerning that deployment.
				</p>
			</article>
		</div>
	);
}
