import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const claudeAi = {
	facts: inheritedFacts(["public", "private"], {
		kind: "fixed",
		uris: ["https://claude.ai/api/mcp/auth_callback"],
		status: "unverified",
		evidence: [],
	}),
	installModes: ["personal"],
	group: "Curated",
	id: "claude-ai",
	name: "Claude.ai / Claude Desktop",
	setupNote: "Add a remote MCP server in Claude and follow its OAuth sign-in flow.",
	verify:
		"The server appears as connected in Claude and its tools are available in a new conversation.",
} satisfies ClientDefinition;
