import { RULESYNC_TARGETS, type RulesyncTargetId } from "../rulesyncTargets";
export const CLIENTS = [
	"claude-ai",
	"claude-code",
	"codex",
	"copilot-studio",
	"gemini-enterprise",
	"antigravity",
	"chatgpt",
	"superhuman-go",
	"gemini-cli",
	"generic",
] as const;

export type Client = (typeof CLIENTS)[number] | RulesyncTargetId;
export type KeyType = "public" | "private";
export type InstallMode = "personal" | "enterprise";
export const CLIENT_ALIASES: Partial<Record<Client, Client>> = {
	claudecode: "claude-code",
	codexcli: "codex",
	"antigravity-ide": "antigravity",
};
export function isClient(value: unknown): value is Client {
	return (
		typeof value === "string" &&
		(CLIENTS.some((id) => id === value) || RULESYNC_TARGETS.some((target) => target.id === value))
	);
}
