import { createContextProvider } from "@solid-primitives/context";
import { createEffect } from "solid-js";
import { createOptionsQuery } from "~/utils/queries";
import { ensureStudioOrScreenshotMode } from "~/utils/recording";
import { commands } from "~/utils/tauri";

const [RecordingOptionsProvider, useRecordingOptionsContext] =
	createContextProvider(() => {
		const options = createOptionsQuery();

		createEffect(() => {
			const mode = options.rawOptions.mode;
			if (mode !== "instant") return;
			const next = ensureStudioOrScreenshotMode(mode);
			options.setOptions({ mode: next });
			void commands.setRecordingMode(next);
		});

		return options;
	});

export function useRecordingOptions() {
	return (
		useRecordingOptionsContext() ??
		(() => {
			throw new Error("useOptions must be used within an OptionsProvider");
		})()
	);
}

export { RecordingOptionsProvider };
