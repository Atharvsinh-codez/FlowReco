import { Button } from "@cap/ui-solid";
import * as shell from "@tauri-apps/plugin-shell";

const licenseFacts = [
	["Application", "GNU Affero General Public License v3.0"],
	["Local editor", "No subscription gate or forced watermark"],
	["Source", "Included with every distributed build"],
	["Upstream", "Cap and Recordly attribution preserved"],
];

export default function Page() {
	return (
		<main class="cap-settings-page h-full overflow-y-auto p-5 text-gray-12">
			<section class="mx-auto max-w-[720px] overflow-hidden rounded-2xl border border-gray-4 bg-gray-2">
				<div class="border-b border-gray-4 p-6">
					<p class="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#ff6243]">
						Open-source license
					</p>
					<h1 class="text-2xl font-semibold tracking-tight">
						FlowReco belongs in the open.
					</h1>
					<p class="mt-2 max-w-[600px] text-sm leading-6 text-gray-10">
						Use the complete local recording and editing experience without a
						license key. If you distribute a modified network service, review
						the AGPL corresponding-source requirements that ship with this
						repository.
					</p>
				</div>

				<dl class="divide-y divide-gray-4 px-6">
					{licenseFacts.map(([term, detail]) => (
						<div class="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-5">
							<dt class="text-xs font-medium text-gray-9">{term}</dt>
							<dd class="text-sm text-gray-12">{detail}</dd>
						</div>
					))}
				</dl>

				<div class="flex flex-wrap gap-2 border-t border-gray-4 p-6">
					<Button
						variant="primary"
						onClick={() =>
							shell.open(
								"https://github.com/Atharvsinh-codez/FlowReco/blob/main/LICENSE",
							)
						}
					>
						Read the license
					</Button>
					<Button
						variant="gray"
						onClick={() =>
							shell.open("https://github.com/Atharvsinh-codez/FlowReco")
						}
					>
						View source
					</Button>
				</div>
			</section>
		</main>
	);
}
