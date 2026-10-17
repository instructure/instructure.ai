import { type Client, type KeyType, type InstallMode, CLIENT_ALIASES } from "./ids";
import { type ClientDefinition } from "./types";
import { rulesyncClients } from "./rulesync";
import { chatgpt } from "./curated/chatgpt";
import { superhumanGo } from "./curated/superhuman-go";
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
	chatgpt,
	superhumanGo,
	generic,
];
CURATED_CLIENTS.sort((left, right) =>
	new Intl.Collator("en", { sensitivity: "base", ignorePunctuation: true }).compare(
		left.name,
		right.name,
	),
);

export const CLIENTS: ClientDefinition[] = [
	...CURATED_CLIENTS,
	...rulesyncClients(CURATED_CLIENTS),
];
export function clientDefinition(id: Client): ClientDefinition {
	const canonical = CLIENT_ALIASES[id] ?? id;
	return CLIENTS.find((client) => client.id === canonical) ?? claudeCode;
}
export function allowedKeyTypes(client: ClientDefinition): KeyType[] {
	return (["public", "private"] as const).filter(
		(key) => client.facts.keyTypes[key].value !== "no",
	);
}
export function normalizeKeyType(client: Client, key: string): KeyType {
	const types = allowedKeyTypes(clientDefinition(client));
	if ((key === "public" || key === "private") && types.includes(key)) return key;
	return (
		types.find((type) => clientDefinition(client).facts.keyTypes[type].value === "yes") ??
		types[0] ??
		"public"
	);
}
export function normalizeInstall(client: Client, install: string): InstallMode {
	const modes = clientDefinition(client).installModes;
	return modes.find((mode) => mode === install) ?? modes[0] ?? "personal";
}
