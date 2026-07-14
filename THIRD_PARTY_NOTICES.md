# Third-party notices

FlowReco includes, modifies, or was developed with reference to open-source software. This file supplements—not replaces—the license text, copyright headers, dependency manifests, lockfiles, and notices shipped with individual components.

## Cap

- Project: Cap
- Source: <https://github.com/CapSoftware/cap>
- Pinned source used for this FlowReco foundation: `bf6e56d3e8804da33abd21d9470a02cb50adefc0`
- Copyright: © 2023–present Cap Software, Inc.
- License: GNU Affero General Public License, version 3, except that code in the `cap-camera*` and `scap-*` crate families is licensed under the MIT License; third-party components retain the license of their owner.

FlowReco is derived substantially from Cap's desktop, web, project, capture, rendering, encoding, storage, SDK, and backend foundation. The full AGPL-3.0 text is in [`LICENSE`](LICENSE), and Cap's MIT exception text is in [`licenses/LICENSE-MIT`](licenses/LICENSE-MIT). Existing source headers and notices must remain intact.

## Recordly

- Project: Recordly
- Source: <https://github.com/webadderallorg/Recordly>
- Pinned source inspected: `360b1605009b1c9439629bfaf2033c59f94c611b`
- Copyright: © 2026 webadderall; the upstream notice states that Recordly began as a fork of OpenScreen by Siddharth Vaddem (2025).
- License at the pin: `LICENSE.md` declares GNU Affero General Public License, version 3, and contains additional attribution/branding statements.

Recordly was inspected as a secondary behavioral and data-model reference for timeline editing, automatic zooms, cursor composition, webcam composition, GIF export, atomic project behavior, and extensions. FlowReco does not use the Recordly name or artwork as its product brand. Any Recordly-derived source that is introduced must preserve its applicable headers and attribution and be entered in [`docs/UPSTREAM_SOURCES.md`](docs/UPSTREAM_SOURCES.md).

Recordly's `CONTRIBUTING.md` says contributions use MIT but points to `LICENSE`, while the repository contains `LICENSE.md` declaring AGPL-3.0. FlowReco does not treat that inconsistency as an MIT grant; see [`docs/UPSTREAM_AUDIT.md`](docs/UPSTREAM_AUDIT.md).

## agent-skills UI design skill

- Project: agent-skills
- Source: <https://github.com/mblode/agent-skills>
- Pinned source inspected: `d7c7ae79009a2c6f103154b5c476d2b7b75e4fd7`
- License: MIT

The UI-design skill informed product-design process and interface guidance. FlowReco's public branding and visual assets are original.

## Other dependencies

FlowReco uses third-party Rust crates, JavaScript packages, native libraries, fonts, codecs, and vendored/patched components declared in `Cargo.toml`, `Cargo.lock`, workspace `package.json` files, `pnpm-lock.yaml`, `bun.lock`, `vendor/`, and `patches/`. Each remains subject to its own license and notice requirements.

Before any binary or hosted release, generate a dependency inventory from the exact release lockfiles, review all unknown/custom/copyleft entries, bundle required license texts, and record the result in [`docs/UPSTREAM_AUDIT.md`](docs/UPSTREAM_AUDIT.md). The absence of a dependency from this summary does not remove its license.

Commercial Neue Montreal and unprovenanced Geist font binaries inherited from the research foundation are not redistributed by FlowReco; web, extension, and mobile surfaces use platform UI font stacks. Unprovenanced ONNX weights and UI recordings are also excluded. FlowReco's checked-in WAV alerts are generated from original mathematical tone definitions in `scripts/generate-ui-sounds.mjs`.

## Original FlowReco assets

FlowReco's marks, cursor artwork, and other checked-in brand sources are original project assets unless an adjacent provenance file says otherwise. Names of operating-system cursor concepts identify behavior only and do not claim ownership of platform artwork.

## No affiliation

FlowReco is an independent open-source project. References to Cap, Recordly, OpenScreen, macOS, Windows, S3 providers, and other products identify upstream sources, compatibility, or platforms and do not imply endorsement.
