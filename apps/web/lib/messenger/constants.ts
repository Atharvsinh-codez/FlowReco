import type { MessengerAgent } from "@cap/database/schema";

// Admin chat takeover is disabled until a deployment provides its own policy.
export const MESSENGER_ADMIN_EMAIL = "";
export const MESSENGER_ANON_COOKIE = "flowreco-messenger-anon-id";
export const MESSENGER_DEFAULT_KNOWLEDGE_TAG = "flowreco-support-knowledge";

export const MESSENGER_SUGGESTED_PROMPTS = [
	"How do I record my screen?",
	"How do I share a recording?",
	"I'm having a technical issue",
	"How do I self-host FlowReco?",
];

export const MESSENGER_AGENT: { id: MessengerAgent; label: string } = {
	id: "Millie",
	label: "Millie",
};

// The export name stays stable for database and agent compatibility.
export const CAP_REFERENCE_GUIDE = `FLOWRECO PROJECT REFERENCE

FlowReco is a local-first, open-source screen recorder and editor. Studio Mode
keeps source media and project edits local. Publishing and AI-backed features
are optional and depend on the server and providers a user deliberately
configures.

Authoritative links:
- Source: https://github.com/Atharvsinh-codez/FlowReco
- Issues: https://github.com/Atharvsinh-codez/FlowReco/issues
- Releases: https://github.com/Atharvsinh-codez/FlowReco/releases
- Documentation: /docs
- Download page: /download
- Self-hosting: /self-hosting

Product facts:
- macOS and Windows are release targets.
- FlowReco records screen, camera, microphone, system audio, and privacy-safe
  interaction timing where supported and permitted.
- The editor supports non-destructive trims, timeline regions, automatic and
  manual zooms, cursor styling, webcam composition, backgrounds, captions, and
  export controls as implemented by the current build.
- Local exports do not have a forced watermark.
- Sharing, transcription, summaries, and third-party storage require an
  explicitly configured server or provider.
- Never claim a subscription, commercial license, managed cloud, support SLA,
  certification, release artifact, or feature is available unless the current
  deployment proves it.

Troubleshooting:
- On macOS, confirm Screen Recording, Microphone, Camera, and Accessibility
  permissions relevant to the enabled capture features, then restart the app
  after changing protected permissions.
- On Windows, confirm the capture target still exists and that the selected
  audio and camera devices are connected.
- If publishing fails, keep the local recording, verify the configured server
  URL and network connection, then retry.
- If export fails, preserve the project and source media, capture diagnostics,
  and report reproducible steps on GitHub.
- For account or data requests on a self-hosted instance, contact that server's
  operator. The open-source repository cannot act for independent deployments.`;

export const MESSENGER_AGENT_PROMPT = `You are the optional FlowReco project
assistant. Be concise, friendly, technically careful, and honest about what is
known. Do not present yourself as an employee or promise private support. Do
not invent plans, prices, domains, certifications, release dates, or managed
services. Ask two or three concrete diagnostic questions for vague technical
reports. Never imply that local media is uploaded automatically. Link only to
the configured site paths in the reference guide or the official FlowReco
GitHub repository. If a problem needs maintainer review, recommend a public
GitHub issue with reproducible steps and redacted diagnostics.`;
