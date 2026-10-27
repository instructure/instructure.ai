// @vitest-environment node

import { describe, expect, it } from "vite-plus/test";
import {
	type AppState,
	type StorageLike,
	deriveUrls,
	isTestDomain,
	normalizeCanvasDomain,
	normalizeRedirectUris,
	readState,
	savePreferences,
	stateQuery,
} from "../src/state";

describe("normalizeCanvasDomain", () => {
	it.each([
		["utah.instructure.com", "utah.instructure.com"],
		["https://UTAH.beta.instructure.com/courses/1", "utah.beta.instructure.com"],
		["utah.instructure.com/path", "utah.instructure.com"],
	])("normalizes supported domain input %s", (input, expected) => {
		expect(normalizeCanvasDomain(input)).toBe(expected);
	});

	it.each([
		"school.edu",
		"utah.test.instructure.com",
		"https://utah.instructure.com.evil.test",
		"https://user@utah.instructure.com",
		"utah.instructure.com:8443",
		"https://utah.instructure.com.evil",
		"https://foo.bar.instructure.com",
	])("rejects unsupported domain input %s", (input) => {
		expect(normalizeCanvasDomain(input)).toBeNull();
	});
});

describe("isTestDomain", () => {
	it.each([
		"school.test",
		"school.test.instructure.com",
		" https://SCHOOL.TEST.instructure.com/courses/1 ",
		"http://school.test/",
		"school.test.",
		"school.test.instructure.com.",
		"https://school.test.instructure.com./courses/1",
	])("identifies test instances: %s", (input) => {
		expect(isTestDomain(input)).toBe(true);
	});

	it.each([
		"",
		"school",
		"school.beta",
		"school.instructure.com",
		"school.beta.instructure.com",
		"test.instructure.com",
		"school-test",
		"not a domain.test",
		"school.instructure.com.",
	])("does not flag non-test input: %s", (input) => {
		expect(isTestDomain(input)).toBe(false);
	});
});

describe("deriveUrls", () => {
	it("builds production URLs for a selected region", () => {
		expect(deriveUrls({ domain: "utah.instructure.com", region: "us-east-1" })).toEqual({
			auth: "https://utah.instructure.com/login/oauth2/auth",
			mcp: "https://utah.maple.us-east-1.core.inseng.io/mcp",
			scope: "https://sso.canvaslms.com/all-client-scopes",
			token: "https://utah.instructure.com/login/oauth2/token",
		});
	});

	it("builds beta URLs and keeps the beta Canvas OAuth domain", () => {
		const urls = deriveUrls({
			domain: "utah.beta.instructure.com",
			region: "eu-west-1",
		});

		expect(urls.mcp).toBe("https://utah.maple-beta.eu-west-1.core.inseng.io/mcp");
		expect(urls.auth).toBe("https://utah.beta.instructure.com/login/oauth2/auth");
	});

	it("uses a non-copyable placeholder until a region is selected", () => {
		expect(deriveUrls({ domain: "utah.instructure.com", region: "" }).mcp).toContain(".<region>.");
	});
});

describe("app state", () => {
	it("normalizes callback URIs one per line without rewriting their exact values", () => {
		expect(
			normalizeRedirectUris(
				" \r\n http://localhost:8081/callback \r\n\n client-app://oauth/callback?x=1 \n",
			),
		).toBe("http://localhost:8081/callback\nclient-app://oauth/callback?x=1");
	});

	it("round-trips generic callback URIs through preferences and setup links", () => {
		const storage = memoryStorage();
		const state = readState("?client=generic", null);
		state.redirectUris = "http://localhost:8081/callback\nhttps://client.example/callback";
		savePreferences(state, storage);
		expect(readState("", storage).redirectUris).toBe(state.redirectUris);
		expect(readState(`?${stateQuery(state)}`, null).redirectUris).toBe(state.redirectUris);
		expect(readState("?client=generic&redirectUris=", storage).redirectUris).toBe("");
		expect(
			readState("?client=generic&redirectUris=client-app%3A%2F%2Fcallback", storage).redirectUris,
		).toBe("client-app://callback");
		expect(
			new URLSearchParams(stateQuery({ ...state, client: "claude-code" })).has("redirectUris"),
		).toBe(false);
		expect(readState("", memoryStorage({ redirectUris: [] })).redirectUris).toBe("");
	});

	it("uses URL values before saved preferences and validates untrusted values", () => {
		const storage = memoryStorage({
			client: "codex",
			domain: "saved.instructure.com",
			key: "private",
			region: "eu-west-1",
		});

		expect(readState("?domain=utah.instructure.com&client=generic&region=nope", storage)).toEqual({
			client: "generic",
			install: "personal",
			surface: "canvas",
			platform: "auto",
			clientId: "",
			redirectUris: "",
			domain: "utah.instructure.com",
			key: "private",
			region: "eu-west-1",
		});
	});

	it("accepts Client IDs up to 18 digits in setup links", () => {
		const clientId = "123450000000000012";
		const state = readState(`?clientId=${clientId}`, null);

		expect(state.clientId).toBe(clientId);
		expect(new URLSearchParams(stateQuery(state)).get("clientId")).toBe(clientId);
		expect(readState(`?clientId=${clientId}3`, null).clientId).toBe("");
	});

	it("ignores unavailable or malformed storage", () => {
		expect(readState("", null)).toMatchObject({
			client: "claude-code",
			domain: "",
			key: "public",
			region: "",
		});
		expect(readState("", memoryStorageRaw("not json"))).toMatchObject({ domain: "" });
		expect(
			readState(
				"",
				memoryStorage({ client: [], domain: { host: "evil" }, key: "bad", region: {} }),
			),
		).toMatchObject({ client: "claude-code", domain: "", key: "public", region: "" });
	});

	it("does not persist client IDs or secrets and serializes only public values", () => {
		const storage = memoryStorage(),
			state: AppState = {
				client: "codex",
				install: "personal",
				surface: "canvas",
				platform: "mac",
				clientId: "12345",
				redirectUris: "",
				domain: "utah.instructure.com",
				key: "private",
				region: "us-west-2",
			};

		savePreferences(state, storage);

		expect(JSON.parse(storage.getItem("canvas-mcp:v1") ?? "")).toEqual({
			platform: "mac",
			client: "codex",
			install: "personal",
			domain: "utah.instructure.com",
			key: "private",
			region: "us-west-2",
			redirectUris: "",
		});
		expect(stateQuery(state)).toBe(
			"domain=utah.instructure.com&client=codex&key=private&install=personal&platform=mac&region=us-west-2&clientId=12345",
		);
		expect(stateQuery({ ...state, clientId: "x%26secret=abc" })).not.toContain("secret");
	});

	it.each([
		["", "windows", "windows"],
		["?platform=mac", "windows", "mac"],
		["?platform=auto", "windows", "auto"],
		["?platform=windows", "mac", "windows"],
		["?platform=invalid", "mac", "mac"],
		["?platform=invalid", "invalid", "auto"],
		["", null, "auto"],
	])("resolves platform preference for %s over saved %s", (search, saved, expected) => {
		const state = readState(search, memoryStorage({ platform: saved }));
		expect(state.platform).toBe(expected);
		expect(new URLSearchParams(stateQuery(state)).get("platform")).toBe(expected);
	});

	it("round-trips Auto without pinning the detected platform", () => {
		const storage = memoryStorage();
		const state = readState("?platform=auto", null);
		savePreferences(state, storage);
		expect(readState("", storage).platform).toBe("auto");
		expect(readState("", memoryStorageRaw("[]")).platform).toBe("auto");
		expect(readState("", memoryStorageRaw("not json")).platform).toBe("auto");
	});
});

function memoryStorage(initial?: Record<string, unknown>): StorageLike {
	const data = new Map<string, string>();
	if (initial) {
		data.set("canvas-mcp:v1", JSON.stringify(initial));
	}
	return {
		getItem: (key) => data.get(key) ?? null,
		setItem: (key, value) => data.set(key, value),
	};
}

function memoryStorageRaw(value: string): StorageLike {
	return {
		getItem: () => value,
		setItem: () => undefined,
	};
}
