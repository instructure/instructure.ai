import type { ClientDefinition } from "../types";
export const claudeCode = {
	group: "Curated",
	id: "claude-code",
	keyTypes: ["public"],
	requiresClientId: true,
	rulesyncTarget: "claudecode",
	name: "Claude Code",
	redirectUris: ["http://localhost:8081/callback"],
	setupNote: "Add the remote HTTP MCP server using Claude Code's current MCP configuration flow.",
	verify: "Complete the browser sign-in and confirm the server is listed as connected.",
} satisfies ClientDefinition;
