import { type Guide } from "../../guides/types";
import { updatedGuidance } from "../evidence";
import { type Evidence, type ClientDefinition } from "../types";
import { unknownFacts } from "../facts";
import { screenshot } from "../../guides/screenshots";
const chatgptApps: Evidence = {
	method: "vendor-doc",
	label: "ChatGPT custom MCP apps and workspace administration",
	url: "https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt",
	verifiedAt: "2026-10-17",
};
function chatgptGuide(enterprise: boolean): Guide {
	return {
		presentation: "by-surface",
		...(enterprise
			? {
					clientSetup: {
						requiresServerDetails: false,
						steps: [
							{
								id: "client-connect",
								kind: "provider" as const,
								title: "Use the workspace Canvas app",
								content: [
									{
										kind: "list" as const,
										items: [
											"In a new ChatGPT conversation, select the Canvas MCP app published by your workspace.",
											"Connect the app and complete Canvas sign-in when prompted.",
											"Ask ChatGPT to list your Canvas courses.",
										],
									},
								],
							},
						],
					},
				}
			: {}),
		status: "documented",
		prerequisites: [],
		sources: [chatgptApps],
		lastVerified: "2026-10-17",
		steps: [
			{ id: "canvas-create", kind: "canvas-key", action: "create" },
			{
				id: "provider-configure",
				kind: "provider",
				title: enterprise ? "ChatGPT — create a workspace app" : "ChatGPT — create a custom app",
				content: [
					{
						kind: "list",
						items: [
							enterprise
								? "In ChatGPT web, open Workspace settings → Apps → Create as an admin or owner."
								: "In ChatGPT web, open Settings → Apps → Create.",
							"Name the app Canvas MCP and enter the MCP endpoint {mcpUrl}.",
							"Choose OAuth authentication and enter the Canvas connection fields in the app's OAuth settings.",
							"Choose Scan Tools, complete Canvas sign-in, then choose Create to save the draft.",
						],
					},
					screenshot(
						"chatgpt_plugins_add_custom_mcp",
						"Plugins page with plus button menu showing Add custom MCP server.",
					),
					screenshot(
						"chatgpt_custom_mcp_connection",
						"form with name, description, Server URL filled with the Canvas MCP URL.",
					),
					screenshot(
						"chatgpt_oauth_advanced_settings",
						"OAuth selected, advanced settings expanded showing registration method, Client ID, Client Secret, token auth method, and the displayed callback URL.",
					),
					screenshot(
						"chatgpt_risk_warning_create",
						"risk warning checkbox/button and Create as a plugin button.",
					),
				],
			},
			...(enterprise
				? [
						{
							id: "provider-publish",
							kind: "provider" as const,
							title: "ChatGPT — publish the workspace app",
							content: [
								{
									kind: "list" as const,
									items: [
										"Test the draft app, then open Workspace settings → Apps → Drafts and choose Publish.",
										"Use Configure Actions to select the Canvas tools and Configure Access to select the workspace groups, then publish the app.",
									],
								},
								screenshot(
									"chatgpt_admin_drafts_publish",
									"Workspace settings > Apps > Drafts with Publish for the Canvas MCP draft.",
								),
								screenshot(
									"chatgpt_admin_configure_actions_access",
									"Configure Actions and Configure Access dialogs.",
								),
								screenshot(
									"chatgpt_admin_permissions_create_mcp",
									"Permissions & roles showing the Create plugins with MCPs toggle.",
								),
							],
						},
					]
				: []),
			{
				id: "verify",
				kind: "verify",
				title: "Use Canvas in ChatGPT",
				content: [
					{
						kind: "paragraph",
						text: "Select the Canvas MCP app in a new chat and ask it to list your Canvas courses.",
					},
					screenshot(
						"chatgpt_plugin_tools_list",
						"plugin details page listing discovered Canvas tools with toggles and Refresh.",
					),
				],
			},
		],
	};
}
// Workspace app administration is documented independently of Canvas interoperability.
// The supplied Instructure guidance records a Canvas authentication bug; keep the
// connection action blocked until a successful retest, while showing admin setup.
// Exact redirect URI and key compatibility remain unknown, not inferred from Codex.
const canvasAuthBlocker =
	"ChatGPT cannot currently complete Canvas MCP authentication because of a Canvas MCP bug. Setup instructions are pending a fix.";
export const chatgpt = {
	id: "chatgpt",
	name: "ChatGPT",
	provider: "OpenAI",
	group: "Curated",
	facts: unknownFacts(),
	status: { kind: "known-issue", reason: canvasAuthBlocker },
	blocker: {
		reason: canvasAuthBlocker,
		evidence: [updatedGuidance],
	},
	guides: { personal: chatgptGuide(false), enterprise: chatgptGuide(true) },
	installModes: ["personal", "enterprise"],
	enterpriseSurface: "ChatGPT workspace settings",
	setupNote: "Create a custom Canvas MCP app in ChatGPT.",
	verify: "Complete OAuth and confirm the Canvas MCP tools are available.",
} satisfies ClientDefinition;
