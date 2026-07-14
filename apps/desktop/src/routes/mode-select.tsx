import type { UnlistenFn } from "@tauri-apps/api/event";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { type as ostype } from "@tauri-apps/plugin-os";
import { onCleanup, onMount } from "solid-js";
import ModeSelect from "~/components/ModeSelect";
import CaptionControlsWindows11 from "~/components/titlebar/controls/CaptionControlsWindows11";
import { initializeTitlebar } from "~/utils/titlebar-state";

const ModeSelectWindow = () => {
	let unlistenResize: UnlistenFn | undefined;
	const isWindows = ostype() === "windows";

	onMount(async () => {
		const window = getCurrentWindow();

		if (isWindows) {
			try {
				unlistenResize = await initializeTitlebar();
			} catch (error) {
				console.error("Failed to initialize titlebar:", error);
			}
		}

		try {
			const currentSize = await window.innerSize();

			if (currentSize.width !== 640 || currentSize.height !== 380) {
				await window.setSize(new LogicalSize(640, 380));
			}
		} catch (error) {
			console.error("Failed to set window size:", error);
		}
	});

	onCleanup(() => {
		unlistenResize?.();
	});

	return (
		<div
			data-tauri-drag-region
			class="flex flex-col relative justify-center items-center min-h-screen bg-gray-1"
		>
			{isWindows && (
				<div class="absolute top-0 right-0 z-50 h-9">
					<CaptionControlsWindows11 />
				</div>
			)}

			<div class="flex flex-col items-center w-full px-7 py-6">
				<div class="mb-6 text-center max-w-md">
					<p class="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--sleek-accent,#0284c7)] mb-2">
						How do you want to capture
					</p>
					<h2 class="text-xl font-semibold tracking-tight text-gray-12 mb-1.5 text-balance">
						Pick a recording mode
					</h2>
					<p class="text-sm text-gray-11 text-pretty leading-relaxed">
						Share in seconds, edit in Studio, or grab a still. You can change
						this anytime from the recorder.
					</p>
				</div>

				<div data-tauri-drag-region="false" class="w-full max-w-xl">
					<ModeSelect />
				</div>
			</div>
		</div>
	);
};

export default ModeSelectWindow;
