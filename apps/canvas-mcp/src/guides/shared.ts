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
					title: "Configure your MCP client",
					content: [{ kind: "paragraph", text: client.setupNote }],
				},
				{
					id: "verify",
					kind: "verify",
					title: "Verify the connection",
					content: [{ kind: "paragraph", text: client.verify }, canvasAuthorizationScreenshot()],
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
