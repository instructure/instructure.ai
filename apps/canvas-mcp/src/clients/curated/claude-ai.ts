import type { ClientDefinition } from "../types";
export const claudeAi = {
	group: "Curated",
	id: "claude-ai",
	keyTypes: ["public"],
	requiresClientId: true,
	name: "Claude.ai / Claude Desktop",
	redirectUris: ["https://claude.ai/api/mcp/auth_callback"],
	setupNote: "Add a remote MCP server in Claude and follow its OAuth sign-in flow.",
	verify:
		"The server appears as connected in Claude and its tools are available in a new conversation.",
} satisfies ClientDefinition;
