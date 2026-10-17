// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { CLIENTS, clientDefinition, normalizeKeyType } from "../src/clients";
import { renderPage } from "../src/page";
import { connectionReadiness } from "../src/setup";
import { readState, stateQuery, savePreferences } from "../src/state";

describe("typed client requirements", () => {
	it("adds both new clients and preserves Rulesync aliases", () => {
		for (const id of ["chatgpt", "superhuman-go"] as const) {
			expect(CLIENTS.find((client) => client.id === id)).toBeDefined();
			expect(readState(`?${stateQuery(readState(`?client=${id}`, null))}`, null).client).toBe(id);
			expect(clientDefinition(id).facts.remoteHttp.value).toBe("unknown");
		}
		expect(clientDefinition("superhuman-go").installModes).toEqual([]);
		expect(clientDefinition("superhuman-go").setupNote).not.toContain(
			"connection fields to configure",
		);
		const superhumanPage = renderPage(readState("?client=superhuman-go", null), "user", "", false);
		expect(superhumanPage).toContain("install flow unverified");
		expect(superhumanPage).not.toContain("install=personal");
		expect(clientDefinition("codexcli")).toBe(clientDefinition("codex"));
		expect(clientDefinition("antigravity-cli")).not.toBe(clientDefinition("antigravity"));
	});
	it("prefers public for both-capable clients and retains an explicit private choice", () => {
		for (const id of ["claude-ai", "claude-code", "codex", "gemini-cli"] as const) {
			expect(normalizeKeyType(id, "")).toBe("public");
			expect(normalizeKeyType(id, "private")).toBe("private");
		}
		expect(normalizeKeyType("copilot-studio", "public")).toBe("private");
	});
	it("normalizes install mode while accepting old preferences and excluding credentials", () => {
		const saved: Record<string, string> = {
			"canvas-mcp:v1": JSON.stringify({ client: "copilot-studio", key: "public" }),
		};
		const storage = {
			getItem: (key: string) => saved[key] ?? null,
			setItem: (key: string, value: string) => {
				saved[key] = value;
			},
		};
		const state = readState("?install=invalid&clientId=12345&surface=provider", storage);
		expect(state).toMatchObject({ install: "enterprise", key: "private", surface: "provider" });
		savePreferences(state, storage);
		expect(JSON.parse(saved["canvas-mcp:v1"])).toMatchObject({ install: "enterprise" });
		expect(saved["canvas-mcp:v1"]).not.toMatch(/clientId|surface|secret/iu);
		expect(readState("?clientId=123456789012345678901234567890", null).clientId).toBe("");
	});
	it("blocks unsupported clients even with complete connection values", () => {
		const state = readState(
			"?domain=example.instructure.com&region=us-east-1&clientId=12345",
			null,
		);
		const client = structuredClone(clientDefinition(state.client));
		client.facts.registration = { value: "dcr-only", status: "unverified", evidence: [] };
		expect(connectionReadiness(state, client)).toMatchObject({ ready: false });
		expect(connectionReadiness(state).ready).toBe(true);
	});
	it("keeps evidence attached to individual supported facts", () => {
		for (const client of CLIENTS) {
			for (const fact of [
				client.facts.remoteHttp,
				client.facts.pkce,
				client.facts.staticClientId,
				...Object.values(client.facts.keyTypes),
			]) {
				if (fact.status !== "unverified") expect(fact.evidence.length).toBeGreaterThan(0);
			}
		}
	});
	it("omits source notes, the FAQ, and OAuth requirement details from all client settings pages", () => {
		for (const { id } of CLIENTS) {
			const state = readState(
				`?client=${id}&domain=example.instructure.com&region=us-east-1&clientId=12345`,
				null,
			);
			const page = renderPage(state, "user", state.domain, true);
			expect(page).not.toContain("Troubleshooting and OAuth FAQ");
			expect(page).not.toContain("Last checked:");
			expect(page).not.toContain("Instructure setup guidance");
			expect(page, id).not.toContain("OAuth requirements");
			expect(page).not.toContain('class="shared-troubleshooting"');
			expect(page).not.toContain('class="oauth-facts"');
		}
	});
});
