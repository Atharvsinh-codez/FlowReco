export const DEVICE_ROW_CLASS =
	"group relative isolate overflow-hidden flex flex-row gap-2.5 items-center pl-3 pr-2 w-full h-11 rounded-[var(--radius-lg,12px)] border border-[var(--recorder-border,rgba(233,238,245,0.1))] bg-[var(--recorder-raised,#1b1d22)] text-[var(--recorder-text,#eef3f8)] transition-[background-color,border-color,box-shadow,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-default disabled:opacity-70 disabled:text-[var(--recorder-muted,#7a7d85)] enabled:hover:bg-[var(--recorder-hover,#22252b)] enabled:hover:border-[rgba(233,238,245,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sleek-accent,#0284c7)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--recorder-bg,#121212)]";

export const DEVICE_ROW_ICON_CLASS =
	"text-[var(--recorder-muted,#7a7d85)] size-4 shrink-0 transition-colors group-hover:text-[var(--recorder-text,#eef3f8)]";

export const DEVICE_ROW_LABEL_CLASS =
	"flex-1 min-w-0 text-[13px] font-medium tracking-[-0.02em] text-left truncate";

export const DEVICE_ROW_TRAILING_CLASS = "flex items-center gap-1 shrink-0";

export const DEVICE_SHORTCUT_BUTTON_CLASS =
	"flex size-7 items-center justify-center rounded-[var(--radius-md,8px)] text-[var(--recorder-muted,#7a7d85)] hover:text-[var(--recorder-text,#eef3f8)] hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sleek-accent,#0284c7)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--recorder-raised,#1b1d22)]";
