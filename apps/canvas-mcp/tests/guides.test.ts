// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";
import { renderContent, renderGuide, validateGuide } from "../src/guides/render";
import { screenshot, screenshotSource } from "../src/guides/screenshots";
import { clientGuide } from "../src/guides/shared";
import { allowedKeyTypes, CLIENTS, clientDefinition } from "../src/clients";
import * as clients from "../src/clients";
import { readState } from "../src/state";
import { resolveKeySettings } from "../src/admin/key-settings-model";

beforeEach(() => {
	localStorage.clear();
	history.replaceState(null, "", "/canvas-mcp/");
	document.body.innerHTML = '<div id="root"></div>';
});
afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
});
describe("composable client guides", () => {
	it("escapes and interpolates platform-specific command descriptions", () => {
		document.body.innerHTML = renderContent(
			[
				{
					kind: "code-group",
					variants: {
						mac: {
							language: "bash",
							text: "echo safe",
							description: "Use **Bash** with `{clientId}`. <script>bad()</script>",
						},
						windows: {
							language: "powershell",
							text: "Write-Output safe",
							description: "Use Windows.",
						},
					},
				},
			],
			{ clientId: "<img src=x>" },
			"mac",
		);
		const panel = document.querySelector('[data-code-platform="mac"]')!;
		expect(panel.querySelector("p strong")?.textContent).toBe("Bash");
		expect(panel.querySelector("p code")?.textContent).toBe("<img src=x>");
		expect(panel.querySelector("script, img")).toBeNull();
		expect(document.querySelector('[data-code-platform="windows"]')?.hasAttribute("hidden")).toBe(
			true,
		);
	});

	it("renders field tables with accessible headers, inline markup, and escaped values", () => {
		document.body.innerHTML = renderContent(
			[
				{
					kind: "table",
					rows: [
						["**Client ID**", "`{clientId}`"],
						["<b>Field</b>", "<img src=x>"],
					],
				},
			],
			{ clientId: "<script>bad()</script>" },
		);
		expect(document.querySelectorAll('thead th[scope="col"]')).toHaveLength(2);
		expect(document.querySelector('tbody th[scope="row"] strong')?.textContent).toBe("Client ID");
		expect(document.querySelector('td code [data-guide-token="clientId"]')?.textContent).toBe(
			"<script>bad()</script>",
		);
		expect(document.querySelector("script, b, img")).toBeNull();
		expect(document.querySelectorAll("tbody tr")[1].textContent).toBe("<b>Field</b><img src=x>");
		expect(() => renderContent([{ kind: "table", rows: [["Field", "{missing}"]] }], {})).toThrow(
			"Unknown guide token: missing",
		);
	});

	it.each(["public", "private"] as const)(
		"shows the generic %s connection fields and only the matching key instructions",
		(key) => {
			const state = readState(
				`?client=generic&key=${key}&domain=example.instructure.com&region=us-east-1&clientId=12345&redirectUris=${encodeURIComponent("http://localhost:8081/callback\nhttps://client.example/callback")}`,
				null,
			);
			document.body.innerHTML = renderGuide(clientDefinition(state.client), state, false);
			const step = document.querySelector(`[data-guide-step="provider-${key}"]`)!;
			expect(step).not.toBeNull();
			expect(
				document.querySelector(
					`[data-guide-step="provider-${key === "public" ? "private" : "public"}"]`,
				),
			).toBeNull();
			const rows = Object.fromEntries(
				[...step.querySelectorAll("tbody tr")].map((row) => [
					row.querySelector("th")!.textContent,
					row.querySelector("td")!.textContent,
				]),
			);
			expect(rows).toMatchObject({
				Transport: "Remote HTTP (Streamable HTTP)",
				"MCP server URL": "https://example.maple.us-east-1.core.inseng.io/mcp",
				"Authorization URL": "https://example.instructure.com/login/oauth2/auth",
				"Token URL": "https://example.instructure.com/login/oauth2/token",
				"Client ID": "12345",
				Scope: "https://sso.canvaslms.com/all-client-scopes",
				"Redirect URI(s)": "http://localhost:8081/callback\nhttps://client.example/callback",
				PKCE: key === "public" ? "Required; use S256." : "Optional for a Canvas private key.",
			});
			expect(rows["Client secret"]).toBe(
				key === "public"
					? "Do not send a client secret for a public key."
					: "Required; enter the Canvas key secret directly in your client's secret field.",
			);
			if (key === "private") expect(step.textContent).toContain("never paste it into this guide");
		},
	);

	it("supports inline code and bold in paragraphs, lists, and link labels", () => {
		document.body.innerHTML = renderContent(
			[
				{ kind: "paragraph", text: "Open `/mcp`, then **Needs Auth** or **run `claude`**." },
				{ kind: "list", items: ["Choose **Connect** for `canvas-mcp`."] },
				{ kind: "link", label: "**Read** the `guide`", url: "https://example.test/" },
			],
			{},
		);
		expect(document.querySelector("p > code")?.textContent).toBe("/mcp");
		expect(document.querySelector("p > strong")?.textContent).toBe("Needs Auth");
		expect(document.querySelector("strong > code")?.textContent).toBe("claude");
		expect(document.querySelector("li > strong")?.textContent).toBe("Connect");
		expect(document.querySelector("li > code")?.textContent).toBe("canvas-mcp");
		expect(document.querySelector("a > strong")?.textContent).toBe("Read");
		expect(document.querySelector("a > code")?.textContent).toBe("guide");
	});

	it("escapes HTML and treats code contents and interpolated values as literal text", () => {
		const value = '<img src=x onerror="bad()"> **not bold** `not code`';
		document.body.innerHTML = renderContent(
			[
				{
					kind: "paragraph",
					text: "<script>bad()</script> **<b>safe</b>** `**literal** <em>code</em>` **`{clientId}`**",
				},
			],
			{ clientId: value },
		);
		expect(document.querySelector("script, b, em, img")).toBeNull();
		expect(document.querySelector("p > code")?.textContent).toBe("**literal** <em>code</em>");
		const token = document.querySelector('[data-guide-token="clientId"]');
		expect(token?.textContent).toBe(value);
		expect(token?.children).toHaveLength(0);
		expect(token?.parentElement?.tagName).toBe("CODE");
		expect(token?.parentElement?.parentElement?.tagName).toBe("STRONG");
	});

	it("keeps unmatched inline markers literal and rejects unknown tokens", () => {
		expect(renderContent([{ kind: "paragraph", text: "Plain `code and **bold" }], {})).toBe(
			"<p>Plain `code and **bold</p>",
		);
		expect(() => renderContent([{ kind: "paragraph", text: "**`{missing}`**" }], {})).toThrow(
			"Unknown guide token: missing",
		);
	});

	it("handles long unterminated bold text containing repeated code spans without backtracking", () => {
		const text = `**${"`)`".repeat(20_000)}`;
		const start = performance.now();
		const html = renderContent([{ kind: "paragraph", text }], {});
		expect(performance.now() - start).toBeLessThan(1_000);
		expect(html).toBe(`<p>**${"<code>)</code>".repeat(20_000)}</p>`);
	});

	it("supports asterisks inside code spans nested in bold", () => {
		expect(renderContent([{ kind: "paragraph", text: "**Run `**literal**` now**" }], {})).toBe(
			"<p><strong>Run <code>**literal**</code> now</strong></p>",
		);
	});

	it("renders the untitled Claude Code introduction as a paragraph without a heading", () => {
		const state = readState("?client=claude-code", null);
		document.body.innerHTML = renderGuide(clientDefinition(state.client), state, false);

		const introduction = document.querySelector('[data-guide-step="intro"]');
		expect(introduction?.querySelector("h3")).toBeNull();
		expect(introduction?.firstElementChild?.tagName).toBe("P");
		expect(introduction?.textContent).toContain("configuration scope first");
		expect(document.querySelector('[data-guide-step="provider-scopes"] h3')?.textContent).toBe(
			"Choose the configuration scope",
		);
	});

	it("uses the shared Canvas authorization image in every available client sign-in flow", () => {
		for (const client of CLIENTS)
			for (const install of client.installModes)
				for (const key of allowedKeyTypes(client)) {
					const state = readState(`?client=${client.id}&install=${install}&key=${key}`, null);
					document.body.innerHTML = renderGuide(client, state, false);
					const images = document.querySelectorAll<HTMLImageElement>(
						'img[src$="/images/client-canvas-oauth_authorize.png"]',
					);
					if (client.blocker) {
						expect(images).toHaveLength(0);
						continue;
					}
					expect(images, `${client.id}/${install}/${key}`).toHaveLength(1);
					expect(images[0].closest("[data-guide-step]")).not.toBeNull();
					expect(images[0].dataset.placeholder).toBe("false");
					expect(images[0].width).toBe(732);
					expect(images[0].height).toBe(400);
					expect(images[0].alt).toContain("Canvas OAuth authorization");
				}
	});

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

		const terminal = screenshot("claude_code_mcp_needs_auth", "Terminal output.");
		expect(terminal).toMatchObject({ width: 600, height: 360, placeholder: false });
		expect(renderContent([terminal], {})).toContain(
			`${import.meta.env.BASE_URL.replace(/\/$/u, "")}/images/client-claude_code-start_auth.png`,
		);
		const terminalPlaceholder = screenshot("cli_auth_url_and_code_prompt", "Terminal prompt.");
		expect(terminalPlaceholder).toMatchObject({ width: 600, height: 360, placeholder: true });
		expect(renderContent([terminalPlaceholder], {})).toContain(
			"https://placehold.co/600x360/png?text=cli_auth_url_and_code_prompt",
		);
	});

	it("hides placeholder images in production unless the dev query flag is present", () => {
		vi.stubEnv("DEV", false);
		const placeholder = screenshot("chatgpt_plugins_add_custom_mcp", "Add a custom MCP server.");
		document.body.innerHTML = renderContent(
			[{ kind: "paragraph", text: "Run the setup command." }, placeholder],
			{},
		);
		expect(document.body.textContent).toContain("Run the setup command.");
		expect(document.querySelector(".guide-screenshot")).toBeNull();

		for (const search of ["?dev", "?client=claude-code&dev"]) {
			history.replaceState(null, "", `/canvas-mcp/${search}`);
			document.body.innerHTML = renderContent([placeholder], {});
			expect(
				document.querySelector<HTMLImageElement>(".guide-screenshot")?.dataset.placeholder,
			).toBe("true");
		}
	});

	it("uses the captured Claude Code registration image at the standard terminal size", () => {
		const image = screenshot("claude_code_mcp_add_command", "Claude Code registration output.");
		expect(image).toMatchObject({ width: 600, height: 360, placeholder: false });
		expect(screenshotSource(image.name, image.placeholder)).toBe(
			`${import.meta.env.BASE_URL.replace(/\/$/u, "")}/images/client-claude_code-mcp_add_command.png`,
		);
		expect(renderContent([image], {})).not.toContain("placehold.co");
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
		const definition = clientDefinition("codex");
		const original = clients.clientDefinition;
		vi.spyOn(clients, "clientDefinition").mockImplementation((id) =>
			id === "codex" ? { ...definition, status: { kind: "untested" } } : original(id),
		);
		vi.stubGlobal("scrollTo", vi.fn());
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=codex&install=enterprise&domain=example.instructure.com&region=us-east-1",
		);
		mountApp("admin");
		expect(
			document.querySelector<HTMLButtonElement>('[data-guide-step="provider-register"] [data-copy]')
				?.disabled,
		).toBe(true);
		const input = document.querySelector<HTMLInputElement>("#client-id-input")!;
		input.value = "12345000000000001";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		document.querySelector<HTMLButtonElement>("#configure-client-button-bottom")!.click();
		const command = document.querySelector<HTMLButtonElement>(
			'[data-guide-step="provider-register"] [data-copy]',
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
