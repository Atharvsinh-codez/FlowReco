# FlowReco implementation plan

This plan orders work by data safety, media correctness, and dependency. A milestone is complete only when its exit criteria pass on the required platforms. Code presence alone is not completion.

## Status legend

- **Complete:** exit evidence is recorded and release-relevant platforms passed.
- **In progress:** useful implementation exists, but one or more exit gates remain.
- **Planned:** accepted scope with no release-ready implementation.
- **Blocked:** work or verification cannot proceed in the current environment; the unblock condition is explicit.

## Milestone map

| ID | Milestone | Depends on | Current status | Exit criteria |
| --- | --- | --- | --- | --- |
| M0 | Source, license, and architecture baseline | — | In progress | Pins, provenance, feature inventory, decision log, notices, compatible dependency report |
| M1 | Original FlowReco brand and product shell | M0 | In progress | No inherited public branding/assets/endpoints in shipped bundles; desktop/web accessibility smoke passes |
| M2 | Recording reliability and local recovery | M0 | In progress | Display/window/region plus camera/mic/system audio verified on macOS/Windows; pause/resume/stop, disk pressure, crash recovery pass |
| M3 | Versioned non-destructive project and shared render graph | M2 | In progress | Atomic autosave, migrations, undo/redo, reopen, missing-media recovery, preview/export golden parity |
| M4 | Signature automatic zoom and cursor system | M3 | In progress | Deterministic clustering/focus tests, full edit controls, collision/reduced-motion behavior, golden frames, native metadata capture |
| M5 | Timeline, crop, audio, speed, captions, annotations, webcam | M3 | In progress | Required region operations, time mapping, A/V sync, inspector controls, reopen and export tests |
| M6 | MP4/GIF export and publish reliability | M3–M5 | In progress | Presets through 4K60, GIF, progress/cancel/retry/reveal, long-duration sync, hardware/software fallback |
| M7 | Web sharing, collaboration, ownership, self-host | M0, M6 | In progress | Access matrix, comments/reactions/transcript/chapters/analytics, workspaces/roles, S3 providers, Docker fresh install/backup |
| M8 | SDK, CLI, import, integrations, extension security | M3, M7 | Planned | Versioned public interfaces, Loom import fixtures, least-privilege integrations, sandboxed extension model |
| M9 | Cross-platform hardening and release | M0–M8 | Blocked | Native test matrix, accessibility/security/license audits, signed installers, update/recovery drill, reproducible release evidence |

## M0 — Source and compliance baseline

Deliverables:

- Pinned upstream source register and audit.
- Feature matrix covering both upstreams and the product brief.
- Architecture, decision, test, and implementation ledgers.
- Root license and third-party notices preserving Cap and Recordly attribution.
- Automated Cargo/npm dependency inventory with license allow-list.
- Asset provenance inventory for images, cursors, fonts, sounds, models, codecs, and installer resources.

Exit gate: no unknown or incompatible release dependency; legal ambiguities are resolved or the affected material is removed/reimplemented.

## M1 — Brand and product shell

Deliverables:

- FlowReco name, application IDs, schemes, settings, metadata, and trusted update policy.
- Original logo, icon family, cursor family, wallpapers, tray/installer art, and sound assets.
- Graphite/coral design tokens and consistent web/desktop product copy.
- Local/connected/uploading/published indicators and no commercial plan gate on local functionality.
- Compatibility migration for legacy project filenames, server settings, and deep links where safe.

Exit gate: automated artifact scan plus human inspection of every public surface and packaged resource on macOS/Windows.

## M2 — Capture and recovery

Work order:

1. Validate source enumeration and permissions.
2. Validate display/window/region coordinates across DPI/Retina and multiple displays.
3. Validate camera, microphone, and system audio as synchronized/separate sources.
4. Finish device meters, clipping warnings, hot-plug and device-loss recovery.
5. Persist session checkpoints, finalize partial containers, and test low disk/crash/interrupted stop.
6. Exercise Instant Mode with disconnected/reconnecting upload and a durable local fallback.

Exit gate: repeatable 5-minute, 30-minute, and 2-hour recordings on the supported OS matrix with bounded dropped frames and A/V drift; forced crashes recover source media.

## M3 — Project and render invariants

Deliverables:

- Schema versioning and fixtures from every supported project version.
- Atomic save/autosave, undo/redo transaction boundaries, recovery copies, relink missing source.
- One source-to-project time map for trims and speed regions.
- One content-to-output transform stack for crop, frame, zoom, cursor, webcam, captions, and annotations.
- Deterministic preview/export render fixtures at representative frames.

Exit gate: save/reopen/export is bitwise-stable where expected, perceptually equivalent where encoders differ, and never changes source files.

## M4 — Automatic zoom and cursor

Deliverables:

- Privacy-safe pointer, click, scroll, typing-activity, focus, window, and optional accessibility geometry stream.
- DPI/crop/window-motion normalization.
- Deterministic intent clustering, lead/hold/merge rules, edge-safe focus, webcam/caption collision avoidance.
- Editable automatic regions: regenerate, accept/reject, manual add, resize/move, scale/focus, easing, copy/paste, multi-edit, reset.
- Original rendered cursors, smoothing, motion blur, sway, click bounce/highlight, GIF loop behavior.
- Golden frames for entry, midpoint, hold, reframe, exit, crop, corners, and display-scale cases.

Exit gate: identical project settings produce equivalent preview/export transforms and the native capture stream contains no sensitive text.

## M5 — Editor breadth

Deliverables:

- Multi-track drag/resize/select/multiselect/duplicate/split/delete/copy/paste.
- Snap, nudge, timeline zoom/scroll, timecode/frame stepping, ripple/non-ripple edits.
- Trim and variable-speed regions with speech pitch preservation when supported.
- Webcam layout, crop, mirror, shape, shadow, and zoom behavior.
- Background/frame, audio waveforms/gain/fades/mute/solo, captions and transcript.
- Text/image/shape/highlight/redaction annotations with safe-area alignment.

Exit gate: representative compound projects survive autosave/reopen and export without overlay or A/V drift.

## M6 — Export and publishing

Deliverables:

- MP4 presets for practical resolutions/frame rates through 3840 × 2160 at 60 fps when supported.
- GIF presets, FPS, dimensions, looping, quality/size guardrails.
- Encoder capability probing and safe software fallback.
- Accurate progress, cancellation at safe boundaries, resumable/retry behavior, atomic destination write, reveal-in-file-manager.
- Publish to a configured hosted/self-hosted FlowReco server without risking the local project.

Exit gate: codec/device matrix, long-duration sync, variable-speed audio, cancellation/retry, low-disk, and preview/export parity pass.

## M7 — Web, collaboration, and self-hosting

Deliverables:

- Library/folders/search, metadata/thumbnails/downloads.
- Public/unlisted/private/workspace/password access, expiry, download control, embeds.
- Timestamped comments/replies, reactions, transcript, captions, chapters, privacy-aware analytics.
- Workspace invitations and roles; custom domains.
- Provider-configurable, explicit AI with no silent media egress.
- S3-compatible storage validation for AWS S3, R2, B2, MinIO, Wasabi, and generic endpoints.
- Docker Compose setup, migrations, health checks, TLS guidance, backup/restore and upgrade runbook.

Exit gate: automated access-control matrix plus fresh-install and upgrade tests against local object storage and at least two external-compatible providers.

## M8 — Platform APIs and extensions

Deliverables:

- Embed SDK, recorder SDK, CLI, and API compatibility/rebranding review.
- Loom import with title, date, source, media, partial-failure reporting, and duplicate handling.
- Integration permissions and secrets lifecycle.
- Extension manifest, capabilities, signatures, sandbox, render-hook determinism, resource limits, revocation, and recovery mode.

Exit gate: versioned compatibility fixtures, threat model, malicious-extension tests, and uninstall/rollback behavior.

## M9 — Release qualification

Required platforms:

- macOS 14+ on Apple Silicon and a supported Intel Mac.
- Windows 10 build 19041 and Windows 11 on Intel/AMD; ARM64 is best-effort until dependencies qualify.

Release checklist:

- Native capture/editor/export/manual acceptance matrix.
- Unit, integration, migration, golden-frame, stress, and end-to-end tests green.
- Accessibility, privacy, security, dependency-license, and asset-provenance audits closed.
- Signed/notarized installers, clean install, upgrade, downgrade/recovery, uninstall, update-feed drill.
- Docker fresh install, upgrade, backup/restore, and self-host documentation verified.
- Known limitations published; no acceptance criterion is silently waived.

## Immediate next sequence

1. Finish M0 license/dependency and asset scans.
2. Complete M1 public brand and endpoint audit.
3. Provision Rust, macOS, Windows, and Docker runners.
4. Establish M2 recording/recovery baselines before expanding media behavior.
5. Lock M3 render/time invariants, then finish M4/M5 feature depth.
6. Qualify export and self-host paths before release packaging.

