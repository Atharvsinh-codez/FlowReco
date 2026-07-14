# FlowReco cursor theme

The FlowReco cursor theme is original artwork created for FlowReco on 2026-07-14. It
uses a quiet broadcast-tool palette that remains legible over light and dark
recordings:

- graphite outline: `#151A22`
- near-white fill: `#F7F8FA`
- recording coral detail: `#FF6243`

The forms are purpose-built geometric symbols on a 32 × 32 grid. They preserve
the semantic cursor categories and filenames consumed by the native detector,
but do not copy or trace platform cursor artwork. Platform names in the Rust
enums describe the detected operating-system cursor, not the rendered asset.

Run this from the repository root to regenerate the complete embedded set and
the two onboarding preview icons:

```bash
node scripts/generate-cursor-assets.mjs
```

Generated outputs:

- `crates/cursor-info/assets/mac/**/*.svg`
- `crates/cursor-info/assets/windows/*.svg`
- `packages/ui-solid/icons/cursor-macos.svg`
- `packages/ui-solid/icons/cursor-windows.svg`

Do not hand-edit generated SVGs. Update the generator and the normalized
hotspots in `crates/cursor-info/src/` together, then run the resolver tests.
