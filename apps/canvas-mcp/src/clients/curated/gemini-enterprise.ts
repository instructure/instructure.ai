import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const geminiEnterprise = {
	facts: inheritedFacts(["private"], {
		kind: "fixed",
		uris: ["https://vertexaisearch.cloud.google.com/oauth-redirect"],
		status: "unverified",
		evidence: [],
	}),
	installModes: ["enterprise"],
	enterpriseSurface: "Google Cloud console",
	group: "Curated",
	id: "gemini-enterprise",
	name: "Gemini Enterprise",
	setupNote:
		"Create the MCP connection in Gemini Enterprise using its OAuth authorization and token URL fields.",
	verify: "Complete the OAuth flow and confirm the connection is available to the workspace.",
} satisfies ClientDefinition;
