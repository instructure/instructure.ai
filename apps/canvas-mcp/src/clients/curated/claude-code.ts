import { documented, setupGuidance, updatedGuidance } from "../evidence";
import { type ClientDefinition, type Evidence } from "../types";
import { type ClientGuideStep, type Guide } from "../../guides/types";
import { inheritedFacts } from "../facts";
import { canvasAuthorizationScreenshot, screenshot } from "../../guides/screenshots";
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
			id: "intro",
			kind: "verify",
			content: [
				{
					kind: "paragraph",
					text: 'Configuring claude code requires you to choose the configuration scope first. In the example below we use `local`, but you can select `user` or `project` depending on your needs.',
				},
			],
		},
		{
			id: "provider-scopes",
			kind: "provider",
			title: "Choose the configuration scope",
			content: [
				{
					kind: "list",
					items: [
						"**local**: private to you in this project.",
						"**user**: private to you across projects.",
						"**project**: shares the server configuration in .mcp.json; each user still authenticates individually.",
					],
				},
			],
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
				screenshot(
					"claude_code_mcp_add_command",
					"terminal after `claude mcp add-json ... canvas-mcp` with success output.",
				),
			],
			key: "public",
		},
		{
			id: "provider-private",
			kind: "provider",
			title: "Register a private client",
			content: [
				{
					kind: "paragraph",
					text: "The `--client-secret` flag prompts for the secret. Enter it at the prompt so it is not included in command history.",
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
				screenshot(
					"claude_code_mcp_add_command_private",
					"terminal after `claude mcp add-json ... canvas-mcp` with success output.",
				),
			],
			key: "private",
		},
		{
			id: "added",
			kind: "verify",
			content: [
				{
					kind: "paragraph",
					text: 'After you run the initial command you should see a confirmation that the Canvas MCP has been added successfully.',
				},
			],
		},
		{
			id: "provider-login",
			kind: "provider",
			title: "Validate and authenticate",
			content: [
        {
          kind: "paragraph",
          text: "Validate that the Canvas MCP has been added successfully by retrieving its details. Claude will return the active configuration and the status will show '! Needs authentication' until you sign in.",
        },
				{
					kind: "code",
					language: "bash",
					text: "claude mcp get canvas-mcp",
				},
				screenshot(
					"claude_code_mcp_get",
					"terminal after `claude mcp get canvas-mcp` showing the MCP details.",
				),
				{
					kind: "paragraph",
          text: "Start a new Claude Code session with `claude`. The terminal shows that an MCP server needs authentication.",
        },
				screenshot(
					"claude_code_needs_auth",
					"terminal after starting a new Claude Code session showing the MCP needs authentication.",
				),
        {
          kind: "paragraph",
          text: "Open `/mcp`, select **canvas-mcp**.",
        },
				screenshot(
					"claude_code_mcp_needs_auth",
					"`/mcp` panel with canvas-mcp showing \"Needs authentication\".",
				),
        {
          kind: "paragraph",
          text: "You will be taken to the mcp settings for the Canvas MCP in Claude.",
        },
        screenshot(
          "claude_code_mcp_authorize",
          "`/mcp` panel with canvas-mcp showing the authorization page.",
        ),
        {
          kind: "paragraph",
          text: "Selecting **Authenticate** will automatically open your default browser for Canvas sign-in and authorization. If you haven't allowed claude to open the browser, it will provide a copyable URL.",
        },
        {
          kind: "paragraph",
          text: "Canvas will present you with a modal to authorize the **MCP Test** server for your user account. You may be required to sign in to Canvas first if you are not already signed in.",
        },
				canvasAuthorizationScreenshot(),
			],
		},
		{
			id: "verify",
			kind: "verify",
			title: "Verify the connection",
			content: [
				{
					kind: "paragraph",
					text: "After authenticating, you can close the browser tab and return to Claude. You should see an **Authentication successful** message.",
				},
				screenshot("claude_code_mcp_connected", "terminal showing canvas-mcp connected with tools."),
				{
					kind: "paragraph",
					text: "You're now connected to the Canvas MCP and ready to begin prompting. Try asking Claude to list your Canvas courses.",
				},
				{
					kind: "code",
					language: "prompt",
					text: "List my Canvas courses",
				},
				screenshot("claude_code_mcp_list_courses", "terminal showing the list of Canvas courses."),
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
						screenshot(
							"claude_admin_managed_settings_page",
							"Organization settings > Claude Code > Managed settings JSON editor with the managedMcpServers block.",
						),
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
						screenshot(
							"claude_code_blocked_by_policy",
							'terminal showing the "not allowed by enterprise policy" message.',
						),
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
						screenshot(
							"claude_code_mcp_managed_section",
							'`/mcp` showing canvas-mcp under "Managed MCPs".',
						),
						screenshot(
							"claude_code_doctor_managed_settings",
							'`claude doctor` output line "Managed settings (remote)".',
						),
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
							screenshot(
								"claude_code_mcp_managed_section",
								'`/mcp` showing canvas-mcp under "Managed MCPs".',
							),
							canvasAuthorizationScreenshot(),
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
							screenshot(
								"claude_code_doctor_managed_settings",
								'`claude doctor` output line "Managed settings (remote)".',
							),
							canvasAuthorizationScreenshot(),
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
