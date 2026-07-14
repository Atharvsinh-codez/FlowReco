# Upstream and release audit

**Audit date:** 2026-07-14  
**Scope:** pinned Cap and Recordly sources, current FlowReco foundation, licenses, assets, build surfaces, and release gates.

## Executive result

The Cap foundation is the technically appropriate base: it already separates native capture, project data, rendering/export, desktop UI, web collaboration, storage, and SDK concerns. Recordly is useful as a behavioral reference, especially for editor controls, but importing Electron or PixiJS would create a second media/runtime path and undermine preview/export parity.

This is **not a release approval**. TypeScript and web tests provide meaningful foundation evidence, while Rust, packaged desktop, Docker, macOS capture, Windows capture, A/V sync, and export golden frames remain unverified in this environment.

## Repository inspection

| Check | Cap | Recordly | Finding |
| --- | --- | --- | --- |
| Root guidance | `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `README.md` | `CONTRIBUTING.md`, `README.md` | Read before implementation decisions |
| JS workspace | pnpm 10.5.2, Turborepo, Node 20+, SolidStart/Next.js | npm, Vite, React, Electron, PixiJS | Keep Cap's workspace and runtime |
| Native workspace | Rust/Tauri v2 with capture, camera, media, render, encode, mux crates | Swift/C++ helpers behind Electron IPC | Keep Cap's native graph; port behavior cleanly |
| Product backend | Next.js, Effect API layers, Drizzle/MySQL, S3 | Desktop-local | Keep Cap web platform |
| Project model | Rust/JSON project configuration | `.recordly` JSON/project manager | Keep one FlowReco model and add migrations |
| Export | Rust encoders/export pipeline, hardware backends, GIF crate | FFmpeg/native/Electron export routes | Keep Rust path and use Recordly for UX ideas |

## License findings

| ID | Severity | Finding | Required action | State |
| --- | --- | --- | --- | --- |
| L-01 | Release blocking | Cap's main work is AGPL-3.0; named crate families are MIT | Preserve license, notices, source availability, and exception boundaries | Documented |
| L-02 | Release blocking | Recordly `LICENSE.md` is AGPL-3.0 and adds branding/attribution language | Treat any copied/derived code as AGPL; preserve attribution; use no Recordly brand | Documented |
| L-03 | High | Recordly `CONTRIBUTING.md` says MIT and links `LICENSE`, but the repository contains `LICENSE.md` declaring AGPL | Do not rely on the contribution statement; obtain clarification before verbatim reuse under MIT | Open |
| L-04 | Release blocking | Full transitive dependency license compatibility has not been scanned at the FlowReco lockfile state | Run an allow-list scan for npm and Cargo; manually review unknown/custom licenses | Open |
| L-05 | High | Vendored and patched dependencies can carry notices beyond lockfile metadata | Inventory `vendor/`, `patches/`, binary helpers, fonts, codecs, and model files | Open |
| L-06 | High | The inherited Neue Montreal font files did not include a redistribution grant in this source snapshot | Removed the font binaries and switched extension/mobile UI to platform font stacks | Resolved for checked-in fonts; dependency scan remains open |
| L-07 | High | Inherited ONNX model weights had no exact source, version, or model-license record | Removed both weights; blur returns the existing unavailable/fallback path until a reviewed installer is implemented | Resolved for source publication; licensed model delivery remains open |
| L-08 | High | Inherited UI sound recordings had no adjacent source or redistribution record | Replaced them with deterministic PCM WAV tones generated from checked-in FlowReco code | Resolved; generator determinism verified |

This audit is engineering documentation, not legal advice.

## Brand and asset findings

| Area | Rule | Current evidence | Remaining gate |
| --- | --- | --- | --- |
| Public name | Use FlowReco, not upstream product names | Visible desktop/web copy is being rebranded | Automated string/metadata scan and packaged-app inspection |
| Logo and mark | Original artwork only | Original FlowReco mark sources exist under `branding/source` | Generate and visually inspect every installer/mobile/favicon size |
| Cursors | Original artwork only | Deterministic generator, embedded SVGs, hotspot tests, provenance comments | Render on macOS/Windows at 1x/2x and check hotspots |
| Backgrounds | No upstream or reference artwork | Six generator-backed FlowReco backgrounds remain; inherited source wallpapers were removed | Confirm packaged bundle contains only approved assets |
| Supplied reference | Interaction-only reference | No source or proprietary assets imported | Manual visual/asset diff before release |
| Legacy binaries | Do not ship inherited logos, wallpapers, testimonial photos, marketing art, Rive pricing, or watermark | Unreferenced desktop media and inherited web testimonials, customer claims, Cap-history art, and obsolete marketing assets were removed | Binary inventory scan of final bundles |
| UI fonts | Do not redistribute font binaries without a verified grant and notice | Neue Montreal and unprovenanced Geist copies removed; web, extension, and mobile use platform UI stacks | Visual typography inspection on release platforms |
| UI sounds | Original or license-cleared audio only | Start, stop, screenshot, and notification WAVs are reproducible from `scripts/generate-ui-sounds.mjs` | Audition at release volume on macOS/Windows/browser |

## Security and privacy findings

| ID | Finding | FlowReco policy | Evidence/state |
| --- | --- | --- | --- |
| P-01 | Global input monitoring can expose sensitive activity | Capture geometry/timing only; never persist typed content, passwords, clipboard, or accessibility text | Exact-key capture is off by default; settings migration exists; native permission test pending |
| P-02 | Telemetry inherited from upstream can transmit unexpectedly | Explicit opt-in with inherited settings reset | Default and migration code/tests exist; live endpoint inspection pending |
| P-03 | Uploads can violate local-first expectations | Local recording is authoritative; upload needs visible user intent | Desktop/web copy and local fallback paths exist; network interruption test pending |
| P-04 | AI processing can send media/transcripts externally | Provider-configurable and opt-in only | Product requirement documented; provider-by-provider egress audit pending |
| P-05 | Extensions can execute untrusted code | No marketplace runtime until signed manifests, capabilities, isolation, and revocation exist | Planned; disabled by absence |
| P-06 | Share links may expose media | Explicit public/unlisted/private/workspace/password modes and download/expiry controls | Cap-derived routes exist; full access matrix test pending |

## Architecture risks

- Preview/export parity can regress if UI-only transforms diverge from `crates/rendering`; all visual features must terminate in the shared project/render path.
- Project migrations must remain forward-readable and preserve source media; renaming the public brand must not casually rename internal identifiers or formats.
- Native capture behavior is platform-specific. Passing browser/unit tests does not validate ScreenCaptureKit, Windows Graphics Capture, WASAPI, camera synchronization, permissions, hot-plug, or crash recovery.
- A 4K60 promise is hardware- and codec-sensitive. Release support requires a device/encoder matrix, thermal and memory measurements, and long-duration A/V sync tests.
- Self-host defaults inherited from Cap may include upstream URLs. No production build may silently target Cap services.

## Release gates

| Gate | Evidence required | State |
| --- | --- | --- |
| Source and license | Dependency report, notices, asset provenance, source-offer path | Blocked: dependency scan outstanding |
| macOS desktop | Signed/notarized build on macOS 14+, permissions, display/window/region, camera/mic/system audio, 4K60, recovery | Blocked: no macOS host/signing identity |
| Windows desktop | Signed build on Windows 10 19041 and Windows 11, WGC/WASAPI/device loss, hardware encoders, recovery | Blocked: no Windows host/signing identity |
| Media correctness | Golden preview/export frames; A/V drift thresholds across trims and speed regions | Blocked: Rust/native test environment unavailable |
| Self-host | Fresh Docker Compose install, migrations, MinIO/S3, auth, upload, share/access modes, backup/restore | Blocked: Docker unavailable |
| Security/privacy | Egress capture, secrets scan, permission review, telemetry/AI/upload opt-in tests | Partial |
| Accessibility | Keyboard-only desktop/web flow, focus order, contrast, reduced motion, screen-reader labels | Partial |
| Brand | Final binary/resource string scan and visual inspection | Partial |

## Required follow-up commands

Run from the repository root in a provisioned environment:

```bash
pnpm install --frozen-lockfile
pnpm exec biome check .
pnpm typecheck
pnpm test
cargo test --workspace
docker compose config
docker compose up -d
pnpm tauri:build
```

The exact evidence ledger and known environmental blockers are maintained in [TEST_REPORT.md](TEST_REPORT.md).
