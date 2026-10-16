// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { mountApp } from "../src/app";

describe("Canvas MCP pages", () => {
	beforeEach(() => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/");
		globalThis.localStorage.clear();
		document.body.innerHTML = '<div id="root"></div>';
	});

	it("uses Pantoken components and switches the Canvas logo with the scheme", () => {
		mountApp("admin");

		expect(document.querySelector(".controls-panel")?.classList.contains("instui-card")).toBe(true);
		expect(document.querySelector(".controls-panel > .content")).not.toBeNull();
		expect(document.querySelector(".details-panel > .content")).not.toBeNull();
		expect(
			document
				.querySelector<HTMLInputElement>("#domain-input")
				?.classList.contains("instui-text-input"),
		).toBe(true);
		expect(
			document
				.querySelector<HTMLSelectElement>("#client-select")
				?.classList.contains("instui-simple-select"),
		).toBe(true);
		expect(document.querySelectorAll('input[name="key-type"]')).toHaveLength(2);
		const logo = document.querySelector<HTMLImageElement>(".wordmark-logo");
		const lightLogo = logo?.getAttribute("src");
		expect(lightLogo).toContain("data:image/svg+xml");

		const theme = document.querySelector<HTMLSelectElement>("#theme-select");
		if (!theme) throw new Error("Theme selector not found");
		theme.value = "dark";
		theme.dispatchEvent(new Event("change", { bubbles: true }));

		expect(document.documentElement.dataset.pantokenScheme).toBe("dark");
		expect(logo?.getAttribute("src")).not.toBe(lightLogo);
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
		expect(document.querySelector('[role="tablist"]')).not.toBeNull();
		expect(document.querySelector(".page-heading")?.nextElementSibling?.classList.contains("page-tabs")).toBe(true);
		expect(document.querySelector(".page-tabs > .list[role='tablist']")).not.toBeNull();
		expect(document.querySelector(".page-tabs > .panel[role='tabpanel']")).not.toBeNull();
		expect(document.querySelector(".page-tabs")?.classList.contains("--mb-md")).toBe(true);
		expect(document.querySelector(".page-tabs > .list")?.classList.contains("--mb-md")).toBe(false);
		expect(document.querySelector('[data-page="admin"]')?.getAttribute("aria-selected")).toBe("true");
	});

	it("switches setup tabs through the page query parameter and preserves setup state", () => {
		globalThis.history.replaceState(
			null,
			"",
			"/canvas-mcp/?domain=utah.instructure.com&region=us-east-1&page=connect",
		);
		mountApp("user");

		expect(document.querySelector("h1")?.textContent).toContain("Connect Canvas");
		document.querySelector<HTMLButtonElement>('[data-page="admin"]')?.click();

		const adminParams = new URLSearchParams(globalThis.location.search);
		expect(adminParams.get("page")).toBe("admin");
		expect(adminParams.get("domain")).toBe("utah.instructure.com");
		expect(adminParams.get("region")).toBe("us-east-1");
		expect(document.querySelector("h1")?.textContent).toContain("Create a Canvas developer key");

		document.querySelector<HTMLButtonElement>('[data-page="connect"]')?.click();
		expect(new URLSearchParams(globalThis.location.search).get("page")).toBe("connect");
		expect(document.querySelector("h1")?.textContent).toContain("Connect Canvas");
	});

	it("opens the page selected by the page query parameter from either static entry", () => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/?page=admin");
		mountApp("user");

		expect(document.querySelector("h1")?.textContent).toContain("Create a Canvas developer key");
		expect(document.querySelector('[data-page="admin"]')?.getAttribute("aria-selected")).toBe("true");
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

		expect(document.querySelector("img:not(.wordmark-logo)")).toBeNull();
		expect(document.querySelector<HTMLImageElement>(".wordmark-logo")?.src).toContain(
			"data:image/svg+xml",
		);
		expect(document.querySelector<HTMLInputElement>("#domain-input")?.value).toBe("");
		expect(document.body.textContent).toContain(
			"Select a Canvas domain and region to build this URL",
		);
	});
});
