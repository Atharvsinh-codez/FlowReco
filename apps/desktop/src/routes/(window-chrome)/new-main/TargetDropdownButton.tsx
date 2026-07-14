import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Polymorphic } from "@kobalte/core/polymorphic";
import { cx } from "cva";
import { splitProps, type ValidComponent } from "solid-js";
import IconCapChevronDown from "~icons/cap/chevron-down";

type TargetDropdownButtonProps<T extends ValidComponent> = PolymorphicProps<
	T,
	{
		class?: string;
		disabled?: boolean;
		expanded?: boolean;
	}
>;

export default function TargetDropdownButton<
	T extends ValidComponent = "button",
>(props: TargetDropdownButtonProps<T>) {
	const [local, rest] = splitProps(props, ["class", "expanded", "disabled"]);

	return (
		<Polymorphic
			as="button"
			type="button"
			{...rest}
			disabled={local.disabled}
			aria-expanded={local.expanded ? "true" : "false"}
			data-expanded={local.expanded ? "true" : "false"}
			class={cx(
				"flex w-6 shrink-0 items-center justify-center text-[var(--recorder-muted,#7a7d85)] transition-colors duration-150 focus-visible:outline-hidden hover:bg-white/[0.05] hover:text-[var(--recorder-text,#eef3f8)]",
				local.expanded && "bg-white/[0.06] text-[var(--recorder-text,#eef3f8)]",
				local.disabled && "pointer-events-none opacity-60",
				local.class,
			)}
		>
			<IconCapChevronDown
				class={cx(
					"size-3.5 transition-transform duration-150",
					local.expanded && "rotate-180",
				)}
			/>
		</Polymorphic>
	);
}
