import { updatedGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const generic = {
	facts: inheritedFacts(["public", "private"], { kind: "unverified" }),
	installModes: ["personal"],
	guides: {
		personal: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: ["A client supporting remote HTTP MCP with preconfigured OAuth credentials."],
			sources: [updatedGuidance],
			lastVerified: "2026-10-17",
			steps: [
				{ id: "canvas-create", kind: "canvas-key", action: "create" },
				{
					id: "provider-configure",
					kind: "provider",
					title: "Configure the client",
					content: [
						{
							kind: "paragraph",
							text: "Use the connection fields below. The MCP server and Canvas OAuth endpoints use different hosts. Public keys require PKCE (S256); private keys must send the client secret, with PKCE optional. Register the client's exact redirect URI on the Canvas key before connecting.",
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Verify the connection",
					content: [
						{
							kind: "paragraph",
							text: "Complete Canvas sign-in and confirm the client can list the Canvas MCP tools.",
						},
					],
				},
			],
		},
	},
	group: "Other",
	id: "generic",
	name: "Generic MCP client",
	setupNote:
		"Use a client that supports remote MCP over HTTP and OAuth 2.1. Enter the values shown below.",
	verify: "Complete OAuth and confirm the client can list the server's tools.",
} satisfies ClientDefinition;
