# FlowReco Contributor Guide

## Introduction

### What is FlowReco?

FlowReco is a local-first, open-source screen recorder and cinematic editor. It records source media and interaction metadata locally, keeps edits non-destructive, and makes web sharing optional.

FlowReco is under active development. Check the feature matrix and test report before relying on a capability in a production workflow.

### What is this guide?

This guide is for anyone who wants to contribute to FlowReco. `AGENTS.md` contains the current repository rules and verification requirements.

### How can I contribute?

There are many ways to contribute to FlowReco. You can:

- [Report a bug](https://github.com/Atharvsinh-codez/FlowReco/issues/new)
- [Suggest a feature](https://github.com/Atharvsinh-codez/FlowReco/issues/new)
- Submit a PR

## Running FlowReco

### Development Requirements

Before anything else, make sure you have the following installed:

- Node Version 20+
- Rust 1.88.0+
- pnpm 10.5.2
- Docker ([OrbStack](https://orbstack.dev/) recommended)

### General Setup

Run `pnpm install`, then run `pnpm env-setup` to generate a `.env` file configured for your environment.
It will ask you which apps you intend to run, whether you'd like to use Docker to run S3 (MinIO) and MySQL locally,
and allow you to provide overrides as needed.

Then run `pnpm cap-setup` to install native dependencies such as FFmpeg.

On Windows, llvm, clang, and VCPKG must be installed.
On MacOS, cmake must be installed.
`pnpm cap-setup` does not yet install these dependencies for you.

To run both `@cap/desktop` and `@cap/web` together, use `pnpm dev`.
To run only one of them, use `pnpm dev:desktop` or `pnpm dev:web` respectively.

### `@cap/desktop` (desktop app)

When running `@cap/desktop` from a terminal on macOS,
you will need to grant permissions (screen recording, microphone, etc.) to the terminal, not the FlowReco app.
For example, if you run `pnpm dev:desktop` in the macOS `Terminal.app`,
you will need to grant permissions to it instead of `FlowReco - Development.app`.

#### Where are my recordings stored?

You can find new development recordings under the platform application-data directory for
`app.flowreco.desktop.dev`. Legacy Cap-derived locations remain readable during migration.

### `@cap/web` (FlowReco web application)

When running `pnpm dev` or `pnpm dev:web`, a MySQL database and MinIO S3 server will also be using Docker.
If you want to _only_ run the `@cap/web` NextJS app, `cd` into `./apps/web` and run `pnpm dev`.
