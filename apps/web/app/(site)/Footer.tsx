import { Logo } from "@cap/ui";
import { Github } from "lucide-react";
import Link from "next/link";
import { FLOWRECO_SOURCE_REPOSITORY } from "@/utils/brand";

const columns = [
	{
		title: "Product",
		links: [
			["Download", "/download"],
			["Studio mode", "/features/studio-mode"],
			["Instant mode", "/features/instant-mode"],
			["Self-hosting", "/self-hosting"],
		],
	},
	{
		title: "Resources",
		links: [
			["Documentation", "/docs"],
			["Support", "/support"],
			["Source code", FLOWRECO_SOURCE_REPOSITORY],
			["Issues", `${FLOWRECO_SOURCE_REPOSITORY}/issues`],
		],
	},
	{
		title: "Tools",
		links: [
			["Video converter", "/tools/convert"],
			["Video trimmer", "/tools/trim"],
			["Speed controller", "/tools/video-speed-controller"],
			["MP4 to GIF", "/tools/convert/mp4-to-gif"],
		],
	},
] as const;

export const Footer = () => (
	<footer className="border-t border-gray-4 bg-gray-1">
		<div className="wrapper py-14 md:py-20">
			<div className="grid gap-12 lg:grid-cols-[1.35fr_2fr]">
				<div>
					<Logo className="h-auto w-[148px]" />
					<p className="mt-5 max-w-md text-sm leading-6 text-gray-10">
						Record locally, shape the story, and share only when you choose.
						FlowReco is open source and can be self-hosted.
					</p>
					<a
						className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-12 hover:text-gray-10"
						href={FLOWRECO_SOURCE_REPOSITORY}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github className="size-4" /> GitHub
					</a>
				</div>

				<div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
					{columns.map((column) => (
						<div key={column.title}>
							<h2 className="text-sm font-semibold text-gray-12">
								{column.title}
							</h2>
							<ul className="mt-4 space-y-3">
								{column.links.map(([label, href]) => (
									<li key={label}>
										<Link
											className="text-sm text-gray-10 transition-colors hover:text-gray-12"
											href={href}
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="mt-14 flex flex-col gap-4 border-t border-gray-4 pt-6 text-xs text-gray-9 sm:flex-row sm:items-center sm:justify-between">
				<p>FlowReco is community-built software licensed under the AGPL.</p>
				<div className="flex gap-6">
					<Link href="/privacy" className="hover:text-gray-12">
						Privacy
					</Link>
					<Link href="/terms" className="hover:text-gray-12">
						Terms
					</Link>
				</div>
			</div>
		</div>
	</footer>
);
