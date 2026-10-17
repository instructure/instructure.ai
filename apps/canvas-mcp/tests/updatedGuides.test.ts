// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";
import { CLIENTS, clientDefinition } from "../src/clients";
import { guideValues, resolveCodeBlock, renderGuide } from "../src/guides/render";
import { readState } from "../src/state";

beforeEach(() => {
	localStorage.clear();
	document.body.innerHTML = '<div id="root"></div>';
});
afterEach(() => vi.unstubAllGlobals());
describe("updated curated guidance", () => {
	it.each([
		["codex", "Codex managed configuration", "requirements.toml"],
		["chatgpt", "ChatGPT workspace settings", "Configure Access"],
		["antigravity", "Google Cloud console", "Assign users"],
		["antigravity-cli", "Google Cloud console", "Assign users"],
	])(
		"switches %s between personal Canvas setup and enterprise provider instructions",
		(id, surface, instruction) => {
			vi.stubGlobal("scrollTo", vi.fn());
			history.replaceState(
				null,
				"",
				`/canvas-mcp/?client=${id}&key=private&install=personal&domain=example.instructure.com&region=us-east-1&page=admin`,
			);
			mountApp("admin");
			expect(document.querySelector(".guide-surfaces")).toBeNull();
			const enterprise = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
			expect(enterprise.disabled).toBe(false);
			enterprise.checked = true;
			enterprise.dispatchEvent(new Event("change", { bubbles: true }));
			expect(
				[...document.querySelectorAll(".instui-segmented-control label")].map(
					(label) => label.textContent,
				),
			).toEqual(["1. Canvas", `2. ${surface}`]);
			document.querySelector<HTMLButtonElement>("#configure-provider-button-bottom")!.click();
			expect(document.querySelector<HTMLElement>("#guide-provider")?.hidden).toBe(false);
			expect(document.querySelector("#guide-provider")?.textContent).toContain(instruction);
			expect(new URLSearchParams(location.search).get("install")).toBe("enterprise");
			expect(new URLSearchParams(location.search).get("key")).toBe("private");
			const toggle = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
			toggle.checked = false;
			toggle.dispatchEvent(new Event("change", { bubbles: true }));
			expect(document.querySelector(".guide-surfaces")).toBeNull();
			expect(document.querySelector<HTMLElement>("#guide-canvas")?.hidden).toBe(false);
		},
	);
	it.each([
		["claude-ai", "Connect to the organization connector"],
		["gemini-enterprise", "Use the Canvas connector"],
		["copilot-studio", "Use the configured agent"],
	])("shows only member instructions for provisioned %s connections", (id, heading) => {
		history.replaceState(
			null,
			"",
			`/canvas-mcp/?client=${id}&install=enterprise&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
		);
		mountApp("user");
		expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("user");
		expect(
			document.querySelector(
				".server-details-card, .guide-fields, #guide-canvas, .admin-steps, .install-modes, [data-install]",
			),
		).toBeNull();
		expect(
			document.querySelector(".workspace-grid")?.classList.contains("workspace-grid--single"),
		).toBe(true);
		expect(document.querySelector("#guide-provider")?.textContent).toContain(heading);
		expect(document.querySelector("#guide-provider")?.textContent).not.toMatch(
			/create the data store|Policies|Use your own OAuth client|Developer Keys/iu,
		);
	});
	it.each(["codex", "antigravity", "antigravity-cli"])(
		"retains connection fields for enterprise %s users who configure their client",
		(id) => {
			history.replaceState(
				null,
				"",
				`/canvas-mcp/?client=${id}&install=enterprise&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
			);
			mountApp("user");
			expect(document.querySelector(".server-details-card")).not.toBeNull();
			expect(document.querySelector("#generated-mcp-url")?.getAttribute("value")).toBe(
				"https://example.maple.us-east-1.core.inseng.io/mcp",
			);
			expect(
				document.querySelector(".guide-fields, #guide-canvas, .install-modes, [data-install]"),
			).toBeNull();
			expect(document.querySelector("#guide-provider")?.textContent).not.toMatch(
				/requirements.toml|Assign users a Gemini Enterprise/iu,
			);
		},
	);
	it("uses the server Configuration toggle as the only source of client install mode", () => {
		vi.stubGlobal("scrollTo", vi.fn());
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=claude-ai&install=personal&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=admin",
		);
		mountApp("admin");
		const enterprise = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		enterprise.checked = true;
		enterprise.dispatchEvent(new Event("change", { bubbles: true }));
		document.querySelector<HTMLButtonElement>("#tab-connect")!.click();
		expect(document.querySelector(".server-details-card")).toBeNull();
		expect(document.querySelector("#guide-provider")?.textContent).toContain(
			"organization connector",
		);
		document.querySelector<HTMLButtonElement>("#tab-admin")!.click();
		const personal = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		personal.checked = false;
		personal.dispatchEvent(new Event("change", { bubbles: true }));
		document.querySelector<HTMLButtonElement>("#tab-connect")!.click();
		expect(document.querySelector(".server-details-card")).not.toBeNull();
		expect(document.querySelector("#guide-provider")?.textContent).toContain(
			"Add custom connector",
		);
		expect(document.querySelector("#guide-provider")?.textContent).not.toContain(
			"organization connector",
		);
		expect(document.querySelector(".install-modes, [data-install]")).toBeNull();
		expect(new URLSearchParams(location.search).get("install")).toBe("personal");
	});

	it("blocks ChatGPT authentication without claiming DCR-only behavior", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=chatgpt&domain=example.instructure.com&region=us-east-1&clientId=12345&page=connect",
		);
		mountApp("user");
		expect(document.querySelector(".details-panel")?.textContent).not.toContain("Canvas MCP bug");
		expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(true);
		expect(document.querySelector("#client-id-input")).not.toBeNull();
		expect(clientDefinition("chatgpt").facts.registration.value).toBe("unknown");
	});
	it("keeps CLI and IDE facts distinct and defaults to a documented key type", () => {
		expect(clientDefinition("antigravity-cli").facts.redirectUri).toMatchObject({
			kind: "fixed",
			uris: ["https://antigravity.google/oauth-callback"],
		});
		expect(clientDefinition("antigravity").facts.redirectUri).toMatchObject({
			kind: "fixed",
			uris: ["https://antigravity.google/oauth-callback"],
		});
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
				const guide = client.guides?.[install];
				for (const step of guide?.steps ?? []) {
					if (
						step.kind !== "canvas-key" &&
						(step.audience === "client" || (step.kind === "verify" && step.audience !== "server"))
					) {
						expect(document.querySelector(`[data-guide-step="${step.id}"]`)).toBeNull();
					}
				}
				if (install === "personal") expect(document.querySelector("#guide-provider")).toBeNull();
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
