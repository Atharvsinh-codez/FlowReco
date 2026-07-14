# FlowReco visual identity

FlowReco uses an original focus-and-recording mark: four framing corners surround a coral `R`, expressing capture, reframing, and guided attention. The identity is deliberately distinct from Cap, Recordly, and the behavioral video reference.

## Core system

| Token | Value | Use |
| --- | --- | --- |
| Graphite | `#111315` | Primary surfaces, app tile, dark installer art |
| Coral | `#FF6243` | Recording state, emphasis, focal signal |
| Paper | `#F4F5F6` | Light surfaces and high-contrast mark details |
| Soft graphite | `#1A1D22` | Raised dark surfaces |
| Muted | `#9CA2AB` | Secondary information |

The product UI follows a four-pixel spacing rhythm, quiet neutral surfaces, restrained coral accents, and Geist typography where available. Coral indicates recording, selection, or a single primary action; it should not become ambient decoration.

## Sources and generated assets

Canonical, editable SVG sources live in [`branding/source`](source). They include:

- app mark, monochrome mark, and light/dark wordmarks;
- six original 16:9 editor backgrounds;
- installer artwork for DMG, NSIS, and WiX;
- desktop tray states;
- light, dark, and system theme previews;
- onboarding artwork and editor background swatches;
- social and Open Graph artwork.
- original web dashboard, editor, recorder, ambient, and call-to-action previews.

Run the deterministic generator from the repository root:

```sh
node scripts/generate-brand-icons.mjs
```

UI notification sounds are deterministic FlowReco originals generated with:

```sh
node scripts/generate-ui-sounds.mjs
```

The sound generator writes the desktop, web, and extension copies from the same
mathematical tone definitions; no third-party recordings are embedded.

The generator validates the canonical palette, uses Tauri's icon generator for platform bundles, and renders the source SVGs into the existing desktop and web asset paths. It replaces the public favicon family, app icons, tray imagery, installer art, public logo surfaces, theme previews, onboarding decoration, social previews, and FlowReco editor backgrounds.

The compatibility files `branding/source/reco-mark.svg`, `branding/source/reco-mark-mono.svg`, and `apps/desktop/src/assets/reco-mark.svg` intentionally mirror the canonical FlowReco mark while older internal imports are migrated. Their artwork is FlowReco's.

## Provenance and use

All artwork in this directory was created specifically for FlowReco from simple geometric primitives. It does not copy the supplied behavioral reference, upstream logos, proprietary artwork, wallpapers, or marketing creative. These assets are distributed under the repository license unless a file-local notice states otherwise.

Keep the mark legible, retain safe space equal to one focus-corner stroke, and do not recolor the coral signal with upstream brand colors. The monochrome mark is intended for platform template icons and pinned tabs only.
