import type { ClientDefinition } from "../types";
export const antigravity = {
	group: "Curated",
	id: "antigravity",
	keyTypes: ["public", "private"],
	requiresClientId: true,
	redirectUriKnown: false,
	name: "Antigravity",
	redirectUris: ["Confirm the OAuth callback URI with this client"],
	setupNote: "Verify Antigravity's current OAuth requirements before configuring the connection.",
	verify: "Confirm Antigravity completes OAuth and connects to the Canvas MCP server.",
	rulesyncTarget: "antigravity-ide",
	oauthMetadataVerified: false,
} satisfies ClientDefinition;
