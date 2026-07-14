"use client";

import { Logo } from "@cap/ui";
import clsx from "clsx";

interface WebRecorderDialogHeaderProps {
	isBusy: boolean;
	onClose: () => void;
}

export const WebRecorderDialogHeader = ({
	isBusy,
	onClose,
}: WebRecorderDialogHeaderProps) => {
	return (
		<>
			<div className="absolute left-3 top-3 flex gap-1.5 items-center">
				<button
					type="button"
					onClick={onClose}
					disabled={isBusy}
					className={clsx(
						"size-3 rounded-full bg-[#ff6243] border-none p-0",
						isBusy
							? "opacity-50 cursor-not-allowed"
							: "cursor-pointer hover:opacity-80 transition-opacity",
					)}
					aria-label="Close dialog"
				/>
				<div className="size-3 rounded-full bg-gray-8 opacity-50"></div>
				<div className="size-3 rounded-full bg-gray-8 opacity-50"></div>
			</div>
			<div className="flex items-center justify-between pb-[0.25rem]">
				<div className="flex items-center">
					<Logo className="w-[92px] h-auto" />
				</div>
			</div>
		</>
	);
};
