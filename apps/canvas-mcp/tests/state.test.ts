// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
	deriveUrls,
	normalizeCanvasDomain,
	readState,
	savePreferences,
	stateQuery,
	type AppState,
	type StorageLike,
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
		expect(
			deriveUrls({ domain: "utah.instructure.com", region: "us-east-1" }),
		).toEqual({
			mcp: "https://utah.maple.us-east-1.core.inseng.io/mcp",
			auth: "https://utah.instructure.com/login/oauth2/auth",
			token: "https://utah.instructure.com/login/oauth2/token",
			scope: "https://sso.canvaslms.com/all-client-scopes",
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
		expect(deriveUrls({ domain: "utah.instructure.com", region: "" }).mcp).toContain(
			".<region>.",
		);
	});
});

describe("app state", () => {
	it("uses URL values before saved preferences and validates untrusted values", () => {
		const storage = memoryStorage({
			domain: "saved.instructure.com",
			client: "codex",
			key: "private",
			region: "eu-west-1",
		});

		expect(readState("?domain=utah.instructure.com&client=generic&region=nope", storage)).toEqual({
			domain: "utah.instructure.com",
			client: "generic",
			key: "private",
			region: "eu-west-1",
			clientId: "",
		});
	});

	it("ignores unavailable or malformed storage", () => {
		expect(readState("", null)).toMatchObject({
			domain: "",
			client: "claude-code",
			key: "public",
			region: "",
		});
		expect(readState("", memoryStorageRaw("not json"))).toMatchObject({ domain: "" });
	});

	it("does not persist client IDs or secrets and serializes only public values", () => {
		const storage = memoryStorage();
		const state: AppState = {
			domain: "utah.instructure.com",
			client: "codex",
			key: "private",
			region: "us-west-2",
			clientId: "12345",
		};

		savePreferences(state, storage);

		expect(storage.getItem("canvas-mcp:v1")).toBe(
			'{"domain":"utah.instructure.com","client":"codex","key":"private","region":"us-west-2"}',
		);
		expect(stateQuery(state)).toBe(
			"domain=utah.instructure.com&client=codex&key=private&region=us-west-2&clientId=12345",
		);
		expect(stateQuery({ ...state, clientId: "x%26secret=abc" })).not.toContain("secret");
	});
});

function memoryStorage(initial?: Record<string, unknown>): StorageLike {
	const data = new Map<string, string>();
	if (initial) data.set("canvas-mcp:v1", JSON.stringify(initial));
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