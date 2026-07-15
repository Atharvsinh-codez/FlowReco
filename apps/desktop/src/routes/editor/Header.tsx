import { Button } from "@cap/ui-solid";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { ask } from "@tauri-apps/plugin-dialog";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { type as ostype } from "@tauri-apps/plugin-os";
import { cx } from "cva";
import {
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import Tooltip from "~/components/Tooltip";
import CaptionControlsMacOS from "~/components/titlebar/controls/CaptionControlsMacOS";
import CaptionControlsWindows11 from "~/components/titlebar/controls/CaptionControlsWindows11";
import { trackEvent } from "~/utils/analytics";
import { commands } from "~/utils/tauri";
import { initializeTitlebar } from "~/utils/titlebar-state";
import { useEditorContext } from "./context";
import OrganizationDropdown from "./OrganizationDropdown";
import PresetsDropdown from "./PresetsDropdown";
import ShareButton from "./ShareButton";
import { EditorButton } from "./ui";

export type ResolutionOption = {
	label: string;
	value: string;
	width: number;
	height: number;
};

export const RESOLUTION_OPTIONS = {
	_720p: { label: "720p", value: "720p", width: 1280, height: 720 },
	_1080p: { label: "1080p", value: "1080p", width: 1920, height: 1080 },
	_4k: { label: "4K", value: "4k", width: 3840, height: 2160 },
};

export interface ExportEstimates {
	duration_seconds: number;
	estimated_time_seconds: number;
	estimated_size_mb: number;
}

export function Header() {
	const {
		editorInstance,
		project,
		projectHistory,
		dialog,
		setDialog,
		meta,
		exportState,
		setExportState,
		customDomain,
		editorState,
		setEditorState,
	} = useEditorContext();

	let unlistenTitlebar: UnlistenFn | undefined;
	onMount(async () => {
		unlistenTitlebar = await initializeTitlebar();
	});
	onCleanup(() => unlistenTitlebar?.());

	const clearTimelineSelection = () => {
		if (!editorState.timeline.selection) return false;
		setEditorState("timeline", "selection", null);
		return true;
	};

	const hasTranscript = createMemo(() => {
		const segments = project.captions?.segments ?? [];
		return segments.some((seg) => seg.words && seg.words.length > 0);
	});

	const isTranscriptOpen = createMemo(() => {
		const d = dialog();
		return "type" in d && d.type === "transcript" && d.open;
	});

	const isClipsOpen = createMemo(() => {
		const d = dialog();
		return "type" in d && d.type === "clips" && d.open;
	});

	return (
		<div
			data-tauri-drag-region
			class="flex relative flex-row items-center w-full h-12 border-b border-[var(--recorder-border,#e6e6e6)] bg-white/95 dark:bg-gray-2/95 backdrop-blur-md"
		>
			<div
				data-tauri-drag-region
				class={cx("flex flex-row flex-1 gap-1.5 items-center px-3 h-full")}
			>
				{ostype() === "macos" && <div class="h-full w-16" />}
				{ostype() === "linux" && <CaptionControlsMacOS class="mr-1" />}
				<div class="flex items-center gap-1 rounded-[10px] border border-[var(--recorder-border,#e6e6e6)] bg-[var(--flow-surface-light,#f5f5f5)] p-0.5">
					<EditorButton
						onClick={async () => {
							clearTimelineSelection();

							if (
								!(await ask("Are you sure you want to delete this recording?"))
							)
								return;

							await commands.editorDeleteProject();
						}}
						tooltipText="Delete recording"
						leftIcon={<IconCapTrash class="w-4" />}
					/>
					<EditorButton
						onClick={() => {
							clearTimelineSelection();
							revealItemInDir(`${editorInstance.path}/`);
						}}
						tooltipText="Open project folder"
						leftIcon={<IconLucideFolder class="w-4" />}
					/>
				</div>

				<div class="flex flex-col justify-center min-w-0 ml-2">
					<div class="flex flex-row items-center gap-1.5 min-w-0">
						<NameEditor name={meta().prettyName} />
					</div>
					<span class="text-[10px] text-[var(--recorder-muted,#879192)] leading-none mt-0.5">
						Studio · local project
					</span>
				</div>
				<div data-tauri-drag-region class="flex-1 h-full" />
			</div>

			<div
				data-tauri-drag-region
				class="flex flex-row items-center justify-center gap-2 px-3 h-full"
			>
				<PresetsDropdown />
				<OrganizationDropdown />
			</div>

			<div
				data-tauri-drag-region
				class={cx(
					"flex-1 h-full flex flex-row items-center gap-1.5 pl-2",
					ostype() !== "windows" && "pr-2",
				)}
			>
				<div class="flex items-center gap-0.5 rounded-[10px] border border-[var(--recorder-border,#e6e6e6)] bg-[var(--flow-surface-light,#f5f5f5)] p-0.5">
					<EditorButton
						onClick={() => {
							clearTimelineSelection();
							if (!projectHistory.canUndo()) return;
							projectHistory.undo();
						}}
						disabled={
							!projectHistory.canUndo() && !editorState.timeline.selection
						}
						tooltipText="Undo"
						leftIcon={<IconCapUndo class="w-4" />}
					/>
					<EditorButton
						onClick={() => {
							clearTimelineSelection();
							if (!projectHistory.canRedo()) return;
							projectHistory.redo();
						}}
						disabled={
							!projectHistory.canRedo() && !editorState.timeline.selection
						}
						tooltipText="Redo"
						leftIcon={<IconCapRedo class="w-4" />}
					/>
				</div>
				<div data-tauri-drag-region class="flex-1 h-full" />
				<Show when={customDomain.data}>
					<ShareButton />
				</Show>
				<Button
					variant={isClipsOpen() ? "white" : "gray"}
					class="flex gap-1.5 justify-center h-9 px-3 rounded-[10px] border border-[var(--recorder-border,#e6e6e6)]"
					onClick={() => {
						clearTimelineSelection();
						if (isClipsOpen()) {
							setDialog((d) => ({ ...d, open: false }));
						} else {
							setDialog({ type: "clips", open: true });
						}
					}}
				>
					<IconCapClapperboard class="size-4" />
					Clips
				</Button>
				<Show when={hasTranscript()}>
					<Button
						variant={isTranscriptOpen() ? "white" : "gray"}
						class="flex gap-1.5 justify-center h-9 px-3 rounded-[10px] border border-[var(--recorder-border,#e6e6e6)]"
						onClick={() => {
							clearTimelineSelection();
							if (isTranscriptOpen()) {
								setDialog((d) => ({ ...d, open: false }));
							} else {
								setDialog({ type: "transcript", open: true });
							}
						}}
					>
						<Show
							when={isTranscriptOpen()}
							fallback={<IconCapCaptions class="size-4" />}
						>
							<IconLucideArrowLeft class="size-4" />
						</Show>
						{isTranscriptOpen() ? "Back" : "Captions"}
					</Button>
				</Show>
				<button
					type="button"
					class={cx(
						"flex gap-1.5 justify-center items-center px-4 h-9 min-w-[96px] text-[0.8125rem] font-semibold text-white rounded-full outline-hidden",
						"bg-[var(--sleek-accent,#0084d1)]",
						"shadow-[0_8px_20px_-10px_rgba(0,132,209,0.55)]",
						"transition-[box-shadow,filter,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
						"hover:brightness-110 active:scale-[0.98]",
					)}
					onClick={() => {
						clearTimelineSelection();

						trackEvent("export_button_clicked");
						if (exportState.type === "done") setExportState({ type: "idle" });

						setDialog({ type: "export", open: true });
					}}
				>
					Export
				</button>
				{ostype() === "windows" && <CaptionControlsWindows11 />}
			</div>
		</div>
	);
}

function NameEditor(props: { name: string }) {
	const { refetchMeta } = useEditorContext();

	let prettyNameRef: HTMLInputElement | undefined;
	let prettyNameMeasureRef: HTMLSpanElement | undefined;
	const [truncated, setTruncated] = createSignal(false);
	const [prettyName, setPrettyName] = createSignal(props.name);

	createEffect(() => {
		if (!prettyNameRef || !prettyNameMeasureRef) return;
		prettyNameMeasureRef.textContent = prettyName();
		const inputWidth = prettyNameRef.offsetWidth;
		const textWidth = prettyNameMeasureRef.offsetWidth;
		setTruncated(inputWidth < textWidth);
	});

	return (
		<Tooltip disabled={!truncated()} content={props.name}>
			<div class="flex relative flex-row items-center text-sm font-normal font-inherit tracking-inherit text-gray-12">
				<input
					ref={prettyNameRef}
					class={cx(
						"absolute inset-0 px-px m-0 opacity-0 overflow-hidden focus:opacity-100 bg-transparent border-b border-transparent focus:border-gray-7 focus:outline-hidden peer whitespace-pre",
						truncated() && "truncate",
						(prettyName().length < 5 || prettyName().length > 100) &&
							"focus:border-red-500",
					)}
					value={prettyName()}
					onInput={(e) => setPrettyName(e.currentTarget.value)}
					onBlur={async () => {
						const trimmed = prettyName().trim();
						if (trimmed.length < 5 || trimmed.length > 100) {
							setPrettyName(props.name);
							return;
						}
						if (trimmed && trimmed !== props.name) {
							await commands.setPrettyName(trimmed);
							refetchMeta();
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === "Escape") {
							prettyNameRef?.blur();
						}
					}}
				/>
				{/* Hidden span for measuring text width */}
				<span
					ref={prettyNameMeasureRef}
					class="pointer-events-none max-w-[200px] px-px m-0 peer-focus:opacity-0 border-b border-transparent truncate whitespace-pre"
				/>
			</div>
		</Tooltip>
	);
}
