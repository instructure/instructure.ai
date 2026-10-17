import { type Guide } from "../../guides/types";
import { type Evidence } from "../types";

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
							"In the Antigravity app or CLI, choose Sign in → Business account → Continue with Google Cloud.",
							"Select the licensed project in the License Selector, then configure the Canvas MCP connection below.",
						],
					},
				],
			},
			...personal.steps.filter((step) => step.kind !== "canvas-key"),
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
			],
		},
	],
};
