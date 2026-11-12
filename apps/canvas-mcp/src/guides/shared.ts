import { type ClientDefinition } from "../clients/types";
import { type Guide } from "./types";
import { canvasAuthorizationScreenshot } from "./screenshots";

export function clientGuide(client: ClientDefinition, install: "personal" | "enterprise"): Guide {
	if (client.id === "openclaw" && install === "personal") {
		return {
			presentation: "by-surface",
			status: "pending",
			prerequisites: [],
			sources: [],
			steps: [
				{ id: "canvas-create", kind: "canvas-key", action: "create" },
				{
					id: "provider-configure",
					kind: "provider",
					audience: "client",
					title: "Configure OpenClaw",
					content: [
						{
							kind: "paragraph",
							text: "The reported production test used OpenClaw 2026.11.1 with a private Canvas key and a bearer token obtained and refreshed by a separate OAuth client. OpenClaw's native login was not validated for a pre-registered Canvas key.",
						},
						{
							kind: "paragraph",
							text: "Register the external OAuth client's exact callback URI on the Canvas key. Configure it for authorization code with PKCE and securely manage token refresh. Use the connection fields above in that OAuth client, not as OpenClaw OAuth settings.",
						},
						{
							kind: "paragraph",
							text: "Authorize the external OAuth client in Canvas when prompted.",
						},
						canvasAuthorizationScreenshot(),
						{
							kind: "paragraph",
							text: "The test configured OpenClaw's Streamable HTTP server with an Authorization: Bearer header and no auth field. Treat access and refresh tokens as secrets; never paste them into this guide or a setup link. Follow your organization's policy for securely storing and refreshing credentials.",
						},
						{
							kind: "link",
							label: "Open OpenClaw MCP configuration documentation",
							url: "https://docs.openclaw.ai/tools/mcp",
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
							text: "Confirm the server lists its tools and make a safe, permitted read-only tool call. Public keys, enterprise and beta installs, and write operations were not tested in this report.",
						},
					],
				},
			],
		};
	}
	return (
		client.guides?.[install] ?? {
			presentation: "by-surface",
			status: "pending",
			prerequisites: [],
			sources: [],
			steps: [
				{ id: "canvas-create", kind: "canvas-key", action: "create" },
				{
					id: "provider-configure",
					kind: "provider",
					...(client.research ? { audience: "client" as const } : {}),
					title: "Configure your MCP client",
					content: [
						{
							kind: "paragraph",
							text: client.research
								? "Use the connection fields in your MCP client's supported configuration. Follow the client's documentation for the configuration format and authentication controls."
								: client.setupNote,
						},
						...(client.configurationUrl
							? [
									{
										kind: "link" as const,
										label: `Open ${client.name} MCP configuration documentation`,
										url: client.configurationUrl,
									},
								]
							: []),
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
							text: "Return to your MCP client after authorizing Canvas access.",
						},
						{ kind: "paragraph", text: client.verify },
						{ kind: "paragraph", text: "Try a prompt:" },
						{ kind: "code", language: "prompt", text: "list my Canvas courses" },
					],
				},
			],
		}
	);
}
// Server setup includes Canvas and explicitly marked server steps. Verification is
// a client action unless a guide explicitly identifies an administrator-only check.
export function serverSetupSteps(guide: Guide, install: "personal" | "enterprise") {
	return guide.steps.filter(
		(step) =>
			step.kind === "canvas-key" ||
			step.audience === "server" ||
			(install === "enterprise" &&
				step.audience !== "client" &&
				(step.kind !== "verify" || step.audience === "server")),
	);
}
// A client page follows the server's selected install mode. Enterprise guides declare
// whether members wire a local connection or only sign in to a provisioned connector.
export function clientSetup(client: ClientDefinition, install: "personal" | "enterprise") {
	const guide = clientGuide(client, install);
	return (
		guide.clientSetup ?? {
			requiresServerDetails: true,
			steps: guide.steps.filter((step) => step.kind !== "canvas-key" && step.audience !== "server"),
		}
	);
}
