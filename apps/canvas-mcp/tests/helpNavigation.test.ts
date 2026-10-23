// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";
import { COMMON_ISSUES, FAQS } from "../src/help/content";

const originalFaqs = [...FAQS];
const originalIssues = [...COMMON_ISSUES];
const platformCommands = { mac: "echo mac-example", windows: "Write-Output windows-example" };
const sharedCommand = "https://<example-host>.test/";

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
		for (const groups of [FAQS, COMMON_ISSUES])
			groups.splice(0, groups.length, {
				title: "General",
				entries: [
					{ title: "Example question", text: "Example answer." },
					{
						title: "Example command",
						text: "Run the example.",
						commands: groups === FAQS ? platformCommands : sharedCommand,
					},
				],
			});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		FAQS.splice(0, FAQS.length, ...originalFaqs);
		COMMON_ISSUES.splice(0, COMMON_ISSUES.length, ...originalIssues);
	});

	it.each(["faqs", "issues", "clients"])(
		"restores manually opened and closed %s disclosures after remounting",
		(section) => {
			history.replaceState(null, "", `?page=help&help=${section}`);
			mountApp("admin");
			document.querySelector<HTMLElement>("#help-content details > summary")!.click();
			mountApp("admin");
			expect(document.querySelector<HTMLDetailsElement>("#help-content details")?.open).toBe(true);
			document.querySelector<HTMLElement>("#help-content details > summary")!.click();
			mountApp("admin");
			expect(document.querySelector<HTMLDetailsElement>("#help-content details")?.open).toBe(false);
		},
	);

	it("does not persist automatic search or print expansion", () => {
		history.replaceState(null, "", "?page=help&help=faqs");
		mountApp("admin");
		const search = document.querySelector<HTMLInputElement>("[data-help-search]")!;
		search.value = "Example";
		search.dispatchEvent(new Event("input"));
		globalThis.dispatchEvent(new Event("beforeprint"));
		globalThis.dispatchEvent(new Event("afterprint"));
		mountApp("admin");
		expect(
			[...document.querySelectorAll<HTMLDetailsElement>("#help-content details")].every(
				(details) => !details.open,
			),
		).toBe(true);
	});

	it("renders and copies a shared Common Issues command without a platform switch", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		history.replaceState(null, "", "?page=help&help=issues");
		mountApp("admin");
		const block = document.querySelector(".help-entry .shiki-block.language-text")!;
		expect(block).not.toBeNull();
		expect(block.closest(".shiki-code-group")).toBeNull();
		const text = block.querySelector("pre code")!.textContent;
		expect(text).toBe(sharedCommand);
		expect(block.querySelector("example-host")).toBeNull();
		block.querySelector<HTMLButtonElement>("[data-copy]")!.click();
		await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(text));
	});

	it.each(["windows", "mac"] as const)(
		"restores the %s FAQ command and persists platform switching",
		(platform) => {
			history.replaceState(null, "", `?page=help&help=faqs&platform=${platform}`);
			mountApp("admin");
			const panel = document.querySelector<HTMLElement>(
				`.shiki-code-group [data-code-platform="${platform}"]`,
			)!;
			expect(panel.hidden).toBe(false);
			expect(panel.querySelector("pre code")?.textContent).toBe(platformCommands[platform]);
			const other = platform === "windows" ? "mac" : "windows";
			document
				.querySelector<HTMLButtonElement>(`.shiki-code-group [data-platform-choice="${other}"]`)!
				.click();
			expect(panel.hidden).toBe(true);
			expect(document.querySelector<HTMLElement>(`[data-code-platform="${other}"]`)?.hidden).toBe(
				false,
			);
			expect(new URLSearchParams(location.search).get("platform")).toBe(other);
			choose("issues");
			choose("faqs");
			expect(document.querySelector<HTMLElement>(`[data-code-platform="${other}"]`)?.hidden).toBe(
				false,
			);
		},
	);

	it("copies the FAQ command and finds it through Help search", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		history.replaceState(null, "", "?page=help&help=faqs&platform=windows");
		mountApp("admin");
		const search = document.querySelector<HTMLInputElement>("[data-help-search]")!;
		search.value = platformCommands.windows;
		search.dispatchEvent(new Event("input"));
		const group = document.querySelector(".shiki-code-group")!;
		expect(group.closest("details")?.open).toBe(true);
		expect(group.closest("details")?.hidden).toBe(false);
		const button = group.querySelector<HTMLButtonElement>(
			'[data-code-platform="windows"] [data-copy]',
		)!;
		button.click();
		await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(button.dataset.copy));
	});

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
		expect(document.querySelector("#help-content [data-help-search]")).not.toBeNull();
		expect(document.querySelector("#help-content details > summary")).not.toBeNull();
	});

	it.each(["faqs", "issues", "clients", "tools", "contact"])(
		"supports %s deep links without setup",
		(section) => {
			history.replaceState(null, "", `?page=help&help=${section}&client=chatgpt`);
			mountApp("admin");
			expect(document.querySelector(".site-shell")?.getAttribute("data-mode")).toBe("help");
			expect(document.querySelector<HTMLInputElement>(`#help-section-${section}`)?.checked).toBe(
				true,
			);
			expect(document.querySelector(".known-issue-alert")).toBeNull();
			expect(document.querySelector(".print-permalink")?.textContent).toContain("page=help");
			expect(document.querySelector(".print-permalink")?.textContent).toContain(`help=${section}`);
		},
	);

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

	it("opens Available Tools after Supported Clients and wires its filters", () => {
		history.replaceState(null, "", "?page=help&help=clients");
		mountApp("admin");
		choose("tools");
		expect(document.activeElement?.id).toBe("help-section-tools");
		expect(new URLSearchParams(location.search).get("help")).toBe("tools");
		const search = document.querySelector<HTMLInputElement>("#tool-search")!;
		search.value = "no-such-tool-xyz";
		search.dispatchEvent(new Event("input", { bubbles: true }));
		expect(document.querySelector("#tool-results")?.textContent).toBe("0 of 141 tools");
		expect(document.querySelector(".print-context")?.textContent).toContain(
			"Help · Available Tools",
		);
		expect(document.querySelector(".print-permalink")?.textContent).toContain("help=tools");
	});

	it("opens Contact with community and issue form links without setup", () => {
		history.replaceState(null, "", "?page=help&help=tools");
		mountApp("admin");
		choose("contact");
		expect(document.activeElement?.id).toBe("help-section-contact");
		expect(new URLSearchParams(location.search).get("help")).toBe("contact");
		expect(document.querySelector("#help-content-heading")?.textContent).toBe("Contact");
		expect(
			[...document.querySelectorAll<HTMLAnchorElement>("#contact-issues + p + ul a")].map((link) =>
				new URL(link.href).searchParams.get("template"),
			),
		).toEqual([
			"canvas-mcp-guides.yml",
			"canvas-mcp-validation.yml",
			"canvas-mcp-faq.yml",
			"canvas-mcp-common-issues.yml",
			"canvas-mcp-client.yml",
		]);
		expect(document.querySelector("[data-help-search], #tool-search")).toBeNull();
		expect(document.querySelector(".print-context")?.textContent).toContain("Help · Contact");
		expect(document.querySelector(".print-permalink")?.textContent).toContain("help=contact");
		choose("faqs");
		expect(document.querySelector("#contact-community")).toBeNull();
		expect(document.querySelector("[data-help-search]")).not.toBeNull();
	});

	it("copies the example prompt from a tool card without setup", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		history.replaceState(null, "", "?page=help&help=tools");
		mountApp("admin");
		const button = document.querySelector<HTMLButtonElement>("#tool-list [data-copy]")!;
		const prompt = button.closest(".shiki-block")!.querySelector("code")!.textContent;
		button.click();
		await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(prompt));
	});

	it("restores, shares, and prints tool filters while retaining them across Help navigation", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { clipboard: { writeText } });
		history.replaceState(
			null,
			"",
			"?page=help&help=tools&toolResource=quiz&toolAccess=read&toolRole=student&toolRole=teacher&toolSearch=quiz",
		);
		mountApp("admin");
		expect(document.querySelector<HTMLSelectElement>("#tool-resource-filter")?.value).toBe("quiz");
		expect(document.querySelector<HTMLInputElement>("#tool-search")?.value).toBe("quiz");
		const search = document.querySelector<HTMLInputElement>("#tool-search")!;
		search.value = "question";
		search.dispatchEvent(new Event("input"));
		expect(new URLSearchParams(location.search).get("toolSearch")).toBe("question");
		expect(document.querySelector(".print-permalink")?.textContent).toContain(
			"toolSearch=question",
		);
		document.querySelector<HTMLButtonElement>('[data-action="copy-link"]')!.click();
		await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
		const shared = new URL(writeText.mock.calls[0]![0]).searchParams;
		expect(shared.get("toolResource")).toBe("quiz");
		expect(shared.getAll("toolRole")).toEqual(["student", "teacher"]);
		expect(shared.get("toolSearch")).toBe("question");
		choose("faqs");
		expect(new URLSearchParams(location.search).has("toolResource")).toBe(false);
		choose("tools");
		expect(document.querySelector<HTMLInputElement>("#tool-search")?.value).toBe("question");
		expect(document.querySelector<HTMLSelectElement>("#tool-resource-filter")?.value).toBe("quiz");
		expect(localStorage.getItem("canvas-mcp:v1")).not.toContain("toolResource");
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
