import { Select as KSelect } from "@kobalte/core/select";
import { ToggleButton as KToggleButton } from "@kobalte/core/toggle-button";
import { createElementBounds } from "@solid-primitives/bounds";
import { debounce } from "@solid-primitives/scheduled";
import { Menu } from "@tauri-apps/api/menu";
import { type as ostype } from "@tauri-apps/plugin-os";
import { cx } from "cva";
import { createEffect, createSignal, onMount, Show } from "solid-js";

import Tooltip from "~/components/Tooltip";
import { captionsStore } from "~/store/captions";
import { commands } from "~/utils/tauri";
import AspectRatioSelect from "./AspectRatioSelect";
import {
	CanvasElementsOverlay,
	SnapGuidesOverlay,
} from "./CanvasElementsOverlay";
import { CaptionOverlay } from "./CaptionOverlay";
import { CaptionsRegenerateBadge } from "./CaptionsRegenerateBadge";
import { createCaptionTrackSegments } from "./captions";
import {
	type EditorPreviewQuality,
	FPS,
	serializeProjectConfiguration,
	useEditorContext,
} from "./context";
import { FrameButton } from "./FrameButton";
import { MaskOverlay } from "./MaskOverlay";
import { PerformanceOverlay } from "./PerformanceOverlay";
import { SplitScreenOverlay } from "./SplitScreenOverlay";
import { TextOverlay } from "./TextOverlay";
import {
	EditorButton,
	MenuItem,
	MenuItemList,
	PopperContent,
	Slider,
	topLeftAnimateClasses,
} from "./ui";
import { useEditorShortcuts } from "./useEditorShortcuts";
import { formatTime } from "./utils";

export function PlayerContent() {
	const {
		project,
		editorInstance,
		setDialog,
		totalDuration,
		editorState,
		setEditorState,
		zoomOutLimit,
		setProject,
		previewResolutionBase,
		previewQuality,
		setPreviewQuality,
	} = useEditorContext();

	const previewOptions = [
		{ label: "Full", value: "full" as EditorPreviewQuality },
		{ label: "Half", value: "half" as EditorPreviewQuality },
		{ label: "Quarter", value: "quarter" as EditorPreviewQuality },
	];

	const zoomHint = () =>
		ostype() === "windows"
			? "Hold Ctrl and scroll, or press Ctrl +/- to zoom"
			: "Pinch, or press Cmd +/- to zoom";

	// Load captions on mount
	onMount(async () => {
		if (editorInstance?.path) {
			await captionsStore.loadCaptions(editorInstance.path);

			if (editorInstance && project) {
				const updatedProject = { ...project };
				let projectDidChange = false;
				const captionSegments = captionsStore.state.segments;
				const hasStoredCaptions = captionSegments.length > 0;

				if (!updatedProject.captions && hasStoredCaptions) {
					updatedProject.captions = {
						segments: captionSegments.map((segment) => ({
							id: segment.id,
							start: segment.start,
							end: segment.end,
							text: segment.text,
						})),
						settings: { ...captionsStore.state.settings },
						sourceTimed: true,
					};
					projectDidChange = true;
				}

				if (
					hasStoredCaptions &&
					(updatedProject.timeline?.captionSegments?.length ?? 0) === 0
				) {
					updatedProject.timeline = {
						...(updatedProject.timeline ?? {
							segments: [
								{
									start: 0,
									end: editorInstance.recordingDuration,
									timescale: 1,
								},
							],
							zoomSegments: [],
							sceneSegments: [],
							maskSegments: [],
							textSegments: [],
						}),
						captionSegments: createCaptionTrackSegments(captionSegments),
					};
					projectDidChange = true;
				}

				const hasCaptionTrackData =
					hasStoredCaptions ||
					(updatedProject.timeline?.captionSegments?.length ?? 0) > 0;

				if (hasCaptionTrackData) {
					setEditorState(
						"timeline",
						"tracks",
						"caption",
						updatedProject.captions?.settings?.enabled ?? true,
					);
				}

				if (projectDidChange) {
					setProject(updatedProject);
					await commands.setProjectConfig(
						serializeProjectConfiguration(updatedProject),
					);
				}
			}
		}
	});

	// Continue to update current caption when playback time changes
	// This is still needed for CaptionsTab to highlight the current caption
	createEffect(() => {
		const time = editorState.playbackTime;
		// Only update captions if we have a valid time and segments exist
		if (
			time !== undefined &&
			time >= 0 &&
			captionsStore.state.segments.length > 0
		) {
			captionsStore.updateCurrentCaption(time);
		}
	});

	const isAtEnd = () => {
		const total = totalDuration();
		return total > 0 && total - editorState.playbackTime <= 0.1;
	};

	const cropDialogHandler = async () => {
		const display = editorInstance.recordings.segments[0].display;
		setDialog({
			open: true,
			type: "crop",
			position: {
				...(project.background.crop?.position ?? { x: 0, y: 0 }),
			},
			size: {
				...(project.background.crop?.size ?? {
					x: display.width,
					y: display.height,
				}),
			},
		});
		await commands.stopPlayback();
		setEditorState("playing", false);
	};

	const handlePreviewQualityChange = async (quality: EditorPreviewQuality) => {
		if (quality === previewQuality()) return;

		const wasPlaying = editorState.playing;
		const currentFrame = Math.max(
			Math.floor(editorState.playbackTime * FPS),
			0,
		);

		setPreviewQuality(quality);

		if (!wasPlaying) return;

		try {
			await commands.stopPlayback();
			setEditorState("playing", false);
			await commands.seekTo(currentFrame);
			await commands.startPlayback(FPS, previewResolutionBase());
			setEditorState("playing", true);
		} catch (error) {
			console.error("Failed to update preview quality:", error);
			setEditorState("playing", false);
		}
	};

	createEffect(() => {
		if (isAtEnd() && editorState.playing) {
			commands.stopPlayback();
			setEditorState("playing", false);
		}
	});

	const handlePlayPauseClick = async () => {
		try {
			if (isAtEnd()) {
				await commands.stopPlayback();
				setEditorState("playbackTime", 0);
				await commands.seekTo(0);
				await commands.startPlayback(FPS, previewResolutionBase());
				setEditorState("playing", true);
			} else if (editorState.playing) {
				await commands.stopPlayback();
				setEditorState("playing", false);
			} else {
				await commands.seekTo(Math.floor(editorState.playbackTime * FPS));
				await commands.startPlayback(FPS, previewResolutionBase());
				setEditorState("playing", true);
			}
			if (editorState.playing) setEditorState("previewTime", null);
		} catch (error) {
			console.error("Error handling play/pause:", error);
			setEditorState("playing", false);
		}
	};

	// Register keyboard shortcuts in one place
	useEditorShortcuts(() => {
		const el = document.activeElement;
		if (!el) return true;
		const tagName = el.tagName.toLowerCase();
		const isContentEditable = el.getAttribute("contenteditable") === "true";
		return !(
			tagName === "input" ||
			tagName === "textarea" ||
			isContentEditable
		);
	}, [
		{
			combo: "S",
			handler: () =>
				setEditorState(
					"timeline",
					"interactMode",
					editorState.timeline.interactMode === "split" ? "seek" : "split",
				),
		},
		{
			combo: "Mod+=",
			handler: () =>
				editorState.timeline.transform.updateZoom(
					editorState.timeline.transform.zoom / 1.1,
					editorState.playbackTime,
				),
		},
		{
			combo: "Mod+-",
			handler: () =>
				editorState.timeline.transform.updateZoom(
					editorState.timeline.transform.zoom * 1.1,
					editorState.playbackTime,
				),
		},
		{
			combo: "Space",
			handler: async () => {
				const prevTime = editorState.previewTime;

				if (!editorState.playing) {
					if (prevTime !== null) setEditorState("playbackTime", prevTime);

					await commands.seekTo(Math.floor(editorState.playbackTime * FPS));
				}

				await handlePlayPauseClick();
			},
		},
	]);

	const playbackProgress = () => {
		const total = totalDuration();
		if (total <= 0) return 0;
		const t = Math.max(editorState.previewTime ?? editorState.playbackTime, 0);
		return Math.min(100, (t / total) * 100);
	};

	return (
		<div class="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-2">
			<div class="flex items-center justify-between gap-3 px-3.5 py-2 border-b border-[var(--recorder-border,#e6e6e6)] bg-white/90 dark:bg-gray-2">
				<div class="flex items-center gap-2">
					<AspectRatioSelect />
					<EditorButton
						tooltipText="Crop Video"
						onClick={cropDialogHandler}
						leftIcon={<IconCapCrop class="w-4 text-gray-12" />}
					>
						Crop Video
					</EditorButton>
					<FrameButton />
				</div>
				<div class="flex items-center gap-2">
					<span class="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--recorder-muted,#879192)]">
						Preview
					</span>
					<KSelect<{ label: string; value: EditorPreviewQuality }>
						options={previewOptions}
						optionValue="value"
						optionTextValue="label"
						value={previewOptions.find(
							(option) => option.value === previewQuality(),
						)}
						onChange={(next) => {
							if (next) handlePreviewQualityChange(next.value);
						}}
						disallowEmptySelection
						itemComponent={(props) => (
							<MenuItem<typeof KSelect.Item>
								as={KSelect.Item}
								item={props.item}
							>
								<KSelect.ItemLabel class="flex-1">
									{props.item.rawValue.label}
								</KSelect.ItemLabel>
								<KSelect.ItemIndicator class="ml-auto text-[var(--sleek-accent,#0084d1)]">
									<IconCapCircleCheck />
								</KSelect.ItemIndicator>
							</MenuItem>
						)}
					>
						<KSelect.Trigger class="flex items-center gap-2 h-8 px-2.5 rounded-[10px] border border-[var(--recorder-border,#e6e6e6)] bg-[var(--flow-surface-light,#f5f5f5)] text-sm text-gray-12 transition-colors hover:border-gray-5">
							<KSelect.Value<{
								label: string;
								value: EditorPreviewQuality;
							}> class="flex-1 text-left truncate">
								{(state) =>
									state.selectedOption()?.label ?? "Select preview quality"
								}
							</KSelect.Value>
							<KSelect.Icon>
								<IconCapChevronDown class="size-4 text-gray-11" />
							</KSelect.Icon>
						</KSelect.Trigger>
						<KSelect.Portal>
							<PopperContent<typeof KSelect.Content>
								as={KSelect.Content}
								class={cx(topLeftAnimateClasses, "w-44")}
							>
								<MenuItemList<typeof KSelect.Listbox>
									as={KSelect.Listbox}
									class="max-h-40"
								/>
							</PopperContent>
						</KSelect.Portal>
					</KSelect>
				</div>
			</div>
			<div class="relative flex flex-1 min-h-0 flex-col bg-[var(--flow-subtle,#eceef1)] dark:bg-gray-3">
				<PreviewCanvas />
			</div>
			<div class="relative flex z-10 flex-row gap-3 justify-between items-center px-3.5 py-2.5 border-t border-[var(--recorder-border,#e6e6e6)] bg-white dark:bg-gray-2">
				<div class="flex items-center gap-2">
					<button
						type="button"
						class="flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--recorder-border,#e6e6e6)] bg-[var(--flow-surface-light,#f5f5f5)] text-gray-12 transition-colors hover:bg-[var(--sleek-accent-soft,rgba(0,132,209,0.12))] hover:text-[var(--sleek-accent,#0084d1)]"
						onClick={handlePlayPauseClick}
						aria-label={!editorState.playing || isAtEnd() ? "Play" : "Pause"}
					>
						{!editorState.playing || isAtEnd() ? (
							<IconCapPlay class="size-3.5" />
						) : (
							<IconCapPause class="size-3.5" />
						)}
					</button>
					<div class="flex items-center gap-1.5 text-[0.8125rem] tabular-nums">
						<Time
							class="text-gray-12 font-medium"
							seconds={Math.max(
								editorState.previewTime ?? editorState.playbackTime,
								0,
							)}
						/>
						<span class="text-[var(--recorder-muted,#879192)]">/</span>
						<Time
							class="text-[var(--recorder-muted,#879192)]"
							seconds={totalDuration()}
						/>
					</div>
					<div class="group relative mx-1 hidden h-6 w-40 min-w-[6rem] flex-1 items-center sm:flex sm:w-52">
						<div class="absolute inset-x-0 h-1 overflow-hidden rounded-full bg-[var(--flow-subtle,#eceef1)]">
							<div
								class="h-full rounded-full bg-[var(--sleek-accent,#0084d1)]"
								style={{ width: `${playbackProgress()}%` }}
							/>
						</div>
						<input
							type="range"
							min={0}
							max={Math.max(totalDuration(), 0.001)}
							step={0.01}
							value={Math.max(
								editorState.previewTime ?? editorState.playbackTime,
								0,
							)}
							class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
							onInput={async (e) => {
								const next = Number(e.currentTarget.value);
								if (editorState.playing) {
									await commands.stopPlayback();
									setEditorState("playing", false);
								}
								setEditorState("playbackTime", next);
								setEditorState("previewTime", null);
								await commands.seekTo(Math.floor(next * FPS));
							}}
						/>
					</div>
				</div>
				<div class="flex flex-row flex-1 gap-2 justify-end items-center">
					<button
						type="button"
						class="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-gray-11 transition-colors hover:bg-[var(--flow-surface-light,#f5f5f5)] hover:text-gray-12"
						onClick={async () => {
							await commands.stopPlayback();
							setEditorState("playing", false);
							setEditorState("playbackTime", 0);
							editorState.timeline.transform.setPosition(0);
						}}
						aria-label="Go to start"
					>
						<IconCapPrev class="size-3.5" />
					</button>
					<button
						type="button"
						class="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-gray-11 transition-colors hover:bg-[var(--flow-surface-light,#f5f5f5)] hover:text-gray-12"
						onClick={async () => {
							await commands.stopPlayback();
							setEditorState("playing", false);
							setEditorState("playbackTime", totalDuration());
						}}
						aria-label="Go to end"
					>
						<IconCapNext class="size-3.5" />
					</button>
					<div class="w-px h-5 bg-[var(--recorder-border,#e6e6e6)]" />
					<EditorButton<typeof KToggleButton>
						tooltipText="Split tool"
						kbd={["S"]}
						pressed={editorState.timeline.interactMode === "split"}
						onChange={(v: boolean) =>
							setEditorState("timeline", "interactMode", v ? "split" : "seek")
						}
						as={KToggleButton}
						variant="danger"
						leftIcon={
							<IconCapScissors
								class={cx(
									editorState.timeline.interactMode === "split"
										? "text-white"
										: "text-gray-12",
								)}
							/>
						}
					/>
					<div class="w-px h-5 bg-[var(--recorder-border,#e6e6e6)]" />
					<Tooltip kbd={["meta", "-"]} content="Zoom out timeline">
						<button
							type="button"
							class="p-1.5 rounded-[8px] text-gray-12 transition-colors hover:bg-[var(--flow-surface-light,#f5f5f5)]"
							onClick={() => {
								editorState.timeline.transform.updateZoom(
									editorState.timeline.transform.zoom * 1.1,
									editorState.playbackTime,
								);
							}}
						>
							<IconCapZoomOut class="size-4" />
						</button>
					</Tooltip>
					<Tooltip kbd={["meta", "+"]} content="Zoom in timeline">
						<button
							type="button"
							class="p-1.5 rounded-[8px] text-gray-12 transition-colors hover:bg-[var(--flow-surface-light,#f5f5f5)]"
							onClick={() => {
								editorState.timeline.transform.updateZoom(
									editorState.timeline.transform.zoom / 1.1,
									editorState.playbackTime,
								);
							}}
						>
							<IconCapZoomIn class="size-4" />
						</button>
					</Tooltip>
					<Slider
						class="w-24"
						minValue={0}
						maxValue={1}
						step={0.001}
						value={[
							Math.min(
								Math.max(
									1 - editorState.timeline.transform.zoom / zoomOutLimit(),
									0,
								),
								1,
							),
						]}
						onChange={([v]) => {
							editorState.timeline.transform.updateZoom(
								(1 - v) * zoomOutLimit(),
								editorState.playbackTime,
							);
						}}
						formatTooltip={() =>
							`${editorState.timeline.transform.zoom.toFixed(
								0,
							)} seconds visible`
						}
					/>
				</div>
				<div class="absolute right-2 bottom-0.5 text-[10px] leading-none text-right text-gray-9 pointer-events-none whitespace-nowrap">
					{zoomHint()}
				</div>
			</div>
		</div>
	);
}

// CSS for checkerboard grid (adaptive to light/dark mode)
const gridStyle = {
	"background-image":
		"linear-gradient(45deg, rgba(128,128,128,0.12) 25%, transparent 25%), " +
		"linear-gradient(-45deg, rgba(128,128,128,0.12) 25%, transparent 25%), " +
		"linear-gradient(45deg, transparent 75%, rgba(128,128,128,0.12) 75%), " +
		"linear-gradient(-45deg, transparent 75%, rgba(128,128,128,0.12) 75%)",
	"background-size": "40px 40px",
	"background-position": "0 0, 0 20px, 20px -20px, -20px 0px",
	"background-color": "rgba(200,200,200,0.08)",
};

function PreviewCanvas() {
	const { latestFrame, canvasControls, performanceMode, setPerformanceMode } =
		useEditorContext();

	const hasRenderedFrame = () => canvasControls()?.hasRenderedFrame() ?? false;

	const handleContextMenu = async (e: MouseEvent) => {
		e.preventDefault();
		const menu = await Menu.new({
			items: [
				{
					id: "performance-mode",
					text: performanceMode() ? "✓ Performance Mode" : "Performance Mode",
					action: () => setPerformanceMode(!performanceMode()),
				},
			],
		});
		menu.popup();
	};

	const canvasInitializedRef = { current: false };
	const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement | null>(
		null,
	);

	const [canvasContainerRef, setCanvasContainerRef] =
		createSignal<HTMLDivElement>();
	const containerBounds = createElementBounds(canvasContainerRef);

	const [debouncedBounds, setDebouncedBounds] = createSignal({
		width: 0,
		height: 0,
	});

	const updateDebouncedBounds = debounce(
		(width: number, height: number) => setDebouncedBounds({ width, height }),
		100,
	);

	createEffect(() => {
		const width = containerBounds.width ?? 0;
		const height = containerBounds.height ?? 0;
		if (debouncedBounds().width === 0 && debouncedBounds().height === 0) {
			setDebouncedBounds({ width, height });
		} else {
			updateDebouncedBounds(width, height);
		}
	});

	createEffect(() => {
		const canvas = canvasRef();
		const controls = canvasControls();
		console.warn("[Player] Canvas init effect", {
			hasCanvas: !!canvas,
			hasControls: !!controls,
			alreadyInit: canvasInitializedRef.current,
		});
		if (canvasInitializedRef.current || !canvas || !controls) return;

		console.warn("[Player] Initializing canvas", {
			canvasId: canvas.id,
			isConnected: canvas.isConnected,
		});
		controls.initDirectCanvas(canvas);
		canvasInitializedRef.current = true;
		console.warn("[Player] Canvas initialized successfully");
	});

	const padding = 4;
	const frameWidth = () => latestFrame()?.width ?? 1920;
	const frameHeight = () => latestFrame()?.height ?? 1080;

	const availableWidth = () =>
		Math.max(debouncedBounds().width - padding * 2, 0);
	const availableHeight = () =>
		Math.max(debouncedBounds().height - padding * 2, 0);

	const containerAspect = () => {
		const width = availableWidth();
		const height = availableHeight();
		if (width === 0 || height === 0) return 1;
		return width / height;
	};

	const frameAspect = () => {
		const width = frameWidth();
		const height = frameHeight();
		if (width === 0 || height === 0) return containerAspect();
		return width / height;
	};

	const size = () => {
		let width: number;
		let height: number;
		if (frameAspect() < containerAspect()) {
			height = availableHeight();
			width = height * frameAspect();
		} else {
			width = availableWidth();
			height = width / frameAspect();
		}

		return { width, height };
	};

	const hasFrame = () => !!latestFrame();

	return (
		<div
			ref={setCanvasContainerRef}
			class="relative flex-1 justify-center items-center"
			style={{ contain: "layout style" }}
			onContextMenu={handleContextMenu}
		>
			<CaptionsRegenerateBadge class="absolute top-3 right-3 z-20" />
			<div
				class="flex overflow-hidden absolute inset-0 justify-center items-center h-full"
				style={{ visibility: hasFrame() ? "visible" : "hidden" }}
			>
				<div
					class="relative"
					style={{
						width: `${size().width}px`,
						height: `${size().height}px`,
						contain: "strict",
					}}
				>
					<canvas
						style={{
							width: `${size().width}px`,
							height: `${size().height}px`,
							"image-rendering": "auto",
							"background-color": "#000000",
							...(hasRenderedFrame() ? gridStyle : {}),
						}}
						ref={setCanvasRef}
						id="canvas"
					/>
					<Show when={hasFrame()}>
						<CanvasElementsOverlay size={size()} />
						<MaskOverlay size={size()} />
						<CaptionOverlay size={size()} />
						<TextOverlay size={size()} />
						<SplitScreenOverlay size={size()} />
						<SnapGuidesOverlay size={size()} />
						<PerformanceOverlay size={size()} />
					</Show>
				</div>
			</div>
		</div>
	);
}

function Time(props: { seconds: number; fps?: number; class?: string }) {
	return (
		<span class={cx("text-gray-11 text-sm tabular-nums", props.class)}>
			{formatTime(props.seconds, props.fps ?? FPS)}
		</span>
	);
}
