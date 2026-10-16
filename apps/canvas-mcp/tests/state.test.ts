// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
	type AppState,
	type StorageLike,
	deriveUrls,
	normalizeCanvasDomain,
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
		"https://utah.instructure.com.evil.test",
		"https://user@utah.instructure.com",
		"utah.instructure.com:8443",
		"https://utah.instructure.com.evil",
		"https://foo.bar.instructure.com",
	])("rejects unsupported domain input %s", (input) => {
		expect(normalizeCanvasDomain(input)).toBeNull();
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
	it("uses URL values before saved preferences and validates untrusted values", () => {
		const storage = memoryStorage({
			client: "codex",
			domain: "saved.instructure.com",
			key: "private",
			region: "eu-west-1",
		});

		expect(readState("?domain=utah.instructure.com&client=generic&region=nope", storage)).toEqual({
			client: "generic",
			clientId: "",
			domain: "utah.instructure.com",
			key: "private",
			region: "eu-west-1",
		});
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
				clientId: "12345",
				domain: "utah.instructure.com",
				key: "private",
				region: "us-west-2",
			};

		savePreferences(state, storage);

		expect(JSON.parse(storage.getItem("canvas-mcp:v1") ?? "")).toEqual({
			client: "codex",
			domain: "utah.instructure.com",
			key: "private",
			region: "us-west-2",
		});
		expect(stateQuery(state)).toBe(
			"domain=utah.instructure.com&client=codex&key=private&region=us-west-2&clientId=12345",
		);
		expect(stateQuery({ ...state, clientId: "x%26secret=abc" })).not.toContain("secret");
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
