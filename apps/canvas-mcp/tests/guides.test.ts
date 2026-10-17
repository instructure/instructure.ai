// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";
import { renderContent, validateGuide } from "../src/guides/render";
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
	it("refreshes copyable configuration when a Client ID is entered", () => {
		history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=codex&domain=example.instructure.com&region=us-east-1",
		);
		mountApp("admin");
		const command = document.querySelector<HTMLButtonElement>(
			'button[data-copy-template*="mcp add"]',
		);
		expect(command?.disabled).toBe(true);
		const input = document.querySelector<HTMLInputElement>("#client-id-input")!;
		input.value = "12345";
		input.dispatchEvent(new Event("input", { bubbles: true }));
		expect(command?.disabled).toBe(false);
		expect(command?.dataset.copy).toContain('--oauth-client-id "12345"');
		expect(command?.dataset.copy).not.toContain("Enter the Client ID");
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
			"provider-verify",
		]);
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
	it("switches surfaces and install modes independently, persists them and restores focus", () => {
		history.replaceState(null, "", "/canvas-mcp/?client=claude-ai");
		mountApp("admin");
		document.querySelector<HTMLButtonElement>("#guide-surface-provider")?.focus();
		document.querySelector<HTMLButtonElement>("#guide-surface-provider")?.click();
		expect(document.activeElement?.id).toBe("guide-surface-provider");
		expect(document.querySelector("#guide-provider")?.hasAttribute("hidden")).toBe(false);
		document.querySelector<HTMLButtonElement>("#install-enterprise")?.click();
		const params = new URLSearchParams(location.search);
		expect(params.get("surface")).toBe("provider");
		expect(params.get("install")).toBe("enterprise");
		expect(JSON.parse(localStorage.getItem("canvas-mcp:v1") ?? "{}")).toMatchObject({
			install: "enterprise",
		});
		expect(document.querySelector(".guide-pending")).not.toBeNull();
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
		expect(() => renderContent([{ kind: "code", text: "{clientSecret}" }], {})).toThrow(
			"Unknown guide token",
		);
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
