import { Button } from "@cap/ui-solid";
import { getCurrentWindow } from "@tauri-apps/api/window";
import * as shell from "@tauri-apps/plugin-shell";
import RecoMark from "../../assets/reco-mark.svg";

const capabilities = [
	{
		title: "Studio tools are unlocked",
		description:
			"Edit, zoom, style, caption, and export local recordings without a plan gate or watermark.",
	},
	{
		title: "Your media stays yours",
		description:
			"Projects remain local unless you deliberately connect and publish to a FlowReco server.",
	},
	{
		title: "Open source by design",
		description:
			"FlowReco is distributed under the AGPL with upstream notices and source provenance included.",
	},
];

export default function Page() {
	return (
		<main class="flex h-full items-center justify-center bg-gray-1 p-6 text-gray-12">
			<section class="w-full max-w-[640px] overflow-hidden rounded-2xl border border-gray-4 bg-gray-2 shadow-sm">
				<div class="border-b border-gray-4 px-7 py-6">
					<div class="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#111315]">
						<img src={RecoMark} alt="" class="size-9" />
					</div>
					<p class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff6243]">
						FlowReco open source
					</p>
					<h1 class="text-3xl font-semibold tracking-tight">
						Everything you need is already unlocked.
					</h1>
					<p class="mt-2 max-w-[540px] text-sm leading-6 text-gray-10">
						There is no local editor upgrade to buy. Connect a hosted or
						self-hosted server only when your workflow needs publishing and
						collaboration.
					</p>
				</div>

				<div class="grid gap-px bg-gray-4 sm:grid-cols-3">
					{capabilities.map((capability) => (
						<div class="bg-gray-2 p-5">
							<div class="mb-3 size-2 rounded-full bg-[#ff6243]" />
							<h2 class="text-sm font-semibold">{capability.title}</h2>
							<p class="mt-1.5 text-xs leading-5 text-gray-10">
								{capability.description}
							</p>
						</div>
					))}
				</div>

				<div class="flex items-center justify-between gap-3 border-t border-gray-4 px-7 py-5">
					<Button
						variant="gray"
						onClick={() =>
							shell.open("https://github.com/Atharvsinh-codez/FlowReco")
						}
					>
						View source
					</Button>
					<Button variant="primary" onClick={() => getCurrentWindow().close()}>
						Continue to FlowReco
					</Button>
				</div>
			</section>
		</main>
	);
}
