import { RULESYNC_TARGETS } from "../rulesyncTargets";
import { unknownFacts } from "./facts";
import { type ClientDefinition } from "./types";
export function rulesyncClients(curated: ClientDefinition[]): ClientDefinition[] {
	const overlays = new Set(
		curated.flatMap((client) => (client.rulesyncTarget ? [client.rulesyncTarget] : [])),
	);
	return RULESYNC_TARGETS.filter((target) => !overlays.has(target.id))
		.map((target) => ({
			id: target.id,
			name: target.name,
			group: "Other" as const,
			facts: unknownFacts(),
			installModes: ["personal"] as ClientDefinition["installModes"],
			rulesyncTarget: target.id,
			setupNote:
				"Rulesync confirms MCP configuration support only. Remote HTTP and OAuth requirements are unverified.",
			verify: "Confirm the client completes OAuth and can list the server tools.",
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}
