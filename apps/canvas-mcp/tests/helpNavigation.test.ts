// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";

function click(id: string): void {
	document.querySelector<HTMLButtonElement>(`#${id}`)!.click();
}

function choose(section: string): void {
	const radio = document.querySelector<HTMLInputElement>(`#help-section-${section}`)!;
	radio.checked = true;
	radio.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("Help navigation", () => {
	beforeEach(() => {
		history.replaceState(null, "", "/canvas-mcp/");
		localStorage.clear();
		document.body.innerHTML = '<div id="root"></div>';
	});

	afterEach(() => vi.unstubAllGlobals());

	it.each(["faqs", "issues"])(
		"expands all %s disclosures for printing and restores their state",
		(section) => {
			history.replaceState(null, "", `?page=help&help=${section}`);
			mountApp("admin");
			const details = [
				...document.querySelectorAll<HTMLDetailsElement>("details.instui-toggle-details"),
			];
			expect(details.length).toBeGreaterThan(1);
			details[0]!.open = true;
			const original = details.map((entry) => entry.open);
			globalThis.dispatchEvent(new Event("beforeprint"));
			expect(details.every((entry) => entry.open)).toBe(true);
			globalThis.dispatchEvent(new Event("beforeprint"));
			globalThis.dispatchEvent(new Event("afterprint"));
			expect(details.map((entry) => entry.open)).toEqual(original);
			globalThis.dispatchEvent(new Event("afterprint"));
			expect(details.map((entry) => entry.open)).toEqual(original);
		},
	);

	it("cleans up print handlers when the same app root is mounted again", () => {
		history.replaceState(null, "", "?page=help");
		mountApp("admin");
		const previous = document.querySelector<HTMLDetailsElement>("details")!;
		globalThis.dispatchEvent(new Event("beforeprint"));
		expect(previous.open).toBe(true);
		mountApp("admin");
		expect(previous.open).toBe(false);
		const current = document.querySelector<HTMLDetailsElement>("details")!;
		globalThis.dispatchEvent(new Event("beforeprint"));
		expect(previous.open).toBe(false);
		expect(current.open).toBe(true);
		globalThis.dispatchEvent(new Event("afterprint"));
		expect(current.open).toBe(false);
	});

	it("is always available after Connect and skips the disabled tab with the keyboard", () => {
		mountApp("admin");
		expect([...document.querySelectorAll("[role=tab]")].map((tab) => tab.textContent)).toEqual([
			"Configure a Server",
			"Connect a Client",
			"Help",
		]);
		const admin = document.querySelector<HTMLButtonElement>("#tab-admin")!;
		admin.focus();
		admin.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
		expect(document.activeElement?.id).toBe("tab-help");
		expect(document.querySelector("#tab-admin")?.getAttribute("aria-selected")).toBe("true");
		click("tab-help");
		expect(document.querySelector("[role=tabpanel]")?.getAttribute("aria-labelledby")).toBe(
			"tab-help",
		);
		expect(document.querySelector("h1")?.textContent).toBe("Canvas MCP Help");
		expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(true);
		expect(document.querySelector("#domain-input")).toBeNull();
		expect(document.querySelector("#help-content")?.textContent).toContain("What is Canvas MCP?");
	});

	it.each(["faqs", "issues", "clients"])("supports %s deep links without setup", (section) => {
		history.replaceState(null, "", `?page=help&help=${section}&client=chatgpt`);
		mountApp("admin");
		expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("help");
		expect(document.querySelector<HTMLInputElement>(`#help-section-${section}`)?.checked).toBe(
			true,
		);
		expect(document.querySelector(".known-issue-alert")).toBeNull();
		expect(document.querySelector(".print-permalink")?.textContent).toContain("page=help");
		expect(document.querySelector(".print-permalink")?.textContent).toContain(`help=${section}`);
	});

	it("defaults invalid sections and restores focus after changing sections", () => {
		history.replaceState(null, "", "?page=help&help=bad");
		mountApp("admin");
		expect(new URLSearchParams(location.search).get("help")).toBe("faqs");
		choose("clients");
		expect(document.activeElement?.id).toBe("help-section-clients");
		expect(new URLSearchParams(location.search).get("help")).toBe("clients");
		expect(document.querySelector("table")).not.toBeNull();
		choose("issues");
		expect(document.activeElement?.id).toBe("help-section-issues");
		expect(document.querySelector("table")).toBeNull();
		expect(document.querySelector(".print-context")?.textContent).toContain("Help · Common Issues");
	});

	it("preserves setup preferences, surface, incomplete input, and the Help section", () => {
		history.replaceState(
			null,
			"",
			"?client=claude-code&install=enterprise&key=private&platform=windows&surface=provider&domain=school.instructure.com&region=us-west-2&clientId=12345000000000001",
		);
		mountApp("admin");
		const original = new URLSearchParams(location.search);
		const domain = document.querySelector<HTMLInputElement>("#domain-input")!;
		domain.value = "unfinished.";
		domain.dispatchEvent(new Event("input", { bubbles: true }));
		click("tab-help");
		choose("clients");
		const help = new URLSearchParams(location.search);
		for (const key of [
			"client",
			"install",
			"key",
			"platform",
			"surface",
			"domain",
			"region",
			"clientId",
		])
			expect(help.get(key)).toBe(original.get(key));
		expect(document.querySelector<HTMLButtonElement>("#tab-connect")?.disabled).toBe(false);
		click("tab-admin");
		expect(document.querySelector<HTMLInputElement>("#domain-input")?.value).toBe("unfinished.");
		expect(new URLSearchParams(location.search).has("help")).toBe(false);
		click("tab-help");
		expect(document.querySelector<HTMLInputElement>("#help-section-clients")?.checked).toBe(true);
		click("tab-connect");
		expect(new URLSearchParams(location.search).get("page")).toBe("connect");
		expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("user");
	});

	it("shares and prints the selected Help section without persisting it in preferences", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		const print = vi.fn();
		vi.stubGlobal("print", print);
		history.replaceState(null, "", "?page=help&help=clients");
		mountApp("admin");
		document.querySelector<HTMLButtonElement>('[data-action="copy-link"]')!.click();
		await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
		const url = new URL(writeText.mock.calls[0]![0]);
		expect(url.searchParams.get("page")).toBe("help");
		expect(url.searchParams.get("help")).toBe("clients");
		document.querySelector<HTMLButtonElement>('[data-action="print"]')!.click();
		expect(print).toHaveBeenCalledOnce();
		expect(document.querySelector(".print-context")?.textContent).toContain(
			"Help · Supported Clients",
		);
		expect(localStorage.getItem("canvas-mcp:v1")).not.toContain('"help"');
		expect(localStorage.getItem("canvas-mcp:v1")).not.toContain('"page"');
	});
});
