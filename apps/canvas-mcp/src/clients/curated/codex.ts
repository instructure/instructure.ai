import { documented, setupGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const codex = {
	facts: {
		...inheritedFacts(["public"], {
			kind: "computed",
			recipe: "codex-callback-id",
			base: "http://localhost:8081/callback",
			mode: "unknown",
			evidence: [],
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
			prerequisites: ["Codex CLI or IDE extension installed and signed in; a public Canvas key."],
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-callback",
					kind: "provider",
					title: "Codex — configure the callback",
					content: [
						{
							kind: "paragraph",
							text: "Confirm the complete redirect URI and callback mode before signing in. The callback can depend on the exact MCP URL; computed output is not enabled until that behavior is verified.",
						},
						{
							kind: "code",
							text: 'mcp_oauth_callback_port = 8081\nmcp_oauth_callback_url = "http://localhost:8081/callback"',
						},
					],
				},
				{
					id: "provider-register",
					kind: "provider",
					title: "Register and sign in",
					content: [
						{
							kind: "paragraph",
							text: "Add the two callback settings at the top level of ~/.codex/config.toml, then register the server:",
						},
						{
							kind: "code",
							text: 'codex mcp add canvas-mcp \\\n  --url "{mcpUrl}" \\\n  --oauth-client-id "{clientId}"',
						},
						{
							kind: "paragraph",
							text: "If the browser does not open automatically, start sign-in explicitly:",
						},
						{
							kind: "code",
							text: 'codex mcp login canvas-mcp --scopes "{scope}"',
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Verify Codex",
					content: [
						{
							kind: "code",
							text: "codex mcp get canvas-mcp",
						},
						{
							kind: "paragraph",
							text: "In a Codex session, type /mcp to check sign-in status. If the server URL changes, recheck the registered callback URI.",
						},
					],
				},
			],
			sources: [setupGuidance],
			lastVerified: "2026-10-17",
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
