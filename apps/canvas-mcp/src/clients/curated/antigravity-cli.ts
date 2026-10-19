import { type Guide } from "../../guides/types";
import { antigravityEnterpriseGuide } from "./antigravity-guides";
import { antigravityCliCommands } from "./antigravity-cli-commands";
import { type ClientDefinition } from "../types";
import { unknownFacts, unverified } from "../facts";
import { updatedGuidance, updatedFact } from "../evidence";
import { canvasAuthorizationScreenshot, screenshot } from "../../guides/screenshots";
const antigravityCliGuide: Guide = {
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
			content: [
				{
					kind: "paragraph",
					text: "Configure `.agents/mcp_config.json` with the command or manual JSON below. If it already contains other servers, preserve them when adding the canvas-mcp entry.",
				},
				{
					kind: "paragraph",
					text: "Antigravity discovers OAuth endpoints from the MCP server metadata.",
				},
			],
		},
		...(["public", "private"] as const).map((key) => ({
			id: `provider-configure-${key}`,
			kind: "provider" as const,
			key,
			content: [
				antigravityCliCommands(key),
				{
					kind: "paragraph" as const,
					text:
						"Manual alternative (no extra tools): merge this entry into your configuration instead. Do not replace existing servers." +
						(key === "private" ? " Keep private-key configuration out of source control." : ""),
				},
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
					"agy_cli_mcp_config_canvas_entry",
					key === "private"
						? "terminal editor showing the entry, secret redacted."
						: "terminal editor showing the public-client entry without a client secret.",
				),
				{
					kind: "paragraph" as const,
					text:
						key === "private"
							? "Enter the secret only in your local configuration. Keep the file out of source control."
							: "",
				},
				{
					kind: "paragraph" as const,
					text: "A successful run will output `Updated .agents/mcp_config.json` to the terminal.",
				},
			],
		})),
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
				screenshot(
					"cli_mcp_manager_overlay",
					"overlay listing canvas-mcp with status Auth Needed.",
				),
				screenshot("cli_mcp_authenticate_option", "server detail with Authenticate selected."),
				canvasAuthorizationScreenshot(),
				screenshot("cli_auth_url_and_code_prompt", "terminal showing URL and code prompt."),
			],
		},
	],
};
const canvasAuthBlocker =
	"Antigravity CLI (agy) currently fails to connect to Canvas MCP: initialization returns Unauthorized (No authorization header provided).";
export const antigravityCli = {
	id: "antigravity-cli",
	name: "Antigravity CLI",
	provider: "Google",
	group: "Curated",
	installModes: ["personal", "enterprise"],
	enterpriseSurface: "Google Cloud console",
	status: {
		kind: "known-issue",
		reason: canvasAuthBlocker,
		diagnostic:
			'✗ canvas-mcp  error: calling "initialize": sending "initialize": No authorization header provided: rejected by transport: Unauthorized',
	},
	blocker: {
		reason: canvasAuthBlocker,
		evidence: [
			{
				method: "probe",
				label:
					"Reported agy initialization failure and unauthenticated Canvas MCP response; OAuth root cause unconfirmed",
				version: "agy 1.4.2",
				verifiedAt: "2026-10-19",
			},
		],
	},
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
		personal: antigravityCliGuide,
		enterprise: antigravityEnterpriseGuide(antigravityCliGuide),
	},
	setupNote: "Use the source-backed CLI guide.",
	verify: "Authenticate and confirm the server in /mcp.",
	rulesyncTarget: "antigravity-cli",
} satisfies ClientDefinition;
