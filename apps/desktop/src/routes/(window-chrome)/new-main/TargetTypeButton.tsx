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
				"flex flex-1 flex-col items-center justify-center gap-1.5 rounded-[var(--radius-lg,12px)] border py-3 text-center transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--sleek-accent,#0284c7)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--recorder-bg,#121212)]",
				local.selected
					? "border-[var(--sleek-accent,#0284c7)] bg-[var(--sleek-accent-soft,rgba(2,132,199,0.12))] text-[var(--recorder-text,#eef3f8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
					: "border-[var(--recorder-border,rgba(233,238,245,0.1))] bg-[var(--recorder-raised,#1b1d22)] text-[var(--recorder-text,#eef3f8)] hover:bg-[var(--recorder-hover,#22252b)] hover:border-[rgba(233,238,245,0.16)]",
				local.disabled && "pointer-events-none opacity-60",
				local.class,
			)}
		>
			<div
				class={cx(
					"flex size-8 items-center justify-center rounded-[var(--radius-md,8px)] transition-colors",
					local.selected
						? "bg-[var(--sleek-accent,#0284c7)]/15 text-[var(--sleek-accent,#0284c7)]"
						: "bg-white/[0.04] text-[var(--recorder-muted,#7a7d85)]",
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
