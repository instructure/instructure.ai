// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { CLIENTS } from "../src/clients";
import { clientStatus } from "../src/clients/status";
import { COMMON_ISSUES, FAQS, helpSectionFromQuery } from "../src/help/content";
import { renderHelp } from "../src/help/render";

describe("Help content", () => {
	it("lists Generic MCP then all other Rulesync clients alphabetically in a collapsed toggle group below the table", () => {
		document.body.innerHTML = renderHelp("clients");
		const matrix = document.querySelector(".help-matrix-scroll")!;
		const group = matrix.nextElementSibling as HTMLDetailsElement;
		expect(group.matches("details.instui-toggle-group")).toBe(true);
		expect(group.open).toBe(false);
		expect(group.querySelector("summary")?.textContent).toBe("Other MCP clients");
		const expected = CLIENTS.filter(({ group, id }) => group === "Other" && id !== "generic").sort(
			(left, right) => left.name.localeCompare(right.name, "en"),
		);
		const items = [...group.querySelectorAll("li")];
		expect(items.map((item) => item.getAttribute("data-other-client"))).toEqual([
			"generic",
			...expected.map(({ id }) => id),
		]);
		expect(items[0]?.textContent).toBe("Generic MCP Untested");
		for (const item of items)
			expect(item.querySelector(".instui-pill")?.textContent).toBe(
				item.getAttribute("data-other-client") === "copilot" ? "Known issue" : "Untested",
			);
		const copilot = group.querySelector('[data-other-client="copilot"]')!;
		expect(copilot.textContent).toBe("GitHub Copilot Known issue");
		expect(copilot.querySelector(".instui-pill.-color-danger")).not.toBeNull();
		expect(copilot.querySelector("p")).toBeNull();
		expect(document.querySelector('[data-matrix-client="generic"]')).toBeNull();
	});

	it("documents the VS Code discovery failure under Users common issues", () => {
		document.body.innerHTML = renderHelp("issues");
		const users = document.querySelector('[aria-labelledby="issue-users"]')!;
		const issue = [...users.querySelectorAll("details")].find((entry) =>
			entry.querySelector("summary")?.textContent?.includes("VS Code"),
		)!;
		expect(issue.textContent).toContain(
			"Failed to fetch authorization server metadata from all attempted URLs",
		);
		expect(issue.textContent).toContain("not evidence that a public client needs a secret");
		expect(issue.textContent).toContain("do not establish why VS Code");
		expect(issue.textContent).toContain("Developer: Show Logs");
	});

	it("shows Claude Code personal validation version without repeating header key types", () => {
		document.body.innerHTML = renderHelp("clients");
		const row = document.querySelector('[data-matrix-client="claude-code"]')!;
		for (const key of ["public", "private"]) {
			const cell = row.querySelector(`td[headers~="matrix-personal-${key}"]`)!;
			expect(cell.querySelector(".instui-pill")?.textContent).toBe("Verified");
			expect(cell.textContent).toContain("Version: 2.1.303 (Claude Code)");
			expect([...cell.querySelectorAll("p")].map((entry) => entry.textContent)).toEqual([
				"Tested: 2026-10-17",
				"Version: 2.1.303 (Claude Code)",
				"Platform: macOS",
			]);
			expect(cell.textContent).not.toContain("not recorded");
			expect(cell.textContent?.toLowerCase()).not.toContain(key);
		}
	});

	it("normalizes section URLs", () => {
		for (const section of ["faqs", "issues", "clients"])
			expect(helpSectionFromQuery(`?help=${section}`)).toBe(section);
		expect(helpSectionFromQuery("")).toBe("faqs");
		expect(helpSectionFromQuery("?help=invalid")).toBe("faqs");
	});

	it("allows scope copying without implying production approval", () => {
		document.body.innerHTML = renderHelp("faqs");
		const admins = document.querySelector('[aria-labelledby="faq-admins"]')!;
		expect(admins.textContent).toContain(
			"You can copy the list regardless of setup completeness or review status.",
		);
		expect(admins.textContent).toContain("Copying does not indicate production approval.");
		expect(admins.textContent).toContain(
			"Do not use the unreviewed list to create a production developer key.",
		);
	});

	it("uses the segmented-control component and renders only the selected content", () => {
		document.body.innerHTML = renderHelp("faqs");
		expect(document.querySelector("fieldset.instui-segmented-control")).not.toBeNull();
		expect([...document.querySelectorAll("label")].map((label) => label.textContent)).toEqual([
			"FAQs",
			"Common Issues",
			"Supported Clients",
		]);
		expect(document.querySelector<HTMLInputElement>("#help-section-faqs")?.checked).toBe(true);
		expect(document.querySelector("#help-content")?.textContent).toContain("What is Canvas MCP?");
		expect(document.querySelector("table")).toBeNull();
	});

	it("presents every curated client and all four combinations from existing source statuses", () => {
		document.body.innerHTML = renderHelp("clients");
		const curated = CLIENTS.filter(({ group }) => group === "Curated");
		expect(document.querySelectorAll("tbody tr")).toHaveLength(curated.length);
		expect(
			[...document.querySelectorAll("thead th[scope=colgroup]")].map((th) => th.textContent),
		).toEqual(["Enterprise", "Personal"]);
		for (const client of curated) {
			const row = document.querySelector(`[data-matrix-client="${client.id}"]`)!;
			const cells = [...row.querySelectorAll("td")];
			expect(cells).toHaveLength(4);
			for (const [i, install] of (["enterprise", "personal"] as const).entries()) {
				for (const [j, key] of (["public", "private"] as const).entries()) {
					const cell = cells[i * 2 + j]!;
					expect(cell.getAttribute("headers")).toContain(`matrix-${install}-${key}`);
					if (
						(client.installModes.length && !client.installModes.includes(install)) ||
						client.facts.keyTypes[key].value === "no" ||
						(client.id === "gemini-cli" && install === "personal")
					) {
						expect(cell.textContent).toContain("Not applicable");
						expect(
							cell.querySelector(".instui-pill.-color-info.-icon-equal-approximately-not")
								?.textContent,
						).toBe("Not applicable");
						expect(cell.querySelector("p")).toBeNull();
						continue;
					}
					const status = clientStatus(client, install);
					const issue = client.blocker || status.kind === "known-issue";
					expect(cell.querySelector(".instui-pill")?.textContent).toBe(
						issue ? "Known issue" : status.kind === "validated" ? "Verified" : "Untested",
					);
					if (status.kind === "validated") {
						expect(cell.textContent).toContain(status.testedAt);
						if (status.note) expect(cell.textContent).toContain(status.note);
					}
					if (!issue && status.kind === "untested") {
						expect(cell.textContent).toBe("Untested");
						expect(cell.querySelector("p")).toBeNull();
					}
				}
			}
		}
		expect(document.querySelector('[data-matrix-client="generic"]')).toBeNull();
		expect(document.querySelector("#client-matrix-legend")?.textContent).toContain(
			"not separate public/private tests",
		);
	});

	it.each([
		["faqs", "faq", FAQS],
		["issues", "issue", COMMON_ISSUES],
	] as const)(
		"groups %s under General, Admins, or Users using Pantoken toggle-details",
		(topic, prefix, groups) => {
			document.body.innerHTML = renderHelp(topic);
			expect(
				[...document.querySelectorAll("#help-content h3")].map((heading) => heading.textContent),
			).toEqual(
				topic === "issues"
					? ["General", "Admins", "Users", "Known Issues"]
					: ["General", "Admins", "Users"],
			);
			expect(
				document.querySelectorAll(
					'.help-entry:not([aria-labelledby="known-issues-heading"]) > details.instui-toggle-details',
				),
			).toHaveLength(groups.reduce((total, group) => total + group.entries.length, 0));
			for (const group of groups) {
				const section = document.querySelector(
					`[aria-labelledby="${prefix}-${group.title.toLowerCase()}"]`,
				)!;
				expect(
					[...section.querySelectorAll("details > summary")]
						.slice(0, group.entries.length)
						.map((summary) => summary.textContent),
				).toEqual(group.entries.map(({ title }) => title));
				for (const [index, details] of [...section.querySelectorAll("details")]
					.slice(0, group.entries.length)
					.entries()) {
					expect(details.open).toBe(false);
					expect(details.querySelector("div > p")?.textContent).toBe(group.entries[index]?.text);
					details.querySelector("summary")!.click();
					expect(details.open).toBe(true);
					details.querySelector("summary")!.click();
					expect(details.open).toBe(false);
				}
			}
		},
	);

	it("includes the reported configuration errors and source-scoped client issues", () => {
		document.body.innerHTML = renderHelp("issues");
		expect(document.body.textContent).toContain(
			"MCP server canvas-mcp already exists in local config",
		);
		expect(document.body.textContent).toContain("redirect_uri does not match client settings");
		expect(document.body.textContent).toContain("Do not change key type");
		const geminiIssues = [
			...document.querySelectorAll('[aria-labelledby="known-issues-heading"] details'),
		].filter((entry) => entry.querySelector("summary")?.textContent?.includes("Gemini CLI"));
		expect(geminiIssues).toHaveLength(0);
		expect(document.querySelector("#known-issues-heading")?.textContent).toBe("Known Issues");
		expect(document.querySelector("#known-issues-heading")?.className).toBe(
			document.querySelector("#issue-general")?.className,
		);
		for (const details of document.querySelectorAll<HTMLDetailsElement>(
			'[aria-labelledby="known-issues-heading"] details',
		)) {
			expect(details.classList.contains("instui-toggle-details")).toBe(true);
			expect(details.open).toBe(false);
			details.querySelector("summary")!.click();
			expect(details.open).toBe(true);
		}
	});

	it("marks unsupported public keys and Gemini CLI personal installs as Not applicable, not Known issue", () => {
		document.body.innerHTML = renderHelp("clients");
		for (const id of ["gemini-enterprise", "copilot-studio"]) {
			const row = document.querySelector(`[data-matrix-client="${id}"]`)!;
			expect(row.querySelector("td")?.textContent).toContain("Not applicable");
			expect(row.querySelector("td")?.textContent).not.toContain("Known issue");
			expect(row.querySelectorAll("td")[1]?.textContent).toContain("Untested");
		}
		const gemini = document.querySelector('[data-matrix-client="gemini-cli"]')!;
		for (const cell of [...gemini.querySelectorAll("td")].slice(2)) {
			expect(cell.textContent).toContain("Not applicable");
			expect(cell.textContent).toBe("Not applicable");
			expect(cell.textContent).not.toContain("Known issue");
		}
		for (const cell of [...gemini.querySelectorAll("td")].slice(0, 2))
			expect(cell.textContent).toContain("Untested");
		const chatgpt = document.querySelector('[data-matrix-client="chatgpt"]')!;
		for (const cell of chatgpt.querySelectorAll("td"))
			expect(cell.textContent).toContain("Known issue");
	});

	it("gives users rationale, self-service fixes, and admin/Instructure escalation for reported errors", () => {
		document.body.innerHTML = renderHelp("issues");
		const users = document.querySelector('[aria-labelledby="issue-users"]')!;
		for (const title of [
			"OAuth provider returned `invalid_target`",
			"OAuth provider returned `invalid_scope`",
			"redirect_uri does not match client settings",
			"MCP server canvas-mcp already exists in local config",
		]) {
			const entries = [...users.querySelectorAll("details")].filter(
				(entry) => entry.querySelector("summary")?.textContent === title,
			);
			expect(entries).toHaveLength(1);
			const text = entries[0]!.querySelector("p")!.textContent!;
			expect(text).toContain("Why:");
			expect(text).toContain("Fix it yourself:");
			expect(text).toContain("Report to your admin");
			expect(text).toContain("Instructure");
			expect(text).toContain("secrets");
			expect(text).toContain("tokens");
		}
		expect(users.textContent).toContain(
			'{"error":"invalid_request","error_description":"redirect_uri does not match client settings"}',
		);
		expect(users.textContent).toContain("https://sso.canvaslms.com/all-client-scopes");
		expect(users.textContent).toContain("does not need to be reported to Instructure");
		expect(users.textContent).toContain("unreviewed scope manifest");
		expect(users.textContent).toContain(
			"The+requested+resource+is+invalid,+missing,+unknown,+or+malformed.",
		);
		expect(users.textContent).toContain("Maple Allowed Audience");
		expect(users.textContent).toContain("Do not remove or spoof the resource parameter");
		expect(users.textContent).toContain("does not establish a Codex-wide root cause");
		expect(document.querySelector('[aria-labelledby="issue-admins"]')?.textContent).not.toContain(
			"redirect_uri does not match client settings",
		);
	});

	it("escapes source status reasons and notes", () => {
		const client = CLIENTS.find(({ id }) => id === "claude-code")!;
		const original = client.status;
		try {
			client.status = { kind: "known-issue", reason: '<img src=x onerror="alert(1)">' };
			document.body.innerHTML = renderHelp("clients") + renderHelp("issues");
			expect(document.querySelector("img")).toBeNull();
			expect(document.body.textContent).toContain('<img src=x onerror="alert(1)">');
		} finally {
			client.status = original;
		}
	});
});
