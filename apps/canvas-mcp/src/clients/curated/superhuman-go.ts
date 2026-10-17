// Research 2026-10-17: https://help.superhuman.com/hc/en-us/articles/47378469809805
// documents Superhuman's native Canvas LMS connector (Coda Pack 51655), not a custom
// Maple MCP connection. Its coda.io redirect URI must not be reused for this MCP client.
// https://superhuman.com/go advertises custom MCP connectors but does not specify
// their static OAuth credentials or redirect URI. Keep those facts unknown until sourced.
import { type ClientDefinition } from "../types";
import { unknownFacts } from "../facts";
export const superhumanGo = {
	id: "superhuman-go",
	name: "Go",
	provider: "Superhuman",
	group: "Curated",
	facts: unknownFacts(),
	installModes: ["personal"],
	setupNote:
		"Use the MCP server connection fields to configure a custom connector in Superhuman Go.",
	verify: "Complete OAuth and confirm the Canvas MCP tools are available.",
} satisfies ClientDefinition;
