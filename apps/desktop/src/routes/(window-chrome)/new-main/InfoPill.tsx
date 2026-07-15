import { cx } from "cva";
import type { ComponentProps } from "solid-js";

export type InfoPillVariant = "blue" | "red" | "gray";

export default function InfoPill(
	props: ComponentProps<"button"> & { variant: InfoPillVariant },
) {
	return (
		<button
			{...props}
			type="button"
			class={cx(
				"inline-flex items-center justify-center min-w-[40px] h-6 px-2.5 rounded-[var(--radius-pill,9999px)] text-[11px] font-medium leading-none tracking-[-0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sleek-accent,#0084d1)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--recorder-raised,#f5f5f5)]",
				props.variant === "blue" &&
					"bg-[var(--sleek-accent,#0084d1)] text-white hover:brightness-110",
				props.variant === "red" && "bg-red-500 text-white hover:bg-red-600",
				props.variant === "gray" &&
					"bg-[var(--recorder-overlay,rgba(37,43,49,0.05))] text-[var(--recorder-muted,#879192)] hover:bg-[var(--recorder-overlay-strong,rgba(37,43,49,0.08))] hover:text-[var(--recorder-text,#252b31)]",
			)}
		/>
	);
}
