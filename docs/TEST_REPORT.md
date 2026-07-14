# FlowReco test report

**Report date:** 2026-07-14  
**Scope:** foundation reconstruction and rebrand in the current Linux workspace.  
**Result:** useful TypeScript/web evidence exists; this is **not** desktop or release certification.

## Evidence summary

| Area | Command/evidence | Result | Interpretation |
| --- | --- | --- | --- |
| Web formatting/lint | `pnpm exec biome check` on the 70 changed web/shared files | Passed | Changed web foundation was syntactically formatted and lint-clean at that checkpoint |
| Next route types | `pnpm --dir apps/web exec next typegen` | Passed | Next-generated route/type inputs succeeded |
| Web/shared TypeScript | `pnpm tsc -b apps/web --pretty false` | Passed | Web project references type-checked at that checkpoint |
| Web unit/integration tests | web Vitest: **74 files, 955 tests** | Passed | Broad inherited web test foundation passed |
| Desktop changed files | scoped Biome checks over rebrand/recovery/export/settings changes | Passed | The targeted Solid/TypeScript changes were lint/format clean at their checkpoints |
| Desktop focused tests | final desktop Vitest: **11 files, 55 tests** | Passed | Includes zoom, captions, settings, routing, analytics, and memory-soak units |
| Chrome extension tests | focused extension Vitest: **3 files, 10 tests** | Passed | Branding/server migration behavior is covered in the scoped suite |
| Cursor assets | generator regeneration and SVG render comparison: **52/52 byte-identical** | Passed | Original embedded cursor outputs are reproducible |
| Desktop source assets | reference scan plus tracked binary inventory | Passed | Removed 70 unreferenced inherited binaries; retained only the six original FlowReco wallpapers in the bundled background tree |
| UI sound assets | regenerate with `node scripts/generate-ui-sounds.mjs`, then verify SHA-256 | Passed | Four original tone definitions reproduce byte-identical desktop/web/extension WAV files |
| Public web asset audit | deleted-asset reference scan and `git diff --check` | Passed | Removed inherited testimonial photos, customer claims, Cap-history media, and obsolete marketing art |
| JSON/config parsing | Node parse checks for touched Tauri/web manifests | Passed at the relevant checkpoint | Syntax only; does not validate native packaging semantics |
| Rust | `cargo test` / `cargo check` | Blocked | Rust/Cargo toolchain is unavailable in this environment |
| Self-host | `docker compose config` and end-to-end stack | Blocked | Docker is unavailable in this environment |
| Browser visual smoke | managed browser to local preview | Blocked with `ERR_BLOCKED_BY_CLIENT` | Managed browser policy prevented local visual inspection; not an app pass/fail |
| Native macOS | record/edit/export/recovery | Blocked | No macOS 14+ host, permissions, devices, signing/notarization identity |
| Native Windows | record/edit/export/recovery | Blocked | No Windows 10/11 host, WGC/WASAPI devices, signing identity |

The web and mobile files continued to change during branding integration after some checkpoints above. Before any release, rerun every applicable command on the final commit and replace checkpoint evidence with commit-pinned logs.

## What has targeted test coverage

- Web authentication/onboarding/dashboard/share/backend behavior inherited from the Cap foundation.
- FlowReco copy and self-host entitlement behavior in targeted web tests.
- Recording filename compatibility and recovery parsing for FlowReco and legacy names.
- Desktop update-feed configuration error behavior.
- Telemetry and exact-key defaults/migration logic in Rust unit tests (written, not executed here).
- Deterministic automatic-zoom clustering/focus/sanitization tests in Rust (written, not executed here).
- Renderer automatic focus/spring behavior tests (present, not executed here).
- Original cursor generator output, hotspots/provenance checks, and platform lookup tests (Rust portion not executed).
- Camera background blur currently takes the unavailable/fallback path because unprovenanced ONNX weights are intentionally not bundled.

## Commands to rerun on the final tree

### Fast cross-platform source checks

```bash
pnpm install --frozen-lockfile
pnpm exec biome check .
pnpm --dir apps/web exec next typegen
pnpm tsc -b
pnpm test
```

### Rust/media checks

```bash
rustc --version
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
cargo test -p rendering
cargo test -p export
cargo test -p recording
cargo test -p project
```

### Self-host checks

```bash
docker compose config
docker compose up -d
docker compose ps
docker compose logs --no-color
```

Then perform a clean install, migration, upload, share, access-control, backup, restore, and upgrade scenario.

## Native manual matrix

Every row needs a result, OS/build, hardware, app commit, output fixture, and diagnostic-log link.

| Scenario | macOS Apple Silicon | macOS Intel | Windows 10 19041 | Windows 11 |
| --- | --- | --- | --- | --- |
| Permission onboarding and denial/retry | Not run | Not run | Not run | Not run |
| Entire-display capture | Not run | Not run | Not run | Not run |
| Single-window capture, move/resize window | Not run | Not run | Not run | Not run |
| Region capture across DPI/Retina/multiple displays | Not run | Not run | Not run | Not run |
| Camera + microphone + system audio, separate tracks | Not run | Not run | Not run | Not run |
| Device hot-plug/loss and clipping warning | Not run | Not run | Not run | Not run |
| Pause/resume/stop and shortcut state | Not run | Not run | Not run | Not run |
| Crash/kill recovery and interrupted finalization | Not run | Not run | Not run | Not run |
| Low disk during recording/export | Not run | Not run | Not run | Not run |
| Instant upload offline/reconnect/local fallback | Not run | Not run | Not run | Not run |
| Studio edit/autosave/reopen/undo/redo | Not run | Not run | Not run | Not run |
| Auto-zoom/cursor/webcam/caption collision cases | Not run | Not run | Not run | Not run |
| Trim/split/speed/audio pitch/A/V mapping | Not run | Not run | Not run | Not run |
| MP4 1080p30/60, 1440p60, 4K30/60 | Not run | Not run | Not run | Not run |
| GIF preset, loop, FPS, dimensions | Not run | Not run | Not run | Not run |
| Export cancel/retry/reveal and app restart | Not run | Not run | Not run | Not run |
| Packaged install/update/uninstall | Not run | Not run | Not run | Not run |

## Media correctness fixtures

Required automated or repeatable fixtures:

1. Zoom entry start, midpoint, hold, reframe, and exit at exact project timestamps.
2. Pointer target near every edge/corner, under webcam, under captions, after crop, and across Retina/DPI scales.
3. 23.976/24/25/29.97/30/50/59.94/60 fps source/output combinations.
4. Separate mic/system/camera clocks over 5 minutes, 30 minutes, and 2 hours.
5. Trim and speed regions spanning captions, cursor events, annotations, and audio fades.
6. Hardware encoder available, unavailable, failure mid-export, and software fallback.
7. Export destination full/unwritable/disconnected and cancellation at each phase.

Acceptance thresholds must be written before qualification; a visually plausible result is not enough.

## Known blockers and exact reproduction

### Rust toolchain unavailable

```bash
cargo --version
```

Expected in a provisioned runner: a Cargo version compatible with `rust-toolchain.toml`. Current environment: executable unavailable. Install the pinned toolchain and native FFmpeg/build dependencies, then run the Rust commands above.

### Docker unavailable

```bash
docker version
docker compose version
```

Current environment cannot start the web/database/object-storage topology. Provision Docker, then run Compose validation and the self-host scenario.

### Native OS unavailable

The current Linux container cannot reproduce ScreenCaptureKit/TCC behavior, macOS camera/system-audio clocks, Windows Graphics Capture, WASAPI, hardware encoder selection, or signed application packaging. Use physical/virtual macOS and Windows runners with real or virtual devices and retain output fixtures.

### Managed browser local preview

Opening the local development preview in the managed browser produced `ERR_BLOCKED_BY_CLIENT`. Reproduce with the product's managed browser against the local preview URL; verify the same build through an unrestricted local browser or approved preview tunnel. This does not replace native desktop inspection.

## Release conclusion

FlowReco is currently an actively integrated foundation. The evidence supports ongoing development and source-level confidence in tested areas. It does not yet support claims of production-ready macOS/Windows recording, 4K60 export, self-host deployment, or full acceptance completion.
