// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { mountApp } from "../src/app";
import { CLIENTS, clientDefinition } from "../src/clients";
import { renderGuide } from "../src/guides/render";
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
		expect(clientDefinition("gemini-cli").guides?.personal?.status).toBe("pending");
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
