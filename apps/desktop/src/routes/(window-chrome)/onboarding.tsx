import { Button } from "@cap/ui-solid";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ask } from "@tauri-apps/plugin-dialog";
import { type as ostype } from "@tauri-apps/plugin-os";
import { relaunch } from "@tauri-apps/plugin-process";
import { cx } from "cva";
import {
	createEffect,
	createMemo,
	createSignal,
	For,
	type JSX,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { generalSettingsStore } from "~/store";
import {
	isPermissionGranted as isPermitted,
	requestAndVerifyPermission,
} from "~/utils/os-permissions";
import {
	commands,
	type OSPermission,
	type OSPermissionStatus,
} from "~/utils/tauri";
import IconCapFilmCut from "~icons/cap/film-cut";
import IconCapScreenshot from "~icons/cap/screenshot";
import IconLucideArrowLeft from "~icons/lucide/arrow-left";
import IconLucideArrowRight from "~icons/lucide/arrow-right";
import IconLucideCheck from "~icons/lucide/check";
import IconLucideClapperboard from "~icons/lucide/clapperboard";
import IconLucideDownload from "~icons/lucide/download";
import IconLucideMonitor from "~icons/lucide/monitor";
import IconLucideShield from "~icons/lucide/shield";
import IconLucideSparkles from "~icons/lucide/sparkles";
import flowRecoMark from "../../assets/flowreco-mark.svg";
import { WindowChromeHeader } from "./Context";

type SetupPermission = {
	name: string;
	key: OSPermission;
	description: string;
	requiresManualGrant: boolean;
	optional?: boolean;
};

const setupPermissions: readonly SetupPermission[] = [
	{
		name: "Screen Recording",
		key: "screenRecording",
		description: "Needed to capture your display, windows, or a selected area.",
		requiresManualGrant: false,
	},
	{
		name: "Accessibility",
		key: "accessibility",
		description:
			"Used locally for pointer activity so Studio can suggest automatic zooms.",
		requiresManualGrant: false,
	},
	{
		name: "Microphone",
		key: "microphone",
		description: "Optional — enable when you want voiceover on recordings.",
		requiresManualGrant: false,
		optional: true,
	},
	{
		name: "Camera",
		key: "camera",
		description: "Optional — enable when you want a webcam track.",
		requiresManualGrant: false,
		optional: true,
	},
];

const modes = [
	{
		id: "studio" as const,
		title: "Studio",
		tagline: "Full-quality local video",
		description:
			"Record display, window, or area into the FlowReco editor. Add zooms, captions, and export when you are ready.",
		icon: IconCapFilmCut,
		bullets: [
			"Local project files",
			"Non-destructive edits",
			"MP4 / GIF export",
		],
	},
	{
		id: "screenshot" as const,
		title: "Screenshot",
		tagline: "Stills for bugs and docs",
		description:
			"Grab a frame, annotate it, then copy or save — no video pipeline required.",
		icon: IconCapScreenshot,
		bullets: ["One-shot capture", "Quick annotate", "Copy or save"],
	},
];

const workflow = [
	{
		title: "Capture",
		body: "Pick display, window, area, or camera. FlowReco records full quality on this machine.",
		icon: IconLucideMonitor,
	},
	{
		title: "Polish",
		body: "Open Studio to trim, zoom, style the cursor, add captions, and frame the scene.",
		icon: IconLucideClapperboard,
	},
	{
		title: "Export",
		body: "Export a local file anytime. Sharing to a server is optional — never required.",
		icon: IconLucideDownload,
	},
];

export default function OnboardingPage() {
	const isMacOS = createMemo(() => ostype() === "macos");
	const [step, setStep] = createSignal(0);
	const [ready, setReady] = createSignal(false);
	const [permsGranted, setPermsGranted] = createSignal(false);
	const [corePermsGranted, setCorePermsGranted] = createSignal(false);
	const [permissionsNeeded, setPermissionsNeeded] = createSignal(false);

	const settings = generalSettingsStore.createQuery();
	const isRevisit = createMemo(
		() => settings.data?.hasCompletedOnboarding === true,
	);

	const stepIds = createMemo(() => {
		const ids: Array<
			"welcome" | "permissions" | "modes" | "workflow" | "ready"
		> = ["welcome"];
		if (isMacOS() && (!isRevisit() || permissionsNeeded())) {
			ids.push("permissions");
		}
		if (!(isMacOS() && isRevisit() && permissionsNeeded())) {
			ids.push("modes", "workflow", "ready");
		}
		return ids;
	});

	const totalSteps = createMemo(() => stepIds().length);
	const currentId = createMemo(() => stepIds()[step()] ?? "welcome");

	createEffect(() => {
		if (!isMacOS()) {
			setPermsGranted(true);
			setCorePermsGranted(true);
		}
	});

	createEffect(() => {
		const s = settings.data;
		if (s === undefined || ready()) return;

		void commands.doPermissionsCheck(true).then((check) => {
			const coreOk =
				!isMacOS() ||
				(isPermitted(check.screenRecording) &&
					isPermitted(check.accessibility));
			setPermissionsNeeded(isMacOS() && !coreOk);
			setPermsGranted(coreOk);
			setCorePermsGranted(coreOk);
			setReady(true);
		});
	});

	createEffect(() => {
		if (step() >= totalSteps()) setStep(Math.max(0, totalSteps() - 1));
	});

	const goToStep = (target: number) => {
		if (target < 0 || target >= totalSteps()) return;
		setStep(target);
	};

	const handleFinish = async () => {
		if (!isRevisit()) {
			await generalSettingsStore.set({
				hasCompletedOnboarding: true,
				hasCompletedStartup: true,
			});
		} else {
			await generalSettingsStore.set({ hasCompletedStartup: true });
		}
		await commands.showWindow({ Main: { init_target_mode: null } });
		await getCurrentWindow().close();
	};

	const nextDisabled = () =>
		currentId() === "permissions" && isMacOS() && !permsGranted();

	const handleNext = () => {
		if (nextDisabled()) return;
		if (step() < totalSteps() - 1) goToStep(step() + 1);
		else void handleFinish();
	};

	const handleSkip = () => {
		if (isMacOS() && !corePermsGranted()) return;
		void handleFinish();
	};

	const nextLabel = () => {
		if (step() === totalSteps() - 1) return "Open FlowReco";
		if (currentId() === "welcome") return "Get started";
		return "Continue";
	};

	onMount(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === "Enter") {
				e.preventDefault();
				if (!nextDisabled()) handleNext();
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				if (step() > 0) goToStep(step() - 1);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		onCleanup(() => window.removeEventListener("keydown", onKeyDown));
	});

	return (
		<>
			<WindowChromeHeader hideMaximize>
				<div
					class={cx(
						"flex items-center w-full mx-2",
						ostype() === "macos" && "flex-row-reverse",
					)}
					data-tauri-drag-region
				>
					{ostype() === "macos" && (
						<div class="flex-1" data-tauri-drag-region />
					)}
				</div>
			</WindowChromeHeader>
			<Show when={ready()}>
				<div
					data-tauri-drag-region="false"
					class="flex flex-col flex-1 min-h-0 overflow-hidden relative bg-[var(--recorder-bg,#ffffff)] text-[var(--recorder-text,#252b31)]"
				>
					<div
						class="pointer-events-none absolute inset-0"
						style={{
							background:
								"radial-gradient(70% 50% at 50% 0%, rgba(0,132,209,0.08) 0%, transparent 60%)",
						}}
					/>
					<div class="relative flex-1 min-h-0 z-10">
						<For each={stepIds()}>
							{(id, index) => (
								<StepPanel
									active={step() === index()}
									index={index()}
									currentStep={step()}
								>
									<Show when={id === "welcome"}>
										<WelcomeStep />
									</Show>
									<Show when={id === "permissions"}>
										<PermissionsStep
											active={step() === index()}
											onPermissionsChanged={setPermsGranted}
											onCorePermissionsChanged={setCorePermsGranted}
										/>
									</Show>
									<Show when={id === "modes"}>
										<ModesStep />
									</Show>
									<Show when={id === "workflow"}>
										<WorkflowStep />
									</Show>
									<Show when={id === "ready"}>
										<ReadyStep />
									</Show>
								</StepPanel>
							)}
						</For>
					</div>
					<StepNavigation
						current={step()}
						total={totalSteps()}
						onBack={() => goToStep(step() - 1)}
						onNext={handleNext}
						nextLabel={nextLabel()}
						showBack={step() > 0}
						nextDisabled={nextDisabled()}
						showSkip={corePermsGranted() && step() < totalSteps() - 1}
						onSkip={handleSkip}
					/>
				</div>
			</Show>
		</>
	);
}

function StepNavigation(props: {
	current: number;
	total: number;
	onBack: () => void;
	onNext: () => void;
	nextLabel: string;
	showBack: boolean;
	nextDisabled?: boolean;
	showSkip?: boolean;
	onSkip?: () => void;
}) {
	return (
		<div
			data-tauri-drag-region="false"
			class="relative z-40 flex flex-col items-center gap-2 border-t border-[var(--recorder-border,#e6e6e6)] bg-[var(--recorder-bg,#ffffff)] px-6 pb-5 pt-3 shrink-0"
		>
			<div class="flex items-center justify-between w-full max-w-[640px]">
				<div class="flex-1">
					<Show when={props.showBack}>
						<button
							data-tauri-drag-region="false"
							type="button"
							onClick={props.onBack}
							class="flex items-center gap-1.5 text-[13px] text-[var(--recorder-muted,#879192)] hover:text-[var(--recorder-text,#252b31)] transition-colors"
						>
							<IconLucideArrowLeft class="size-3.5" />
							Back
						</button>
					</Show>
				</div>
				<div class="flex items-center gap-1.5">
					<For each={Array.from({ length: props.total })}>
						{(_, index) => (
							<div
								class={cx(
									"rounded-full transition-all duration-300",
									props.current === index()
										? "w-5 h-1.5 bg-[var(--sleek-accent,#0084d1)]"
										: props.current > index()
											? "w-1.5 h-1.5 bg-[var(--sleek-accent,#0084d1)]/50"
											: "w-1.5 h-1.5 bg-[var(--flow-subtle,#eceef1)]",
								)}
							/>
						)}
					</For>
				</div>
				<div class="flex-1 flex justify-end">
					<div class="flex flex-col items-end gap-1">
						<Button
							data-tauri-drag-region="false"
							onClick={props.onNext}
							variant="blue"
							size="md"
							class="gap-2 min-w-36 rounded-[var(--radius-md,10px)]"
							disabled={props.nextDisabled}
						>
							{props.nextLabel}
							<Show
								when={props.current < props.total - 1}
								fallback={<IconLucideCheck class="size-4" />}
							>
								<IconLucideArrowRight class="size-4" />
							</Show>
						</Button>
						<Show when={props.showSkip}>
							<button
								data-tauri-drag-region="false"
								type="button"
								onClick={() => props.onSkip?.()}
								class="text-[11px] text-[var(--recorder-muted,#879192)] hover:text-[var(--recorder-text,#252b31)] transition-colors py-0.5"
							>
								Skip for now
							</button>
						</Show>
					</div>
				</div>
			</div>
			<span class="text-[10px] text-[var(--recorder-muted,#879192)] tabular-nums">
				Enter ↵ · ← → arrows
			</span>
		</div>
	);
}

function StepPanel(props: {
	active: boolean;
	index: number;
	currentStep: number;
	children: JSX.Element;
}) {
	return (
		<div
			class="absolute inset-0 overflow-y-auto"
			style={{
				transform: props.active
					? "translateX(0)"
					: props.index < props.currentStep
						? "translateX(-24px)"
						: "translateX(24px)",
				opacity: props.active ? 1 : 0,
				visibility: props.active ? "visible" : "hidden",
				"pointer-events": props.active ? "auto" : "none",
				"z-index": props.active ? 1 : 0,
				transition:
					"transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease",
			}}
		>
			{props.children}
		</div>
	);
}

function WelcomeStep() {
	return (
		<div class="flex flex-col items-center justify-center min-h-full px-10 py-8 text-center">
			<div class="flex size-16 items-center justify-center rounded-[20px] border border-[var(--recorder-border,#e6e6e6)] bg-white shadow-[0_8px_30px_rgba(37,43,49,0.06)]">
				<img src={flowRecoMark} alt="" class="size-9" />
			</div>
			<p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--sleek-accent,#0084d1)]">
				Local-first capture
			</p>
			<h1 class="mt-2 text-[28px] font-semibold tracking-tight text-[var(--recorder-text,#252b31)] text-balance">
				Welcome to FlowReco
			</h1>
			<p class="mt-3 max-w-[420px] text-[14px] leading-relaxed text-[var(--recorder-muted,#879192)] text-pretty">
				Record your screen, polish in Studio, and export files you own. No
				account required for local capture and editing.
			</p>
			<div class="mt-8 grid w-full max-w-[480px] grid-cols-3 gap-2">
				<For
					each={[
						{ label: "Offline ready", icon: IconLucideMonitor },
						{ label: "Studio editor", icon: IconLucideClapperboard },
						{ label: "Clean exports", icon: IconLucideSparkles },
					]}
				>
					{(item) => (
						<div class="flex flex-col items-center gap-2 rounded-[14px] border border-[var(--recorder-border,#e6e6e6)] bg-[var(--recorder-raised,#f5f5f5)] px-3 py-4">
							<item.icon class="size-4 text-[var(--sleek-accent,#0084d1)]" />
							<span class="text-[11px] font-medium text-[var(--recorder-text,#252b31)]">
								{item.label}
							</span>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

function ModesStep() {
	return (
		<div class="flex flex-col items-center justify-center min-h-full px-8 py-6 gap-6">
			<div class="text-center max-w-[460px]">
				<p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--sleek-accent,#0084d1)]">
					Capture modes
				</p>
				<h2 class="mt-2 text-[24px] font-semibold tracking-tight text-[var(--recorder-text,#252b31)]">
					Studio and Screenshot
				</h2>
				<p class="mt-2 text-[14px] leading-relaxed text-[var(--recorder-muted,#879192)]">
					Switch anytime from the main window. Everything stays on this device
					until you export.
				</p>
			</div>
			<div class="grid w-full max-w-[560px] gap-3 md:grid-cols-2">
				<For each={modes}>
					{(mode) => (
						<div class="flex flex-col gap-3 rounded-[16px] border border-[var(--recorder-border,#e6e6e6)] bg-white p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
							<div class="flex items-center gap-3">
								<div class="flex size-10 items-center justify-center rounded-[12px] bg-[var(--sleek-accent-soft,rgba(0,132,209,0.12))] text-[var(--sleek-accent,#0084d1)]">
									<mode.icon class="size-5 invert dark:invert-0 opacity-90" />
								</div>
								<div>
									<div class="text-[15px] font-semibold text-[var(--recorder-text,#252b31)]">
										{mode.title}
									</div>
									<div class="text-[12px] text-[var(--recorder-muted,#879192)]">
										{mode.tagline}
									</div>
								</div>
							</div>
							<p class="text-[13px] leading-relaxed text-[var(--recorder-muted,#879192)]">
								{mode.description}
							</p>
							<ul class="flex flex-col gap-1.5">
								<For each={mode.bullets}>
									{(bullet) => (
										<li class="flex items-center gap-2 text-[12px] text-[var(--recorder-text,#252b31)]">
											<span class="flex size-4 items-center justify-center rounded-full bg-[var(--sleek-accent,#0084d1)]">
												<IconLucideCheck class="size-2.5 text-white" />
											</span>
											{bullet}
										</li>
									)}
								</For>
							</ul>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

function WorkflowStep() {
	return (
		<div class="flex flex-col items-center justify-center min-h-full px-8 py-6 gap-6">
			<div class="text-center max-w-[440px]">
				<p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--sleek-accent,#0084d1)]">
					How it works
				</p>
				<h2 class="mt-2 text-[24px] font-semibold tracking-tight text-[var(--recorder-text,#252b31)]">
					Capture, polish, export
				</h2>
			</div>
			<div class="flex w-full max-w-[520px] flex-col gap-3">
				<For each={workflow}>
					{(item, index) => (
						<div class="flex gap-3 rounded-[14px] border border-[var(--recorder-border,#e6e6e6)] bg-white p-4">
							<div class="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--recorder-raised,#f5f5f5)] text-[var(--sleek-accent,#0084d1)]">
								<item.icon class="size-4" />
							</div>
							<div class="min-w-0">
								<div class="flex items-center gap-2">
									<span class="text-[11px] font-semibold tabular-nums text-[var(--sleek-accent,#0084d1)]">
										{index() + 1}
									</span>
									<span class="text-[14px] font-semibold text-[var(--recorder-text,#252b31)]">
										{item.title}
									</span>
								</div>
								<p class="mt-1 text-[13px] leading-relaxed text-[var(--recorder-muted,#879192)]">
									{item.body}
								</p>
							</div>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

function ReadyStep() {
	return (
		<div class="flex flex-col items-center justify-center min-h-full px-10 py-8 text-center">
			<div class="flex size-14 items-center justify-center rounded-full bg-[var(--sleek-accent-soft,rgba(0,132,209,0.12))] text-[var(--sleek-accent,#0084d1)]">
				<IconLucideCheck class="size-6" />
			</div>
			<h2 class="mt-5 text-[24px] font-semibold tracking-tight text-[var(--recorder-text,#252b31)]">
				You are ready
			</h2>
			<p class="mt-2 max-w-[400px] text-[14px] leading-relaxed text-[var(--recorder-muted,#879192)]">
				Open the main window, choose a source, and start a Studio recording.
				Shortcuts and preferences live in Settings anytime.
			</p>
			<div class="mt-6 rounded-[14px] border border-[var(--recorder-border,#e6e6e6)] bg-[var(--recorder-raised,#f5f5f5)] px-4 py-3 text-[12px] text-[var(--recorder-muted,#879192)]">
				Tip: use Studio for editable video projects. Screenshots are perfect for
				quick stills.
			</div>
		</div>
	);
}

function PermissionsStep(props: {
	active: boolean;
	onPermissionsChanged: (allRequired: boolean) => void;
	onCorePermissionsChanged: (granted: boolean) => void;
}) {
	const [initialCheck, setInitialCheck] = createSignal(true);
	const [check, setCheck] = createSignal<
		Record<string, OSPermissionStatus> | undefined
	>(undefined);
	const [requestingPermission, setRequestingPermission] = createSignal(false);

	const fetchPermissions = async () => {
		const result = await commands.doPermissionsCheck(initialCheck());
		setCheck(result as unknown as Record<string, OSPermissionStatus>);
	};

	onMount(() => {
		void fetchPermissions();
	});

	createEffect(() => {
		if (props.active && !initialCheck()) {
			const interval = setInterval(() => {
				void fetchPermissions();
			}, 250);
			onCleanup(() => clearInterval(interval));
		}
	});

	createEffect(() => {
		const c = check();
		if (!c) return;
		const allRequired = setupPermissions
			.filter((p) => !p.optional)
			.every((p) => isPermitted(c[p.key]));
		props.onPermissionsChanged(allRequired);
		props.onCorePermissionsChanged(
			isPermitted(c.screenRecording) && isPermitted(c.accessibility),
		);
	});

	const maybePromptRestartForPermission = async (permission: OSPermission) => {
		const message =
			permission === "accessibility"
				? "After enabling Accessibility for FlowReco in System Settings, macOS may keep showing it as denied until you restart the app."
				: "After adding FlowReco in System Settings, you'll need to restart the app for the permission to take effect.";
		const shouldRestart = await ask(message, {
			title: "Restart Required",
			kind: "info",
			okLabel: "Restart, I've granted permission",
			cancelLabel: "No, I still need to add it",
		});
		if (shouldRestart) {
			await relaunch();
		}
	};

	const requestPermission = async (permission: OSPermission) => {
		if (requestingPermission()) return;
		setRequestingPermission(true);
		try {
			const status = check()?.[permission] as OSPermissionStatus | undefined;
			setInitialCheck(false);
			const result = await requestAndVerifyPermission(
				commands,
				permission,
				status,
			);
			setCheck(result.check as unknown as Record<string, OSPermissionStatus>);
			if (
				result.openedSettings &&
				(permission === "screenRecording" || permission === "accessibility")
			) {
				await maybePromptRestartForPermission(permission);
			}
		} catch (err) {
			console.error(`Error requesting permission: ${err}`);
			void fetchPermissions().catch(() => {});
		} finally {
			setRequestingPermission(false);
		}
	};

	const openSettings = async (permission: OSPermission) => {
		if (requestingPermission()) return;
		setRequestingPermission(true);
		try {
			await commands.openPermissionSettings(permission);
			if (permission === "screenRecording" || permission === "accessibility") {
				await maybePromptRestartForPermission(permission);
			}
			setInitialCheck(false);
			void fetchPermissions();
		} catch (err) {
			console.error(`Error opening permission settings: ${err}`);
		} finally {
			setRequestingPermission(false);
		}
	};

	return (
		<div
			data-tauri-drag-region="false"
			class="flex flex-col items-center justify-center min-h-full px-8 py-6 gap-5"
		>
			<div class="flex flex-col items-center gap-2 text-center max-w-[440px]">
				<div class="flex size-12 items-center justify-center rounded-[14px] border border-[var(--recorder-border,#e6e6e6)] bg-white">
					<IconLucideShield class="size-5 text-[var(--sleek-accent,#0084d1)]" />
				</div>
				<h2 class="text-[22px] font-semibold tracking-tight text-[var(--recorder-text,#252b31)]">
					Permissions
				</h2>
				<p class="text-[13px] leading-relaxed text-[var(--recorder-muted,#879192)]">
					Grant access so FlowReco can record your screen. Optional devices can
					wait until you need them.
				</p>
			</div>
			<div class="w-full max-w-[460px] flex flex-col gap-2">
				<For each={setupPermissions}>
					{(permission) => {
						const permStatus = () =>
							check()?.[permission.key] as OSPermissionStatus | undefined;
						return (
							<Show when={permStatus() !== "notNeeded"}>
								<div class="flex items-center gap-3 rounded-[14px] border border-[var(--recorder-border,#e6e6e6)] bg-white px-4 py-3">
									<div class="flex flex-col flex-1 min-w-0 gap-0.5">
										<div class="flex items-center gap-2">
											<span class="text-[13px] font-medium text-[var(--recorder-text,#252b31)]">
												{permission.name}
											</span>
											<Show when={permission.optional}>
												<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--recorder-raised,#f5f5f5)] text-[var(--recorder-muted,#879192)]">
													Optional
												</span>
											</Show>
										</div>
										<span class="text-[11px] text-[var(--recorder-muted,#879192)] leading-snug">
											{permission.description}
										</span>
									</div>
									<Show
										when={!isPermitted(permStatus())}
										fallback={
											<div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-green-3 border border-green-5 text-green-11 text-[12px] font-medium shrink-0">
												<IconLucideCheck class="size-3" />
												Granted
											</div>
										}
									>
										<Button
											data-tauri-drag-region="false"
											size="sm"
											variant="gray"
											class="shrink-0"
											disabled={requestingPermission()}
											onClick={() =>
												permission.requiresManualGrant ||
												permStatus() === "denied"
													? openSettings(permission.key)
													: requestPermission(permission.key)
											}
										>
											{permission.requiresManualGrant ||
											permStatus() === "denied"
												? "Open Settings"
												: "Grant"}
										</Button>
									</Show>
								</div>
							</Show>
						);
					}}
				</For>
			</div>
		</div>
	);
}
