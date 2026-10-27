// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { mountApp } from "../src/app";
import { CLIENTS, clientDefinition } from "../src/clients";
import { guideValues, resolveCodeBlock, renderGuide } from "../src/guides/render";
import { readState } from "../src/state";

beforeEach(() => {
	localStorage.clear();
	document.body.innerHTML = '<div id="root"></div>';
});
afterEach(() => vi.unstubAllGlobals());
describe("curated guide structure and behavior", () => {
	it.each([
		["personal", "public"],
		["personal", "private"],
		["enterprise", "public"],
		["enterprise", "private"],
	])("blocks %s Codex connections for %s keys", (install, key) => {
		history.replaceState(
			null,
			"",
			`?client=codex&install=${install}&key=${key}&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
		);
		mountApp("user");
		expect(clientDefinition("codex").status).toMatchObject({
			kind: "known-issue",
			installModes: ["personal", "enterprise"],
		});
		expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("admin");
		expect(document.querySelector('.known-issue-alert[role="alert"]')).not.toBeNull();
		expect(document.querySelector(".client-status-pill")?.textContent).toBe("Known issue");
		expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(true);
		expect(
			document.querySelector<HTMLButtonElement>("#configure-client-button-bottom")?.disabled,
		).toBe(true);
	});

	it.each(["public", "private"])(
		"blocks direct personal Gemini CLI client links for %s keys",
		(key) => {
			history.replaceState(
				null,
				"",
				`?client=gemini-cli&install=personal&key=${key}&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
			);
			mountApp("user");
			expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("admin");
			expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(true);
			expect(
				document.querySelector<HTMLButtonElement>("#configure-client-button-bottom")?.disabled,
			).toBe(true);
			expect(document.querySelector("#client-id-input")).not.toBeNull();
		},
	);

	it.each([
		["personal", "public"],
		["personal", "private"],
		["enterprise", "public"],
		["enterprise", "private"],
	])("blocks Antigravity CLI connections and shows the top alert for %s/%s", (install, key) => {
		vi.stubGlobal("scrollTo", vi.fn());
		history.replaceState(
			null,
			"",
			`?client=antigravity-cli&install=${install}&key=${key}&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
		);
		mountApp("user");
		expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("admin");
		const alert = document.querySelector('.known-issue-alert[role="alert"]')!;
		expect(alert.querySelector(".shiki-block.language-text pre.shiki > code")).not.toBeNull();
		expect(alert.querySelector<HTMLButtonElement>(".shiki-copy")?.dataset.copy).toBe(
			alert.querySelector("pre.shiki code")?.textContent,
		);
		expect(alert.classList.contains("-color-danger")).toBe(true);
		expect(alert.nextElementSibling?.classList.contains("details-panel")).toBe(true);
		expect(document.querySelector(".client-status-pill")?.textContent).toBe("Known issue");
		expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(true);
		expect(document.querySelector("#client-id-input")).not.toBeNull();
		if (install === "enterprise") {
			document.querySelector<HTMLButtonElement>("#configure-provider-button-bottom")!.click();
			expect(document.querySelector<HTMLElement>("#guide-provider")?.hidden).toBe(false);
		}
		expect(
			document.querySelector<HTMLButtonElement>("#configure-client-button-bottom")?.disabled,
		).toBe(true);
		const state = readState(location.search, null);
		document.body.innerHTML = renderGuide(clientDefinition(state.client), state, false);
		expect(document.querySelector('[data-guide-step="verify"], [data-copy-template]')).toBeNull();
	});

	it.each([
		["personal", "public"],
		["personal", "private"],
		["enterprise", "public"],
		["enterprise", "private"],
	])("uses key-specific Antigravity CLI configuration for %s/%s", (install, key) => {
		const state = readState(
			`?client=antigravity-cli&install=${install}&key=${key}&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001`,
			null,
		);
		document.body.innerHTML = renderGuide(
			{ ...clientDefinition(state.client), blocker: undefined },
			state,
			false,
		);
		const step = document.querySelector(`[data-guide-step="provider-configure-${key}"]`)!;
		expect(step).not.toBeNull();
		expect(
			document.querySelector(
				`[data-guide-step="provider-configure-${key === "public" ? "private" : "public"}"]`,
			),
		).toBeNull();
		const copy = step.querySelector<HTMLButtonElement>(".language-json [data-copy]")!;
		expect(copy.disabled).toBe(false);
		for (const platform of ["mac", "windows"]) {
			const command = step.querySelector<HTMLButtonElement>(
				`[data-code-platform="${platform}"] [data-copy]`,
			)!;
			expect(command.disabled).toBe(false);
			expect(command.dataset.copy).toContain("https://example.maple.us-east-1.core.inseng.io/mcp");
			expect(command.dataset.copy).toContain("12345000000000001");
			expect(command.dataset.copy).not.toMatch(/\{mcpUrl\}|\{clientId\}/u);
			expect(command.dataset.copy).not.toContain("<ENTER_CLIENT_SECRET_LOCALLY>");
		}
		expect(JSON.parse(copy.dataset.copy!).mcpServers["canvas-mcp"]).toEqual({
			serverUrl: "https://example.maple.us-east-1.core.inseng.io/mcp",
			oauth: {
				clientId: "12345000000000001",
				...(key === "private" ? { clientSecret: "<ENTER_CLIENT_SECRET_LOCALLY>" } : {}),
			},
		});
		if (key === "public") expect(copy.dataset.copy).not.toContain("clientSecret");
		expect(document.querySelector('[data-guide-step="verify"]')).not.toBeNull();
		expect(Boolean(document.querySelector('[data-guide-step="client-enterprise-signin"]'))).toBe(
			install === "enterprise",
		);
	});

	it.each(["codex", "chatgpt", "antigravity", "antigravity-cli", "claude-code", "gemini-cli"])(
		"switches %s between personal Canvas setup and enterprise provider instructions",
		(id) => {
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
			expect(document.querySelectorAll(".instui-segmented-control label")).toHaveLength(2);
			document.querySelector<HTMLButtonElement>("#configure-provider-button-bottom")!.click();
			expect(document.querySelector<HTMLElement>("#guide-provider")?.hidden).toBe(false);
			expect(document.querySelector("#guide-provider [data-guide-step]")).not.toBeNull();
			expect(new URLSearchParams(location.search).get("install")).toBe("enterprise");
			expect(new URLSearchParams(location.search).get("key")).toBe("private");
			const toggle = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
			toggle.checked = false;
			toggle.dispatchEvent(new Event("change", { bubbles: true }));
			expect(document.querySelector(".guide-surfaces")).toBeNull();
			expect(document.querySelector<HTMLElement>("#guide-canvas")?.hidden).toBe(false);
		},
	);
	it.each(["claude-ai", "gemini-enterprise", "copilot-studio", "claude-code"])(
		"shows only member instructions for provisioned %s connections",
		(id) => {
			history.replaceState(
				null,
				"",
				`/canvas-mcp/?client=${id}&install=enterprise&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
			);
			mountApp("user");
			expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("user");
			expect(
				document.querySelector(
					".guide-fields, #guide-canvas, .admin-steps, .install-modes, [data-install]",
				),
			).toBeNull();
			expect(
				document.querySelector(".workspace-grid")?.classList.contains("workspace-grid--single"),
			).toBe(true);
			expect(document.querySelector("#guide-provider [data-guide-step]")).not.toBeNull();
		},
	);
	it.each(["claude-code", "antigravity", "gemini-cli"])(
		"retains connection fields for enterprise %s users who configure their client",
		(id) => {
			history.replaceState(
				null,
				"",
				`/canvas-mcp/?client=${id}&install=enterprise&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
			);
			mountApp("user");
			expect(document.querySelector("#settings-tray .server-details-card")).not.toBeNull();
			expect(document.querySelector("#generated-mcp-url")?.getAttribute("value")).toBe(
				"https://example.maple.us-east-1.core.inseng.io/mcp",
			);
			expect(
				document.querySelector(".guide-fields, #guide-canvas, .install-modes, [data-install]"),
			).toBeNull();
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
		expect(document.querySelector("#settings-tray .server-details-card")).not.toBeNull();
		const enterpriseSteps = [...document.querySelectorAll<HTMLElement>("[data-guide-step]")].map(
			(step) => step.dataset.guideStep,
		);
		document.querySelector<HTMLButtonElement>("#tab-admin")!.click();
		const personal = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		personal.checked = false;
		personal.dispatchEvent(new Event("change", { bubbles: true }));
		document.querySelector<HTMLButtonElement>("#tab-connect")!.click();
		expect(document.querySelector("#settings-tray .server-details-card")).not.toBeNull();
		expect(
			[...document.querySelectorAll<HTMLElement>("[data-guide-step]")].map(
				(step) => step.dataset.guideStep,
			),
		).not.toEqual(enterpriseSteps);
		expect(document.querySelector(".install-modes, [data-install]")).toBeNull();
		expect(new URLSearchParams(location.search).get("install")).toBe("personal");
	});

	it("deploys Claude Code public OAuth through managed settings and keeps client setup sign-in-only", () => {
		vi.stubGlobal("scrollTo", vi.fn());
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=claude-code&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=admin",
		);
		mountApp("admin");
		const enterprise = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		expect(enterprise.disabled).toBe(false);
		expect(enterprise.checked).toBe(false);
		expect(enterprise.closest("label")?.textContent).toBe("Enterprise install");
		expect(enterprise.closest("label")?.nextElementSibling).toBeNull();
		enterprise.checked = true;
		enterprise.dispatchEvent(new Event("change", { bubbles: true }));
		document.querySelector<HTMLButtonElement>("#configure-provider-button-bottom")!.click();
		const copy = document.querySelector<HTMLButtonElement>(
			'[data-guide-step="provider-deploy-public"] [data-copy]',
		)!;
		expect(copy.disabled).toBe(false);
		const config = JSON.parse(copy.dataset.copy!);
		expect(config.managedMcpServers["canvas-mcp"]).toEqual({
			type: "http",
			url: "https://example.maple.us-east-1.core.inseng.io/mcp",
			oauth: {
				clientId: "12345000000000001",
				callbackPort: 8081,
				scopes: "https://sso.canvaslms.com/all-client-scopes",
			},
		});
		expect(copy.dataset.copy).not.toMatch(/secret|token|headers/iu);
		expect(document.querySelector('[data-guide-step="provider-approve-private"]')).toBeNull();
		expect(document.querySelector('[data-guide-step="client-managed"]')).toBeNull();
		document.querySelector<HTMLButtonElement>("#configure-client-button-bottom")!.click();
		expect(document.querySelectorAll("#guide-provider [data-guide-step]")).toHaveLength(2);
		expect(document.querySelector('[data-guide-step="client-managed"]')).not.toBeNull();
		expect(document.querySelector("#guide-provider [data-copy-template]")).toBeNull();
		expect(new URLSearchParams(location.search).get("install")).toBe("enterprise");
		expect(JSON.parse(localStorage.getItem("canvas-mcp:v1")!)).toMatchObject({
			install: "enterprise",
			client: "claude-code",
		});

		history.replaceState(null, "", "/canvas-mcp/?page=connect&clientId=12345000000000001");
		mountApp("user");
		expect(document.querySelector('[data-guide-step="client-managed"]')).not.toBeNull();
		document.querySelector<HTMLButtonElement>("#tab-admin")!.click();
		const personal = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		personal.checked = false;
		personal.dispatchEvent(new Event("change", { bubbles: true }));
		document.querySelector<HTMLButtonElement>("#tab-connect")!.click();
		expect(
			document.querySelector('[data-guide-step="provider-public"] .shiki-code-group'),
		).not.toBeNull();
		expect(document.querySelector('[data-guide-step="client-managed"]')).toBeNull();
		expect(new URLSearchParams(location.search).get("install")).toBe("personal");
	});

	it("uses an approved catalog and per-user secret prompt for private Claude Code enterprise keys", () => {
		const state = readState(
			"?client=claude-code&install=enterprise&key=private&surface=provider&platform=windows&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001",
			null,
		);
		const client = clientDefinition("claude-code");
		document.body.innerHTML = renderGuide(client, state, true);
		expect(document.querySelector('[data-guide-step="provider-deploy-public"]')).toBeNull();
		const copy = document.querySelector<HTMLButtonElement>(
			'[data-guide-step="provider-approve-private"] [data-copy]',
		)!;
		expect(JSON.parse(copy.dataset.copy!)).toEqual({
			allowManagedMcpServersOnly: true,
			allowedMcpServers: [{ serverUrl: "https://example.maple.us-east-1.core.inseng.io/mcp" }],
		});
		expect(copy.dataset.copy).not.toMatch(/clientSecret|MCP_CLIENT_SECRET/iu);
		document.body.innerHTML = renderGuide(client, state, false);
		expect(document.querySelector('[data-guide-step="client-managed"]')).toBeNull();
		expect(document.querySelector('[data-guide-step="provider-approve-private"]')).toBeNull();
		expect(document.querySelector('[data-guide-step="client-private-login"]')).not.toBeNull();
		expect(document.querySelector('[data-code-platform="windows"]')?.hasAttribute("hidden")).toBe(
			false,
		);
		const command = document.querySelector<HTMLButtonElement>(
			'[data-code-platform="windows"] [data-copy]',
		)!;
		expect(command.dataset.copy).toContain("--client-secret");
		expect(command.dataset.copy).toContain("12345000000000001");
		expect(command.dataset.copy).not.toContain("CANVAS_CLIENT_SECRET");
	});

	it.each(["public", "private"])(
		"supports Gemini CLI enterprise policy and matching %s client configuration",
		(key) => {
			vi.stubGlobal("scrollTo", vi.fn());
			history.replaceState(
				null,
				"",
				`/canvas-mcp/?client=gemini-cli&key=${key}&install=personal&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=admin`,
			);
			mountApp("admin");
			const enterprise = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
			expect(enterprise.checked).toBe(false);
			expect(enterprise.disabled).toBe(false);
			expect(enterprise.closest("label")?.textContent).toBe("Enterprise install");
			expect(enterprise.closest("label")?.nextElementSibling).toBeNull();
			enterprise.checked = true;
			enterprise.dispatchEvent(new Event("change", { bubbles: true }));
			document.querySelector<HTMLButtonElement>("#configure-provider-button-bottom")!.click();
			const policyCopy = document.querySelector<HTMLButtonElement>(
				'[data-guide-step="provider-allowlist"] [data-copy]',
			)!;
			expect(policyCopy.disabled).toBe(false);
			expect(JSON.parse(policyCopy.dataset.copy!)).toEqual({
				mcpServers: {
					"canvas-mcp": {
						url: "https://example.maple.us-east-1.core.inseng.io/mcp",
						type: "http",
						trust: false,
					},
				},
			});
			expect(policyCopy.dataset.copy).not.toMatch(/secret|oauth|token|requiredMcpServers/iu);
			expect(document.querySelector('[data-guide-step="provider-private-secret"]') !== null).toBe(
				key === "private",
			);
			expect(document.querySelector('[data-guide-step="client-enterprise"]')).toBeNull();
			document.querySelector<HTMLButtonElement>("#configure-client-button-bottom")!.click();
			expect(document.querySelector('[data-guide-step="client-enterprise"]')).not.toBeNull();
			expect(document.querySelector('[data-guide-step="client-private-secret"]') !== null).toBe(
				key === "private",
			);
			expect(document.querySelector('[data-guide-step="provider-allowlist"]')).toBeNull();
			expect(document.querySelector('[data-guide-step="provider-distribute"]')).toBeNull();
			const clientCopy = document.querySelector<HTMLButtonElement>(
				`[data-guide-step="provider-register-${key}"] [data-copy]`,
			)!;
			expect(clientCopy.disabled).toBe(false);
			expect(document.querySelectorAll("#guide-provider [data-copy-template]")).toHaveLength(1);
			const config = JSON.parse(clientCopy.dataset.copy!).mcpServers["canvas-mcp"];
			expect(config.httpUrl).toBe("https://example.maple.us-east-1.core.inseng.io/mcp");
			expect(config.oauth).toEqual({
				enabled: true,
				clientId: "12345000000000001",
				authorizationUrl: "https://example.instructure.com/login/oauth2/auth",
				tokenUrl: "https://example.instructure.com/login/oauth2/token",
				scopes: ["https://sso.canvaslms.com/all-client-scopes"],
				redirectUri: "http://localhost:8081/oauth/callback",
				...(key === "private" ? { clientSecret: "<CANVAS_CLIENT_SECRET>" } : {}),
			});
			expect(document.querySelector('[data-guide-step="verify"]')).not.toBeNull();
			expect(new URLSearchParams(location.search).get("install")).toBe("enterprise");
			expect(JSON.parse(localStorage.getItem("canvas-mcp:v1")!)).toMatchObject({
				client: "gemini-cli",
				install: "enterprise",
				key,
			});
			history.replaceState(null, "", "/canvas-mcp/?page=connect&clientId=12345000000000001");
			mountApp("user");
			expect(document.querySelector('[data-guide-step="client-enterprise"]')).not.toBeNull();
			document.querySelector<HTMLButtonElement>("#tab-admin")!.click();
			const personal = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
			personal.checked = false;
			personal.dispatchEvent(new Event("change", { bubbles: true }));
			document.querySelector<HTMLButtonElement>("#tab-connect")!.click();
			expect(document.querySelector('[data-guide-step="client-enterprise"]')).toBeNull();
			expect(
				document.querySelector(`[data-guide-step="provider-register-${key}"] [data-copy]`),
			).toBeNull();
			expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(true);
			expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("admin");
			expect(new URLSearchParams(location.search).get("install")).toBe("personal");
		},
	);

	it("keeps Gemini CLI enterprise configuration non-copyable without a complete endpoint", () => {
		const client = clientDefinition("gemini-cli");
		const state = readState("?client=gemini-cli&install=enterprise&surface=provider", null);
		document.body.innerHTML = renderGuide(client, state, true);
		expect(
			document.querySelector<HTMLButtonElement>(
				'[data-guide-step="provider-allowlist"] [data-copy]',
			)?.disabled,
		).toBe(true);
	});

	it("shows Gemini CLI's personal replacement and enterprise admin transition warnings", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=gemini-cli&install=personal&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=admin",
		);
		mountApp("admin");
		const notice = () => document.querySelector(".gemini-deprecation-notice");
		expect(notice()?.querySelector("a[href]")).not.toBeNull();
		expect(notice()?.classList.contains("-color-warning")).toBe(true);
		expect(notice()?.classList.contains("-color-danger")).toBe(false);
		expect(notice()?.getAttribute("role")).toBe("status");
		expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(true);
		expect(
			document.querySelector<HTMLButtonElement>("#configure-client-button-bottom")?.disabled,
		).toBe(true);
		expect(document.querySelector(".client-status-pill")?.textContent).toBe("Known issue");
		expect(notice()?.closest(".details-panel")).toBeNull();
		expect(notice()?.nextElementSibling?.classList.contains("details-panel")).toBe(true);
		expect(document.querySelector(".workspace-grid")?.children).toHaveLength(2);
		expect(
			document.querySelector(".controls-panel")?.classList.contains("print-page-break-after"),
		).toBe(true);
		expect(
			document.querySelector(".details-panel")?.classList.contains("print-page-break-after"),
		).toBe(false);
		const enterprise = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		enterprise.checked = true;
		enterprise.dispatchEvent(new Event("change", { bubbles: true }));
		expect(notice()?.classList.contains("-color-warning")).toBe(true);
		expect(notice()?.classList.contains("-color-danger")).toBe(false);
		expect(notice()?.getAttribute("role")).toBe("status");
		expect(notice()?.querySelector("a[href]")).not.toBeNull();
		expect(notice()?.nextElementSibling?.classList.contains("details-panel")).toBe(true);
		expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(false);
		expect(document.querySelector(".client-status-pill")?.textContent).toBe("Untested");
		document.querySelector<HTMLButtonElement>("#tab-connect")!.click();
		expect(notice()).toBeNull();
		expect(document.querySelector(".known-issue-alert")).toBeNull();
		expect(document.querySelector(".instructions-column")).toBeNull();
		expect(document.querySelector(".client-status-pill")).toBeNull();
		document.querySelector<HTMLButtonElement>("#tab-admin")!.click();
		const personal = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		personal.checked = false;
		personal.dispatchEvent(new Event("change", { bubbles: true }));
		expect(notice()?.classList.contains("-color-warning")).toBe(true);
		const client = document.querySelector<HTMLSelectElement>("#client-select")!;
		client.value = "claude-code";
		client.dispatchEvent(new Event("change", { bubbles: true }));
		expect(notice()).toBeNull();
	});

	it("blocks ChatGPT authentication and retains the setup fields", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=chatgpt&domain=example.instructure.com&region=us-east-1&clientId=12345&page=connect",
		);
		mountApp("user");
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
	it("keeps client-only steps out of server setup", () => {
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
