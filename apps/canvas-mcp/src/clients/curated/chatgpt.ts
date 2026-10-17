import { updatedGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { unknownFacts } from "../facts";
export const chatgpt = {
	id: "chatgpt",
	name: "ChatGPT",
	provider: "OpenAI",
	group: "Curated",
	facts: unknownFacts(),
	blocker: {
		reason:
			"ChatGPT cannot currently complete Canvas MCP authentication because of a Canvas MCP bug. Setup instructions are pending a fix.",
		evidence: [updatedGuidance],
	},
	installModes: ["personal"],
	setupNote: "Connection instructions and supported install modes are awaiting verification.",
	verify: "Complete OAuth and confirm the Canvas MCP tools are available.",
} satisfies ClientDefinition;
