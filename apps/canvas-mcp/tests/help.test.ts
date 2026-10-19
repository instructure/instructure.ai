// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { CLIENTS } from "../src/clients";
import { clientStatus } from "../src/clients/status";
import { FAQS, helpSectionFromQuery } from "../src/help/content";
import { renderHelp } from "../src/help/render";

describe("Help content", () => {
	it("normalizes section URLs", () => {
		for (const section of ["faqs", "issues", "clients"])
			expect(helpSectionFromQuery(`?help=${section}`)).toBe(section);
		expect(helpSectionFromQuery("")).toBe("faqs");
		expect(helpSectionFromQuery("?help=invalid")).toBe("faqs");
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
					if (client.installModes.length && !client.installModes.includes(install)) {
						expect(cell.textContent).toContain("Not applicable");
						continue;
					}
					const status = clientStatus(client, install);
					const issue =
						client.blocker ||
						status.kind === "known-issue" ||
						client.facts.keyTypes[key].value === "no";
					expect(cell.querySelector(".instui-pill")?.textContent).toBe(
						issue ? "Known issue" : status.kind === "validated" ? "Verified" : "Untested",
					);
					if (status.kind === "validated") {
						expect(cell.textContent).toContain(status.testedAt);
						if (status.note) expect(cell.textContent).toContain(status.note);
					}
				}
			}
		}
		expect(document.querySelector('[data-matrix-client="generic"]')).toBeNull();
		expect(document.querySelector("#client-matrix-legend")?.textContent).toContain(
			"not separate public/private tests",
		);
	});

	it("groups every FAQ under General, Admins, or Users using Pantoken toggle-details", () => {
		document.body.innerHTML = renderHelp("faqs");
		expect(
			[...document.querySelectorAll("#help-content h3")].map((heading) => heading.textContent),
		).toEqual(["General", "Admins", "Users"]);
		expect(document.querySelectorAll("details.instui-toggle-details")).toHaveLength(
			FAQS.reduce((total, group) => total + group.entries.length, 0),
		);
		for (const group of FAQS) {
			const section = document.querySelector(
				`[aria-labelledby="faq-${group.title.toLowerCase()}"]`,
			)!;
			expect(
				[...section.querySelectorAll("details > summary")].map((summary) => summary.textContent),
			).toEqual(group.entries.map(({ title }) => title));
			for (const [index, details] of [...section.querySelectorAll("details")].entries()) {
				expect(details.open).toBe(false);
				expect(details.querySelector("div > p")?.textContent).toBe(group.entries[index]?.text);
				details.querySelector("summary")!.click();
				expect(details.open).toBe(true);
				details.querySelector("summary")!.click();
				expect(details.open).toBe(false);
			}
		}
	});

	it("includes the reported configuration errors and source-scoped client issues", () => {
		document.body.innerHTML = renderHelp("issues");
		expect(document.body.textContent).toContain(
			"MCP server canvas-mcp already exists in local config",
		);
		expect(document.body.textContent).toContain("redirect_uri does not match client settings");
		expect(document.body.textContent).toContain("Do not change key type");
		const geminiIssues = [...document.querySelectorAll(".help-entry")].filter((entry) =>
			entry.querySelector("h3")?.textContent?.includes("Gemini CLI"),
		);
		expect(geminiIssues).toHaveLength(1);
		expect(geminiIssues[0]?.textContent).toContain("(personal)");
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
