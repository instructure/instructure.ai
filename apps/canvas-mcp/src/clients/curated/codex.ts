import { type Guide } from "../../guides/types";
import { documented, updatedGuidance } from "../evidence";
import { type Evidence, type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
import { canvasAuthorizationScreenshot, screenshot } from "../../guides/screenshots";
import { codexCallbackOptions, codexCommands } from "./codex-commands";
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
	prerequisites: ["Codex CLI installed and signed in; a Canvas OAuth key and callback port 8081."],
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
			content: [
				codexCommands("public", "personal"),
				screenshot(
					"codex_desktop_mcp_servers_add",
					"Settings > MCP servers with Add server and Streamable HTTP selected, Canvas MCP URL entered.",
				),
				screenshot("codex_desktop_authenticate", "server row showing the Authenticate button."),
				screenshot("codex_ide_mcp_servers_add", "IDE gear menu > MCP servers > Add server form."),
			],
		},
		{
			id: "provider-register-private",
			kind: "provider",
			key: "private",
			title: "Codex — register the server",
			content: [codexCommands("private", "personal")],
		},
		{
			id: "provider-login",
			kind: "provider",
			audience: "client",
			title: "Sign in to Canvas",
			content: [
				{
					kind: "paragraph",
					text: "If the add command returns `invalid_scope` or requests `openid`, run this command instead of adding the server again. Codex has already saved the server; this login explicitly requests the Canvas scope. Register the exact callback URI shown in the Canvas key settings first. If sign-in already succeeded, continue to validation.",
				},
				{
					kind: "code",
					language: "bash",
					text: `codex ${codexCallbackOptions} mcp login canvas-mcp --scopes "{scope}"`,
				},
				{
					kind: "paragraph",
					text: "If this scoped login also returns `invalid_scope`, have the Canvas administrator check that the developer key permits the requested Canvas scope.",
				},
				canvasAuthorizationScreenshot(),
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
const codexEnterpriseSteps = codexPersonalGuide.steps
	.filter((step) => step.kind !== "canvas-key")
	.map((step) => {
		const key = step.key;
		return key
			? {
					...step,
					content: step.content.map((content) =>
						content.kind === "code-group" ? codexCommands(key, "enterprise") : content,
					),
				}
			: step;
	});
// Maple 6368cd5b58b7a3f9d4c004c46f8779712cdb0d14, src/controllers/well-known.controller.ts:
// authorization-server metadata omits authorization_response_iss_parameter_supported.
// Codex therefore appends the server-specific callback ID. Recheck if Maple adds RFC 9207.
// This is source/documentation evidence, not a successful live Canvas OAuth probe.
export const codex = {
	status: {
		kind: "known-issue",
		installModes: ["personal", "enterprise"],
		reason:
			"Codex Canvas sign-in is blocked by an OAuth invalid_target response in personal testing, including with an explicit Canvas scope. Enterprise uses the same OAuth flow and is also marked as a known issue pending verification. The cause is not yet confirmed.",
	},
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
				steps: codexEnterpriseSteps,
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
						screenshot(
							"codex_agent_security_requirements",
							"Admin Console Agent Security page with the requirements editor.",
						),
						{
							kind: "paragraph",
							text: "Distribute the configuration below to managed devices. Each user completes their own Canvas sign-in.",
						},
					],
				},
				...codexEnterpriseSteps,
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
