import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const antigravity = {
	facts: inheritedFacts(["public", "private"], { kind: "unverified" }),
	installModes: ["personal"],
	provider: "Google",
	group: "Curated",
	id: "antigravity",
	name: "Antigravity",
	setupNote: "Verify Antigravity's current OAuth requirements before configuring the connection.",
	verify: "Confirm Antigravity completes OAuth and connects to the Canvas MCP server.",
	rulesyncTarget: "antigravity-ide",
} satisfies ClientDefinition;
