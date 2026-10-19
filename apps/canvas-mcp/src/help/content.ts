export const HELP_SECTIONS = [
	{ id: "faqs", label: "FAQs" },
	{ id: "issues", label: "Common Issues" },
	{ id: "clients", label: "Supported Clients" },
] as const;

export type HelpSection = (typeof HELP_SECTIONS)[number]["id"];

export function helpSectionFromQuery(search: string): HelpSection {
	const section = new URLSearchParams(search).get("help");
	return HELP_SECTIONS.find(({ id }) => id === section)?.id ?? "faqs";
}

interface HelpEntry {
	title: string;
	text: string;
}

export interface HelpGroup {
	title: "General" | "Admins" | "Users";
	entries: HelpEntry[];
}

export const FAQS: HelpGroup[] = [
	{
		title: "General",
		entries: [
			{
				title: "What is Canvas MCP?",
				text: "Canvas MCP lets an MCP-enabled client connect to Canvas tools. This guide helps administrators configure a Canvas developer key and users connect their client. The guide itself does not make requests to Canvas or Maple.",
			},
			{
				title: "What does this guide store?",
				text: "Setup preferences may be saved in this browser, and setup links include configuration such as the domain and Client ID. Client secrets and access tokens are never requested or stored. Review configuration before sharing a link.",
			},
			{
				title: "What do the client statuses mean?",
				text: "Verified presents the existing Validated client status. Untested means no validation status is recorded for that install mode. Known issue identifies an existing connection blocker. Not applicable means the key type or install mode is unavailable, including discontinued Gemini CLI personal access. Statuses are recorded per install mode, not as separate tests of every key type; the table preserves recorded notes and dates.",
			},
		],
	},
	{
		title: "Admins",
		entries: [
			{
				title: "What do public and private keys mean?",
				text: "These are OAuth client types, not the visibility of your Canvas content. Public clients use a Client ID without a client secret; private clients also use a secret. Follow the selected client's instructions, including any PKCE requirement.",
			},
			{
				title: "Where do Client IDs, secrets, and callback URIs belong?",
				text: "Enter the Canvas developer key Client ID in the setup guide. Register the client's exact callback URI in the key's Redirect URIs. Enter a private client secret only in your approved client configuration, never in this guide, a shared URL, or source control.",
			},
			{
				title: "Is the developer-key scope list approved for production?",
				text: "The scope manifest is still awaiting Product/Security release review. Scope copying remains disabled. Do not use the unreviewed list to create a production developer key.",
			},
		],
	},
	{
		title: "Users",
		entries: [
			{
				title: "Should I use personal or enterprise setup?",
				text: "Personal setup configures your own client connection. Enterprise setup includes organization-managed configuration, permissions, or publication steps where documented. Each user still signs in with their own Canvas account.",
			},
			{
				title: "Which domain and region should I use?",
				text: "Use your school's instructure.com domain, or its beta.instructure.com domain for beta. Use the region in the Maple audience automatically populated on the Canvas developer key. The MCP endpoint is region-specific.",
			},
		],
	},
];

export const COMMON_ISSUES: HelpGroup[] = [
	{
		title: "General",
		entries: [
			{
				title: "Connect a Client is disabled",
				text: "Return to Configure a Server and check the Canvas domain, region, and Client ID. Generic MCP also requires at least one callback URI. A recorded client blocker can disable connection even when those fields are complete; see the client issues below.",
			},
			{
				title: "The client cannot reach the server",
				text: "Check that the Canvas domain, region, and production or beta environment match the developer key. Verify your organization's network and client policies. An unreachable endpoint alone does not establish an OAuth defect.",
			},
		],
	},
	{
		title: "Admins",
		entries: [
			{
				title: "The organization blocks the connection",
				text: "Ask an administrator to follow the selected client's enterprise guide and check server allowlists, connector permissions, and publication requirements. Personal setup does not bypass organization policy.",
			},
			{
				title: "The key type or PKCE configuration does not match",
				text: "Use a key type supported by your client and follow its PKCE instructions. A public client must not depend on a secret. Do not change key type merely to work around an unexplained authentication error.",
			},
		],
	},
	{
		title: "Users",
		entries: [
			{
				title: "OAuth provider returned `invalid_scope`",
				text: "Why: the OAuth provider rejected a requested scope. The client may have requested a discovered or default scope instead of the Canvas scope, or the developer key may not permit the requested scope. Fix it yourself: follow this client's setup instructions and request https://sso.canvaslms.com/all-client-scopes exactly; for Codex, save the configured scope before login and use the guide's explicit login command rather than relying on automatic scope discovery. Report to your admin if the correct scope still fails or your configuration is managed; ask them to verify the developer key's allowed scopes. Do not add permissions or use the unreviewed scope manifest as a workaround. Report to Instructure through your admin's support channel if the admin confirms the requested scope and key configuration are correct and the rejection persists. Include the client/version, error text, time, and requested scope, but no tokens, secrets, or full authorization URL.",
			},
			{
				title: "redirect_uri does not match client settings",
				text: 'Why: {"error":"invalid_request","error_description":"redirect_uri does not match client settings"} means the callback URI sent during sign-in does not match the Canvas developer key configuration. Fix it yourself: confirm you selected the correct client and install flow and used its documented callback settings. Do not substitute the MCP server URL for the callback. Report to your admin to compare the actual redirect_uri with the key\'s Redirect URIs, including scheme, hostname, port, path, and trailing slash, and register the exact approved callback. Computed or client-generated callbacks must be confirmed in the client. If you manage the key yourself, make that correction there. Report to Instructure through your admin\'s support channel if an exact approved match still fails after retrying sign-in. Include the client/version, error text, time, and a sanitized callback URI; do not send tokens, secrets, authorization codes, state values, or the full authorization URL.',
			},
			{
				title: "MCP server canvas-mcp already exists in local config",
				text: "Why: your client already has a local server entry named canvas-mcp; adding the same name again would duplicate or overwrite configuration. This is a local configuration conflict, not evidence of a Canvas service failure. Fix it yourself: inspect and update the existing entry using the guide's manual configuration, or use the client's documented remove-and-add workflow, then sign in again. Preserve other servers and settings; do not delete the whole configuration file. Report to your admin if the entry is organization-managed or you do not have permission to change it. This message alone does not need to be reported to Instructure. If an Instructure-provided setup command still fails after the duplicate entry is resolved, report the command, client/version, and sanitized error through your admin's support channel; never include secrets or tokens.",
			},
		],
	},
];
