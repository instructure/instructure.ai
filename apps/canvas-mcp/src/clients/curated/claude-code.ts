import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const claudeCode = {
	facts: inheritedFacts(["public", "private"], {
		kind: "fixed",
		uris: ["http://localhost:8081/callback"],
		status: "unverified",
		evidence: [],
	}),
	installModes: ["personal"],
	group: "Curated",
	id: "claude-code",
	rulesyncTarget: "claudecode",
	name: "Claude Code",
	setupNote: "Add the remote HTTP MCP server using Claude Code's current MCP configuration flow.",
	verify: "Complete the browser sign-in and confirm the server is listed as connected.",
} satisfies ClientDefinition;
