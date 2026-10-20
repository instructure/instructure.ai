import { type ClientGuideStep, type Guide, type StructuredContent } from "../../../guides/types";
import { genericSources } from "./sources";
import { canvasAuthorizationScreenshot } from "../../../guides/screenshots";

const connectionFields: [string, string][] = [
	["Transport", "Remote HTTP (Streamable HTTP)"],
	["MCP server URL", "`{mcpUrl}`"],
	["Authorization URL", "`{authUrl}`"],
	["Token URL", "`{tokenUrl}`"],
	["Client ID", "`{clientId}`"],
	["Scope", "`{scope}`"],
	["Redirect URI(s)", "`{redirectUri}`"],
];
const connectionIntroduction: StructuredContent = {
	kind: "paragraph",
	text: "Map these fields to your client's connection settings; field names and JSON configuration formats vary by client. The MCP server and Canvas OAuth endpoints use different hosts.",
};

const clientSteps: ClientGuideStep[] = [
	{
		id: "provider-public",
		kind: "provider",
		key: "public",
		content: [
			connectionIntroduction,
			{
				kind: "table",
				rows: [
					...connectionFields,
					["Client secret", "Do not send a client secret for a public key."],
					["PKCE", "Required; use S256."],
				],
			},
		],
	},
	{
		id: "provider-private",
		kind: "provider",
		key: "private",
		content: [
			connectionIntroduction,
			{
				kind: "table",
				rows: [
					...connectionFields,
					[
						"Client secret",
						"Required; enter the Canvas key secret directly in your client's secret field.",
					],
					["PKCE", "Optional for a Canvas private key."],
				],
			},
			{
				kind: "paragraph",
				text: "The client must send the client secret during the token exchange. Store it securely in the client; never paste it into this guide, a setup link, or a shared configuration file.",
			},
		],
	},
	{
		id: "authorize",
		kind: "provider",
		audience: "client",
		title: "Authorize Canvas access",
		content: [
			{
				kind: "paragraph",
				text: "Start authentication in your MCP client. Open the authorization link in your browser if it does not open automatically, then sign in to Canvas with your own account if prompted.",
			},
			{
				kind: "paragraph",
				text: "On the Canvas authorization screen, click **Authorize** to allow the MCP client to access Canvas on your behalf.",
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
				text: "Return to your MCP client after authorizing Canvas access and confirm the server is connected and its tools are available.",
			},
			{ kind: "paragraph", text: "Try a prompt:" },
			{
				kind: "code",
				language: "prompt",
				text: "list my Canvas courses",
			},
		],
	},
];

export const genericPersonalGuide: Guide = {
	presentation: "interleaved",
	status: "documented",
	prerequisites: ["A client supporting remote HTTP MCP with preconfigured OAuth credentials."],
	sources: genericSources,
	lastVerified: "2026-10-17",
	clientSetup: { requiresServerDetails: true, steps: clientSteps },
	steps: [
		{
			id: "provider-callback",
			kind: "provider",
			audience: "server",
			title: "Get the MCP client's callback URIs",
			content: [
				{
					kind: "list",
					items: [
						"Open your MCP client's remote HTTP connection settings and find its OAuth callback URI(s). Some clients list them in their documentation or generate them during connection setup.",
						"Enter the exact callback URI(s) in the field below, one per line. Do not sign in until all callback URIs are registered on the Canvas key.",
						"Use the connection fields below if your client needs server details to generate its callback URI. After step 2, return to the client with the Canvas Client ID and, for a private key, enter the secret directly in the client's secret field.",
					],
				},
				connectionIntroduction,
				{ kind: "table", rows: connectionFields },
			],
		},
		{ id: "canvas-create", kind: "canvas-key", action: "create" },
	],
};
