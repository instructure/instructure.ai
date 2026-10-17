import { type ClientDefinition } from "../clients/types";
import { type Guide } from "./types";

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
					content: [{ kind: "paragraph", text: client.verify }],
				},
			],
		}
	);
}
// A client page follows the server's selected install mode. Enterprise guides declare
// whether members wire a local connection or only sign in to a provisioned connector.
export function clientSetup(client: ClientDefinition, install: "personal" | "enterprise") {
	const guide = clientGuide(client, install);
	return (
		guide.clientSetup ?? {
			requiresServerDetails: true,
			steps: guide.steps.filter((step) => step.kind !== "canvas-key"),
		}
	);
}

export const sharedTroubleshooting = [
	{
		symptom: "invalid_target",
		fix: "Check that the developer key includes the pre-populated Maple Allowed Audience for your Canvas region.",
	},
	{
		symptom: "Region or environment mismatch",
		fix: "Use the region from the key's Maple audience. Beta tenants use the beta Canvas authorization/token URLs and maple-beta MCP server URL.",
	},
	{
		symptom: "Redirect URI mismatch",
		fix: "Register the exact callback URI required by the client, including its scheme, port and path.",
	},
	{
		symptom: "Missing content fields",
		fix: "Check Allow Include Parameters and whether a limited-access key is being used. Customer-created keys exclude mcp-limited by default.",
	},
];
