import { type ClientDefinition } from "../types";
import { unknownFacts, unverified } from "../facts";
import { updatedGuidance, updatedFact } from "../evidence";
export const antigravityCli = {
	id: "antigravity-cli",
	name: "Antigravity CLI",
	group: "Curated",
	installModes: ["personal"],
	facts: {
		...unknownFacts(),
		redirectUri: {
			kind: "fixed",
			uris: ["https://antigravity.google/oauth-callback"],
			status: "documented",
			evidence: [updatedGuidance],
		},
		remoteHttp: updatedFact("yes"),
		staticClientId: updatedFact("yes"),
		registration: updatedFact("static"),
		keyTypes: { public: unverified(), private: updatedFact("yes") },
	},
	guides: {
		personal: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: [
				"Antigravity CLI installed; the supplied configuration uses a private Canvas key. Public-key support is unverified.",
			],
			sources: [updatedGuidance],
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
					title: "Antigravity CLI — configure the server",
					content: [
						{
							kind: "paragraph",
							text: "Edit .agents/mcp_config.json. If it already contains other servers, merge the canvas-mcp entry into the existing mcpServers object.",
						},
						{
							kind: "code",
							text: '{\n  "mcpServers": {\n    "canvas-mcp": {\n      "serverUrl": "{mcpUrl}",\n      "oauth": {\n        "clientId": "{clientId}",\n        "clientSecret": "<ENTER_CLIENT_SECRET_LOCALLY>"\n      }\n    }\n  }\n}',
						},
						{
							kind: "paragraph",
							text: "Enter the secret only in your local configuration. Keep the file out of source control. Antigravity discovers OAuth endpoints from the MCP server metadata.",
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Authenticate in Antigravity CLI",
					content: [
						{
							kind: "list",
							items: [
								"Start a new session with agy.",
								"Open /mcp, select canvas-mcp and choose Authenticate.",
								"Sign in to Canvas in the browser and approve access. Reopen /mcp to confirm the connection.",
							],
						},
					],
				},
			],
		},
	},
	setupNote: "Use the source-backed CLI guide and confirm any unverified OAuth requirements.",
	verify: "Authenticate and confirm the server in /mcp.",
	rulesyncTarget: "antigravity-cli",
} satisfies ClientDefinition;
