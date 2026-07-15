import * as dialog from "@tauri-apps/plugin-dialog";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import type { createOptionsQuery } from "./queries";
import { commands, type RecordingAction, type RecordingMode } from "./tauri";

export function handleRecordingResult(
	result: Promise<RecordingAction>,
	setOptions: ReturnType<typeof createOptionsQuery>["setOptions"] | undefined,
) {
	return result
		.then(async (result) => {
			if (result === "Started") return;
			if (result === "InvalidAuthentication") {
				if (setOptions) {
					setOptions({ mode: "studio" });
					commands.setRecordingMode("studio");
				}
				await dialog.message(
					"Studio Mode records locally on this device. No account is required.",
					{
						title: "Studio Mode",
						kind: "info",
					},
				);
			} else {
				await dialog.message(
					"Recording could not start with the current server settings. Use Studio Mode to record locally.",
					{
						title: "Recording unavailable",
						kind: "error",
					},
				);
			}
		})
		.catch((err) =>
			dialog.message(err, {
				title: "Error starting recording",
				kind: "error",
			}),
		);
}

export function ensureStudioOrScreenshotMode(
	mode: RecordingMode | undefined | null,
): RecordingMode {
	if (mode === "screenshot") return "screenshot";
	return "studio";
}

export async function openRecordingFolder(
	projectPath: string,
	mode: RecordingMode,
) {
	const path = projectPath.replace(/[/\\]+$/, "");

	const openedContent =
		mode === "instant" &&
		(await commands.openFilePath(`${path}/content`).then(
			() => true,
			() => false,
		));

	if (openedContent) return;

	await revealItemInDir(`${path}/`);
}
