import { type Guide } from "../../guides/types";
import { type Evidence } from "../types";
import { screenshot } from "../../guides/screenshots";

export const antigravityMcp: Evidence = {
	method: "vendor-doc",
	label: "Antigravity MCP configuration and OAuth",
	url: "https://antigravity.google/docs/mcp",
	verifiedAt: "2026-10-17",
};
const antigravityEnterprise: Evidence = {
	method: "vendor-doc",
	label: "Antigravity in Gemini Enterprise",
	url: "https://www.antigravity.google/docs/enterprise",
	verifiedAt: "2026-10-17",
};
// Enterprise support applies to the current app and CLI, not the legacy standalone IDE.
// Google Cloud sign-in enables the tool; Canvas OAuth still uses the Canvas key separately.
export function antigravityEnterpriseGuide(personal: Guide): Guide {
	return {
		...personal,
		clientSetup: {
			requiresServerDetails: true,
			steps: [
				{
					id: "client-enterprise-signin",
					kind: "provider",
					title: "Sign in to your organization",
					content: [
						{
							kind: "list",
							items: [
								"In the Antigravity app or CLI, choose Sign in → Business account → Continue with Google Cloud.",
								"Select your organization's licensed project in the License Selector, then configure Canvas MCP below.",
							],
						},
						screenshot("cli_signin_business_account", "sign-in prompt with Business account."),
						screenshot(
							"ide_signin_business_license_selector",
							"Business account option and License Selector.",
						),
					],
				},
				...personal.steps.filter((step) => step.kind !== "canvas-key"),
			],
		},
		sources: [...personal.sources, antigravityEnterprise],
		steps: [
			{ id: "canvas-create", kind: "canvas-key", action: "create" },
			{
				id: "provider-enterprise",
				kind: "provider",
				title: "Antigravity enterprise settings",
				content: [
					{
						kind: "list",
						items: [
							"Assign users a Gemini Enterprise Standard or Plus license in the organization's Google Cloud project.",
						],
					},
					screenshot(
						"ge_ai_developer_tools_toggle",
						"AI developer tools page with toggle Enabled.",
					),
					screenshot(
						"ge_security_mcp_allowed_config",
						"Security edit panel with MCP Servers on and the Allowed server configuration field containing the Canvas entry.",
					),
					screenshot(
						"ide_blocked_by_admin_policy",
						"Customizations list showing the blocked state (for troubleshooting).",
					),
				],
			},
		],
	};
}

export const antigravityAppGuide: Guide = {
	presentation: "by-surface",
	status: "documented",
	prerequisites: [],
	sources: [antigravityMcp],
	lastVerified: "2026-10-17",
	steps: [
		{ id: "canvas-create", kind: "canvas-key", action: "create" },
		{
			id: "provider-configure",
			kind: "provider",
			title: "Antigravity — configure Canvas MCP",
			content: [
				{
					kind: "paragraph",
					text: "Merge the Canvas entry into mcpServers in ~/.gemini/config/mcp_config.json, or .agents/mcp_config.json for the current workspace.",
				},
				screenshot(
					"ide_agent_panel_menu",
					"agent side panel header with the `…` menu open and `MCP Servers` highlighted.",
				),
				screenshot(
					"ide_manage_mcp_raw_config",
					"MCP Servers view with `Manage MCP Servers` and `View raw config`.",
				),
			],
		},
		...(["public", "private"] as const).map((key) => ({
			id: `provider-configure-${key}`,
			kind: "provider" as const,
			key,
			title: "Canvas MCP configuration",
			content: [
				{
					kind: "code" as const,
					language: "json" as const,
					text: JSON.stringify(
						{
							mcpServers: {
								"canvas-mcp": {
									serverUrl: "{mcpUrl}",
									oauth: {
										clientId: "{clientId}",
										...(key === "private" ? { clientSecret: "<ENTER_CLIENT_SECRET_LOCALLY>" } : {}),
									},
								},
							},
						},
						null,
						2,
					),
				},
				screenshot(
					"ide_raw_config_canvas_entry",
					"raw config with the canvas-mcp entry, secret redacted.",
				),
			],
		})),
		{
			id: "verify",
			kind: "verify",
			title: "Authenticate the Canvas connection",
			content: [
				{
					kind: "list",
					items: [
						"Open Agent settings → Customizations and choose Authenticate next to canvas-mcp.",
						"Sign in to Canvas in the browser. Copy the returned authorization code, paste it into the settings panel, and choose Submit.",
					],
				},
				screenshot(
					"ide_user_settings_customizations",
					"Customizations tab with Installed MCP Servers and Refresh.",
				),
				screenshot(
					"ide_authenticate_paste_code",
					"Authenticate button and paste-code field with Submit.",
				),
			],
		},
	],
};
