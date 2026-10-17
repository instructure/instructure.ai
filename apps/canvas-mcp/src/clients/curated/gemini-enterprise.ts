import { documented, setupGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const geminiEnterprise = {
	facts: {
		...inheritedFacts(["private"], {
			kind: "fixed",
			uris: ["https://vertexaisearch.cloud.google.com/oauth-redirect"],
			status: "documented",
			evidence: [setupGuidance],
		}),
		remoteHttp: documented("yes"),
		staticClientId: documented("yes"),
		registration: documented("static"),
		keyTypes: { public: documented("no"), private: documented("yes") },
		pkce: documented("off"),
	},
	guides: {
		enterprise: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: [
				"Discovery Engine Editor role (roles/discoveryengine.editor) in the Google Cloud project; a private Canvas key.",
			],
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-configure",
					kind: "provider",
					title: "Gemini Enterprise — create the data store",
					content: [
						{
							kind: "list",
							items: [
								"In Google Cloud console, open Gemini Enterprise → Data stores → Create data store. Search for Custom MCP Server and choose Add MCP server.",
								"Choose OAuth 2.0. MCP Server URL: {mcpUrl}; Authorization URL: {authUrl}; Token URL: {tokenUrl}.",
								"Leave Authorization URL Parameters blank. Enter Client ID {clientId} and the secret directly in Google Cloud. Scopes: {scope}. Leave Enable PKCE Support unchecked.",
								"Choose Verify Auth, sign in to Canvas and approve access, then choose Continue.",
								"Choose Multi-region, name the connector and choose Create.",
								"Open Actions on the new data store and enable the Canvas tools; no tools are enabled by default.",
							],
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Verify Gemini Enterprise",
					content: [
						{
							kind: "paragraph",
							text: "Ask a question such as “What assignments are due this week in my Canvas courses?” Complete Canvas sign-in when prompted.",
						},
					],
				},
			],
			sources: [setupGuidance],
			lastVerified: "2026-10-17",
		},
	},
	installModes: ["enterprise"],
	enterpriseSurface: "Google Cloud console",
	group: "Curated",
	id: "gemini-enterprise",
	name: "Gemini Enterprise",
	setupNote:
		"Create the MCP connection in Gemini Enterprise using its OAuth authorization and token URL fields.",
	verify: "Complete the OAuth flow and confirm the connection is available to the workspace.",
} satisfies ClientDefinition;
