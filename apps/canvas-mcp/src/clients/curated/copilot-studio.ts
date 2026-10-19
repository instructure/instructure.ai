// The Accept-header policy is the workaround supplied in the September setup guidance.
// Recheck its necessity against Copilot releases; keep that maintenance note out of the guide.
import { documented, setupGuidance, updatedGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
import { canvasAuthorizationScreenshot, screenshot } from "../../guides/screenshots";
export const copilotStudio = {
	facts: {
		...inheritedFacts(["private"], {
			kind: "client-generated",
			where: "Copilot Studio generates the redirect URI when the connector is saved.",
			evidence: [setupGuidance],
		}),
		remoteHttp: documented("yes"),
		staticClientId: documented("yes"),
		registration: documented("static"),
		keyTypes: { public: documented("no"), private: documented("yes") },
	},
	guides: {
		enterprise: {
			clientSetup: {
				requiresServerDetails: false,
				steps: [
					{
						id: "client-connect",
						kind: "provider",
						title: "Use the configured agent",
						content: [
							{
								kind: "list",
								items: [
									"Open the agent that your organization configured with the Canvas MCP tools.",
									"Ask the agent to list your Canvas courses.",
									"Complete Canvas sign-in when prompted.",
								],
							},
							canvasAuthorizationScreenshot(),
						],
					},
				],
			},
			presentation: "interleaved",
			status: "documented",
			prerequisites: [
				"Permission to create tools/connectors for the agent; a private Canvas developer key.",
			],
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-save",
					kind: "provider",
					title: "Copilot Studio — configure and save the connector",
					content: [
						{
							kind: "list",
							items: [
								"Use the classic Copilot Studio experience. Open your agent → Tools → Add a tool → New tool → Model Context Protocol.",
								"Enter a name, a description of the Canvas tools, and Server URL {mcpUrl}.",
								"Choose OAuth 2.0 with Manual discovery. Enter Client ID {clientId} and enter the secret directly in Copilot Studio.",
								"Authorization URL: {authUrl}. Token URL and Refresh URL: {tokenUrl}. Scope: {scope}.",
								"Save the connector and copy its generated redirect URI. Add it to the Canvas key in the next step before signing in.",
							],
						},
						screenshot("copilot_tools_page", 'agent Tools page with "Add a tool" button visible.'),
						screenshot("copilot_new_tool_menu", 'Add a tool panel with "New tool" option.'),
						screenshot(
							"copilot_mcp_wizard_blank",
							"wizard with Server name, Server description, Server URL, authentication type.",
						),
						screenshot("copilot_mcp_wizard_basics", "three basic fields filled in."),
						screenshot("copilot_oauth_type_manual", "OAuth 2.0 with Type = Manual selected."),
						screenshot("copilot_manual_oauth_fields", "all six fields filled (secret masked)."),
						screenshot(
							"copilot_callback_url",
							"callback URL shown after Create, with copy control.",
						),
					],
				},
				{
					id: "canvas-update-redirect",
					kind: "canvas-key",
					action: "update-redirect",
				},
				{
					id: "provider-policy",
					kind: "provider",
					title: "Copilot Studio — check the temporary Accept-header workaround",
					content: [
						{
							kind: "list",
							items: [
								"In Tools, open the connector → Edit → Definition → Policies → New policy.",
								"Choose Set HTTP Header; select InvokeServer under Operations.",
								"Set header name accept and value text/event-stream. Choose append if the header exists and run the policy on Request.",
								"Choose Update Connector to save.",
							],
						},
						screenshot(
							"ppac_data_policy_list",
							"PPAC Security > Data and privacy > Data policy list.",
						),
						screenshot(
							"ppac_assign_connectors",
							"Assign connectors page with custom connector in Business group.",
						),
						screenshot(
							"copilot_channels_teams",
							"Channels page with Teams and Microsoft Copilot tile and Add channel.",
						),
						screenshot(
							"copilot_agent_auth_settings",
							"Settings > Security > Authentication with Authenticate with Microsoft.",
						),
					],
				},
				{
					id: "provider-add-tool",
					kind: "provider",
					audience: "server",
					title: "Copilot Studio — add the connector to the agent",
					content: [
						{
							kind: "paragraph",
							text: "After saving the generated redirect URI on the Canvas key, add the connector as a tool to the agent.",
						},
						canvasAuthorizationScreenshot(),
						screenshot("copilot_tool_added", "MCP tool listed under agent Tools."),
					],
				},
			],
			sources: [updatedGuidance],
			lastVerified: "2026-10-17",
		},
	},
	installModes: ["enterprise"],
	enterpriseSurface: "Copilot Studio",
	provider: "Microsoft",
	group: "Curated",
	id: "copilot-studio",
	name: "Copilot Studio",
	setupNote:
		"Create the MCP connection in Copilot Studio and register the redirect URI generated by that connection.",
	verify: "Finish the connection test and confirm the MCP tools are available to the agent.",
} satisfies ClientDefinition;
