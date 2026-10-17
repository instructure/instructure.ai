// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
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
describe("composable client guides", () => {
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
		).toEqual(["canvas-create", "provider-save", "canvas-update-redirect", "provider-verify"]);
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
