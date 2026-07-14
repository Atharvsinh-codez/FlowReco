import { Button, LogoBadge } from "@cap/ui";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChromeRecorderButton } from "@/components/ChromeRecorderButton";
import { CHROME_EXTENSION_BUTTON_CLASS } from "@/lib/chrome-extension";
import { UploadCapButton } from "./UploadCapButton";
import { WebRecorderDialog } from "./web-recorder-dialog/web-recorder-dialog";

interface EmptyCapStateProps {
	userName?: string;
}

export const EmptyCapState: React.FC<EmptyCapStateProps> = ({ userName }) => {
	return (
		<div className="flex flex-col flex-1 justify-center items-center w-full h-full">
			<div className="flex flex-col gap-3 justify-center items-center h-full text-center">
				<div className="flex justify-center items-center mb-5 size-20 rounded-2xl border bg-gray-2 border-gray-4">
					<LogoBadge className="size-12" />
				</div>
				<div className="flex flex-col items-center px-5">
					<p className="mb-1 text-xl font-semibold text-gray-12">
						{userName
							? `${userName}, record your first video`
							: "Record your first video"}
					</p>
					<p className="max-w-md text-gray-10 text-md">
						Record locally, then edit, export, or share when you're ready.
					</p>
				</div>
				<div className="flex flex-wrap gap-3 justify-center items-center mt-4">
					<Button
						href="/download"
						className="flex relative gap-2 justify-center items-center"
						variant="primary"
					>
						<FontAwesomeIcon className="size-3.5" icon={faDownload} />
						Download FlowReco
					</Button>
					<p className="text-sm text-gray-10">or</p>
					<WebRecorderDialog />
					<p className="text-sm text-gray-10">or</p>
					<ChromeRecorderButton
						className={`${CHROME_EXTENSION_BUTTON_CLASS} font-medium`}
					/>
					<p className="text-sm text-gray-10">or</p>
					<UploadCapButton />
				</div>
			</div>
		</div>
	);
};
