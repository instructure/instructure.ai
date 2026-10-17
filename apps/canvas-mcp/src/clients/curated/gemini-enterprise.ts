import type { ClientDefinition } from "../types";
export const geminiEnterprise = {
	group: "Curated",
	id: "gemini-enterprise",
	keyTypes: ["private"],
	requiresClientId: true,
	name: "Gemini Enterprise",
	redirectUris: ["https://vertexaisearch.cloud.google.com/oauth-redirect"],
	setupNote:
		"Create the MCP connection in Gemini Enterprise using its OAuth authorization and token URL fields.",
	verify: "Complete the OAuth flow and confirm the connection is available to the workspace.",
} satisfies ClientDefinition;
