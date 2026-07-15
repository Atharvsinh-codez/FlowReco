import { cx } from "cva";
import { type JSX, Show } from "solid-js";
import { createOptionsQuery } from "~/utils/queries";
import { commands, type RecordingMode } from "~/utils/tauri";

interface ModeOptionProps {
	mode: RecordingMode;
	title: string;
	eyebrow: string;
	description: string;
	icon: (props: { class: string; style?: JSX.CSSProperties }) => JSX.Element;
	isSelected: boolean;
	onSelect: (mode: RecordingMode) => void;
}

const ModeOption = (props: ModeOptionProps) => {
	return (
		<button
			type="button"
			data-tauri-drag-region="false"
			onClick={() => props.onSelect(props.mode)}
			class={cx(
				"group relative flex flex-col items-stretch text-left rounded-[var(--radius-xl,16px)] border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sleek-accent,#0084d1)]",
				props.isSelected
					? "border-[var(--sleek-accent,#0084d1)] bg-[var(--sleek-accent-soft,rgba(0,132,209,0.12))] shadow-[0_8px_24px_rgba(0,132,209,0.12)]"
					: "border-gray-4 dark:border-gray-5 bg-gray-2 dark:bg-gray-3 hover:border-gray-6 hover:bg-gray-3 dark:hover:bg-gray-4 hover:-translate-y-0.5",
			)}
			aria-pressed={props.isSelected}
		>
			<Show when={props.isSelected}>
				<div class="absolute top-2.5 right-2.5 flex items-center justify-center size-5 rounded-[var(--radius-md,8px)] bg-[var(--sleek-accent,#0084d1)]">
					<IconLucideCheck class="size-3 text-white" />
				</div>
			</Show>

			<div
				class={cx(
					"flex items-center justify-center w-full pt-5 pb-3 transition-colors duration-200",
					props.isSelected
						? "text-[var(--sleek-accent,#0084d1)]"
						: "text-gray-12",
				)}
			>
				<div
					class={cx(
						"flex size-11 items-center justify-center rounded-[var(--radius-lg,12px)] border transition-colors duration-200",
						props.isSelected
							? "border-[var(--sleek-accent,#0084d1)]/40 bg-[var(--sleek-accent-soft,rgba(0,132,209,0.12))]"
							: "border-gray-5 bg-gray-1 dark:bg-gray-2 group-hover:border-gray-6",
					)}
				>
					<props.icon class="size-5 invert dark:invert-0" />
				</div>
			</div>

			<div class="flex flex-col items-start px-4 pb-4 gap-1.5">
				<span
					class={cx(
						"text-[10px] font-medium uppercase tracking-[0.08em]",
						props.isSelected
							? "text-[var(--sleek-accent,#0084d1)]"
							: "text-gray-10",
					)}
				>
					{props.eyebrow}
				</span>
				<h3 class="text-[15px] font-semibold tracking-tight text-gray-12">
					{props.title}
				</h3>
				<p class="text-xs leading-relaxed text-gray-11 line-clamp-3 text-pretty">
					{props.description}
				</p>
			</div>
		</button>
	);
};

const ModeSelect = (props: { onClose?: () => void; standalone?: boolean }) => {
	const { rawOptions, setOptions } = createOptionsQuery();

	const handleModeChange = (mode: RecordingMode) => {
		if (mode === "instant") return;
		setOptions({ mode });
		commands.setRecordingMode(mode);
	};

	const selectedMode = () =>
		rawOptions.mode === "instant" ? "studio" : rawOptions.mode;

	const modeOptions = [
		{
			mode: "studio" as const,
			title: "Edit in studio",
			eyebrow: "Studio",
			description:
				"Record locally at full quality, then polish zooms, cursor, captions, and export when ready.",
			icon: IconCapFilmCut,
		},
		{
			mode: "screenshot" as const,
			title: "Still capture",
			eyebrow: "Screenshot",
			description:
				"Grab a frame, annotate, and copy or save. Built for bugs, docs, and quick feedback.",
			icon: IconCapScreenshot,
		},
	];

	return (
		<div
			data-tauri-drag-region="false"
			class={cx(
				"relative",
				props.standalone
					? "absolute z-10 border border-gray-4 p-6 rounded-[var(--radius-xl,16px)] bg-gray-1 shadow-s"
					: "",
			)}
			onClick={(e) => e.stopPropagation()}
		>
			<Show when={props.onClose}>
				<button
					type="button"
					onClick={() => props.onClose?.()}
					class="absolute -top-2 -right-2 p-2 rounded-[var(--radius-sm,6px)] border duration-200 bg-gray-2 border-gray-4 hover:bg-gray-3 transition-colors"
					aria-label="Close mode picker"
				>
					<IconCapX class="invert-1 size-2 dark:invert" />
				</button>
			</Show>

			<div class="grid grid-cols-2 gap-3">
				{modeOptions.map((option) => (
					<ModeOption
						mode={option.mode}
						title={option.title}
						eyebrow={option.eyebrow}
						description={option.description}
						icon={option.icon}
						isSelected={selectedMode() === option.mode}
						onSelect={handleModeChange}
					/>
				))}
			</div>
		</div>
	);
};

export default ModeSelect;
