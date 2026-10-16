// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { mountApp } from "../src/app";

describe("Canvas MCP pages", () => {
	beforeEach(() => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/");
		globalThis.localStorage.clear();
		document.body.innerHTML = '<div id="root"></div>';
	});

	it("uses Canvas-populated audience guidance without an admin region picker", () => {
		mountApp("admin");

		expect((document.querySelector("#region-select") as HTMLSelectElement).disabled).toBe(true);
		expect(document.querySelector("#region-field")?.classList.contains("is-hidden")).toBe(true);
		expect(document.body.textContent).toContain(
			"Canvas automatically populates the tenant's region-specific Maple audience",
		);
		expect(document.body.textContent).toContain("Not ready for key creation");
		expect(
			[...document.querySelectorAll(".admin-steps h3")].filter(
				(heading) => heading.textContent === "Paste scopes",
			),
		).toHaveLength(1);
		expect((document.querySelector(".copy-block button") as HTMLButtonElement).disabled).toBe(true);
		expect(
			[...document.querySelectorAll("nav a")].some((link) =>
				link.getAttribute("href")?.endsWith("/admin/"),
			),
		).toBe(true);
	});

	it("builds a regional user URL and includes the region in a shareable setup link", () => {
		globalThis.history.replaceState(
			null,
			"",
			"/canvas-mcp/?domain=utah.instructure.com&region=us-east-1",
		);
		mountApp("user");

		expect(document.body.textContent).toContain("https://utah.maple.us-east-1.core.inseng.io/mcp");
		expect(document.querySelector("#region-select")).not.toBeNull();
		expect(document.querySelector('[data-action="copy-link"]')).not.toBeNull();
	});

	it("does not render markup from an unsupported domain query", () => {
		globalThis.history.replaceState(
			null,
			"",
			"/canvas-mcp/?domain=%3Cimg%20src=x%20onerror=alert(1)%3E",
		);
		mountApp("user");

		expect(document.querySelector("img")).toBeNull();
		expect(document.querySelector<HTMLInputElement>("#domain-input")?.value).toBe("");
		expect(document.body.textContent).toContain(
			"Select a Canvas domain and region to build this URL",
		);
	});
});
