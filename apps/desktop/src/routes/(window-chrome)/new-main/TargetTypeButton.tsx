import { cx } from "cva";
import { type Component, type ComponentProps, splitProps } from "solid-js";

type TargetTypeButtonProps = {
	selected: boolean;
	Component: Component<ComponentProps<"svg">>;
	name: string;
	disabled?: boolean;
} & ComponentProps<"button">;

function TargetTypeButton(props: TargetTypeButtonProps) {
	const [local, rest] = splitProps(props, [
		"selected",
		"Component",
		"name",
		"disabled",
		"class",
	]);

	return (
		<button
			{...rest}
			type="button"
			disabled={local.disabled}
			aria-pressed={local.selected ? "true" : "false"}
			class={cx(
				"flex flex-1 flex-col items-center justify-center gap-1.5 rounded-[var(--radius-lg,12px)] border py-3 text-center transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--sleek-accent,#0084d1)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--recorder-bg,#ffffff)]",
				local.selected
					? "border-[var(--sleek-accent,#0084d1)] bg-[var(--sleek-accent-soft,rgba(0,132,209,0.12))] text-[var(--recorder-text,#252b31)] shadow-[var(--recorder-selected-shadow,0_0_0_1px_rgba(0,132,209,0.35))]"
					: "border-[var(--recorder-border,#e6e6e6)] bg-[var(--recorder-raised,#f5f5f5)] text-[var(--recorder-text,#252b31)] hover:bg-[var(--recorder-hover,#eceef1)] hover:border-[var(--recorder-border,#e6e6e6)]",
				local.disabled && "pointer-events-none opacity-60",
				local.class,
			)}
		>
			<div
				class={cx(
					"flex size-8 items-center justify-center rounded-[var(--radius-md,8px)] transition-colors",
					local.selected
						? "bg-[var(--sleek-accent,#0084d1)]/15 text-[var(--sleek-accent,#0084d1)]"
						: "bg-[var(--recorder-overlay,rgba(37,43,49,0.05))] text-[var(--recorder-muted,#879192)]",
				)}
			>
				<local.Component class="size-4" />
			</div>
			<p class="text-[12px] font-medium tracking-[-0.02em] leading-none">
				{local.name}
			</p>
		</button>
	);
}

export default TargetTypeButton;
