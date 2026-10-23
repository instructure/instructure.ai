// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderConfig } from "../src/admin/config";
import { mountApp } from "../src/app";
import { clientDefinition } from "../src/clients";
import { renderGuide } from "../src/guides/render";
import { readState } from "../src/state";
import { copyToClipboard } from "../src/ui/copy";
import { escapeHtml } from "../src/ui/html";

const payloads = [
	`"><img data-injected src=x onerror="alert(1)">`,
	`'><svg data-injected onload='alert(1)'>`,
	`&quot;&lt;img data-injected src=x onerror=alert(1)&gt;`,
	`school.test.instructure.com/"><img data-injected src=x onerror="alert(1)">`,
];

function expectInertMarkup() {
	expect(document.querySelector("[data-injected], script")).toBeNull();
	expect(document.querySelector("[onerror], [onload], [onfocus]")).toBeNull();
}

describe("security-sensitive UI text", () => {
	beforeEach(() => {
		history.replaceState(null, "", "/canvas-mcp/");
		localStorage.clear();
		document.body.innerHTML = '<div id="root"></div><div class="toast"></div>';
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		document.body.replaceChildren();
	});

	it("escapes all HTML delimiters exactly once", () => {
		expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
	});

	it.each(payloads)("preserves configuration input as an inert attribute: %s", (value) => {
		document.body.innerHTML = renderConfig(readState("", null), value);
		expect(document.querySelector<HTMLInputElement>("#domain-input")?.value).toBe(value);
		expectInertMarkup();
	});

	it.each(payloads)("keeps query and edited domain values inert across renders: %s", (value) => {
		history.replaceState(null, "", `?${new URLSearchParams({ domain: value })}`);
		expect(readState(location.search, null).domain).toBe("");
		mountApp("admin");
		expectInertMarkup();
		const input = document.querySelector<HTMLInputElement>("#domain-input")!;
		input.value = value;
		input.dispatchEvent(new Event("input", { bubbles: true }));
		input.dispatchEvent(new Event("change", { bubbles: true }));
		expectInertMarkup();
		document
			.querySelector<HTMLSelectElement>("#client-select")!
			.dispatchEvent(new Event("change", { bubbles: true }));
		expectInertMarkup();
	});

	it.each(payloads)(
		"copies text without parsing clipboard content or toast labels: %s",
		async (value) => {
			const writeText = vi.fn().mockResolvedValue(undefined);
			vi.stubGlobal("navigator", { clipboard: { writeText } });
			await copyToClipboard(value, value);
			expect(writeText).toHaveBeenCalledExactlyOnceWith(value);
			expect(document.querySelector(".toast")?.textContent).toBe(value);
			expect(document.querySelector(".toast")?.children).toHaveLength(0);
			expect(document.querySelector("textarea")).toBeNull();
			expectInertMarkup();
		},
	);

	it.each(payloads)(
		"keeps fallback clipboard content inert and removes the textarea: %s",
		async (value) => {
			vi.stubGlobal("navigator", {
				clipboard: { writeText: vi.fn().mockRejectedValue(new Error("Clipboard denied")) },
			});
			const execCommand = vi.fn(() => {
				const textarea = document.querySelector("textarea")!;
				expect(textarea.value).toBe(value);
				expect(textarea.hasAttribute("readonly")).toBe(true);
				expect(textarea.childNodes).toHaveLength(0);
				expectInertMarkup();
				return true;
			});
			Object.defineProperty(document, "execCommand", {
				configurable: true,
				value: execCommand,
			});
			try {
				await copyToClipboard(value, value);
				expect(execCommand).toHaveBeenCalledExactlyOnceWith("copy");
				expect(document.querySelector("textarea")).toBeNull();
				expect(document.querySelector(".toast")?.textContent).toBe(value);
				expect(document.querySelector(".toast")?.children).toHaveLength(0);
				expectInertMarkup();
			} finally {
				Reflect.deleteProperty(document, "execCommand");
			}
		},
	);

	it.each(["antigravity", "antigravity-cli"] as const)(
		"keeps %s private credentials as a literal local-entry placeholder",
		(client) => {
			const state = readState(
				`?${new URLSearchParams({
					client,
					key: "private",
					domain: "example.instructure.com",
					region: "us-east-1",
					clientId: "12345000000000001",
				})}`,
				null,
			);
			document.body.innerHTML = renderGuide(
				{ ...clientDefinition(client), blocker: undefined },
				state,
				false,
			);
			const copy = document.querySelector<HTMLButtonElement>(
				'[data-guide-step="provider-configure-private"] .language-json [data-copy]',
			)!;
			expect(copy).not.toBeNull();
			expect(JSON.parse(copy.dataset.copy!).mcpServers["canvas-mcp"].oauth.clientSecret).toBe(
				"<ENTER_CLIENT_SECRET_LOCALLY>",
			);
			expect(document.querySelector("enter_client_secret_locally")).toBeNull();
		},
	);
});
