import { documented, setupGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
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
			prerequisites: ["A Claude account with custom connector access."],
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
								"Open Customize → Connectors, select +, then Add custom connector.",
								"Enter the MCP server URL: {mcpUrl}.",
								"Open Advanced settings and enter Client ID {clientId}. Leave Client Secret blank for a public key; for a private key enter the secret directly in Claude.",
								"Choose Add, then Connect. Sign in to Canvas and approve access.",
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
			sources: [setupGuidance],
			lastVerified: "2026-10-17",
		},
		enterprise: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: ["An organization Owner adds the connector before members connect."],
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-configure",
					kind: "provider",
					title: "Claude organization — configure the connector",
					content: [
						{
							kind: "list",
							items: [
								"An organization Owner opens Organization settings → Connectors and chooses Add → Custom → Web.",
								"Enter the MCP server URL: {mcpUrl}, open Advanced settings and enter Client ID {clientId}.",
								"For a public key leave Client Secret blank. For a private key only the Owner enters the secret; members never need it.",
								"Choose Add. Members then open Customize → Connectors and choose Connect to sign in to Canvas.",
							],
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Verify as a member",
					content: [
						{
							kind: "paragraph",
							text: "In a new chat, ask Claude to list your Canvas courses. Each member uses their own Canvas account and permissions.",
						},
					],
				},
			],
			sources: [setupGuidance],
			lastVerified: "2026-10-17",
		},
	},
	installModes: ["personal", "enterprise"],
	enterpriseSurface: "Claude organization settings",
	group: "Curated",
	id: "claude-ai",
	name: "Claude.ai / Claude Desktop",
	setupNote: "Add a remote MCP server in Claude and follow its OAuth sign-in flow.",
	verify:
		"The server appears as connected in Claude and its tools are available in a new conversation.",
} satisfies ClientDefinition;
