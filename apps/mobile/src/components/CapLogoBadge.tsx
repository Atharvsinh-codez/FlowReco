import Svg, { Path, Rect } from "react-native-svg";

type CapLogoBadgeProps = {
	size?: number;
};

export function CapLogoBadge({ size = 48 }: CapLogoBadgeProps) {
	return (
		<Svg
			accessibilityLabel="FlowReco logo"
			accessibilityRole="image"
			width={size}
			height={size}
			viewBox="0 0 40 40"
		>
			<Rect width={40} height={40} fill="#111315" rx={9} />
			<Path
				d="M15 9h-3a3 3 0 0 0-3 3v3M25 9h3a3 3 0 0 1 3 3v3M31 25v3a3 3 0 0 1-3 3h-3M15 31h-3a3 3 0 0 1-3-3v-3"
				stroke="#F4F5F6"
				strokeWidth={2.4}
				strokeLinecap="round"
			/>
			<Path
				d="M16 28V13h6.6c3.8 0 6 2 6 5.4 0 3.5-2.5 5.2-6 5.2H16m6.5 0 6.4 4.4"
				stroke="#FF6243"
				strokeWidth={2.8}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}
