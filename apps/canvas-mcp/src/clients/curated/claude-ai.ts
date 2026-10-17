import { documented, setupGuidance, updatedGuidance } from "../evidence";
import { type Evidence, type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
const claudeConnectors: Evidence = {
	method: "vendor-doc",
	label: "Claude custom connectors — individual and organization setup",
	url: "https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp",
	verifiedAt: "2026-10-17",
};
// Current vendor instructions supersede the supplied guide's missing corporate section.
// Canvas uses a pre-registered client: select "Use your own OAuth client", not automatic registration.
export const claudeAi = {
	facts: {
		...inheritedFacts(["public", "private"], {
			kind: "fixed",
			uris: ["https://claude.ai/api/mcp/auth_callback"],
			status: "documented",
			evidence: [setupGuidance],
		}),
		remoteHttp: documented("yes"),
		staticClientId: documented("yes"),
		registration: documented("static"),
		keyTypes: { public: documented("yes"), private: documented("yes") },
	},
	guides: {
		personal: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: ["Claude Pro or Max with custom connector access."],
			sources: [updatedGuidance, setupGuidance, claudeConnectors],
			lastVerified: "2026-10-17",
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-configure",
					kind: "provider",
					title: "Claude — add the connector",
					content: [
						{
							kind: "list",
							items: [
								"In Customize → Connectors, choose + Add → Add custom connector.",
								"Name it Canvas MCP, enter {mcpUrl}, then Continue.",
								"Review authentication, continue, and choose Sign in when needed.",
								"Choose Use your own OAuth client. Enter Client ID {clientId}; leave the secret blank for a public key, or enter the Canvas secret for a private key.",
								"Choose Add, then connect and sign in to Canvas.",
							],
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Verify in a new chat",
					content: [
						{
							kind: "paragraph",
							text: "Start a new chat and ask Claude to list your Canvas courses.",
						},
					],
				},
			],
		},
		enterprise: {
			clientSetup: {
				requiresServerDetails: false,
				steps: [
					{
						id: "client-connect",
						kind: "provider",
						title: "Connect to the organization connector",
						content: [
							{
								kind: "list",
								items: [
									"Open Customize \u2192 Connectors and find the Canvas MCP connector added by your organization.",
									"Choose Connect and complete Canvas sign-in.",
									"Start a new chat and ask Claude to list your Canvas courses.",
								],
							},
						],
					},
				],
			},
			presentation: "by-surface",
			status: "documented",
			prerequisites: [
				"On Team and Enterprise, an organization Owner adds the connector before members connect.",
			],
			sources: [updatedGuidance, claudeConnectors],
			lastVerified: "2026-10-17",
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-configure",
					kind: "provider",
					title: "Claude organization setup",
					content: [
						{
							kind: "list",
							items: [
								"In Organization settings → Connectors, choose Add → Custom → Web.",
								"Name it Canvas MCP and enter {mcpUrl}. Continue through authentication settings.",
								"Choose Sign in when needed and Use your own OAuth client.",
								"Enter Client ID {clientId}. Leave the secret blank for a public key; enter the Canvas secret for a private key.",
								"Choose Add. Members then open Customize → Connectors → Canvas MCP → Connect and sign in to Canvas.",
							],
						},
					],
				},
			],
		},
	},
	installModes: ["personal", "enterprise"],
	enterpriseSurface: "Claude organization settings",
	provider: "Anthropic",
	group: "Curated",
	id: "claude-ai",
	name: "Claude.ai / Claude Desktop",
	setupNote: "Add a remote MCP server in Claude and follow its OAuth sign-in flow.",
	verify:
		"The server appears as connected in Claude and its tools are available in a new conversation.",
} satisfies ClientDefinition;
