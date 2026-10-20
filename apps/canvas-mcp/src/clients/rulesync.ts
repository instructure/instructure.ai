import { RULESYNC_TARGETS } from "../rulesyncTargets";
import { researchedClient } from "./rulesync-research";
import { type ClientDefinition } from "./types";
export function rulesyncClients(curated: ClientDefinition[]): ClientDefinition[] {
	const overlays = new Set(
		curated.flatMap((client) => (client.rulesyncTarget ? [client.rulesyncTarget] : [])),
	);
	return RULESYNC_TARGETS.filter((target) => !overlays.has(target.id))
		.map((target): ClientDefinition => ({
			id: target.id,
			name: target.name,
			group: "Other" as const,
			...researchedClient(target.id, curated),
			rulesyncTarget: target.id,
			...(target.id === "copilot"
				? {
						status: {
							kind: "known-issue" as const,
							reason:
								"VS Code could not create the MCP auth provider because authorization server metadata could not be fetched from any attempted URL.",
						},
					}
				: {}),
			verify: "Confirm the client completes OAuth and can list the server tools.",
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}
