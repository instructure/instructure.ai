import { type Evidence, type ClientDefinition } from "../types";
import { type Guide } from "../../guides/types";
import { unknownFacts } from "../facts";
import { updatedGuidance } from "../evidence";
import { screenshot } from "../../guides/screenshots";
const geminiOAuth: Evidence = {
	method: "vendor-doc",
	label: "Gemini CLI MCP OAuth configuration",
	url: "https://geminicli.com/docs/tools/mcp-server/",
	verifiedAt: "2026-10-17",
};
const enterpriseControls: Evidence = {
	method: "vendor-doc",
	label: "Gemini CLI enterprise MCP allowlists and required servers",
	url: "https://geminicli.com/docs/admin/enterprise-controls/",
	verifiedAt: "2026-10-17",
};
const requiredServerSchema: Evidence = {
	method: "source",
	label: "Gemini CLI required-server OAuth schema (no fixed redirect URI)",
	url: "https://github.com/google-gemini/gemini-cli/blob/ed96faedfd5571f055c44f2c9509d62321d1138d/packages/core/src/code_assist/types.ts",
	version: "ed96faedfd5571f055c44f2c9509d62321d1138d",
	verifiedAt: "2026-10-17",
};
const supported = { value: "yes", status: "documented", evidence: [geminiOAuth] } as const;
// Vendor docs resolve the supplied guide's key-type conflict: public clients omit clientSecret;
// private clients supply it. Pin redirectUri because the default listener port is random.
// Docs/source verification does not establish a live Canvas OAuth success.
const personalGuide: Guide = {
	presentation: "by-surface",
	status: "documented",
	prerequisites: ["Gemini CLI access for your account and callback port 8081."],
	sources: [updatedGuidance, geminiOAuth],
	lastVerified: "2026-10-17",

	steps: [
		{
			id: "canvas-create",
			kind: "canvas-key",
			action: "create",
		},
		{
			id: "provider-register-public",
			kind: "provider",
			key: "public",
			title: "Gemini CLI — configure the server",
			content: [
				{
					kind: "paragraph",
					text: "Merge this entry into mcpServers in ~/.gemini/settings.json.",
				},
				{
					kind: "code",
					language: "json",
					text: '{\n  "mcpServers": {\n    "canvas-mcp": {\n      "httpUrl": "{mcpUrl}",\n      "oauth": {\n        "enabled": true,\n        "clientId": "{clientId}",\n        "authorizationUrl": "{authUrl}",\n        "tokenUrl": "{tokenUrl}",\n        "scopes": ["{scope}"],\n        "redirectUri": "http://localhost:8081/oauth/callback"\n      }\n    }\n  }\n}',
				},
				screenshot(
					"canvas_key_redirect_uri",
					"Canvas developer key with the localhost callback in Redirect URIs.",
				),
				screenshot(
					"gemini_cli_settings_json",
					"settings.json with the canvas-mcp entry (secret redacted).",
				),
			],
		},
		{
			id: "provider-register-private",
			kind: "provider",
			key: "private",
			title: "Gemini CLI — configure the server",
			content: [
				{
					kind: "paragraph",
					text: "Merge this entry into mcpServers in ~/.gemini/settings.json.",
				},
				{
					kind: "code",
					language: "json",
					text: '{\n  "mcpServers": {\n    "canvas-mcp": {\n      "httpUrl": "{mcpUrl}",\n      "oauth": {\n        "enabled": true,\n        "clientId": "{clientId}",\n        "clientSecret": "<CANVAS_CLIENT_SECRET>",\n        "authorizationUrl": "{authUrl}",\n        "tokenUrl": "{tokenUrl}",\n        "scopes": ["{scope}"],\n        "redirectUri": "http://localhost:8081/oauth/callback"\n      }\n    }\n  }\n}',
				},
				{
					kind: "paragraph",
					text: "Replace <CANVAS_CLIENT_SECRET> directly in your local settings file with the Canvas key secret.",
				},
			],
		},
		{
			id: "verify",
			kind: "verify",
			title: "Authenticate in Gemini CLI",
			content: [
				{
					kind: "list",
					items: [
						"Start a session with gemini.",
						"Run /mcp auth canvas-mcp, then sign in to Canvas and approve access.",
						"Open /mcp to confirm the connection.",
					],
				},
				screenshot(
					"gemini_cli_mcp_auth",
					"terminal after `/mcp auth canvas-mcp` showing browser prompt.",
				),
				screenshot("canvas_consent_screen", "Canvas authorize page."),
				screenshot("gemini_cli_mcp_list", "/mcp output with canvas-mcp and tool list."),
			],
		},
	],
};
export const geminiCli = {
	id: "gemini-cli",
	name: "Gemini CLI",
	provider: "Google",
	group: "Curated",
	status: {
		kind: "known-issue",
		reason:
			"Gemini CLI was replaced by Antigravity CLI for unpaid-tier and Google One users on June 18, 2026. Use Antigravity CLI unless your account is eligible for Gemini CLI Enterprise.",
		installModes: ["personal"],
	},
	installModes: ["personal", "enterprise"],
	enterpriseSurface: "Gemini CLI enterprise controls",
	facts: {
		...unknownFacts(),
		redirectUri: {
			kind: "fixed",
			uris: ["http://localhost:8081/oauth/callback"],
			status: "documented",
			evidence: [updatedGuidance, geminiOAuth],
		},
		remoteHttp: { ...supported, evidence: [geminiOAuth] },
		staticClientId: { ...supported, evidence: [geminiOAuth] },
		registration: { value: "both", status: "documented", evidence: [geminiOAuth] },
		keyTypes: {
			public: { ...supported, evidence: [geminiOAuth] },
			private: { ...supported, evidence: [geminiOAuth] },
		},
	},
	guides: {
		personal: personalGuide,
		enterprise: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: [
				"Administrator access to Gemini CLI enterprise controls in the Management Console.",
			],
			sources: [updatedGuidance, geminiOAuth, enterpriseControls, requiredServerSchema],
			lastVerified: "2026-10-17",
			steps: [
				{ id: "canvas-create", kind: "canvas-key", action: "create" },
				{
					id: "provider-allowlist",
					kind: "provider",
					title: "Approve Canvas MCP in enterprise controls",
					content: [
						{
							kind: "list",
							items: [
								"In the Gemini CLI Management Console, enable MCP for the intended users. Enterprise MCP access is disabled by default.",
								"Add canvas-mcp to the MCP Servers allowlist (preview) using the policy entry below. Keep the name canvas-mcp: policy and local configuration are matched by name.",
								"Merge with the organization's existing approved servers. Once the allowlist is nonempty, other locally configured servers not listed are ignored.",
							],
						},
						{
							kind: "code",
							language: "json",
							text: '{\n  "mcpServers": {\n    "canvas-mcp": {\n      "url": "{mcpUrl}",\n      "type": "http",\n      "trust": false\n    }\n  }\n}',
						},
						screenshot("gemini_cli_console_mcp_toggle", "MCP setting enabled)."),
						screenshot("gemini_cli_console_allowlist", "allowlist entry)."),
						{
							kind: "paragraph",
							text: "The allowlist approves the server but does not install it. Each user's local configuration supplies the Canvas OAuth Client ID, endpoints, scopes, and fixed redirect URI. Keep trust false so tool execution still requires user approval.",
						},
						{
							kind: "paragraph",
							text: "Do not add canvas-mcp to Required MCP Servers for this workflow. Required servers replace the local definition, and their current OAuth policy schema does not accept redirectUri. Canvas needs the registered http://localhost:8081/oauth/callback; letting the CLI choose a random callback port would not match that registration.",
						},
						{
							kind: "link",
							label: "Open Gemini CLI Management Console",
							url: "https://goo.gle/manage-gemini-cli",
						},
					],
				},
				{
					id: "provider-distribute",
					kind: "provider",
					title: "Distribute the client configuration",
					content: [
						{
							kind: "paragraph",
							text: "Share the client setup link with the same enterprise install mode and selected Canvas key type. Users merge the provided canvas-mcp entry into ~/.gemini/settings.json, or your device-management tooling can deliver that same local configuration. An allowlisted server must also exist locally to load.",
						},
					],
				},
				{
					id: "provider-private-secret",
					kind: "provider",
					key: "private",
					title: "Deliver the private client secret separately",
					content: [
						{
							kind: "paragraph",
							text: "Use your organization's approved secret-delivery process for the Canvas key secret. Users replace the placeholder only in their local settings file. Do not put secrets in the setup link, allowlist policy, or a shared JSON file. For deployment without a client secret, turn off Private key and use a public Canvas key.",
						},
					],
				},
				{
					id: "provider-validate",
					kind: "provider",
					title: "Validate the enterprise rollout",
					content: [
						{
							kind: "list",
							items: [
								"Pilot the policy and matching local configuration with a managed user account before wider deployment.",
								"Start Gemini CLI and confirm canvas-mcp appears in /mcp. Complete /mcp auth canvas-mcp with the pilot user's Canvas account.",
								"Confirm the browser returns to http://localhost:8081/oauth/callback and Canvas tools are available before sharing the setup link broadly.",
							],
						},
					],
				},
			],
			clientSetup: {
				requiresServerDetails: true,
				steps: [
					{
						id: "client-enterprise",
						kind: "provider",
						title: "Set up your organization's approved Canvas connection",
						content: [
							{
								kind: "paragraph",
								text: "Your administrator must enable MCP and approve canvas-mcp for your account. Approval alone does not install the server: merge the configuration below into ~/.gemini/settings.json unless your organization has already delivered it. Keep the name canvas-mcp and the fixed callback URI.",
							},
							{
								kind: "paragraph",
								text: "If the server is missing or blocked after configuration, contact your administrator. Do not bypass enterprise policy or change the managed endpoint.",
							},
						],
					},
					{
						id: "client-private-secret",
						kind: "provider",
						key: "private",
						title: "Obtain the private client secret",
						content: [
							{
								kind: "paragraph",
								text: "Obtain the Canvas key secret through your organization's approved process. Replace <CANVAS_CLIENT_SECRET> only in your local settings file; do not put the secret in a setup link or send it in chat.",
							},
						],
					},
					...personalGuide.steps.filter((step) => step.kind !== "canvas-key"),
				],
			},
		},
	},
	setupNote:
		"Configure the Canvas MCP server in Gemini CLI settings and authenticate with /mcp auth.",
	verify: "Authenticate and confirm the server in /mcp.",
} satisfies ClientDefinition;
