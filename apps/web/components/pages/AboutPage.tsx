"use client";

import { Button } from "@cap/ui";
import { Github } from "lucide-react";
import { FLOWRECO_SOURCE_REPOSITORY } from "@/utils/brand";

const principles = [
	{
		title: "Local-first by default",
		body: "Source recordings and project files stay on your machine unless you deliberately publish them.",
	},
	{
		title: "One preview and export model",
		body: "Camera moves, cursor effects, backgrounds, and timeline edits should render consistently in preview and final output.",
	},
	{
		title: "Open and inspectable",
		body: "The desktop and web foundations are published under their repository licenses, with upstream provenance retained.",
	},
	{
		title: "Hosting is a choice",
		body: "Use local-only projects, point the app at a self-hosted server, and bring S3-compatible storage where supported.",
	},
] as const;

export const AboutPage = () => (
	<div className="wrapper wrapper-sm py-32 md:py-40">
		<div className="mx-auto max-w-3xl">
			<p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-9">
				About FlowReco
			</p>
			<h1 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight text-gray-12 md:text-5xl">
				Screen recording that keeps the craft and the files in your hands.
			</h1>
			<p className="mt-6 max-w-2xl text-lg leading-8 text-gray-10">
				FlowReco combines a native recording foundation with a non-destructive
				editor, cinematic interaction-aware zooms, and optional sharing. It is
				an independent open-source project built from attributed upstream work.
			</p>

			<div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-gray-4 bg-gray-4 sm:grid-cols-2">
				{principles.map((principle) => (
					<section key={principle.title} className="bg-gray-1 p-7">
						<h2 className="text-lg font-semibold text-gray-12">
							{principle.title}
						</h2>
						<p className="mt-3 text-sm leading-6 text-gray-10">
							{principle.body}
						</p>
					</section>
				))}
			</div>

			<div className="mt-10 flex flex-col gap-3 sm:flex-row">
				<Button href="/download" variant="primary" size="lg">
					Download FlowReco
				</Button>
				<Button
					href={FLOWRECO_SOURCE_REPOSITORY}
					variant="white"
					size="lg"
					icon={<Github className="size-4" />}
				>
					View source
				</Button>
			</div>
		</div>
	</div>
);
