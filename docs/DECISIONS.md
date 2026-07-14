# Architecture and product decisions

This is an append-only decision log. Superseded decisions remain visible with a pointer to the replacement.

## D001 — Cap is the primary foundation

**Status:** Accepted, 2026-07-14  
**Decision:** Build FlowReco on Cap's Tauri v2, SolidStart/Next.js, Rust media crates, project model, and web platform.  
**Why:** It already provides the broadest production-oriented native capture, media, sharing, storage, and self-host architecture.  
**Consequence:** Preserve AGPL obligations and regression-test inherited behavior.

## D002 — Do not add Electron or PixiJS

**Status:** Accepted, 2026-07-14  
**Decision:** Treat Recordly as a behavior/data-model reference. Reimplement suitable behavior in FlowReco's existing UI and Rust renderer.  
**Why:** A second desktop runtime and composition engine would raise memory, packaging, security, maintenance, and preview/export-parity risk.  
**Consequence:** Recordly extensions cannot run directly.

## D003 — Keep a clean, separate Git history

**Status:** Accepted, 2026-07-14  
**Decision:** Upstream clones stay under a separate research workspace; FlowReco uses a new repository.  
**Why:** Prevent accidental history/remote mixing and make provenance explicit.  
**Consequence:** Pinned SHAs and origins are documented instead of relying on Git ancestry alone.

## D004 — Release the combined work under AGPL-3.0

**Status:** Accepted, 2026-07-14  
**Decision:** Preserve the Cap root license and notices; retain named MIT exception families and third-party terms.  
**Why:** The primary derived foundation is AGPL-3.0.  
**Consequence:** Network deployments must provide corresponding source as required; a dependency scan is release-blocking.

## D005 — One project model and one renderer

**Status:** Accepted, 2026-07-14  
**Decision:** Every edit is serialized in the FlowReco/Cap-derived project model and rendered through the shared Rust transform graph for preview and export.  
**Why:** This is the strongest defense against preview/export mismatch.  
**Consequence:** UI-only visual effects are not considered implemented.

## D006 — Local recording is authoritative

**Status:** Accepted, 2026-07-14  
**Decision:** Source media and recovery metadata are written locally before cloud publication can be relied upon. Upload is resumable and secondary.  
**Why:** Recording reliability and data safety outrank link latency.  
**Consequence:** An upload failure cannot delete or invalidate the local recording.

## D007 — Capture interaction geometry, not private content

**Status:** Accepted, 2026-07-14  
**Decision:** Store pointer/click/scroll/activity timing and optional UI bounds/roles; do not store typed content, passwords, clipboard, or sensitive accessibility text.  
**Why:** Automatic framing needs intent geometry, not private data.  
**Consequence:** Enhanced permissions are explicit and independently disableable.

## D008 — Automatic zoom is deterministic and non-destructive

**Status:** Accepted, 2026-07-14  
**Decision:** Equal events/configuration produce equal suggestions. Generated suggestions become ordinary editable regions and retain automatic provenance/defaults.  
**Why:** Users need predictable regeneration and total control.  
**Consequence:** Clustering/focus tests use fixed fixtures; generation cannot rewrite source events.

## D009 — Use an original calm product visual system

**Status:** Accepted, 2026-07-14  
**Decision:** Use FlowReco's graphite/coral palette, 4 px grid, Geist, dense restrained chrome, and canvas-dominant editor.  
**Why:** It suits a professional media tool and distinguishes the product.  
**Consequence:** The supplied reference informs control behavior only.

## D010 — No forced watermark

**Status:** Accepted, 2026-07-14  
**Decision:** Normal local exports carry no forced FlowReco or upstream watermark.  
**Why:** Open-source local editing should not degrade user output.  
**Consequence:** Branding overlays are optional project choices, never hidden export policy.

## D011 — Version and migrate projects/settings

**Status:** Accepted, 2026-07-14  
**Decision:** Preserve legacy `.cap` project compatibility until a versioned FlowReco format migration is implemented; migrate public settings with explicit compatibility handling.  
**Why:** Renaming must not strand recordings or corrupt preferences.  
**Consequence:** Internal `cap` identifiers can remain temporarily and must not be bulk-renamed blindly.

## D012 — Extension runtime comes after a security model

**Status:** Accepted, 2026-07-14  
**Decision:** Do not enable a marketplace/runtime until manifests, capabilities, isolation, signatures, limits, revocation, and deterministic render hooks are designed and tested.  
**Why:** Extensions touch media, files, network, and rendering and therefore expand the trust boundary.  
**Consequence:** Extension support remains planned.

## D013 — Visual references are behavior-only

**Status:** Accepted, 2026-07-14  
**Decision:** Do not copy names, icons, logos, wallpaper, artwork, marketing text, or pixel-identical styling from the supplied video/reference product.  
**Why:** Avoid brand, copyright, and product-identity risk.  
**Consequence:** All shipped visual assets need provenance.

## D014 — Exact keyboard capture is opt-in

**Status:** Accepted, 2026-07-14  
**Decision:** Exact key content is disabled by default and migrated to disabled for inherited users. Ordinary automatic zoom uses typing timing only.  
**Why:** Exact key capture is unnecessary for the core feature and materially raises privacy risk.  
**Consequence:** UI must explain the risk before any explicit opt-in.

## D015 — Bound zoom inputs and motion

**Status:** Accepted, 2026-07-14  
**Decision:** User and generated zoom scales, timings, focus points, acceleration, and edge behavior are validated and clamped to safe ranges.  
**Why:** Invalid geometry can break renders; unbounded movement causes discomfort.  
**Consequence:** Presets are convenience values, numeric inputs are authoritative within bounds, and reduced-motion defaults are available.

## D016 — Telemetry requires explicit FlowReco opt-in

**Status:** Accepted, 2026-07-14  
**Decision:** Telemetry defaults off and is not enabled by an inherited upstream preference without a FlowReco migration/consent marker.  
**Why:** No silent telemetry is a product principle.  
**Consequence:** Product functionality and diagnostics must remain usable without remote analytics.

## D017 — Ship original assets

**Status:** Accepted, 2026-07-14  
**Decision:** Generate FlowReco icons, cursors, backgrounds, tray/installer art, and sounds from checked-in originals or documented compatible sources.  
**Why:** Branding must be distinct and reproducible.  
**Consequence:** Upstream branded binary assets are removed from final bundles and generated outputs are checked against sources.

## D018 — No commercial gate on local capabilities

**Status:** Accepted, 2026-07-14  
**Decision:** Recording duration, local resolution, editing, export quality, GIF, and local assets are not disabled by a hosted-plan check. A configured server may still enforce its own authenticated storage/workspace policy.  
**Why:** Local-first open-source operation must not depend on an upstream commercial account.  
**Consequence:** Server rejection is surfaced honestly and never presented as local success.

## D019 — Hosted endpoints are deployment configuration

**Status:** Accepted, 2026-07-14  
**Decision:** Desktop uploads, auth, AI, updates, and analytics target explicit FlowReco deployment configuration; production must not silently fall back to Cap services.  
**Why:** Brand safety, privacy, and self-hosting require controlled network boundaries.  
**Consequence:** A release artifact must pass an endpoint/string and traffic audit.

## D020 — Platform verification is a release requirement

**Status:** Accepted, 2026-07-14  
**Decision:** Browser/unit tests are insufficient evidence for native recorder claims. macOS and Windows capture/export/recovery tests are release-blocking.  
**Why:** Permissions, codecs, clocks, hardware, and device behavior differ substantially by platform.  
**Consequence:** Environmental blockers are reported, never converted into a completion claim.

