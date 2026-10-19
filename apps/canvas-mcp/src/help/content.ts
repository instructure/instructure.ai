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
				title: "redirect_uri does not match client settings",
				text: "Compare the redirect_uri sent by the client with the Canvas developer key's Redirect URIs. Register the exact URI, including scheme, hostname, port, path, and any trailing slash. Use the callback for the correct client and install flow, not the MCP server URL. Computed or client-generated callbacks need confirmation from that client before retrying OAuth.",
			},
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
				title: "MCP server canvas-mcp already exists in local config",
				text: "Inspect the existing canvas-mcp entry in your client's configuration before adding it again. Update that entry or use the client's documented remove-and-add workflow. Preserve other servers and settings; do not delete the whole configuration file.",
			},
		],
	},
];
