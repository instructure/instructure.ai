import { type ClientDefinition } from "../types";
import { unknownFacts } from "../facts";
export const superhumanGo = {
	id: "superhuman-go",
	name: "Superhuman Go",
	group: "Curated",
	facts: unknownFacts(),
	installModes: ["personal"],
	setupNote: "Connection instructions and supported install modes are awaiting verification.",
	verify: "Complete OAuth and confirm the Canvas MCP tools are available.",
} satisfies ClientDefinition;
