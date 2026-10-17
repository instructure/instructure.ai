import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const codex = {
	facts: inheritedFacts(["public"], {
		kind: "computed",
		recipe: "codex-callback-id",
		base: "http://localhost:8081/callback",
		mode: "unknown",
		evidence: [],
	}),
	installModes: ["personal"],
	group: "Curated",
	id: "codex",
	rulesyncTarget: "codexcli",
	name: "Codex",
	setupNote:
		"Add the remote MCP server in Codex. Confirm the exact callback URI and callback mode before registering it.",
	verify: "Complete OAuth and confirm the Canvas MCP server is enabled in Codex.",
} satisfies ClientDefinition;
