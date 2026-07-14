# Upstream sources and provenance

This register pins the sources inspected for FlowReco. Upstream clones are research inputs only; FlowReco has its own Git history. The clone date was **2026-07-14**.

| Source | Repository | Pinned commit | License at pin | Role in FlowReco |
| --- | --- | --- | --- | --- |
| Cap | `https://github.com/CapSoftware/cap.git` | `bf6e56d3e8804da33abd21d9470a02cb50adefc0` | AGPL-3.0 for the main work; MIT for the `cap-camera*` and `scap-*` crate families; third-party components retain their own terms | Primary architecture and product foundation |
| Recordly | `https://github.com/webadderallorg/Recordly.git` | `360b1605009b1c9439629bfaf2033c59f94c611b` | `LICENSE.md` declares AGPL-3.0 and additional attribution/branding conditions | Behavioral and data-model reference for editor, cursor, webcam, timeline, GIF, and extensions |
| agent-skills UI design skill | `https://github.com/mblode/agent-skills.git` | `d7c7ae79009a2c6f103154b5c476d2b7b75e4fd7` | MIT repository license | Design-process guidance only; no product branding or artwork copied |
| Supplied editor video | User-provided URL | Retrieved as a behavioral reference on 2026-07-14 | Proprietary status unknown | Interaction reference only; no code, brand, artwork, copy, or assets copied |

The commit identifiers above are the authoritative provenance anchors. A moving branch URL must never replace them in a release audit.

## Cap paths inspected

| Area | Relevant paths | FlowReco treatment |
| --- | --- | --- |
| Desktop shell and recorder | `apps/desktop`, `apps/desktop/src-tauri` | Retained as the Tauri v2/SolidStart foundation and progressively rebranded |
| Capture and devices | `crates/scap-*`, `crates/camera*`, `crates/audio`, `crates/cursor-capture` | Retained native Rust paths; platform behavior requires native verification |
| Project and editor | `crates/project`, `crates/editor`, `apps/desktop/src/routes/editor` | Retained non-destructive project model and extended editor controls |
| Rendering and export | `crates/rendering*`, `crates/export`, `crates/enc-*`, `crates/cap-muxer*` | Shared preview/export transform path is the architectural baseline |
| Web product | `apps/web`, `packages/web-*`, `packages/database` | Retained dashboard, share pages, auth, organization, API, and persistence foundation |
| Storage | `packages/s3`, `packages/local-docker`, Docker Compose files | Retained S3-compatible and self-host foundations; provider matrix still needs integration testing |
| SDK and CLI | `packages/sdk-embed`, `packages/sdk-recorder`, `apps/cli` | Retained API surfaces; FlowReco naming and compatibility review remain staged |
| UI libraries | `packages/ui`, `packages/ui-solid` | Retained component infrastructure with an original FlowReco visual system |

## Recordly paths inspected

| Area | Relevant paths | FlowReco treatment |
| --- | --- | --- |
| Editor behavior | `src/components/video-editor` | Behavior and test ideas studied; no Electron editor runtime is embedded |
| Timeline | `src/components/video-editor/timeline` | Interaction/data-model reference for region editing and zoom suggestions |
| Cursor composition | `src/components/video-editor/videoPlayback`, `electron/ipc/cursor`, `src/assets/cursors` | Behavior studied; FlowReco uses newly generated original cursor artwork and Cap's Rust renderer |
| Webcam composition | `webcamOverlay.ts`, `webcamSync.ts`, `WebcamCropControl.tsx` | Behavior reference; implementation belongs in FlowReco's project/rendering model |
| Export and GIF | `electron/ipc/export`, `GifOptionsPanel.tsx`, `ExportSettingsMenu.tsx` | Behavior reference; FlowReco retains Rust encoders, including the existing GIF crate |
| Capture helpers | `electron/native`, `electron/ipc/recording` | Platform behavior studied; not imported as a second runtime |
| Project persistence | `electron/ipc/project`, `projectPersistence.ts` | Atomic-save and recovery ideas studied; FlowReco keeps its native project format |
| Extensions | `electron/extensions`, `src/lib/extensions`, `ExtensionManager.tsx` | Capability and security model reference; marketplace execution is not enabled yet |
| Branding and wallpapers | `branding`, `public/wallpapers`, `icons` | Not copied into FlowReco |

## Port register

The following changes are currently based on upstream architecture or observable behavior. This is a provenance description, not a statement that every target feature is complete.

| FlowReco area | Origin | Method | Notes |
| --- | --- | --- | --- |
| Tauri desktop, Solid UI, Rust media graph | Cap | Derived/forked foundation | AGPL notices and Cap copyright must remain |
| Web dashboard/share/backend/database | Cap | Derived/forked foundation | Internal package names may remain `@cap/*` until a controlled migration |
| Project, renderer, encoder, muxer crates | Cap | Derived/forked foundation | MIT exception applies only where Cap's license explicitly says so |
| Deterministic automatic zoom generation | Cap foundation plus Recordly behavior ideas and FlowReco requirements | New FlowReco implementation integrated into Cap architecture | Event clustering, safe focus, and segment generation are implemented in Rust but not native-release verified |
| Zoom editing presets and regeneration UI | Cap editor plus behavioral references | Modified/new FlowReco UI | Uses bounded values and normal project regions |
| Cursor artwork | No upstream artwork | Original generated FlowReco assets | Generator and provenance comments are checked in |
| Graphite/coral interface | UI-design guidance plus original design work | New FlowReco design | Does not reproduce the supplied reference branding or assets |
| Recordly extensions | Recordly behavior reference | Planned clean implementation | Do not load Recordly extensions directly until API and sandbox review are complete |

## License handling rules

1. Keep the root `LICENSE`, Cap notices, MIT exception, and all third-party headers intact.
2. Treat Recordly code as AGPL-3.0 unless a file carries a clearer compatible grant. `CONTRIBUTING.md` says contributions use MIT but links to a nonexistent `LICENSE`, while `LICENSE.md` declares AGPL-3.0; this ambiguity is a release risk, not permission to assume MIT.
3. Recordly's license text also asks derivative users to preserve attribution and not use Recordly branding. FlowReco uses distinct branding and records Recordly here and in `THIRD_PARTY_NOTICES.md`.
4. Do not copy cursor sets, wallpapers, logos, marketing copy, or the supplied video's artwork.
5. Run an automated dependency license scan and a manual asset/header audit before a binary or hosted release.

## Reproducing the pins

```bash
mkdir -p research
git clone https://github.com/CapSoftware/cap.git research/cap
git clone https://github.com/webadderallorg/Recordly.git research/recordly
git -C research/cap checkout bf6e56d3e8804da33abd21d9470a02cb50adefc0
git -C research/recordly checkout 360b1605009b1c9439629bfaf2033c59f94c611b
git -C research/cap rev-parse HEAD
git -C research/recordly rev-parse HEAD
```

