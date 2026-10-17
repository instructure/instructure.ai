import { documented, setupGuidance, updatedGuidance } from "../evidence";
import { type ClientDefinition } from "../types";
import { inheritedFacts } from "../facts";
export const claudeCode = {
	facts: {
		...inheritedFacts(["public", "private"], {
			kind: "fixed",
			uris: ["http://localhost:8081/callback"],
			status: "documented",
			evidence: [setupGuidance],
		}),
		remoteHttp: documented("yes"),
		staticClientId: documented("yes"),
		registration: documented("static"),
		keyTypes: { public: documented("yes"), private: documented("yes") },
	},
	guides: {
		personal: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: ["Claude Code installed and signed in; callback port 8081 available."],
			sources: [updatedGuidance, setupGuidance],
			lastVerified: "2026-10-17",
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-public-bash",
					kind: "provider",
					title: "macOS / Linux — register a public client",
					content: [
						{
							kind: "code",
							language: "bash",
							text: 'claude mcp add-json canvas-mcp \\\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' \\\n  --scope local',
						},
					],
					key: "public",
				},
				{
					id: "provider-public-powershell",
					kind: "provider",
					title: "Windows PowerShell — register a public client",
					content: [
						{
							kind: "code",
							language: "powershell",
							text: 'claude mcp add-json canvas-mcp `\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' `\n  --scope local',
						},
					],
					key: "public",
				},
				{
					id: "provider-private-bash",
					kind: "provider",
					title: "macOS / Linux — private-key alternative",
					content: [
						{
							kind: "paragraph",
							text: "The original setup guidance supports private keys too. The --client-secret flag prompts for the secret.",
						},
						{
							kind: "code",
							language: "bash",
							text: 'claude mcp add-json canvas-mcp \\\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' \\\n  --scope local --client-secret',
						},
					],
					key: "private",
				},
				{
					id: "provider-private-powershell",
					kind: "provider",
					title: "Windows PowerShell — private-key alternative",
					content: [
						{
							kind: "paragraph",
							text: "Enter the secret at the prompt so it is not included in command history.",
						},
						{
							kind: "code",
							language: "powershell",
							text: 'claude mcp add-json canvas-mcp `\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' `\n  --scope local --client-secret',
						},
					],
					key: "private",
				},
				{
					id: "provider-scopes",
					kind: "provider",
					title: "Choose the configuration scope",
					content: [
						{
							kind: "list",
							items: [
								"local: private to you in this project.",
								"user: private to you across projects.",
								"project: shares the server configuration in .mcp.json; each user still authenticates individually.",
							],
						},
					],
				},
				{
					id: "provider-login",
					kind: "provider",
					title: "Validate and authenticate",
					content: [
						{
							kind: "code",
							language: "bash",
							text: "claude mcp get canvas-mcp",
						},
						{
							kind: "list",
							items: [
								"Start a new Claude Code session with claude. The server shows Needs authentication until you sign in.",
								"Open /mcp, select canvas-mcp → Needs Auth, then sign in to Canvas in the browser and approve access.",
							],
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Verify the connection",
					content: [
						{
							kind: "paragraph",
							text: "Reopen /mcp to check the connection and ask Claude to list your Canvas courses.",
						},
					],
				},
			],
		},
	},
	installModes: ["personal"],
	provider: "Anthropic",
	group: "Curated",
	id: "claude-code",
	rulesyncTarget: "claudecode",
	name: "Claude Code",
	setupNote: "Add the remote HTTP MCP server using Claude Code's current MCP configuration flow.",
	verify: "Complete the browser sign-in and confirm the server is listed as connected.",
} satisfies ClientDefinition;
