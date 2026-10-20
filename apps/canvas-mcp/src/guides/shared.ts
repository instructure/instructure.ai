import { type ClientDefinition } from "../clients/types";
import { type Guide } from "./types";
import { canvasAuthorizationScreenshot } from "./screenshots";

export function clientGuide(client: ClientDefinition, install: "personal" | "enterprise"): Guide {
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
