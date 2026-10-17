import { documented, setupGuidance } from "../evidence";
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
			steps: [
				{
					id: "canvas-create",
					kind: "canvas-key",
					action: "create",
				},
				{
					id: "provider-public",
					kind: "provider",
					title: "Claude Code — register the public client",
					content: [
						{
							kind: "code",
							text: 'claude mcp add-json canvas-mcp \\\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' \\\n  --scope local',
						},
					],
					key: "public",
				},
				{
					id: "provider-private",
					kind: "provider",
					title: "Claude Code — register the private client",
					content: [
						{
							kind: "paragraph",
							text: "The --client-secret flag prompts for the secret so it does not appear in command history.",
						},
						{
							kind: "code",
							text: 'claude mcp add-json canvas-mcp \\\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' \\\n  --scope local --client-secret',
						},
					],
					key: "private",
				},
				{
					id: "provider-login",
					kind: "provider",
					title: "Sign in from Claude Code",
					content: [
						{
							kind: "code",
							text: "claude mcp get canvas-mcp",
						},
						{
							kind: "list",
							items: [
								"Start a Claude Code session in this project and type /mcp.",
								"Choose canvas-mcp → Needs Auth. Sign in to Canvas in the browser and approve access.",
								"Use --scope user instead of --scope local if you want the server available in all your projects.",
							],
						},
					],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Verify the server",
					content: [
						{
							kind: "paragraph",
							text: "Type /mcp to check that the server is connected, then ask Claude Code to list your Canvas courses.",
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
	id: "claude-code",
	rulesyncTarget: "claudecode",
	name: "Claude Code",
	setupNote: "Add the remote HTTP MCP server using Claude Code's current MCP configuration flow.",
	verify: "Complete the browser sign-in and confirm the server is listed as connected.",
} satisfies ClientDefinition;
