// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";
import { renderContent, renderGuide, validateGuide } from "../src/guides/render";
import { screenshot, screenshotSource } from "../src/guides/screenshots";
import { clientGuide } from "../src/guides/shared";
import { clientDefinition } from "../src/clients";
import { readState } from "../src/state";
import { resolveKeySettings } from "../src/admin/key-settings-model";

beforeEach(() => {
	localStorage.clear();
	history.replaceState(null, "", "/canvas-mcp/");
	document.body.innerHTML = '<div id="root"></div>';
});
afterEach(() => vi.unstubAllGlobals());
describe("composable client guides", () => {
	it.each(["codex", "claude-ai", "claude-code", "gemini-cli"])(
		"omits prerequisite preambles from the %s client preview",
		(id) => {
			const state = readState(`?client=${id}`, null);
			const client = clientDefinition(state.client);
			const guide = clientGuide(client, state.install);
			expect(guide.prerequisites.length).toBeGreaterThan(0);

			document.body.innerHTML = renderGuide(client, state, false);

			for (const prerequisite of guide.prerequisites)
				expect(document.body.textContent).not.toContain(prerequisite);
			expect(document.querySelector("#guide-provider [data-guide-step]")).not.toBeNull();
		},
	);

	it("renders manifest screenshots as accessible lazy images and sizes terminal captures", () => {
		const content = screenshot("chatgpt_plugins_add_custom_mcp", "Add a custom MCP server."),
			html = renderContent([content], {});
		document.body.innerHTML = html;
		const image = document.querySelector<HTMLImageElement>(".guide-screenshot");
		expect(image?.getAttribute("src")).toBe(
			"https://placehold.co/960x540/png?text=chatgpt_plugins_add_custom_mcp",
		);
		expect(image?.getAttribute("alt")).toBe("Add a custom MCP server.");
		expect(image?.getAttribute("width")).toBe("960");
		expect(image?.getAttribute("height")).toBe("540");
		expect(image?.getAttribute("loading")).toBe("lazy");
		expect(image?.getAttribute("decoding")).toBe("async");
		expect(image?.dataset.placeholder).toBe("true");

		const terminal = screenshot("claude_code_mcp_add_command", "Terminal output.");
		expect(terminal).toMatchObject({ width: 960, height: 360, placeholder: true });
		expect(renderContent([terminal], {})).toContain(
			"https://placehold.co/960x360/png?text=claude_code_mcp_add_command",
		);
	});

	it("rejects unregistered screenshots and escapes screenshot alt text", () => {
		expect(() => screenshot("unregistered_capture", "Capture")).toThrow(
			"missing from the manifest",
		);
		expect(() => screenshotSource("chatgpt_plugins_add_custom_mcp", false)).toThrow(
			"does not match the manifest",
		);
		const html = renderContent(
			[screenshot("chatgpt_plugins_add_custom_mcp", '<img src=x onerror="bad()">')],
			{},
		);
		expect(html).not.toContain("<img src=x");
		expect(html).toContain("&lt;img src=x");
	});

	it("renders highlighted configuration with a copy button and live values", () => {
		const html = renderContent(
			[
				{
					kind: "code",
					language: "json",
					text: '{\n  "url": "{mcpUrl}",\n  "clientId": "{clientId}"\n}',
				},
			],
			{ mcpUrl: "https://example.test/mcp", clientId: "12345" },
		);
		document.body.innerHTML = html;
		expect(document.querySelector(".shiki-block.language-json pre.shiki")).not.toBeNull();
		expect(document.querySelector(".shiki-copy")?.getAttribute("aria-label")).toBe(
			"Copy configuration",
		);
		expect(document.querySelector('[data-guide-token="clientId"]')?.textContent).toBe("12345");
		expect(document.querySelector<HTMLButtonElement>(".shiki-copy")?.dataset.copy).toContain(
			"https://example.test/mcp",
		);
		expect(html).toContain("--shiki-dark");
	});

	it("supports prompt as a Markdown highlighting alias", () => {
		const html = renderContent(
			[{ kind: "code", language: "prompt", text: "## Instructions\n\nFollow the steps." }],
			{},
		);
		expect(html).toContain("shiki-block language-prompt");
		expect(html).toContain('class="shiki');
	});

	it("offers the client registration command after entering the server's Client ID", () => {
		vi.stubGlobal("scrollTo", vi.fn());
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=codex&domain=example.instructure.com&region=us-east-1",
		);
		mountApp("admin");
		expect(document.querySelector('button[data-copy-template*="mcp add"]')).toBeNull();
		const input = document.querySelector<HTMLInputElement>("#client-id-input")!;
		input.value = "12345000000000001";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		document.querySelector<HTMLButtonElement>("#configure-client-button-bottom")!.click();
		const command = document.querySelector<HTMLButtonElement>(
			'button[data-copy-template*="mcp add"]',
		);
		expect(command?.disabled).toBe(false);
		expect(command?.dataset.copy).toContain('--oauth-client-id "12345000000000001"');
		expect(command?.dataset.copy).not.toContain("Enter the Client ID");
		expect(document.querySelector('[data-guide-token="clientId"]')?.textContent).toBe(
			"12345000000000001",
		);
	});
	it("keeps Codex sign-in and validation exclusively on the client page", () => {
		const client = clientDefinition("codex");
		const state = readState(
			"?client=codex&install=enterprise&surface=provider&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001",
			null,
		);
		document.body.innerHTML = renderGuide(client, state, true);
		expect(document.querySelector('[data-guide-step="provider-register"]')).not.toBeNull();
		expect(document.querySelector('[data-guide-step="provider-manage"]')).not.toBeNull();
		expect(
			document.querySelector('[data-guide-step="provider-login"], [data-guide-step="verify"]'),
		).toBeNull();
		expect(document.querySelector("#configure-client-button-bottom")).not.toBeNull();
		document.body.innerHTML = renderGuide(client, state, false);
		expect(document.querySelector('[data-guide-step="provider-login"]')?.textContent).toContain(
			"Sign in to Canvas",
		);
		expect(document.querySelector('[data-guide-step="verify"]')?.textContent).toContain(
			"Validate the configuration",
		);
		expect(document.querySelector('[data-guide-step="provider-manage"]')).toBeNull();
	});

	it("ignores stale callback work after a region change", async () => {
		const client = clientDefinition("codex"),
			old = client.facts.redirectUri;
		if (old.kind !== "computed") throw new Error("Expected computed callback");
		const complete: ((value: ArrayBuffer) => void)[] = [];
		vi.stubGlobal("crypto", {
			subtle: {
				digest: vi.fn(() => new Promise<ArrayBuffer>((resolve) => complete.push(resolve))),
			},
		});
		client.facts.redirectUri = { ...old, mode: "per-server" };
		try {
			history.replaceState(
				null,
				"",
				"/canvas-mcp/?client=codex&domain=example.instructure.com&region=us-east-1",
			);
			mountApp("admin");
			const region = document.querySelector<HTMLSelectElement>("#region-select")!;
			region.value = "us-west-2";
			region.dispatchEvent(new Event("change", { bubbles: true }));
			expect(complete).toHaveLength(2);
			complete[1](new Uint8Array(32).buffer);
			await new Promise((resolve) => setTimeout(resolve, 0));
			const redirect = () =>
				[...document.querySelectorAll(".settings-table tr")].find(
					(row) => row.querySelector("th")?.textContent === "Redirect URIs",
				);
			expect(redirect()?.querySelector("code")?.textContent).toBe(
				"http://localhost:8081/callback/AAAAAAAAAAAA",
			);
			complete[0](new Uint8Array(32).fill(1).buffer);
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(redirect()?.querySelector("code")?.textContent).toBe(
				"http://localhost:8081/callback/AAAAAAAAAAAA",
			);
		} finally {
			client.facts.redirectUri = old;
		}
	});

	it("presents Copilot's full ordering before a Client ID exists", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=copilot-studio&domain=example.beta.instructure.com",
		);
		mountApp("admin");
		expect(document.querySelector(".guide-surfaces")).toBeNull();
		expect(
			[...document.querySelectorAll("[data-guide-step]")].map((step) =>
				step.getAttribute("data-guide-step"),
			),
		).toEqual([
			"canvas-create",
			"provider-save",
			"canvas-update-redirect",
			"provider-policy",
			"provider-add-tool",
		]);
		const labels = [...document.querySelectorAll(".workflow-label")];
		expect(labels.map((label) => label.textContent)).toEqual([
			"Step 1 · Canvas",
			"Step 2 · Copilot Studio",
			"Step 3 · Canvas",
			"Step 4 · Copilot Studio",
			"Step 5 · Copilot Studio",
		]);
		expect(document.querySelector(".workflow-label .instui-pill")).toBeNull();
		for (const [index, label] of labels.entries()) {
			const canvas = index === 0 || index === 2;
			const logo = label.firstElementChild;
			expect(logo?.classList.contains("workflow-logo")).toBe(true);
			if (canvas) {
				expect(logo?.classList.contains("workflow-logo--canvas")).toBe(true);
				expect(logo?.getAttribute("aria-hidden")).toBe("true");
			} else {
				expect(logo?.getAttribute("src")).toBe("/canvas-mcp/images/CopilotStudio.svg");
				expect(logo?.getAttribute("alt")).toBe("");
			}
		}
		expect(document.querySelector('[data-guide-step="canvas-create"]')?.textContent).toContain(
			"Leave Redirect URIs blank",
		);
		expect(
			document.querySelector('[data-guide-step="canvas-update-redirect"] a')?.getAttribute("href"),
		).toBe("https://example.instructure.com/accounts/self/developer_keys");
		expect(document.querySelector<HTMLInputElement>("#enterprise-install-input")?.disabled).toBe(
			true,
		);
		expect(new URLSearchParams(location.search).get("install")).toBe("enterprise");
	});
	it("uses an enterprise-only Pantoken control and advances Canvas → provider → client", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=claude-ai&domain=example.instructure.com&region=us-east-1&clientId=12345",
		);
		mountApp("admin");
		expect(document.querySelector(".guide-surfaces")).toBeNull();
		const enterprise = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		enterprise.checked = true;
		enterprise.dispatchEvent(new Event("change", { bubbles: true }));
		expect(
			document.querySelector(".guide-surfaces")?.classList.contains("instui-segmented-control"),
		).toBe(true);
		expect(
			[...document.querySelectorAll(".guide-surfaces > .viewport > .track > label")].map(
				(label) => label.textContent,
			),
		).toEqual(["1. Canvas", "2. Claude organization settings"]);
		const next = document.querySelector<HTMLButtonElement>("#configure-provider-button-bottom")!;
		expect(next.textContent).toBe("Configure Claude organization settings");
		const scrollTo = vi.fn();
		vi.stubGlobal("scrollTo", scrollTo);
		next.click();
		expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
		expect(document.querySelector<HTMLInputElement>("#guide-surface-provider")?.checked).toBe(true);
		expect(document.activeElement?.id).toBe("guide-surface-provider");
		expect(document.querySelector("#guide-provider")?.hasAttribute("hidden")).toBe(false);
		const params = new URLSearchParams(location.search);
		expect(params.get("install")).toBe("enterprise");
		expect(params.get("surface")).toBe("provider");
		expect(JSON.parse(localStorage.getItem("canvas-mcp:v1") ?? "{}")).toMatchObject({
			install: "enterprise",
		});
		const connect = document.querySelector<HTMLButtonElement>(
			"#guide-provider #configure-client-button-bottom",
		)!;
		expect(connect.textContent).toBe("Configure a Client");
		connect.click();
		expect(new URLSearchParams(location.search).get("page")).toBe("connect");
		expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("user");
	});
	it("returns to Canvas when Enterprise install is unchecked", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=claude-ai&install=enterprise&surface=provider",
		);
		mountApp("admin");
		const enterprise = document.querySelector<HTMLInputElement>("#enterprise-install-input")!;
		enterprise.checked = false;
		enterprise.dispatchEvent(new Event("change", { bubbles: true }));
		expect(document.querySelector(".guide-surfaces")).toBeNull();
		expect(document.querySelector("#guide-canvas")?.hasAttribute("hidden")).toBe(false);
		expect(new URLSearchParams(location.search).get("surface")).toBeNull();
	});

	it("supports keyboard navigation of top-level tabs", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?domain=example.instructure.com&region=us-east-1&clientId=12345",
		);
		mountApp("admin");
		document.getElementById("tab-admin")?.focus();
		document.activeElement?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(document.activeElement?.id).toBe("tab-connect");
		document.querySelector<HTMLButtonElement>("#tab-connect")?.click();
		expect(document.activeElement?.id).toBe("tab-connect");
		expect(document.querySelector("#guide-provider")?.hasAttribute("hidden")).toBe(false);
	});
	it("escapes content and injected values and rejects unsupported tokens and links", () => {
		const html = renderContent([{ kind: "paragraph", text: "Value: {clientId}" }], {
			clientId: '<img src=x onerror="bad()">',
		});
		expect(html).not.toContain("<img");
		expect(html).toContain("&lt;img");
		expect(() =>
			renderContent([{ kind: "code", language: "json", text: "{clientSecret}" }], {}),
		).toThrow("Unknown guide token");
		expect(() =>
			renderContent([{ kind: "link", label: "bad", url: "javascript:bad()" }], {}),
		).toThrow("HTTPS");
	});
	it("rejects duplicate step IDs and shares key values between contexts", () => {
		const client = clientDefinition("copilot-studio"),
			guide = structuredClone(clientGuide(client, "enterprise"));
		guide.steps.push(guide.steps[0]);
		expect(() => validateGuide(guide)).toThrow("unique");
		const state = readState(
			"?client=copilot-studio&domain=example.instructure.com&key=public",
			null,
		);
		expect(resolveKeySettings(client, state)).toMatchObject({
			clientType: "Confidential",
			authorizedFlows: "Token Exchange",
			redirect: { copyable: false },
		});
	});
});
