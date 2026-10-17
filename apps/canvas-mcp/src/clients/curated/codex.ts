import { documented, updatedGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const codex = {
	facts: {
		...inheritedFacts(["public"], {
			kind: "computed",
			recipe: "codex-callback-id",
			base: "http://localhost:8081/callback",
			mode: "unknown",
			evidence: [
				{
					method: "source",
					label: "Codex callback algorithm; Canvas mode awaiting verification",
					url: "https://github.com/openai/codex/blob/9be8d6e1c3dbb145d2d7ac3ba46729340e6d8d40/codex-rs/rmcp-client/src/oauth_callback.rs",
					version: "9be8d6e1c3dbb145d2d7ac3ba46729340e6d8d40",
					verifiedAt: "2026-10-17",
				},
			],
		}),
		remoteHttp: documented("yes"),
		staticClientId: documented("yes"),
		registration: documented("static"),
		keyTypes: { public: documented("yes"), private: documented("no") },
	},
	guides: {
		personal: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: [
				"Codex CLI or IDE extension installed and signed in; public Canvas key and callback port 8081.",
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
					id: "provider-register",
					kind: "provider",
					title: "Codex — register the server",
					content: [
						{
							kind: "paragraph",
							text: "The CLI and IDE extension share this configuration. Confirm the complete registered callback URI before signing in.",
						},
						{
							kind: "code",
							text: 'codex -c mcp_oauth_callback_port=8081 -c \'mcp_oauth_callback_url="http://localhost:8081/callback"\' mcp add canvas-mcp --url "{mcpUrl}" --oauth-client-id "{clientId}"',
						},
					],
				},
				{
					id: "provider-login",
					kind: "provider",
					title: "Sign in to Canvas",
					content: [
						{
							kind: "paragraph",
							text: "If sign-in does not start automatically, run:",
						},
						{
							kind: "code",
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
							text: "codex mcp get canvas-mcp",
						},
						{
							kind: "paragraph",
							text: "In a Codex session, open /mcp to confirm the server and its sign-in status.",
						},
					],
				},
			],
		},
	},
	installModes: ["personal"],
	group: "Curated",
	id: "codex",
	rulesyncTarget: "codexcli",
	name: "Codex",
	setupNote:
		"Add the remote MCP server in Codex. Confirm the exact callback URI and callback mode before registering it.",
	verify: "Complete OAuth and confirm the Canvas MCP server is enabled in Codex.",
} satisfies ClientDefinition;
