export const LogoBadge = ({ className }: { className: string }) => {
	return (
		<svg
			className={`aspect-square ${className}`}
			fill="none"
			viewBox="0 0 40 40"
			preserveAspectRatio="xMidYMid meet"
			role="img"
			aria-label="FlowReco logo"
		>
			<title>FlowReco</title>
			<rect x="2" y="2" width="36" height="36" rx="10" fill="#111315" />
			<path
				d="M12 15v-2a3 3 0 0 1 3-3h2M28 15v-2a3 3 0 0 0-3-3h-2M12 25v2a3 3 0 0 0 3 3h2M28 25v2a3 3 0 0 1-3 3h-2"
				stroke="#f8f7f4"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<circle cx="20" cy="20" r="5.5" fill="#ff6243" />
		</svg>
	);
};
