import { type Client, type KeyType } from "../state";
import { RULESYNC_TARGETS } from "../rulesyncTargets";
import type { ClientDefinition } from "./types";
import { claudeAi } from "./curated/claude-ai";
import { claudeCode } from "./curated/claude-code";
import { codex } from "./curated/codex";
import { copilotStudio } from "./curated/copilot-studio";
import { geminiEnterprise } from "./curated/gemini-enterprise";
import { antigravity } from "./curated/antigravity";
import { generic } from "./curated/generic";
const CURATED_CLIENTS: ClientDefinition[] = [
	claudeAi,
	claudeCode,
	codex,
	copilotStudio,
	geminiEnterprise,
	antigravity,
	generic,
];
CURATED_CLIENTS.sort((left, right) =>
	new Intl.Collator("en", { sensitivity: "base", ignorePunctuation: true }).compare(
		left.name,
		right.name,
	),
);

const curatedRulesyncTargets = new Set(
	CURATED_CLIENTS.flatMap((client) => (client.rulesyncTarget ? [client.rulesyncTarget] : [])),
);

const RULESYNC_CLIENTS: ClientDefinition[] = RULESYNC_TARGETS.filter(
	(target) => !curatedRulesyncTargets.has(target.id),
)
	.map((target) => ({
		group: "Other",
		id: target.id,
		keyTypes: ["public", "private"] as KeyType[],
		name: target.name,
		requiresClientId: true,
		redirectUris: ["Confirm the OAuth callback URI with this client"],
		setupNote:
			"Rulesync lists this client as MCP-capable; verify its remote HTTP and OAuth requirements before configuring it.",
		verify: "Confirm the client completes OAuth and can connect to the Canvas MCP server.",
		rulesyncTarget: target.id,
		oauthMetadataVerified: false,
		redirectUriKnown: false,
	}))
	.sort((left, right) => left.name.localeCompare(right.name));

export const CLIENTS: ClientDefinition[] = [...CURATED_CLIENTS, ...RULESYNC_CLIENTS];

export function clientDefinition(id: Client): ClientDefinition {
	return (
		CLIENTS.find((client) => client.id === id) ??
		CURATED_CLIENTS.find((client) => client.id === "claude-code")!
	);
}

export function normalizeKeyType(client: Client, key: string): KeyType {
	const definition = clientDefinition(client);
	return definition.keyTypes.includes(key as KeyType) ? (key as KeyType) : definition.keyTypes[0];
}
