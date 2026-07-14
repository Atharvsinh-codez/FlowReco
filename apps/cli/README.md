# cap CLI

FlowReco screen recording, driven from the command line. The `cap` binary is built for automation and AI
coding agents (Claude Code, Codex, OpenCode, Cursor): every command speaks JSON, errors are
machine-readable, and recordings have an explicit start/stop lifecycle.

## Install

- **From FlowReco Desktop:** Settings → Command Line → Install CLI (links the bundled binary onto your PATH).
- **Source build:** build FlowReco Desktop, then use Settings → Command Line to link its bundled CLI.
- **Signed builds:** review the [FlowReco releases page](https://github.com/Atharvsinh-codez/FlowReco/releases). No inherited installer URL is trusted.

The desktop app and the CLI share the same binary, so the CLI is always in sync with the installed app.

## Agent skill (Claude Code / Agent SDK)

A ready-made skill lives at [`skill/cap/SKILL.md`](./skill/cap/SKILL.md). Install it so agents reach for
FlowReco proactively (e.g. "record a repro of this bug"):

```sh
cp -r apps/cli/skill/cap ~/.claude/skills/cap   # or a project's .claude/skills/
```

The skill is intentionally thin — it delegates the authoritative contract to `cap guide --json`, so it
never drifts from the binary. Agents that don't consume skills (Codex, OpenCode, Cursor) get the same
information from `cap --help` and `cap guide --json` directly.

## The output convention (read this first)

- Pass `--json` (a global flag) to **any** command for machine-readable JSON on **stdout**. A command's
  own `--format json` works too; `--json` is the order-insensitive shortcut (`cap --json targets` and
  `cap targets --json` both work).
- **stdout** is the authoritative result. **stderr** is human-readable logs plus a final
  `error: <message>` line on failure.
- Failures exit **non-zero**. In `--json` mode a final object/event carries an `error` string field, so
  a single `"error" in obj` check detects failure across every command. clap usage/parse errors exit `2`.
- `record` and `export` stream **newline-delimited JSON (NDJSON)** events on stdout.
- Fetch the full machine-readable contract any time with **`cap guide --json`**.

## Authentication

`cap upload` authenticates automatically by **reusing the login FlowReco Desktop already stored** — if the
user is signed into the desktop app, there is no key to fetch or set. Check with `cap auth status --json`
(`{"authenticated":true,"source":"desktop","server":"…","userId":"…"}`); it never prints the secret.

For headless/CI (or to override), set `FLOWRECO_API_KEY` to a FlowReco auth key from Settings. The target server
is taken from `FLOWRECO_SERVER_URL`, else FlowReco Desktop's configured server, else `http://localhost:3000`.
The older `CAP_API_KEY` and `CAP_SERVER_URL` names remain compatibility aliases.

## Environment variables

| Variable                    | Used by                             | Notes                                                                                 |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------- |
| `FLOWRECO_API_KEY`          | `upload`                            | Overrides auth with a FlowReco auth key. Optional when signed into FlowReco Desktop. |
| `FLOWRECO_SERVER_URL`       | `upload`                            | FlowReco server base URL. Defaults to Desktop settings, then `http://localhost:3000`. |
| `CAP_API_KEY`               | `upload`                            | Compatibility alias for `FLOWRECO_API_KEY`. |
| `CAP_SERVER_URL`            | `upload`                            | Compatibility alias for `FLOWRECO_SERVER_URL`. |
| `CAP_NO_MODIFY_PATH`        | `desktop install-cli`               | Set to skip editing shell profiles / user PATH.                                       |
| `CAP_DESKTOP_FORCE_INSTALL` | `install-cli.sh`, `install-cli.ps1` | Force the installer script to replace FlowReco Desktop before linking the CLI.             |

## Typical agent workflow

```sh
cap doctor --json                          # verify permissions & capture readiness (exits 0; read `ok`/`captureReady`)
cap targets --json                         # discover screens/windows/cameras/mics (ids feed the next steps)
cap record start --screen <id> --json --detach  # start in the background -> {"type":"started","recordingId","pid","path"}
# ... the agent performs whatever it needs to capture ...
cap record stop --id <recordingId> --json  # finalize -> {"type":"stopped","path","recordingMetaExists":true}
cap project validate <path.cap> --json     # confirm the recording is complete before exporting
cap export <path.cap> --output out.mp4 --json
cap upload out.mp4 --json                   # -> {"type":"uploaded","id","link"} (auto-auth via FlowReco Desktop)
```

`cap upload <path.cap> --export --json` will export a project to its default output and upload it in one
step.

## Commands

- `cap record start` / `record stop` / `record status` — record (foreground, or `--detach` for background) and manage sessions.
- `cap export` — render a `.cap` project to mp4/gif/mov. Here `--format` selects the **container**; use `--json` for machine-readable output.
- `cap screenshot` — capture a still of a screen/window (`--json` → `{path,width,height}`).
- `cap targets` (`screens`/`windows`/`cameras`/`mics`) — enumerate capture inputs.
- `cap project inspect` / `validate` / `config get|set` — inspect and edit `.cap` projects.
- `cap recordings list` — list `.cap` recordings in the desktop library.
- `cap upload` — upload a `.cap` project or video file and get a shareable link.
- `cap update` — report signed-release update status and the verified releases page.
- `cap doctor` / `version` / `guide` — diagnostics, version info, and the agent capability manifest.
- `cap automations list` — list the automation rules configured in FlowReco Desktop that the CLI honors.
- `cap desktop status|install-cli|uninstall-cli` — manage the `cap` shim on PATH.
- `cap completions <shell>` — shell completion scripts (bash/zsh/fish/powershell).

## Automations

Automations are `trigger → (conditions) → actions` rules authored in FlowReco Desktop (Settings →
Automations) and persisted to its store. Because the CLI shares that store (and the `cap-automation`
engine), it runs the same rules automatically after `cap screenshot`, a `cap record` finish, and
`cap upload` — e.g. "on screenshot, save a copy to `~/Shots` and POST a webhook". Clipboard, OCR,
notification, and open-editor actions are desktop-only and are skipped on the CLI; everything else
(save, export, upload, run command, webhook, reveal, apply preset, delete) runs. Inspect the active
rules with `cap automations list --json`.

Run `cap --help` or `cap <command> --help` for full flag documentation.
