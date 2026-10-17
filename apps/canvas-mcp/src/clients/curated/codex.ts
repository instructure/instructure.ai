import type { ClientDefinition } from "../types";
export const codex = {
	group: "Curated",
	id: "codex",
	keyTypes: ["public"],
	requiresClientId: true,
	rulesyncTarget: "codexcli",
	redirectUriKnown: false,
	name: "Codex",
	redirectUris: ["http://localhost:8081/callback/<callbackId>"],
	setupNote:
		"Add the remote MCP server in Codex. Instructure must provide the exact callback ID for the registered redirect URI.",
	verify: "Complete OAuth and confirm the Canvas MCP server is enabled in Codex.",
} satisfies ClientDefinition;
