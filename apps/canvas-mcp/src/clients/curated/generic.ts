import type { ClientDefinition } from "../types";
export const generic = {
	group: "Other",
	id: "generic",
	keyTypes: ["public", "private"],
	requiresClientId: true,
	redirectUriKnown: false,
	name: "Generic MCP client",
	redirectUris: ["Use the callback URI required by the client"],
	setupNote:
		"Use a client that supports remote MCP over HTTP and OAuth 2.1. Enter the values shown below.",
	verify: "Complete OAuth and confirm the client can list the server's tools.",
} satisfies ClientDefinition;
