# Recordly → FlowReco port map

**Reference clone:** `../Recordly` (sibling of this repo; not a runtime dependency).  
**Upstream:** https://github.com/webadderallorg/Recordly  
**Policy:** D002 + D023 — reimplement patterns in Cap/Tauri/Solid/Rust; no Electron/Pixi transplant; no Recordly branding.

## Done in product chrome (2026-07-15)

| Item | Status |
| --- | --- |
| Light-first design tokens (`#ffffff`, `#f5f5f5`, `#e6e6e6`, `#252b31`, `#0084d1`, …) | Landed in `apps/desktop/src/styles/theme.css` |
| Recorder shell white / airy restyle | Landed (`--recorder-*`, new-main, Mode, device rows) |
| Studio layout: inspector left, preview right | Landed (`Editor.tsx`, `editor-skeleton.tsx`) |
| Recordly-like vertical icon rail + inspector | Landed (`ConfigSidebar.tsx`) |
| Light transport bar under preview | Landed (`Player.tsx`) |
| Cursor animation preset grid + spring controls UI | Landed (ConfigSidebar cursor tab) |
| Purple zoom track pills + light timeline shell | Landed (theme + Timeline styles) |
| Accent blue remapped to `#0084d1` across desktop chrome | Landed on primary surfaces |
| Feature parity (click effects, floating HUD, extensions, …) | Backlog — renderer-bound |

## Feature backlog (priority)

### P0 — UI parity on existing FlowReco capabilities

- Scene/frame inspector density matching Recordly SettingsPanel sections
- Zoom inspector presets + motion controls already present: polish labels/layout only
- Export dialog density and progress chrome
- Light theme audit of Player transport (still dark floating bar by design)

### P1 — Behavior ports (math/UX into Cap pipeline)

- Auto-zoom suggestion quality / connect-zoom / easing labels (Rust + editor)
- Cursor spring / sway / click-effect parameter UI if renderer supports
- Webcam layout presets, margin, react-to-zoom controls
- Caption style panel density and generate UX

### P2 — Larger systems

- Floating HUD recorder (optional product mode; Tauri always-on-top window)
- Annotation types beyond current Cap set
- Extension host (blocked by D012 until security model)

### Explicitly out of scope as-is

- Electron main / IPC / electron-updater
- Pixi.js preview/export compositor
- Recordly assets, icons, wallpapers, name, `.recordly` brand extension
- NVIDIA CUDA path unless FlowReco ships its own native stack

## Branding checklist

Any surface that shows “Recordly”, `recordly.dev`, or Cap marketing names in user-facing FlowReco copy must say **FlowReco** instead. License/attribution remains in notices and `settings/license` where required.

## Layout reference

```
Recordly studio:  [icon rail + inspector | preview + timeline under preview]
FlowReco studio:  [inspector | preview]
                  [======== timeline ========]
```
