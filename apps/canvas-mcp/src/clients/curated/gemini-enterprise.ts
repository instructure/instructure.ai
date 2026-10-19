import { documented, setupGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
import { canvasAuthorizationScreenshot, screenshot } from "../../guides/screenshots";
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
			clientSetup: {
				requiresServerDetails: false,
				steps: [
					{
						id: "client-connect",
						kind: "provider",
						title: "Use the Canvas connector",
						content: [
							{
								kind: "list",
								items: [
									"Open Gemini Enterprise in your organization account.",
									"Ask Gemini to list your Canvas courses using the Canvas connector.",
									"Complete Canvas sign-in when prompted.",
								],
							},
							screenshot("ge_chat_home", "Open the Gemini Enterprise app, start a chat."),
							screenshot(
								"ge_chat_toggle_connector",
								"Enable the Canvas data store/connector in the chat input area (label unverified).",
							),
							canvasAuthorizationScreenshot(),
							screenshot("ge_chat_canvas_result", "Canvas courses result in chat."),
						],
					},
				],
			},
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
						screenshot("gcp_orgpolicy_override", "constraint set to Not enforced."),
						screenshot(
							"canvas_key_redirect_uri_gemini",
							"Canvas key with the vertexaisearch redirect.",
						),
						screenshot("ge_data_stores_list", "Data stores page with Create data store."),
						screenshot("ge_select_custom_mcp", "the card."),
						screenshot("ge_mcp_oauth_form", "filled form, secret masked."),
						screenshot("ge_verify_auth", "success state."),
						screenshot("ge_connector_name_region", "connector name and region selection."),
						screenshot("ge_data_store_active", "data store state active."),
						screenshot("ge_actions_enable", "action list with Enable actions."),
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
	provider: "Google",
	group: "Curated",
	id: "gemini-enterprise",
	name: "Gemini Web / Desktop",
	setupNote:
		"Create the MCP connection in Gemini Enterprise using its OAuth authorization and token URL fields.",
	verify: "Complete the OAuth flow and confirm the connection is available to the workspace.",
} satisfies ClientDefinition;
