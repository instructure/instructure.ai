import { type ClientDefinition } from "../types";
import { unknownFacts } from "../facts";
export const chatgpt = {
	id: "chatgpt",
	name: "ChatGPT (chatgpt.com and ChatGPT Desktop)",
	group: "Curated",
	facts: unknownFacts(),
	installModes: ["personal"],
	setupNote: "Connection instructions and supported install modes are awaiting verification.",
	verify: "Complete OAuth and confirm the Canvas MCP tools are available.",
} satisfies ClientDefinition;
