import { RULESYNC_TARGETS, type RulesyncTargetId } from "./rulesyncTargets";

export const REGIONS = [
	"us-east-1",
	"us-west-2",
	"eu-west-1",
	"eu-central-1",
	"ca-central-1",
	"ap-southeast-1",
	"ap-southeast-2",
] as const;

export const CLIENTS = [
	"claude-ai",
	"claude-code",
	"codex",
	"copilot-studio",
	"gemini-enterprise",
	"antigravity",
	"generic",
] as const;

export type Region = (typeof REGIONS)[number];
export type Client = (typeof CLIENTS)[number] | RulesyncTargetId;
export type KeyType = "public" | "private";

export interface AppState {
	domain: string;
	client: Client;
	key: KeyType;
	region: Region | "";
	clientId: string;
}

export interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

interface SavedPreferences {
	domain: string;
	client: Client | null;
	key: KeyType | null;
	region: Region | "";
}

const STORAGE_KEY = "canvas-mcp:v1",
	DOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.(?:beta\.)?instructure\.com$/u,
	CLIENT_ID_PATTERN = /^\d+$/u;

export function normalizeCanvasDomain(value: string): string | null {
	const input = value.trim();
	if (!input) {
		return null;
	}

	let parsed: URL;
	try {
		parsed = new URL(/^[a-z][a-z\d+.-]*:\/\//iu.test(input) ? input : `https://${input}`);
	} catch {
		return null;
	}

	if (
		(parsed.protocol !== "https:" && parsed.protocol !== "http:") ||
		parsed.username ||
		parsed.password ||
		parsed.port
	) {
		return null;
	}

	const domain = parsed.hostname.toLowerCase();
	return DOMAIN_PATTERN.test(domain) ? domain : null;
}

export function isBetaDomain(domain: string): boolean {
	return domain.toLowerCase().endsWith(".beta.instructure.com");
}

export function deriveUrls(state: Pick<AppState, "domain" | "region">) {
	const tenant = state.domain.replace(/\.beta\.instructure\.com$/u, ".instructure.com"),
		tenantName = tenant.slice(0, -".instructure.com".length),
		environment = isBetaDomain(state.domain) ? "maple-beta" : "maple",
		region = state.region || "<region>";

	return {
		auth: `https://${state.domain}/login/oauth2/auth`,
		mcp: `https://${tenantName}.${environment}.${region}.core.inseng.io/mcp`,
		scope: "https://sso.canvaslms.com/all-client-scopes",
		token: `https://${state.domain}/login/oauth2/token`,
	};
}

export function readState(search: string, storage: StorageLike | null): AppState {
	const params = new URLSearchParams(search),
		saved = readPreferences(storage),
		domain =
			normalizeCanvasDomain(params.get("domain") ?? "") ??
			normalizeCanvasDomain(saved.domain) ??
			"",
		queryClient = params.get("client"),
		client = isClient(queryClient) ? queryClient : (saved.client ?? "claude-code"),
		queryKey = params.get("key"),
		key = queryKey === "private" || queryKey === "public" ? queryKey : (saved.key ?? "public"),
		queryRegion = params.get("region"),
		region = isRegion(queryRegion) ? queryRegion : saved.region,
		clientId = params.get("clientId") ?? "";

	return {
		client,
		clientId: CLIENT_ID_PATTERN.test(clientId) ? clientId : "",
		domain,
		key,
		region,
	};
}

function readPreferences(storage: StorageLike | null): SavedPreferences {
	try {
		const raw = storage?.getItem(STORAGE_KEY);
		if (!raw) {
			return { client: null, domain: "", key: null, region: "" };
		}
		const saved: unknown = JSON.parse(raw);
		if (!isRecord(saved)) {
			return { client: null, domain: "", key: null, region: "" };
		}
		return {
			client: isClient(saved.client) ? saved.client : null,
			domain: typeof saved.domain === "string" ? saved.domain : "",
			key: saved.key === "public" || saved.key === "private" ? saved.key : null,
			region: isRegion(saved.region) ? saved.region : "",
		};
	} catch {
		return { client: null, domain: "", key: null, region: "" };
	}
}

export function savePreferences(state: AppState, storage: StorageLike | null): void {
	try {
		storage?.setItem(
			STORAGE_KEY,
			JSON.stringify({
				client: state.client,
				domain: normalizeCanvasDomain(state.domain) ?? "",
				key: state.key,
				region: isRegion(state.region) ? state.region : "",
			}),
		);
	} catch {
		// Storage is optional; the current page state remains usable.
	}
}

export function stateQuery(state: AppState, includeClientId = true): string {
	const params = new URLSearchParams();
	if (state.domain) {
		params.set("domain", state.domain);
	}
	params.set("client", state.client);
	params.set("key", state.key);
	if (state.region) {
		params.set("region", state.region);
	}
	if (includeClientId && CLIENT_ID_PATTERN.test(state.clientId)) {
		params.set("clientId", state.clientId);
	}
	return params.toString();
}

export function isClient(value: unknown): value is Client {
	return (
		typeof value === "string" &&
		(CLIENTS.includes(value as (typeof CLIENTS)[number]) ||
			RULESYNC_TARGETS.some((target) => target.id === value))
	);
}

export function isRegion(value: unknown): value is Region {
	return typeof value === "string" && REGIONS.includes(value as Region);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
