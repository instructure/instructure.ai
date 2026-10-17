import { documented, setupGuidance, updatedGuidance } from "../evidence";
import { type ClientDefinition, type Evidence } from "../types";
import { type ClientGuideStep, type Guide } from "../../guides/types";
import { inheritedFacts } from "../facts";
const managedMcp: Evidence = {
	method: "vendor-doc",
	label: "Claude Code managed MCP deployment and access policies",
	url: "https://code.claude.com/docs/en/managed-mcp",
	verifiedAt: "2026-10-17",
};
const claudeOAuth: Evidence = {
	method: "vendor-doc",
	label: "Claude Code pre-configured OAuth credentials",
	url: "https://code.claude.com/docs/en/mcp#use-pre-configured-oauth-credentials",
	verifiedAt: "2026-10-17",
};
const personalGuide: Guide = {
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
			id: "provider-public",
			kind: "provider",
			title: "Register a public client",
			content: [
				{
					kind: "code-group",
					variants: {
						mac: {
							language: "bash",
							text: 'claude mcp add-json canvas-mcp \\\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' \\\n  --scope local',
						},
						windows: {
							language: "powershell",
							text: 'claude mcp add-json canvas-mcp `\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' `\n  --scope local',
						},
					},
				},
			],
			key: "public",
		},
		{
			id: "provider-private",
			kind: "provider",
			title: "Private-key alternative",
			content: [
				{
					kind: "paragraph",
					text: "The --client-secret flag prompts for the secret. Enter it at the prompt so it is not included in command history.",
				},
				{
					kind: "code-group",
					variants: {
						mac: {
							language: "bash",
							text: 'claude mcp add-json canvas-mcp \\\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' \\\n  --scope local --client-secret',
						},
						windows: {
							language: "powershell",
							text: 'claude mcp add-json canvas-mcp `\n  \'{"type":"http","url":"{mcpUrl}","oauth":{"clientId":"{clientId}","callbackPort":8081,"scopes":"{scope}"}}\' `\n  --scope local --client-secret',
						},
					},
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
};

export const claudeCode = {
	facts: {
		...inheritedFacts(["public", "private"], {
			kind: "fixed",
			uris: ["http://localhost:8081/callback"],
			status: "documented",
			evidence: [setupGuidance, claudeOAuth],
		}),
		remoteHttp: documented("yes"),
		staticClientId: documented("yes"),
		registration: documented("static"),
		keyTypes: { public: documented("yes"), private: documented("yes") },
	},
	guides: {
		personal: personalGuide,
		enterprise: {
			presentation: "by-surface",
			status: "documented",
			prerequisites: [
				"Access to your organization's Claude Code managed settings and device deployment tooling.",
			],
			sources: [setupGuidance, managedMcp, claudeOAuth],
			lastVerified: "2026-10-17",
			steps: [
				{ id: "canvas-create", kind: "canvas-key", action: "create" },
				{
					id: "provider-deploy-public",
					kind: "provider",
					key: "public",
					title: "Provide Canvas MCP through managed settings",
					content: [
						{
							kind: "paragraph",
							text: "Use Claude Code v2.1.259 or later. Merge this entry into managedMcpServers in your organization's managed settings. Deliver it through server-managed settings, MDM or registry policy, or managed-settings.json. Users keep their other servers and sign in to Canvas individually.",
						},
						{
							kind: "code",
							language: "json",
							text: '{\n  "managedMcpServers": {\n    "canvas-mcp": {\n      "type": "http",\n      "url": "{mcpUrl}",\n      "oauth": {\n        "clientId": "{clientId}",\n        "callbackPort": 8081,\n        "scopes": "{scope}"\n      }\n    }\n  }\n}',
						},
						{
							kind: "paragraph",
							text: "Use a public Canvas developer key with no client secret. Merge with existing managed servers rather than replacing the organization's settings. Existing denylist policies can still block this server.",
						},
						{
							kind: "paragraph",
							text: "For an exclusive fixed deployment instead, put the same server entry under mcpServers in managed-mcp.json. Deploy that standalone file with administrator privileges to /Library/Application Support/ClaudeCode/managed-mcp.json on macOS, /etc/claude-code/managed-mcp.json on Linux or WSL, or C:\\Program Files\\ClaudeCode\\managed-mcp.json on Windows. This blocks other user, project, plugin, and command-line server definitions; preserve all approved servers before deploying it.",
						},
					],
				},
				{
					id: "provider-approve-private",
					kind: "provider",
					key: "private",
					title: "Approve Canvas MCP for private-key registration",
					content: [
						{
							kind: "paragraph",
							text: "For a centrally provisioned, sign-in-only deployment, turn off Private key and use a public Canvas key. Claude Code stores private client secrets when a user adds a server, not in the managed OAuth configuration. For a private key, use an approved-catalog deployment instead and have each user register the server with the secret prompt.",
						},
						{
							kind: "paragraph",
							text: "Merge the Canvas endpoint into your managed allowlist and retain other approved entries. The enforced allowlist restricts user-configured servers; it does not install them. Do not deploy managed-mcp.json or a managedMcpServers entry for canvas-mcp with this workflow, because users need to add their own configuration. Check existing denylist policies too.",
						},
						{
							kind: "code",
							language: "json",
							text: '{\n  "allowManagedMcpServersOnly": true,\n  "allowedMcpServers": [\n    { "serverUrl": "{mcpUrl}" }\n  ]\n}',
						},
						{
							kind: "paragraph",
							text: "Deploy the policy through an administrator-controlled managed settings source. Use Claude Code v2.1.273 or later when combining managed policy sources. Distribute the Canvas secret through your organization's approved secret-delivery process, never in this setup link or a shared JSON file.",
						},
					],
				},
				{
					id: "provider-rollout",
					kind: "provider",
					title: "Validate the rollout",
					content: [
						{
							kind: "list",
							items: [
								"Pilot the deployment on a managed device and start a new Claude Code session.",
								"For a public-key deployment, confirm canvas-mcp appears in /mcp without running claude mcp add. For a private-key catalog, follow the client registration instructions first.",
								"Have the pilot user complete their own Canvas sign-in and verify Canvas tools before distributing the client setup link.",
							],
						},
					],
				},
			],
			clientSetup: {
				requiresServerDetails: false,
				steps: [
					{
						id: "client-managed",
						kind: "provider",
						key: "public",
						title: "Sign in to your organization's Canvas MCP server",
						content: [
							{
								kind: "list",
								items: [
									"Install your organization's supported Claude Code version (v2.1.259 or later for managedMcpServers) and start a new session with claude.",
									"Open /mcp and find canvas-mcp, which your administrator has already configured. Do not run claude mcp add or edit a local MCP configuration.",
									"Select canvas-mcp and choose Authenticate or Needs Auth. Sign in to Canvas in the browser and approve access using your own account.",
									"If canvas-mcp is missing or blocked, ask your administrator to check device deployment and policy rather than adding a duplicate server.",
								],
							},
						],
					},
					...personalGuide.steps.filter(
						(step): step is ClientGuideStep => step.kind !== "canvas-key" && step.key === "private",
					),
					{
						id: "client-private-login",
						kind: "provider",
						key: "private",
						title: "Authenticate your approved Canvas connection",
						content: [
							{
								kind: "list",
								items: [
									"Obtain the Canvas key secret through your organization's approved process and enter it only at the registration command's masked secret prompt.",
									"Start a new Claude Code session, open /mcp, select canvas-mcp, and complete Canvas sign-in with your own account.",
									"If registration is blocked by policy, contact your administrator. Do not bypass the managed policy.",
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
								text: "Reopen /mcp to confirm canvas-mcp is connected, then ask Claude to list your Canvas courses. Each user authorizes access separately; the organization does not distribute shared Canvas tokens.",
							},
						],
					},
				],
			},
		},
	},
	installModes: ["personal", "enterprise"],
	enterpriseSurface: "Claude Code managed configuration",
	provider: "Anthropic",
	group: "Curated",
	id: "claude-code",
	rulesyncTarget: "claudecode",
	name: "Claude Code",
	status: {
		kind: "validated",
		testedAt: "2026-10-17",
		installModes: ["personal"],
		note: "The tested key type and Claude Code version were not recorded.",
	},
	setupNote: "Add the remote HTTP MCP server using Claude Code's current MCP configuration flow.",
	verify: "Complete the browser sign-in and confirm the server is listed as connected.",
} satisfies ClientDefinition;
