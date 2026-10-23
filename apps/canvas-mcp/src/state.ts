import { type Client, type KeyType, type InstallMode, isClient } from "./clients/ids";
import { normalizeInstall, normalizeKeyType } from "./clients";
import { type PlatformPreference, isPlatformPreference } from "./platform";
export { CLIENTS, isClient, type Client, type KeyType, type InstallMode } from "./clients/ids";

export const REGIONS = [
	"us-east-1",
	"us-west-2",
	"eu-west-1",
	"eu-central-1",
	"ca-central-1",
	"ap-southeast-1",
	"ap-southeast-2",
] as const;

export type Region = (typeof REGIONS)[number];

export interface AppState {
	domain: string;
	client: Client;
	key: KeyType;
	region: Region | "";
	clientId: string;
	redirectUris: string;
	install: InstallMode;
	surface: "canvas" | "provider";
	platform: PlatformPreference;
}

export interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

interface SavedPreferences {
	platform: PlatformPreference;
	domain: string;
	client: Client | null;
	install: InstallMode | null;
	key: KeyType | null;
	region: Region | "";
	redirectUris: string;
}

const STORAGE_KEY = "canvas-mcp:v1",
	DOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.(?:beta\.)?instructure\.com$/u,
	CLIENT_ID_PATTERN = /^\d{1,18}$/u;

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

export function isTestDomain(value: string): boolean {
	const input = value.trim();
	try {
		// Strip a terminal DNS root dot so "school.test.instructure.com." is still detected.
		const hostname = new URL(
			/^[a-z][a-z\d+.-]*:\/\//iu.test(input) ? input : `https://${input}`,
		).hostname.replace(/\.$/u, "");
		return hostname.endsWith(".test") || hostname.endsWith(".test.instructure.com");
	} catch {
		return false;
	}
}

export function normalizeRedirectUris(value: string): string {
	return value
		.split(/\r\n?|\n/u)
		.map((line) => line.trim())
		.filter(Boolean)
		.join("\n");
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
		key = queryKey === "private" || queryKey === "public" ? queryKey : (saved.key ?? ""),
		queryRegion = params.get("region"),
		region = isRegion(queryRegion) ? queryRegion : saved.region,
		clientId = params.get("clientId") ?? "";
	const queryPlatform = params.get("platform");

	return {
		platform: isPlatformPreference(queryPlatform) ? queryPlatform : saved.platform,
		client,
		clientId: CLIENT_ID_PATTERN.test(clientId) ? clientId : "",
		redirectUris: normalizeRedirectUris(params.get("redirectUris") ?? saved.redirectUris),
		domain,
		key: normalizeKeyType(client, key),
		install: normalizeInstall(
			client,
			params.get("install") === "personal" || params.get("install") === "enterprise"
				? params.get("install")!
				: (saved.install ?? "personal"),
		),
		surface: params.get("surface") === "provider" ? "provider" : "canvas",
		region,
	};
}

function readPreferences(storage: StorageLike | null): SavedPreferences {
	try {
		const raw = storage?.getItem(STORAGE_KEY);
		if (!raw) {
			return {
				client: null,
				domain: "",
				key: null,
				region: "",
				install: null,
				platform: "auto",
				redirectUris: "",
			};
		}
		const saved: unknown = JSON.parse(raw);
		if (!isRecord(saved)) {
			return {
				client: null,
				domain: "",
				key: null,
				region: "",
				install: null,
				platform: "auto",
				redirectUris: "",
			};
		}
		return {
			platform: isPlatformPreference(saved.platform) ? saved.platform : "auto",
			client: isClient(saved.client) ? saved.client : null,
			install:
				saved.install === "personal" || saved.install === "enterprise" ? saved.install : null,
			domain: typeof saved.domain === "string" ? saved.domain : "",
			key: saved.key === "public" || saved.key === "private" ? saved.key : null,
			region: isRegion(saved.region) ? saved.region : "",
			redirectUris:
				typeof saved.redirectUris === "string" ? normalizeRedirectUris(saved.redirectUris) : "",
		};
	} catch {
		return {
			client: null,
			domain: "",
			key: null,
			region: "",
			install: null,
			platform: "auto",
			redirectUris: "",
		};
	}
}

export function savePreferences(state: AppState, storage: StorageLike | null): void {
	try {
		storage?.setItem(
			STORAGE_KEY,
			JSON.stringify({
				platform: state.platform,
				client: state.client,
				install: normalizeInstall(state.client, state.install),
				domain: normalizeCanvasDomain(state.domain) ?? "",
				key: normalizeKeyType(state.client, state.key),
				region: isRegion(state.region) ? state.region : "",
				redirectUris: normalizeRedirectUris(state.redirectUris),
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
	params.set("key", normalizeKeyType(state.client, state.key));
	params.set("install", normalizeInstall(state.client, state.install));
	params.set("platform", state.platform);
	if (state.surface === "provider") params.set("surface", "provider");
	if (state.region) {
		params.set("region", state.region);
	}
	if (includeClientId && CLIENT_ID_PATTERN.test(state.clientId)) {
		params.set("clientId", state.clientId);
	}
	if (state.client === "generic" && state.redirectUris) {
		params.set("redirectUris", normalizeRedirectUris(state.redirectUris));
	}
	return params.toString();
}

export function isRegion(value: unknown): value is Region {
	return typeof value === "string" && REGIONS.includes(value as Region);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
