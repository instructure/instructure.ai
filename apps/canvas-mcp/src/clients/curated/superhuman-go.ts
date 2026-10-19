import { type Guide } from "../../guides/types";
import { screenshot } from "../../guides/screenshots";
// Research 2026-10-17: https://help.superhuman.com/hc/en-us/articles/47378469809805
// documents Superhuman's native Canvas LMS connector (Coda Pack 51655), not a custom
// Maple MCP connection. Its coda.io redirect URI must not be reused for this MCP client.
// https://superhuman.com/go advertises custom MCP connectors but does not specify
// their static OAuth credentials or redirect URI. Keep those facts unknown until sourced.
import { type ClientDefinition } from "../types";
import { unknownFacts } from "../facts";
const goResearchPreview: Guide = {
	presentation: "by-surface",
	status: "pending",
	prerequisites: [],
	sources: [],
	steps: [
		{ id: "canvas-create", kind: "canvas-key", action: "create" },
		{
			id: "provider-preview",
			kind: "provider",
			title: "Go — research preview",
			content: [
				{
					kind: "paragraph",
					text: "These screenshots capture the currently researched Pack Studio and Go surfaces. They are previews only until Superhuman documents a supported Canvas MCP setup flow.",
				},
				screenshot("packstudio_new_pack", "new Pack with MCP server code. (Label not verified.)"),
				screenshot(
					"packstudio_settings_oauth_credentials",
					"Settings screen with client credentials. (Exact labels unverified.)",
				),
				screenshot("go_connectors_panel", "Go side panel Connectors list."),
			],
		},
	],
};
export const superhumanGo = {
	id: "superhuman-go",
	name: "Go",
	provider: "Superhuman",
	group: "Curated",
	facts: unknownFacts(),
	guides: { personal: goResearchPreview },
	installModes: [],
	setupNote:
		"A supported Canvas MCP setup flow for Go has not been verified. Research documents a developer-built Coda Pack workflow, not a direct Go form for entering an MCP URL and OAuth credentials.",
	verify:
		"Verification instructions are pending confirmation of a supported Canvas MCP setup flow.",
} satisfies ClientDefinition;
