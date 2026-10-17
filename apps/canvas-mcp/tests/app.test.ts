// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountApp } from "../src/app";

describe("Canvas MCP pages", () => {
	beforeEach(() => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/");
		globalThis.localStorage.clear();
		document.body.innerHTML = '<div id="root"></div>';
	});

	afterEach(() => {
		vi.unstubAllGlobals();
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
		expect(document.querySelectorAll('input[name="private-key"]')).toHaveLength(1);
		expect(document.querySelector<HTMLInputElement>("#private-key-input")?.checked).toBe(false);
		expect(document.querySelector<HTMLInputElement>("#private-key-input")?.disabled).toBe(false);
		expect(document.querySelector<HTMLSelectElement>("#region-select")?.disabled).toBe(false);
		expect(document.querySelector<HTMLInputElement>("#client-id-input")?.required).toBe(true);
		expect(document.querySelector(".details-panel #client-id-input")).not.toBeNull();
		expect(document.querySelector("#client-id-reference-input")).toBeNull();
		expect(document.querySelector(".controls-panel h2")?.textContent).toBe("Configuration");
		expect(document.querySelector(".client-health-status")?.textContent).toContain("Validated");
		expect(document.querySelector(".client-health-status svg")?.getAttribute("aria-hidden")).toBe(
			"true",
		);
		expect(document.querySelectorAll(".controls-panel h2")).toHaveLength(1);
		expect(document.querySelector(".controls-panel .rule")).toBeNull();
		expect(document.querySelector("#client-select + .field-hint")).toBeNull();
		expect(document.querySelector(".admin-steps .eyebrow")).toBeNull();
		expect(document.querySelector(".admin-steps .status-pill")).toBeNull();
		expect(document.querySelector(".admin-steps .intro-copy")).toBeNull();
		expect(document.querySelector(".admin-steps .step-kicker")).toBeNull();
		expect(document.querySelectorAll(".admin-steps .guide-section")).toHaveLength(4);
		expect(document.querySelector(".public-key-save-steps")).not.toBeNull();
		expect(document.querySelector(".private-key-save-steps")).toBeNull();
		expect(document.querySelector(".shared-key-save-steps")?.textContent).toContain(
			"Developer Keys",
		);
		expect(document.querySelector(".shared-key-save-steps")?.textContent).toContain(
			"Details column",
		);
		expect(document.querySelector(".shared-key-save-steps")?.getAttribute("start")).toBe("2");
		expect(
			[...document.querySelectorAll(".admin-steps .guide-section h3")].map(
				(heading) => heading.textContent,
			),
		).toEqual(["Open Developer Keys", "Key Settings", "Scopes", "Save"]);
		expect(document.querySelector(".admin-steps ol.instui-list")?.children).toHaveLength(2);
		expect(
			[
				...document.querySelectorAll(
					".admin-steps .guide-section:nth-child(2) .settings-table tbody th[scope=row]",
				),
			].map((label) => label.textContent),
		).toEqual([
			"Key name",
			"Owner Email",
			"Redirect URIs",
			"Linked Partner App",
			"Vendor Code (LTI 2):",
			"Icon URL:",
			"Notes",
			"Test Cluster Only",
			"Client Credentials Audience",
			"Allowed Audiences",
			"Authorized Flows",
			"Client Type",
		]);
		expect([...document.querySelectorAll(".settings-table")].map((table) => table.tagName)).toEqual(
			["TABLE", "TABLE"],
		);
		expect(
			[...document.querySelectorAll(".settings-table thead th")].map(
				(header) => header.textContent,
			),
		).toEqual(["Setting", "Value", "Option", "Value"]);
		const rowForSetting = (label: string) =>
			[...document.querySelectorAll<HTMLTableRowElement>(".settings-table tbody tr")].find(
				(row) => row.querySelector('th[scope="row"]')?.textContent === label,
			);
		const audiencesRow = rowForSetting("Allowed Audiences");
		expect(audiencesRow?.querySelector("td")?.textContent).toContain(
			"https://{{tenant_name}}.maple.<region>.core.inseng.io/",
		);
		const regionLead = audiencesRow?.querySelector(".audience-region-lead");
		expect(regionLead?.textContent).toBe("<region> will be one of:");
		expect(
			audiencesRow?.querySelector("ul.audience-regions")?.classList.contains("instui-list"),
		).toBe(true);
		expect(regionLead?.nextElementSibling).toBe(audiencesRow?.querySelector("ul.audience-regions"));
		expect(
			[...(audiencesRow?.querySelectorAll(".audience-regions code") ?? [])].map(
				(region) => region.textContent,
			),
		).toEqual([
			"us-east-1",
			"us-west-2",
			"eu-west-1",
			"eu-central-1",
			"ca-central-1",
			"ap-southeast-1",
			"ap-southeast-2",
		]);
		expect(audiencesRow?.querySelector(".audience-tenant-note")?.textContent).toBe(
			"{{tenant_name}} is a literal string in the Audiences list.",
		);
		const redirectRow = rowForSetting("Redirect URIs");
		expect(redirectRow?.querySelector("pre code")?.textContent).toBe(
			"http://localhost:8081/callback",
		);
		const redirectCopy = redirectRow?.querySelector<HTMLButtonElement>("button");
		expect(redirectCopy?.classList.contains("-icon-copy")).toBe(true);
		expect(redirectCopy?.classList.contains("-shape-square")).toBe(true);
		expect(redirectCopy?.textContent?.trim()).toBe("");
		expect(redirectCopy?.getAttribute("aria-label")).toBe("Copy Redirect URIs");
		expect(rowForSetting("Owner Email")?.querySelector(".setting-value-muted")?.textContent).toBe(
			"An administrator or team mailbox",
		);
		expect(rowForSetting("Authorized Flows")?.querySelector("td")?.textContent).toBe("Leave blank");
		expect(rowForSetting("Client Type")?.querySelector("td")?.textContent).toBe("Public");
		expect(
			document.querySelector(".admin-steps .guide-section:nth-child(4) .settings-table"),
		).toBeNull();
		for (const label of ["Linked Partner App", "Vendor Code (LTI 2):", "Icon URL:", "Notes"]) {
			expect(rowForSetting(label)?.querySelector(".setting-value-muted")?.textContent).toBe(
				"Leave blank",
			);
		}
		expect(
			[...document.querySelectorAll<HTMLInputElement>(".settings-table input[type=checkbox]")].map(
				(checkbox) => checkbox.checked,
			),
		).toEqual([false, true, true]);
		const settingsCheckboxLabel = (name: string) =>
			[...document.querySelectorAll<HTMLElement>(".settings-table tbody tr")]
				.find((row) => row.querySelector('th[scope="row"]')?.textContent === name)
				?.querySelector("label");
		expect(settingsCheckboxLabel("Test Cluster Only")?.classList.contains("-variant-toggle")).toBe(
			false,
		);
		expect(
			settingsCheckboxLabel("Allow Include Parameters")?.classList.contains("-variant-toggle"),
		).toBe(false);
		const scopeManifest = document.querySelector(".scope-manifest code")?.textContent ?? "";
		expect(
			(document.querySelector(".scope-card-header button") as HTMLButtonElement).dataset.copy,
		).toBe(scopeManifest);
		expect(document.querySelector(".scope-card")?.classList.contains("instui-card")).toBe(true);
		expect(
			document.querySelector(".details-panel")?.classList.contains("print-page-break-after"),
		).toBe(false);
		expect(
			document.querySelector(".scope-card")?.classList.contains("print-page-break-after"),
		).toBe(false);
		expect(document.querySelector(".scope-card-header h4")?.textContent).toBe(
			"Per-tool scope manifest",
		);
		expect(
			document.querySelector(".scope-card-header button")?.classList.contains("-color-tertiary"),
		).toBe(true);
		expect(
			document.querySelector(".scope-card-header button")?.classList.contains("-icon-copy"),
		).toBe(true);
		expect(
			document.querySelector(".scope-card-header button")?.classList.contains("-shape-square"),
		).toBe(true);
		expect(
			document.querySelector(".scope-card-header button")?.classList.contains("-size-sm"),
		).toBe(true);
		expect(document.querySelector(".scope-card-header button")?.textContent?.trim()).toBe("");
		expect(document.querySelector(".scope-card-header button")?.getAttribute("aria-label")).toBe(
			"Copy scope manifest",
		);
		expect(
			(document.querySelector(".scope-card-header button") as HTMLButtonElement).disabled,
		).toBe(true);
		expect(scopeManifest).not.toContain("https://sso.canvaslms.com/mcp-limited");
		expect(scopeManifest.startsWith("https://sso.canvaslms.com/all-client-scopes\n")).toBe(true);
		expect(scopeManifest).toContain(
			"url:PATCH|/api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items/:item_id",
		);
		expect(scopeManifest.endsWith("url:POST|/api/v1/oauth2/introspect")).toBe(true);
		const pasteScopesHeading = document.querySelector(".scope-manifest-title");
		expect(pasteScopesHeading?.textContent).toBe("Paste Scopes");
		expect(pasteScopesHeading?.closest(".settings-table")).toBeNull();
		expect(pasteScopesHeading?.nextElementSibling?.classList.contains("scope-card")).toBe(true);
		expect(document.querySelector(".instructions-heading")).toBeNull();
		expect(document.querySelector(".details-panel h2")?.textContent).toBe(
			"Key settings for Claude Code",
		);
		expect(document.querySelector(".site-header")).toBeNull();
		expect(document.querySelectorAll(".page-heading-actions button")).toHaveLength(1);
		expect(document.querySelector(".instui-tray")?.hasAttribute("popover")).toBe(true);
		expect(document.querySelector<HTMLElement>("#settings-tray")?.style.padding).not.toBe("");
		expect(document.querySelector("#settings-appearance-heading")?.textContent).toBe("Appearance");
		expect(document.querySelector("#settings-sharing-heading")?.textContent).toBe("Sharing");
		expect(document.querySelector("#tray-server-details-heading")?.textContent).toBe(
			"Server details",
		);
		expect(document.querySelector(".controls-panel")).not.toBeNull();
		expect(document.querySelector(".details-panel")).not.toBeNull();
		expect(document.querySelector(".workspace-grid")?.children).toHaveLength(2);
		expect(
			document
				.querySelector<HTMLButtonElement>(".page-heading-actions button")
				?.classList.contains("-icon-sliders-horizontal"),
		).toBe(true);
		expect(
			document
				.querySelector<HTMLButtonElement>(".settings-tray-header button")
				?.getAttribute("popovertargetaction"),
		).toBe("hide");
		expect(
			[...document.querySelectorAll<HTMLButtonElement>('.page-tabs [role="tab"]')].map(
				(tab) => tab.textContent,
			),
		).toEqual(["Configure a Server", "Connect a Client"]);
		expect(document.querySelector<HTMLButtonElement>('[data-page="connect"]')?.disabled).toBe(true);
		expect(
			document.querySelector('[data-action="copy-link"]')?.classList.contains("-icon-send"),
		).toBe(false);
		expect(
			document.querySelector('[data-action="print"]')?.classList.contains("-icon-printer"),
		).toBe(false);
		expect(
			document
				.querySelector('[data-action="copy-link"] > span.instui-icon.-icon-send')
				?.getAttribute("aria-hidden"),
		).toBe("true");
		expect(
			document
				.querySelector('[data-action="print"] > span.instui-icon.-icon-printer')
				?.getAttribute("aria-hidden"),
		).toBe("true");
		expect(document.querySelector('[data-action="print"]')?.textContent).toBe("Print this page");
		expect(document.querySelector('[data-action="copy-link"]')?.textContent).toBe("Copy this link");
		expect(document.querySelector(".theme-toggle")?.classList.contains("instui-button-set")).toBe(
			true,
		);
		expect(
			document.querySelector('[data-theme-choice="system"]')?.classList.contains("-icon-monitor"),
		).toBe(true);
		expect(
			document.querySelector('[data-theme-choice="light"]')?.classList.contains("-icon-sun"),
		).toBe(true);
		expect(
			document.querySelector('[data-theme-choice="dark"]')?.classList.contains("-icon-moon"),
		).toBe(true);
		expect(document.querySelector(".eyebrow")?.textContent?.trim()).toBe("");
		expect(document.querySelector(".page-footer a")).toBeNull();
		expect(document.querySelector(".page-footer > p")?.textContent.trim()).toMatch(
			/^Copyright © \d{4} Instructure, Inc\.$/u,
		);

		const logo = document.querySelector<HTMLImageElement>(".eyebrow-logo");
		const lightLogo = logo?.getAttribute("src");
		expect(lightLogo).toContain("data:image/svg+xml");

		const theme = document.querySelector<HTMLButtonElement>('[data-theme-choice="dark"]');
		if (!theme) throw new Error("Dark theme button not found");
		theme.click();

		expect(document.documentElement.dataset.pantokenScheme).toBe("dark");
		expect(logo?.getAttribute("src")).not.toBe(lightLogo);
		expect(theme.getAttribute("aria-pressed")).toBe("true");
	});

	it("defaults to public and constrains the private-key toggle to client support", () => {
		mountApp("admin");

		const clientSelect = document.querySelector<HTMLSelectElement>("#client-select");
		if (!clientSelect) throw new Error("MCP client selector not found");
		clientSelect.value = "generic";
		clientSelect.dispatchEvent(new Event("change", { bubbles: true }));

		let privateKey = document.querySelector<HTMLInputElement>("#private-key-input");
		expect(privateKey?.checked).toBe(false);
		expect(privateKey?.disabled).toBe(false);
		if (!privateKey) throw new Error("Private key toggle not found");
		privateKey.checked = true;
		privateKey.dispatchEvent(new Event("change", { bubbles: true }));

		privateKey = document.querySelector<HTMLInputElement>("#private-key-input");
		expect(privateKey?.checked).toBe(true);
		expect(new URLSearchParams(globalThis.location.search).get("key")).toBe("private");
		expect(document.querySelector(".shared-key-save-steps")?.getAttribute("start")).toBe("2");
		const privateSaveBanner = document.querySelector(".private-key-save-steps");
		expect(privateSaveBanner?.classList.contains("instui-banner")).toBe(true);
		expect(privateSaveBanner?.classList.contains("-icon-key")).toBe(true);
		expect(privateSaveBanner?.classList.contains("-size-compact")).toBe(true);
		expect(privateSaveBanner?.getAttribute("role")).toBe("status");
		expect(privateSaveBanner?.querySelector("h4")?.textContent).toBe("Private key setup");
		expect(privateSaveBanner?.textContent).toContain("store it securely");
		expect(privateSaveBanner?.querySelector("ol")).toBeNull();
		expect(
			privateSaveBanner?.querySelector<HTMLImageElement>(
				'img[src$="/images/server-canvas-save_private_key.png"]',
			),
		).not.toBeNull();
		expect(document.querySelector(".private-key-save-step")?.textContent).toContain("Save");
		expect(document.querySelector(".public-key-save-steps")).toBeNull();
		expect(document.querySelector(".shared-key-save-steps")).not.toBeNull();
		expect(document.querySelector("#client-id-reference-input")).toBeNull();
		expect(document.querySelector(".generated-panel")).toBeNull();

		const privateOnlyClient = document.querySelector<HTMLSelectElement>("#client-select");
		if (!privateOnlyClient) throw new Error("MCP client selector not found");
		privateOnlyClient.value = "copilot-studio";
		privateOnlyClient.dispatchEvent(new Event("change", { bubbles: true }));

		privateKey = document.querySelector<HTMLInputElement>("#private-key-input");
		expect(privateKey?.checked).toBe(true);
		expect(privateKey?.disabled).toBe(true);

		const flexibleClient = document.querySelector<HTMLSelectElement>("#client-select");
		if (!flexibleClient) throw new Error("MCP client selector not found");
		flexibleClient.value = "generic";
		flexibleClient.dispatchEvent(new Event("change", { bubbles: true }));
		privateKey = document.querySelector<HTMLInputElement>("#private-key-input");
		expect(privateKey?.checked).toBe(false);
		expect(privateKey?.disabled).toBe(false);
		expect(new URLSearchParams(globalThis.location.search).get("key")).toBe("public");
	});

	it("lists Rulesync MCP targets and flags OAuth metadata it does not provide", () => {
		mountApp("admin");

		const clientSelect = document.querySelector<HTMLSelectElement>("#client-select");
		if (!clientSelect) throw new Error("MCP client selector not found");
		const groups = [...clientSelect.querySelectorAll("optgroup")];
		expect(groups.map((group) => group.label)).toEqual(["Curated", "Other"]);
		expect([...groups[0].children].map((option) => option.textContent)).toEqual([
			"Anthropic · Claude.ai / Claude Desktop",
			"Anthropic · Claude Code",
			"Google · Antigravity",
			"Google · Antigravity CLI",
			"Google · Gemini CLI",
			"Google · Gemini Enterprise",
			"Microsoft · Copilot Studio",
			"OpenAI · ChatGPT",
			"OpenAI · Codex",
			"Superhuman · Go",
		]);
		const otherOptions = [...groups[1].children] as HTMLOptionElement[];
		expect(otherOptions[0].value).toBe("generic");
		expect(otherOptions[0].textContent).toBe("Generic MCP client");
		const rulesyncNames = otherOptions.slice(1).map((option) => option.textContent ?? "");
		expect(rulesyncNames).toHaveLength(55);
		expect(rulesyncNames).toEqual(
			[...rulesyncNames].sort((left, right) => left.localeCompare(right)),
		);
		expect(clientSelect.querySelector('option[value="amp"]')?.textContent).toBe("Amp");
		expect(clientSelect.querySelector('option[value="cursor"]')?.textContent).toBe("Cursor");
		expect(clientSelect.querySelector('option[value="copilot"]')?.textContent).toBe(
			"GitHub Copilot",
		);
		expect(clientSelect.querySelector('option[value="claudecode"]')).toBeNull();
		expect(clientSelect.querySelector('option[value="codexcli"]')).toBeNull();
		expect(clientSelect.querySelector('option[value="antigravity-ide"]')).toBeNull();
		expect(clientSelect.querySelector('option[value="antigravity"]')?.textContent).toBe(
			"Google · Antigravity",
		);

		clientSelect.value = "cursor";
		clientSelect.dispatchEvent(new Event("change", { bubbles: true }));

		expect(document.querySelector("#mcp-oauth-metadata-warning")).toBeNull();
		expect(
			[...document.querySelectorAll(".settings-table tbody tr")]
				.find((row) => row.querySelector('th[scope="row"]')?.textContent === "Redirect URIs")
				?.querySelector("td")?.textContent,
		).toBe("Client callback URI");
		const cursorRedirect = [
			...document.querySelectorAll<HTMLTableRowElement>(".settings-table tbody tr"),
		].find((row) => row.querySelector('th[scope="row"]')?.textContent === "Redirect URIs");
		expect(cursorRedirect?.querySelector(".setting-value-muted")?.textContent).toBe(
			"Client callback URI",
		);
		expect(cursorRedirect?.querySelector("pre, button")).toBeNull();

		clientSelect.value = "codex";
		clientSelect.dispatchEvent(new Event("change", { bubbles: true }));
		const codexRedirect = [
			...document.querySelectorAll<HTMLTableRowElement>(".settings-table tbody tr"),
		].find((row) => row.querySelector('th[scope="row"]')?.textContent === "Redirect URIs");
		expect(codexRedirect?.querySelector(".setting-value-muted")?.textContent).toBe(
			"Select a Canvas domain and region to compute the callback URI.",
		);
		expect(codexRedirect?.querySelector("pre, button")).toBeNull();
	});

	it("provides a region picker in admin configuration", () => {
		mountApp("admin");
		const domainInput = document.querySelector<HTMLInputElement>("#domain-input");
		if (!domainInput) throw new Error("Canvas domain input not found");
		expect(document.querySelector(".server-details-card")).not.toBeNull();

		expect((document.querySelector("#region-select") as HTMLSelectElement).disabled).toBe(false);
		expect(document.querySelector("#region-field")?.classList.contains("is-hidden")).toBe(false);
		expect(document.querySelectorAll(".audience-regions li")).toHaveLength(7);
		expect(document.querySelector(".scope-manifest")).not.toBeNull();
		expect(
			[...document.querySelectorAll(".admin-steps h3")].filter(
				(heading) => heading.textContent === "Scopes",
			),
		).toHaveLength(1);
		expect(document.querySelector(".scope-manifest")).not.toBeNull();
		expect(document.querySelector('[role="tablist"]')).not.toBeNull();
		expect(
			document.querySelector(".page-heading")?.nextElementSibling?.classList.contains("page-tabs"),
		).toBe(true);
		expect(document.querySelector(".page-tabs > .list[role='tablist']")).not.toBeNull();
		expect(document.querySelector(".page-tabs > .panel[role='tabpanel']")).not.toBeNull();
		expect(document.querySelector(".page-tabs")?.classList.contains("--mb-md")).toBe(true);
		expect(document.querySelector(".page-tabs > .list")?.classList.contains("--mb-md")).toBe(false);
		expect(document.querySelector('[data-page="admin"]')?.getAttribute("aria-selected")).toBe(
			"true",
		);
		domainInput.value = "utah.instructure.com";
		domainInput.dispatchEvent(new Event("change", { bubbles: true }));
		expect(document.querySelector("#tray-server-details-heading")?.textContent).toBe(
			"Server details",
		);
		const regionSelect = document.querySelector<HTMLSelectElement>("#region-select");
		if (!regionSelect) throw new Error("Canvas region selector not found");
		regionSelect.value = "us-east-1";
		regionSelect.dispatchEvent(new Event("change", { bubbles: true }));
		expect(document.querySelector(".server-details-card")).not.toBeNull();
		expect(document.querySelector<HTMLInputElement>("#generated-mcp-url")?.value).toBe(
			"https://utah.maple.us-east-1.core.inseng.io/mcp",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-mcp-url")?.readOnly).toBe(true);
		expect(document.querySelector<HTMLInputElement>("#generated-auth-url")?.readOnly).toBe(true);
		expect(document.querySelector<HTMLInputElement>("#generated-auth-url")?.value).toBe(
			"https://utah.instructure.com/login/oauth2/auth",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-token-url")?.readOnly).toBe(true);
		expect(document.querySelector<HTMLInputElement>("#generated-token-url")?.value).toBe(
			"https://utah.instructure.com/login/oauth2/token",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-scope-url")?.value).toBe(
			"https://sso.canvaslms.com/all-client-scopes",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-client-id")?.readOnly).toBe(true);
		expect(
			document.querySelector("#generated-client-id-field")?.classList.contains("is-hidden"),
		).toBe(false);
		expect(document.querySelectorAll(".server-details-card input[readonly]")).toHaveLength(5);
		expect(document.querySelector<HTMLButtonElement>("#generated-client-id-copy")?.disabled).toBe(
			true,
		);
		expect(document.querySelector("#configure-client-button")).toBeNull();
		const clientIdInput = document.querySelector<HTMLInputElement>("#client-id-input");
		if (!clientIdInput) throw new Error("Client ID input not found");
		clientIdInput.value = "12345000000000001";
		clientIdInput.dispatchEvent(new Event("input", { bubbles: true }));
		expect(document.querySelector<HTMLInputElement>("#generated-client-id")?.value).toBe(
			"12345000000000001",
		);
	});

	it("checks Test Cluster Only for a beta tenant", () => {
		globalThis.history.replaceState(
			null,
			"",
			"/canvas-mcp/?domain=utah.beta.instructure.com&client=gemini-enterprise&key=private&page=admin",
		);
		mountApp("admin");

		const testClusterCheckbox = [
			...document.querySelectorAll<HTMLElement>(".settings-table tbody tr"),
		]
			.find((row) => row.querySelector('th[scope="row"]')?.textContent === "Test Cluster Only")
			?.querySelector<HTMLInputElement>("input");
		expect(testClusterCheckbox?.checked).toBe(true);
		expect(document.querySelector(".private-key-save-steps")?.textContent).toContain(
			"store it securely",
		);
		const betaRows = [
			...document.querySelectorAll<HTMLTableRowElement>(".settings-table tbody tr"),
		];
		const valueFor = (label: string) =>
			betaRows
				.find((row) => row.querySelector('th[scope="row"]')?.textContent === label)
				?.querySelector("td")?.textContent;
		expect(valueFor("Authorized Flows")).toBe("Token Exchange");
		expect(valueFor("Client Type")).toBe("Confidential");
	});

	it("shows known client issues on both admin and client pages", () => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/?client=chatgpt&page=admin");
		mountApp("admin");
		expect(document.querySelector(".client-health-status")?.textContent).toContain("Known issue");
		const adminAlert = document.querySelector(".known-issue-alert");
		expect(adminAlert?.classList.contains("-color-danger")).toBe(true);
		expect(adminAlert?.textContent).toContain("Canvas MCP authentication");
		expect(adminAlert?.getAttribute("role")).toBe("alert");

		globalThis.history.replaceState(null, "", "/canvas-mcp/?client=chatgpt&page=connect");
		mountApp("user");
		expect(document.querySelector(".known-issue-alert")?.textContent).toContain(
			"Canvas MCP authentication",
		);
		expect(document.querySelector(".details-panel .known-issue-alert")).toBeNull();
	});

	it("defaults client selections without recorded end-to-end tests to untested", () => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/?client=codex&page=admin");
		mountApp("admin");

		const clientSelect = document.querySelector("#client-select");
		expect(clientSelect?.nextElementSibling?.classList.contains("client-health-status")).toBe(true);
		expect(document.querySelector(".client-health-status")?.textContent).toContain("Untested");
		expect(document.querySelector(".client-health-status svg")).not.toBeNull();
		expect(document.querySelector(".known-issue-alert")).toBeNull();

		globalThis.history.replaceState(
			null,
			"",
			"/canvas-mcp/?client=claude-code&install=enterprise&page=admin",
		);
		mountApp("admin");
		expect(document.querySelector(".client-health-status")?.textContent).toContain("Untested");
	});

	it("switches setup tabs through the page query parameter and preserves setup state", () => {
		globalThis.history.replaceState(
			null,
			"",
			"/canvas-mcp/?domain=utah.instructure.com&clientId=12345000000000001&region=us-east-1&page=connect",
		);
		mountApp("user");

		expect(document.querySelector<HTMLButtonElement>('[data-page="connect"]')?.disabled).toBe(
			false,
		);
		expect(document.querySelector("h1")?.textContent).toContain("Connect Canvas");
		document.querySelector<HTMLButtonElement>('[data-page="admin"]')?.click();

		const adminParams = new URLSearchParams(globalThis.location.search);
		expect(adminParams.get("page")).toBe("admin");
		expect(adminParams.get("domain")).toBe("utah.instructure.com");
		expect(adminParams.get("region")).toBe("us-east-1");
		expect(adminParams.get("clientId")).toBe("12345000000000001");
		expect(document.querySelector("h1")?.textContent).toContain("Configure a Canvas MCP Server");

		document.querySelector<HTMLButtonElement>('[data-page="connect"]')?.click();
		expect(new URLSearchParams(globalThis.location.search).get("page")).toBe("connect");
		expect(document.querySelector("h1")?.textContent).toContain("Connect Canvas");
	});

	it("requires a Client ID limited to 17 characters for every supported OAuth client", () => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/?page=admin");
		mountApp("admin");

		const clientSelect = document.querySelector<HTMLSelectElement>("#client-select");
		if (!clientSelect) throw new Error("MCP client selector not found");
		const clientIds = [...clientSelect.options].map((option) => option.value);

		for (const clientId of clientIds) {
			const currentSelect = document.querySelector<HTMLSelectElement>("#client-select");
			if (!currentSelect) throw new Error("MCP client selector not found");
			currentSelect.value = clientId;
			currentSelect.dispatchEvent(new Event("change", { bubbles: true }));

			expect(document.querySelector<HTMLInputElement>("#client-id-input")?.required).toBe(true);
			expect(document.querySelector<HTMLInputElement>("#client-id-input")?.maxLength).toBe(17);
			expect(document.querySelector<HTMLInputElement>("#client-id-input")?.pattern).toBe(
				"[0-9]{17}",
			);
			expect(document.querySelector(".details-panel #client-id-input")).not.toBeNull();
			expect(document.querySelector("#client-id-reference-input")).toBeNull();
			expect(document.querySelector("#client-id-hint")?.textContent).toContain(
				"Required by the Canvas OAuth flow",
			);
			expect(document.querySelector<HTMLInputElement>("#client-id-input")?.placeholder).toBe(
				"12345000000000001",
			);
			expect(document.querySelector(".optional")).toBeNull();
		}
	});

	it.each([
		["12345000000000001", true],
		["1234500000000000", false],
		["123450000000000012", false],
		["1234500000000000a", false],
		["", false],
	])("validates Client ID %s as exactly 17 digits", (value, valid) => {
		mountApp("admin");
		const input = document.querySelector<HTMLInputElement>("#client-id-input");
		if (!input) throw new Error("Client ID input not found");
		input.value = value;
		expect(input.checkValidity()).toBe(valid);
	});

	it("enables Connect a Client when admin state completes the query-provided region", () => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/?region=us-east-1&page=admin");
		mountApp("admin");

		const connectTab = document.querySelector<HTMLButtonElement>('[data-page="connect"]');
		let bottomConfigureButton = document.querySelector<HTMLButtonElement>(
			"#configure-client-button-bottom",
		);
		expect(connectTab?.disabled).toBe(true);
		expect(bottomConfigureButton?.disabled).toBe(true);

		const domainInput = document.querySelector<HTMLInputElement>("#domain-input");
		if (!domainInput) throw new Error("Canvas domain input not found");
		domainInput.value = "utah.instructure.com";
		domainInput.dispatchEvent(new Event("change", { bubbles: true }));
		bottomConfigureButton = document.querySelector<HTMLButtonElement>(
			"#configure-client-button-bottom",
		);

		expect(document.querySelector<HTMLButtonElement>('[data-page="connect"]')?.disabled).toBe(true);
		expect(bottomConfigureButton?.disabled).toBe(true);
		const clientIdInput = document.querySelector<HTMLInputElement>("#client-id-input");
		if (!clientIdInput) throw new Error("Client ID input not found");
		clientIdInput.value = "12345000000000001";
		clientIdInput.dispatchEvent(new Event("input", { bubbles: true }));
		expect(document.querySelector<HTMLInputElement>("#generated-client-id")?.value).toBe(
			"12345000000000001",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-client-id")?.readOnly).toBe(true);
		expect(
			document.querySelector("#generated-client-id-field")?.classList.contains("is-hidden"),
		).toBe(false);
		expect(document.querySelector("#configure-client-button")).toBeNull();
		expect(bottomConfigureButton?.classList.contains("-color-primary")).toBe(true);
		expect(bottomConfigureButton?.disabled).toBe(false);
		expect(document.querySelector("#client-id-reference-input")).toBeNull();

		expect(document.querySelector<HTMLButtonElement>('[data-page="connect"]')?.disabled).toBe(
			false,
		);
		const scrollTo = vi.fn();
		vi.stubGlobal("scrollTo", scrollTo);
		bottomConfigureButton?.click();
		expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
		expect(document.querySelector<HTMLElement>(".site-shell")?.dataset.mode).toBe("user");
	});

	it("opens the page selected by the page query parameter from either static entry", () => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/?page=admin");
		mountApp("user");

		expect(document.querySelector("h1")?.textContent).toContain("Configure a Canvas MCP Server");
		expect(document.querySelector('[data-page="admin"]')?.getAttribute("aria-selected")).toBe(
			"true",
		);
	});

	it("builds a regional user URL and includes the region in a shareable setup link", () => {
		globalThis.history.replaceState(
			null,
			"",
			"/canvas-mcp/?domain=utah.instructure.com&clientId=12345000000000001&client=codex&region=us-east-1",
		);
		mountApp("user");

		expect(document.querySelector<HTMLInputElement>("#generated-mcp-url")?.value).toBe(
			"https://utah.maple.us-east-1.core.inseng.io/mcp",
		);
		expect(document.querySelector("#region-select")).toBeNull();
		expect(document.querySelector('[data-action="copy-link"]')).not.toBeNull();
		expect(document.querySelector(".controls-panel")).toBeNull();
		expect(document.querySelector("#domain-input")).toBeNull();
		expect(document.querySelector("#client-id-input")).toBeNull();
		expect(
			document.querySelector(".workspace-grid")?.classList.contains("workspace-grid--single"),
		).toBe(true);
		expect(document.querySelector("#tray-server-details-heading")?.textContent).toBe(
			"Server details",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-auth-url")?.value).toBe(
			"https://utah.instructure.com/login/oauth2/auth",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-token-url")?.value).toBe(
			"https://utah.instructure.com/login/oauth2/token",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-scope-url")?.value).toBe(
			"https://sso.canvaslms.com/all-client-scopes",
		);
		expect(document.querySelector<HTMLInputElement>("#generated-client-id")?.value).toBe(
			"12345000000000001",
		);
		expect(document.querySelectorAll(".server-details-card input[readonly]")).toHaveLength(5);
		expect(document.querySelector(".details-panel h2")?.textContent).toBe("Instructions");
		expect(document.querySelector(".details-panel h2")?.classList.contains("instui-heading")).toBe(
			true,
		);
		expect(document.querySelector("#guide-provider")?.getAttribute("aria-label")).toBe(
			"Codex setup",
		);
		expect(document.querySelector("#guide-provider")?.hasAttribute("hidden")).toBe(false);
		expect(document.querySelector("#guide-provider .guide-fields")).toBeNull();
		expect(document.querySelector("#guide-canvas")).toBeNull();
	});

	it("opens admin configuration when the consumer route is missing required setup state", () => {
		globalThis.history.replaceState(null, "", "/canvas-mcp/?page=connect");
		mountApp("user");

		expect(document.querySelector("h1")?.textContent).toContain("Configure a Canvas MCP Server");
		expect(document.querySelector(".controls-panel")).not.toBeNull();
		expect(document.querySelector<HTMLButtonElement>('[data-page="connect"]')?.disabled).toBe(true);
		expect(new URLSearchParams(globalThis.location.search).get("page")).toBe("admin");
	});

	it("does not render markup from an unsupported domain query", () => {
		globalThis.history.replaceState(
			null,
			"",
			"/canvas-mcp/?domain=%3Cimg%20src=x%20onerror=alert(1)%3E",
		);
		mountApp("user");

		expect(document.querySelector('img[src="x"], img[onerror]')).toBeNull();
		expect(
			[...document.querySelectorAll<HTMLImageElement>(".admin-steps img")].map((image) =>
				image.getAttribute("src"),
			),
		).toEqual([
			"/images/server-canvas-open_developer_keys.png",
			"/images/server-canvas-allowed_audiences.png",
			"/images/server-canvas-enable_public_key.png",
		]);
		expect(document.querySelector<HTMLImageElement>(".eyebrow-logo")?.src).toContain(
			"data:image/svg+xml",
		);
		expect(document.querySelector<HTMLInputElement>("#domain-input")?.value).toBe("");
		expect(document.querySelector("h1")?.textContent).toContain("Configure a Canvas MCP Server");
		expect(document.querySelector<HTMLButtonElement>('[data-page="connect"]')?.disabled).toBe(true);
	});
});
