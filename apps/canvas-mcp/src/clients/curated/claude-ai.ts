import { documented, setupGuidance, updatedGuidance } from "../evidence";
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
			prerequisites: ["Claude Pro or Max with custom connector access."],
			sources: [updatedGuidance, setupGuidance],
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
								"Open Customize → Connectors, choose +, then Add custom connector.",
								"Enter the MCP server URL: {mcpUrl}.",
								"Open Advanced settings and enter Client ID {clientId}. Public is preferred: leave Client Secret blank. If using the private-key alternative from the setup guidance, enter the secret directly in Claude.",
								"Choose Add and complete Canvas sign-in when prompted.",
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
			presentation: "by-surface",
			status: "pending",
			prerequisites: [
				"On Team and Enterprise, an organization Owner adds the connector before members connect.",
			],
			sources: [updatedGuidance],
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-pending",
					kind: "provider",
					title: "Claude organization setup",
					content: [
						{
							kind: "paragraph",
							text: "Detailed corporate setup instructions are not available in the updated guidance yet. Confirm the organization connector flow with your administrator before connecting.",
						},
					],
				},
			],
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
