import type { SVGProps } from "react";

export const FlowRecoBrand = (props: SVGProps<SVGSVGElement>) => (
	<svg
		className="brand-logo"
		fill="none"
		viewBox="0 0 174 40"
		aria-label="FlowReco"
		{...props}
	>
		<title>FlowReco</title>
		<rect x="2" y="2" width="36" height="36" rx="9" fill="#111315" />
		<path
			d="M15 9h-3a3 3 0 0 0-3 3v3M25 9h3a3 3 0 0 1 3 3v3M31 25v3a3 3 0 0 1-3 3h-3M15 31h-3a3 3 0 0 1-3-3v-3"
			stroke="#F4F5F6"
			strokeWidth="2.4"
			strokeLinecap="round"
		/>
		<path
			d="M16 28V13h6.6c3.8 0 6 2 6 5.4 0 3.5-2.5 5.2-6 5.2H16m6.5 0 6.4 4.4"
			stroke="#FF6243"
			strokeWidth="2.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<text
			x="48"
			y="27"
			fill="currentColor"
			fontFamily="ui-sans-serif, system-ui, sans-serif"
			fontSize="22"
			fontWeight="600"
			letterSpacing="-0.6"
		>
			FlowReco
		</text>
	</svg>
);

export const DoodleBoilFilter = ({ id = "boil" }: { id?: string }) => (
	<filter id={id} x="-15%" y="-15%" width="130%" height="130%">
		<feTurbulence
			type="fractalNoise"
			baseFrequency="0.05"
			numOctaves="2"
			seed="1"
			result="noise"
		>
			<animate
				attributeName="seed"
				values="1;3;5;7"
				dur="0.6s"
				repeatCount="indefinite"
				calcMode="discrete"
			/>
		</feTurbulence>
		<feDisplacementMap
			in="SourceGraphic"
			in2="noise"
			scale="3"
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
);
