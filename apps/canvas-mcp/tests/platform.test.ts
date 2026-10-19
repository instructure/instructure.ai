// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";
import { commandPlatform } from "../src/platform";
import { renderContent } from "../src/guides/render";
import * as clients from "../src/clients";

beforeEach(() => {
	localStorage.clear();
	history.replaceState(null, "", "/canvas-mcp/");
	document.body.innerHTML = '<div id="root"></div>';
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("command platform detection", () => {
	it.each([
		[{ userAgentData: { platform: "Windows" }, platform: "Linux" }, "windows"],
		[{ platform: "Win32" }, "windows"],
		[{ platform: "Win64" }, "windows"],
		[{ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }, "windows"],
		[{ userAgentData: { platform: "macOS" } }, "mac"],
		[{ platform: "MacIntel" }, "mac"],
		[{ platform: "Linux x86_64" }, "mac"],
		[{ platform: "iPhone" }, "mac"],
		[{}, "mac"],
	])("detects %j as %s in Auto mode", (browser, expected) => {
		expect(commandPlatform("auto", browser)).toBe(expected);
	});

	it("uses explicit choices before detection and handles missing browser information", () => {
		expect(commandPlatform("mac", { platform: "Win32" })).toBe("mac");
		expect(commandPlatform("windows", { platform: "MacIntel" })).toBe("windows");
		vi.stubGlobal("navigator", undefined);
		expect(commandPlatform("auto")).toBe("mac");
	});
});

describe("platform code groups", () => {
	it.each([
		["personal", "public"],
		["personal", "private"],
		["enterprise", "public"],
		["enterprise", "private"],
	])(
		"keeps Antigravity CLI descriptions and prompts scoped to platform and key for %s/%s",
		(install, key) => {
			const definition = clients.clientDefinition("antigravity-cli");
			const original = clients.clientDefinition;
			vi.spyOn(clients, "clientDefinition").mockImplementation((id) =>
				id === "antigravity-cli"
					? { ...definition, blocker: undefined, status: { kind: "untested" } }
					: original(id),
			);
			vi.stubGlobal("navigator", { platform: "Win32" });
			history.replaceState(
				null,
				"",
				`?client=antigravity-cli&install=${install}&key=${key}&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
			);
			mountApp("user");
			for (const platform of ["windows", "mac", "windows"]) {
				document
					.querySelector<HTMLButtonElement>(
						`.code-platform-toggle [data-platform-choice="${platform}"]`,
					)!
					.click();
				const panel = document.querySelector<HTMLElement>("[data-code-platform]:not([hidden])")!;
				const description = panel.querySelector("p")!.textContent!;
				const script = panel.querySelector<HTMLButtonElement>("[data-copy]")!.dataset.copy!;
				expect(description).toContain("Run this command from your project directory");
				if (platform === "windows") {
					expect(description).toContain("Windows PowerShell");
					expect(description).not.toMatch(/Bash|jq|macOS|Linux/u);
					expect(script.includes("Read-Host")).toBe(key === "private");
				} else {
					expect(description).toContain("Requires Bash and jq");
					expect(description).not.toMatch(/Windows|PowerShell/u);
					expect(script.includes('read -r -s -p "Canvas client secret: "')).toBe(key === "private");
				}
				expect(description.includes("prompted")).toBe(key === "private");
				if (key === "public") {
					expect(description).not.toContain("source control");
					expect(script).not.toContain("Client secret is required");
					expect(
						document.querySelector(`[data-guide-step="provider-configure-${key}"]`)?.textContent,
					).not.toContain("private");
				}
			}
			document
				.querySelector<HTMLButtonElement>('.platform-toggle [data-platform-choice="auto"]')!
				.click();
			expect(
				document.querySelector("[data-code-platform]:not([hidden]) > p")?.textContent,
			).toContain("Windows PowerShell");
		},
	);

	it.each(["public", "private"])("groups the %s Claude Code registration commands", (key) => {
		vi.stubGlobal("navigator", { platform: "Win32" });
		openClient(`&key=${key}`);
		expect(document.querySelectorAll(".shiki-code-group")).toHaveLength(1);
		expect(
			document.querySelectorAll(".shiki-code-group [data-code-platform]:not([hidden])"),
		).toHaveLength(1);
		expect(document.querySelector('[data-code-platform="windows"] pre')?.textContent).toContain(
			"`\n",
		);
		expect(document.querySelector('[data-code-platform="mac"] pre')?.textContent).toContain("\\\n");
		expect(document.querySelector('[data-code-platform="windows"]')?.hasAttribute("hidden")).toBe(
			false,
		);
		expect(document.querySelector('[data-code-platform="mac"]')?.hasAttribute("hidden")).toBe(true);
		expect(document.querySelector(".platform-toggle [aria-pressed=true]")?.textContent).toBe(
			"Auto",
		);
		expect(document.querySelector(".code-platform-toggle [aria-pressed=true]")?.textContent).toBe(
			"Windows",
		);
		const copy = document.querySelector<HTMLButtonElement>(
			'[data-code-platform="windows"] [data-copy]',
		);
		expect(copy?.disabled).toBe(false);
		expect(copy?.dataset.copy).toContain("12345000000000001");
		expect(copy?.dataset.copy).toContain("https://example.maple.us-east-1.core.inseng.io/mcp");
		expect(copy?.dataset.copy?.includes("--client-secret")).toBe(key === "private");
	});

	it("updates code groups, tray, saved preference, and links without replacing the tray", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { platform: "Win32", clipboard: { writeText } });
		openClient();
		const tray = document.querySelector("#settings-tray");
		document
			.querySelector<HTMLButtonElement>('.code-platform-toggle [data-platform-choice="mac"]')!
			.click();
		expect(document.querySelector("#settings-tray")).toBe(tray);
		expect(document.querySelector(".platform-toggle [aria-pressed=true]")?.textContent).toBe("Mac");
		expect(document.querySelector('[data-code-platform="windows"]')?.hasAttribute("hidden")).toBe(
			true,
		);
		expect(document.querySelector('[data-code-platform="mac"]')?.hasAttribute("hidden")).toBe(
			false,
		);
		expect(new URLSearchParams(location.search).get("platform")).toBe("mac");
		expect(JSON.parse(localStorage.getItem("canvas-mcp:v1")!)).toMatchObject({ platform: "mac" });
		expect(document.querySelector(".print-permalink")?.textContent).toContain("platform=mac");

		document.querySelector<HTMLButtonElement>('[data-code-platform="mac"] [data-copy]')!.click();
		await vi.waitFor(() => expect(writeText).toHaveBeenCalled());
		expect(writeText.mock.calls[0][0]).toContain("\\\n");
		document.querySelector<HTMLButtonElement>('[data-action="copy-link"]')!.click();
		await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
		expect(new URL(writeText.mock.calls[1][0]).searchParams.get("platform")).toBe("mac");

		document
			.querySelector<HTMLButtonElement>('.platform-toggle [data-platform-choice="auto"]')!
			.click();
		expect(document.querySelector("#settings-tray")).toBe(tray);
		expect(document.querySelector(".platform-toggle [aria-pressed=true]")?.textContent).toBe(
			"Auto",
		);
		expect(document.querySelector(".code-platform-toggle [aria-pressed=true]")?.textContent).toBe(
			"Windows",
		);
		expect(document.querySelector('[data-code-platform="windows"]')?.hasAttribute("hidden")).toBe(
			false,
		);
		expect(new URLSearchParams(location.search).get("platform")).toBe("auto");
		expect(JSON.parse(localStorage.getItem("canvas-mcp:v1")!)).toMatchObject({ platform: "auto" });
	});

	it("uses query then saved preference before device detection and keeps it across tabs", () => {
		vi.stubGlobal("navigator", { platform: "Win32" });
		localStorage.setItem("canvas-mcp:v1", JSON.stringify({ platform: "mac" }));
		openClient();
		expect(document.querySelector(".platform-toggle [aria-pressed=true]")?.textContent).toBe("Mac");
		expect(document.querySelector(".code-platform-toggle [aria-pressed=true]")?.textContent).toBe(
			"macOS / Linux",
		);
		openClient("&platform=windows");
		document.querySelector<HTMLButtonElement>("#tab-admin")!.click();
		expect(document.querySelector(".platform-toggle [aria-pressed=true]")?.textContent).toBe(
			"Windows",
		);
		expect(new URLSearchParams(location.search).get("platform")).toBe("windows");
		document.querySelector<HTMLButtonElement>("#tab-connect")!.click();
		expect(document.querySelector(".code-platform-toggle [aria-pressed=true]")?.textContent).toBe(
			"Windows",
		);
	});

	it.each([
		["personal", "public"],
		["personal", "private"],
		["enterprise", "public"],
		["enterprise", "private"],
	] as const)("renders %s/%s Codex commands without a manual alternative", (install, key) => {
		{
			const definition = clients.clientDefinition("codex");
			const original = clients.clientDefinition;
			vi.spyOn(clients, "clientDefinition").mockImplementation((id) =>
				id === "codex" ? { ...definition, status: { kind: "untested" } } : original(id),
			);
		}
		history.replaceState(
			null,
			"",
			`/canvas-mcp/?client=codex&install=${install}&key=${key}&platform=windows&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect`,
		);
		mountApp("user");
		const copy = document.querySelector<HTMLButtonElement>(
			'[data-code-platform="windows"] [data-copy]',
		);
		expect(copy?.dataset.copy?.includes("Read-Host 'Canvas client secret' -AsSecureString")).toBe(
			key === "private",
		);
		expect(copy?.disabled).toBe(false);
		expect(copy?.dataset.copy).toContain('--oauth-client-id "12345000000000001"');
		expect(copy?.dataset.copy).toContain(
			'--url "https://example.maple.us-east-1.core.inseng.io/mcp"',
		);
		const panel = document.querySelector('[data-code-platform="windows"]');
		expect(panel?.textContent).toContain(
			install === "enterprise" ? "managed device" : "own device",
		);
		expect(panel?.textContent).toContain(`${key}-key script`);
		expect(document.querySelector('[data-code-platform="windows"]')?.hasAttribute("hidden")).toBe(
			false,
		);
		const manual = [...document.querySelectorAll<HTMLButtonElement>("[data-copy]")].find((button) =>
			button.dataset.copy?.startsWith("[mcp_servers.canvas-mcp]"),
		);
		expect(manual).toBeUndefined();
		expect(document.body.textContent).not.toContain("Manual alternative");
		expect(
			document.querySelector<HTMLButtonElement>('[data-guide-step="provider-login"] [data-copy]')
				?.dataset.copy,
		).toBe(
			`codex -c mcp_oauth_callback_port=8081 -c 'mcp_oauth_callback_url="http://localhost:8081/callback"' mcp login canvas-mcp --scopes "https://sso.canvaslms.com/all-client-scopes"`,
		);
	});

	it("renders both variants through Shiki and disables copying unresolved values", () => {
		document.body.innerHTML = renderContent(
			[
				{
					kind: "code-group",
					variants: {
						mac: { language: "bash", text: 'echo "{clientId}"' },
						windows: { language: "powershell", text: 'Write-Output "{clientId}"' },
					},
				},
			],
			{ clientId: "Enter the Client ID from your Canvas key" },
			"mac",
		);
		expect(document.querySelectorAll(".shiki-code-group pre.shiki")).toHaveLength(2);
		expect(document.querySelectorAll(".shiki-copy:disabled")).toHaveLength(2);
		expect(document.querySelectorAll('[data-guide-token="clientId"]')).toHaveLength(2);
		expect(document.querySelector('[data-code-platform="windows"]')?.hasAttribute("hidden")).toBe(
			true,
		);
		expect(document.querySelector('[data-code-platform="mac"]')?.hasAttribute("hidden")).toBe(
			false,
		);
	});
});

function openClient(extra = ""): void {
	history.replaceState(
		null,
		"",
		`/canvas-mcp/?client=claude-code&domain=example.instructure.com&region=us-east-1&clientId=12345000000000001&page=connect${extra}`,
	);
	mountApp("user");
}
