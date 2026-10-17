import { type Evidence, type ClientDefinition } from "../types";
import { unknownFacts } from "../facts";
import { updatedGuidance } from "../evidence";
const geminiOAuth: Evidence = {
	method: "vendor-doc",
	label: "Gemini CLI MCP OAuth configuration",
	url: "https://geminicli.com/docs/tools/mcp-server/",
	verifiedAt: "2026-10-17",
};
const supported = { value: "yes", status: "documented", evidence: [geminiOAuth] } as const;
// Vendor docs resolve the supplied guide's key-type conflict: public clients omit clientSecret;
// private clients supply it. Pin redirectUri because the default listener port is random.
// Docs/source verification does not establish a live Canvas OAuth success.
export const geminiCli = {
	id: "gemini-cli",
	name: "Gemini CLI",
	group: "Curated",
	installModes: ["personal"],
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
		personal: {
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
							text: '{\n  "mcpServers": {\n    "canvas-mcp": {\n      "httpUrl": "{mcpUrl}",\n      "oauth": {\n        "enabled": true,\n        "clientId": "{clientId}",\n        "authorizationUrl": "{authUrl}",\n        "tokenUrl": "{tokenUrl}",\n        "scopes": ["{scope}"],\n        "redirectUri": "http://localhost:8081/oauth/callback"\n      }\n    }\n  }\n}',
						},
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
					],
				},
			],
		},
	},
	setupNote:
		"Configure the Canvas MCP server in Gemini CLI settings and authenticate with /mcp auth.",
	verify: "Authenticate and confirm the server in /mcp.",
} satisfies ClientDefinition;
