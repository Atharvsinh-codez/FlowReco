export const Logo = ({
	className,
	showVersion,
	showBeta,
	white,
	hideLogoName,
	viewBoxDimensions = "0 0 148 40",
	style,
}: {
	className?: string;
	showVersion?: boolean;
	showBeta?: boolean;
	white?: boolean;
	hideLogoName?: boolean;
	style?: React.CSSProperties;
	viewBoxDimensions?: `${string} ${string} ${string} ${string}`;
}) => {
	const wordmarkClass = white
		? "fill-[#f8f7f4]"
		: "fill-[#111315] dark:fill-[#f8f7f4]";

	return (
		<div className="flex items-center">
			<svg
				viewBox={viewBoxDimensions}
				preserveAspectRatio="xMidYMid meet"
				style={style}
				role="img"
				aria-label="FlowReco logo"
				className={className}
			>
				<title>FlowReco</title>
				<rect x="2" y="2" width="36" height="36" rx="10" fill="#111315" />
				<path
					d="M12 15v-2a3 3 0 0 1 3-3h2M28 15v-2a3 3 0 0 0-3-3h-2M12 25v2a3 3 0 0 0 3 3h2M28 25v2a3 3 0 0 1-3 3h-2"
					fill="none"
					stroke="#f8f7f4"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<circle cx="20" cy="20" r="5.5" fill="#ff6243" />
				{!hideLogoName && (
					<text
						x="47"
						y="27"
						fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
						fontSize="22"
						fontWeight="600"
						letterSpacing="-0.8"
						className={wordmarkClass}
					>
						FlowReco
					</text>
				)}
			</svg>
			{showVersion && (
				<span
					className={`text-[0.625rem] font-medium ${white ? "text-white" : "text-gray-1"}`}
				>
					v{process.env.appVersion}
				</span>
			)}
			{showBeta && (
				<span
					className={`min-w-[52px] text-[0.625rem] font-medium ${white ? "text-white" : "text-gray-1"}`}
				>
					Beta v{process.env.appVersion}
				</span>
			)}
		</div>
	);
};
