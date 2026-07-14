"use client";

import { ArrowUpRight, BookOpen, Github, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { FLOWRECO_SOURCE_REPOSITORY } from "@/utils/brand";

const supportChannels = [
	{
		title: "Read the docs",
		description:
			"Set up the desktop app, sharing service, storage, and self-hosted deployment.",
		icon: BookOpen,
		href: "/docs",
		cta: "Browse documentation",
	},
	{
		title: "Report an issue",
		description:
			"Use the public issue tracker for reproducible bugs and feature requests.",
		icon: Github,
		href: `${FLOWRECO_SOURCE_REPOSITORY}/issues`,
		cta: "Open GitHub issues",
	},
	{
		title: "Start a discussion",
		description:
			"Ask setup questions and discuss implementation ideas with project contributors.",
		icon: MessagesSquare,
		href: `${FLOWRECO_SOURCE_REPOSITORY}/discussions`,
		cta: "Open discussions",
	},
] as const;

export const SupportPage = () => (
	<div className="wrapper wrapper-sm py-32 md:py-40">
		<div className="mx-auto max-w-3xl">
			<div className="max-w-2xl">
				<p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-9">
					Community support
				</p>
				<h1 className="mt-4 text-4xl font-medium tracking-tight text-gray-12 md:text-5xl">
					Get help with FlowReco
				</h1>
				<p className="mt-6 text-lg leading-8 text-gray-10">
					FlowReco does not currently advertise a private support mailbox or a
					managed-service SLA. Use these project-owned channels so questions and
					fixes remain visible to the community.
				</p>
			</div>

			<div className="mt-12 grid gap-4 md:grid-cols-3">
				{supportChannels.map((channel) => {
					const Icon = channel.icon;
					return (
						<Link
							key={channel.title}
							href={channel.href}
							className="group flex flex-col rounded-2xl border border-gray-4 bg-gray-2 p-6 transition-colors hover:border-gray-6"
						>
							<Icon className="size-5 text-gray-12" />
							<h2 className="mt-5 text-lg font-semibold text-gray-12">
								{channel.title}
							</h2>
							<p className="mt-2 flex-1 text-sm leading-6 text-gray-10">
								{channel.description}
							</p>
							<span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gray-12">
								{channel.cta} <ArrowUpRight className="size-4" />
							</span>
						</Link>
					);
				})}
			</div>
		</div>
	</div>
);
