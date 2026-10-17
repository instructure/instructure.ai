// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { mountApp } from "../src/app";
import { CLIENTS, clientDefinition } from "../src/clients";
import { guideValues, resolveCodeBlock, renderGuide } from "../src/guides/render";
import { readState } from "../src/state";

beforeEach(() => {
	localStorage.clear();
	document.body.innerHTML = '<div id="root"></div>';
});
describe("updated curated guidance", () => {
	it("blocks ChatGPT authentication without claiming DCR-only behavior", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=chatgpt&domain=example.instructure.com&region=us-east-1&clientId=12345&page=connect",
		);
		mountApp("user");
		expect(document.querySelector(".details-panel")?.textContent).not.toContain("Canvas MCP bug");
		expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(true);
		expect(document.querySelector("#client-id-input")).toBeNull();
		expect(clientDefinition("chatgpt").facts.registration.value).toBe("unknown");
	});
	it("keeps CLI and IDE facts distinct and defaults to a documented key type", () => {
		expect(clientDefinition("antigravity-cli").facts.redirectUri).toMatchObject({
			kind: "fixed",
			uris: ["https://antigravity.google/oauth-callback"],
		});
		expect(clientDefinition("antigravity").facts.redirectUri).toMatchObject({ kind: "unverified" });
		expect(readState("?client=antigravity-cli", null).key).toBe("private");
		expect(readState("?client=antigravity-cli&key=public", null).key).toBe("public");
		expect(clientDefinition("gemini-cli").guides?.personal?.status).toBe("documented");
	});
	it("provides the researched Gemini OAuth configuration for each key type", () => {
		const client = clientDefinition("gemini-cli");
		for (const key of ["public", "private"] as const) {
			const state = readState(
				`?client=gemini-cli&key=${key}&domain=example.instructure.com&region=us-east-1&clientId=12345`,
				null,
			);
			const step = client.guides?.personal?.steps.find(
				(step) => step.kind === "provider" && step.key === key,
			);
			if (!step || step.kind !== "provider")
				throw new Error("Missing Gemini provider configuration");
			const block = step.content.find((block) => block.kind === "code");
			if (!block || block.kind !== "code") throw new Error("Missing Gemini JSON");
			const resolved = resolveCodeBlock(block.text, guideValues(client, state));
			expect(resolved.ready).toBe(true);
			const config = JSON.parse(resolved.text).mcpServers["canvas-mcp"];
			expect(config.httpUrl).toBe("https://example.maple.us-east-1.core.inseng.io/mcp");
			expect(config.oauth).toMatchObject({
				clientId: "12345",
				redirectUri: "http://localhost:8081/oauth/callback",
				enabled: true,
			});
			expect(Boolean(config.oauth.clientSecret)).toBe(key === "private");
		}
	});
	it("keeps admin prerequisites and research notices out of every client guide", () => {
		for (const client of CLIENTS)
			for (const install of client.installModes) {
				const state = readState(`?client=${client.id}&install=${install}`, null);
				document.body.innerHTML = renderGuide(client, state, true);
				expect(document.querySelector(".guide-pending")).toBeNull();
				expect(document.body.textContent).not.toMatch(
					/awaiting verification|source verification|Scope list awaiting|Security warning|instructions are not available/iu,
				);
			}
	});
	it("renders every client and supported mode with only approved tokens", () => {
		for (const client of CLIENTS)
			for (const install of client.installModes) {
				const state = readState(
					`?client=${client.id}&install=${install}&domain=example.instructure.com&region=us-east-1&clientId=12345`,
					null,
				);
				expect(() => renderGuide(client, state, true)).not.toThrow();
			}
	});
});
