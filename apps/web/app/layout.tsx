import "@/app/globals.css";
import { buildEnv } from "@cap/env";
import type { Metadata } from "next";
import Script from "next/script";
import type { PropsWithChildren } from "react";

const webUrl = buildEnv.NEXT_PUBLIC_WEB_URL;

export const metadata: Metadata = {
	metadataBase: new URL(webUrl),
	title: "FlowReco — Screen recording, made cinematic.",
	description:
		"Record, edit, and share polished screen videos with smooth automatic zooms. Local-first and open source.",
	openGraph: {
		title: "FlowReco — Screen recording, made cinematic.",
		description:
			"Record, edit, and share polished screen videos with smooth automatic zooms. Local-first and open source.",
		type: "website",
		url: webUrl,
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className="antialiased" lang="en">
			<head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#111315" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<meta name="msapplication-TileColor" content="#111315" />
				<meta name="theme-color" content="#111315" />
			</head>
			<body suppressHydrationWarning>
				<Script src="/theme-script.js" strategy="beforeInteractive" />
				<main className="isolate w-full">{children}</main>
			</body>
		</html>
	);
}
