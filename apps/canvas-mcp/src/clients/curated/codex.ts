import { type Guide } from "../../guides/types";
import { documented, updatedGuidance } from "../evidence";
import { type Evidence, type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
const codexOAuth: Evidence = {
	method: "vendor-doc",
	label: "Codex OAuth registration and callbacks",
	url: "https://learn.chatgpt.com/docs/extend/mcp",
	verifiedAt: "2026-10-17",
};
const codexManaged: Evidence = {
	method: "vendor-doc",
	label: "Codex enterprise managed configuration",
	url: "https://learn.chatgpt.com/docs/enterprise/managed-configuration",
	verifiedAt: "2026-10-17",
};
const codexPersonalGuide: Guide = {
	presentation: "by-surface",
	status: "documented",
	prerequisites: [
		"Codex CLI or IDE extension installed and signed in; public Canvas key and callback port 8081.",
	],
	sources: [updatedGuidance, codexOAuth],
	lastVerified: "2026-10-17",
	steps: [
		{
			id: "canvas-create",
			kind: "canvas-key",
			action: "create",
		},
		{
			id: "provider-register",
			kind: "provider",
			key: "public",
			title: "Codex — register the server",
			content: [
				{
					kind: "paragraph",
					text: "The CLI and IDE extension share this configuration.",
				},
				{
					kind: "code",
					language: "bash",
					text: 'codex -c mcp_oauth_callback_port=8081 -c \'mcp_oauth_callback_url="http://localhost:8081/callback"\' mcp add canvas-mcp --url "{mcpUrl}" --oauth-client-id "{clientId}"',
				},
			],
		},
		{
			id: "provider-register-private",
			kind: "provider",
			key: "private",
			title: "Codex — register the server",
			content: [
				{
					kind: "paragraph",
					text: "Set CANVAS_CLIENT_SECRET in your terminal to the Canvas key secret, then run:",
				},
				{
					kind: "code-group",
					variants: {
						mac: {
							language: "bash",
							text: `codex -c mcp_oauth_callback_port=8081 -c 'mcp_oauth_callback_url="http://localhost:8081/callback"' mcp add canvas-mcp --url "{mcpUrl}" --oauth-client-id "{clientId}" --oauth-client-secret "$CANVAS_CLIENT_SECRET"`,
						},
						windows: {
							language: "powershell",
							text: `codex -c mcp_oauth_callback_port=8081 -c 'mcp_oauth_callback_url="http://localhost:8081/callback"' mcp add canvas-mcp --url "{mcpUrl}" --oauth-client-id "{clientId}" --oauth-client-secret "$env:CANVAS_CLIENT_SECRET"`,
						},
					},
				},
			],
		},
		{
			id: "provider-login",
			kind: "provider",
			audience: "client",
			title: "Sign in to Canvas",
			content: [
				{
					kind: "paragraph",
					text: "If sign-in does not start automatically, run:",
				},
				{
					kind: "code",
					language: "bash",
					text: 'codex -c mcp_oauth_callback_port=8081 -c \'mcp_oauth_callback_url="http://localhost:8081/callback"\' mcp login canvas-mcp --scopes "{scope}"',
				},
			],
		},
		{
			id: "verify",
			kind: "verify",
			title: "Validate the configuration",
			content: [
				{
					kind: "code",
					language: "bash",
					text: "codex mcp get canvas-mcp",
				},
				{
					kind: "paragraph",
					text: "In a Codex session, open /mcp to confirm the server and its sign-in status.",
				},
			],
		},
	],
};
// Maple 6368cd5b58b7a3f9d4c004c46f8779712cdb0d14, src/controllers/well-known.controller.ts:
// authorization-server metadata omits authorization_response_iss_parameter_supported.
// Codex therefore appends the server-specific callback ID. Recheck if Maple adds RFC 9207.
// This is source/documentation evidence, not a successful live Canvas OAuth probe.
export const codex = {
	facts: {
		...inheritedFacts(["public", "private"], {
			kind: "computed",
			recipe: "codex-callback-id",
			base: "http://localhost:8081/callback",
			mode: "per-server",
			evidence: [
				{
					method: "source",
					label: "Codex callback ID algorithm",
					url: "https://github.com/openai/codex/blob/9be8d6e1c3dbb145d2d7ac3ba46729340e6d8d40/codex-rs/rmcp-client/src/oauth_callback.rs",
					version: "9be8d6e1c3dbb145d2d7ac3ba46729340e6d8d40",
					verifiedAt: "2026-10-17",
				},
				codexOAuth,
				{
					method: "source",
					label: "Maple authorization-server metadata (no RFC 9207 flag)",
					version: "6368cd5b58b7a3f9d4c004c46f8779712cdb0d14",
					verifiedAt: "2026-10-17",
				},
			],
		}),
		remoteHttp: documented("yes"),
		staticClientId: documented("yes"),
		registration: documented("static"),
		keyTypes: {
			public: documented("yes"),
			private: { value: "yes", status: "documented", evidence: [codexOAuth] },
		},
	},
	guides: {
		personal: codexPersonalGuide,
		enterprise: {
			...codexPersonalGuide,
			clientSetup: {
				requiresServerDetails: true,
				steps: codexPersonalGuide.steps.filter((step) => step.kind !== "canvas-key"),
			},
			sources: [...codexPersonalGuide.sources, codexManaged],
			steps: [
				{ id: "canvas-create", kind: "canvas-key", action: "create" },
				{
					id: "provider-manage",
					kind: "provider",
					title: "Codex managed configuration",
					content: [
						{
							kind: "paragraph",
							text: "Add this entry to your existing MCP allowlist in the organization's requirements.toml and deploy it through Agent Security, system policy, or macOS MDM:",
						},
						{
							kind: "code",
							language: "toml",
							text: '[mcp_servers.canvas-mcp]\nidentity = { url = "{mcpUrl}" }',
						},
						{
							kind: "paragraph",
							text: "Distribute the registration command below to managed devices. Each user completes their own Canvas sign-in.",
						},
					],
				},
				...codexPersonalGuide.steps.filter((step) => step.kind !== "canvas-key"),
			],
		},
	},
	installModes: ["personal", "enterprise"],
	enterpriseSurface: "Codex managed configuration",
	provider: "OpenAI",
	group: "Curated",
	id: "codex",
	rulesyncTarget: "codexcli",
	name: "Codex",
	setupNote: "Add the remote MCP server in Codex and complete Canvas sign-in.",
	verify: "Complete OAuth and confirm the Canvas MCP server is enabled in Codex.",
} satisfies ClientDefinition;
