// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CLIENTS } from "../src/clients";
import { clientStatus } from "../src/clients/status";
import { COMMON_ISSUES, FAQS, helpSectionFromQuery } from "../src/help/content";
import { allIssueLabels } from "../src/help/labels";
import { bindHelpSearch, contactIssueUrl, renderHelp } from "../src/help/render";
import { renderHelpInlineText } from "../src/help/inline";
import type { HelpGroup } from "../src/help/content";

const originalFaqs = [...FAQS];
const originalIssues = [...COMMON_ISSUES];

beforeEach(() => {
	for (const groups of [FAQS, COMMON_ISSUES]) {
		const fixtures: HelpGroup[] = [
			{
				title: "General",
				entries: [
					{ title: "Example question", text: "Searchable browser answer.\nSecond paragraph." },
					{ title: "Encoded diagnostic", text: "The+following+scopes+are+invalid." },
				],
			},
			{
				title: "Admins",
				entries: [{ title: "Example list", type: "list", text: ["First item", "Second item"] }],
			},
			{ title: "Users", entries: [{ title: "Another question", text: "Another answer." }] },
			{ title: "Clients", entries: [{ title: "Client question", text: "Client answer." }] },
		];
		groups.splice(0, groups.length, ...fixtures);
	}
});

afterEach(() => {
	FAQS.splice(0, FAQS.length, ...originalFaqs);
	COMMON_ISSUES.splice(0, COMMON_ISSUES.length, ...originalIssues);
});

function formattedHelpText(text: string): string {
	const element = document.createElement("span");
	element.innerHTML = renderHelpInlineText(text);
	return element.textContent!;
}

function applyHelpSearch(
	section: "faqs" | "issues",
	id: string,
	query: string,
): { search: HTMLInputElement; total: number; visible: HTMLDetailsElement[] } {
	document.body.innerHTML = renderHelp(section);
	bindHelpSearch(document.body);
	const search = document.querySelector<HTMLInputElement>(`#${id}`)!;
	const total = document.querySelectorAll("#help-entries details").length;
	search.value = query;
	search.dispatchEvent(new Event("input"));
	const visible = [
		...document.querySelectorAll<HTMLDetailsElement>("#help-entries details"),
	].filter((disclosure) => !disclosure.hidden);
	return { search, total, visible };
}

function assertNoHelpSearchResults(search: HTMLInputElement, total: number): void {
	search.value = "no matching entry";
	search.dispatchEvent(new Event("input"));
	expect(document.querySelector("#help-search-results")?.textContent).toBe(`0 of ${total} results`);
	expect(document.querySelector<HTMLElement>("#help-search-empty")?.hidden).toBe(false);
}

describe("Help rendering", () => {
	it.each([
		["faqs", "faq", FAQS, originalFaqs],
		["issues", "issue", COMMON_ISSUES, originalIssues],
	] as const)(
		"renders the published %s collection using the supported entry structure",
		(section, prefix, groups, published) => {
			groups.splice(0, groups.length, ...published);
			expect(new Set(groups.map(({ title }) => title)).size).toBe(groups.length);
			const titles = groups.flatMap(({ entries }) =>
				entries.map(({ title }) => title.trim().toLowerCase()),
			);
			expect(titles.every(Boolean)).toBe(true);
			expect(new Set(titles).size).toBe(titles.length);

			document.body.innerHTML = renderHelp(section);
			for (const group of groups) {
				const container = document.querySelector(
					`[aria-labelledby="${prefix}-${group.title.toLowerCase()}"]`,
				)!;
				expect(container).not.toBeNull();
				expect(container.querySelector("h3")).not.toBeNull();
				const disclosures = [...container.querySelectorAll<HTMLDetailsElement>("details")];
				expect(disclosures).toHaveLength(group.entries.length);
				for (const [index, disclosure] of disclosures.entries()) {
					expect(disclosure.querySelector(":scope > summary")).not.toBeNull();
					expect(disclosure.open).toBe(false);
					const entry = group.entries[index]!;
					if (entry.type === "list") {
						expect(entry.text.length).toBeGreaterThan(0);
						expect(disclosure.querySelectorAll(":scope > div > ul > li")).toHaveLength(
							entry.text.length,
						);
					} else {
						expect(disclosure.querySelectorAll(":scope > div > p").length).toBeGreaterThan(0);
					}
				}
			}
		},
	);

	it("renders the Clients section from Common Issues", () => {
		document.body.innerHTML = renderHelp("issues");
		const clients = document.querySelector('[aria-labelledby="issue-clients"]')!;
		expect(clients.querySelector("h3")?.textContent).toBe("Clients");
		expect(clients.querySelectorAll("details")).toHaveLength(
			COMMON_ISSUES.find(({ title }) => title === "Clients")!.entries.length,
		);
	});

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
		for (const item of items) {
			const client = CLIENTS.find(({ id }) => id === item.getAttribute("data-other-client"))!;
			expect(item.querySelector(".instui-pill")?.textContent).toBe(
				client.blocker || clientStatus(client, "personal").kind === "known-issue"
					? "Known issue"
					: "Untested",
			);
		}
		const copilot = group.querySelector('[data-other-client="copilot"]')!;
		expect(copilot.textContent).toContain("GitHub Copilot Known issue");
		expect(copilot.querySelector(".instui-pill.-color-danger")).not.toBeNull();
		expect(copilot.querySelector("details, p, a, table")).toBeNull();
		expect(document.querySelector('[data-matrix-client="generic"]')).toBeNull();
	});

	it("normalizes section URLs", () => {
		for (const section of ["faqs", "issues", "clients", "tools", "contact"])
			expect(helpSectionFromQuery(`?help=${section}`)).toBe(section);
		expect(helpSectionFromQuery("")).toBe("faqs");
		expect(helpSectionFromQuery("?help=invalid")).toBe("faqs");
	});

	it("uses the segmented-control component and renders only the selected content", () => {
		document.body.innerHTML = renderHelp("faqs");
		expect(document.querySelector("fieldset.instui-segmented-control")).not.toBeNull();
		expect(
			[...document.querySelectorAll("fieldset.help-sections label")].map(
				(label) => label.textContent,
			),
		).toEqual(["FAQs", "Common Issues", "Supported Clients", "Available Tools", "Contact"]);
		expect(document.querySelector<HTMLInputElement>("#help-section-faqs")?.checked).toBe(true);
		expect(document.querySelector("#help-content #faqs-search")).not.toBeNull();
		expect(document.querySelector("#issues-search")).toBeNull();
		expect(document.querySelector("table")).toBeNull();
	});

	it.each([
		["faqs", "faqs-search", "browser", "Example question"],
		["issues", "issues-search", "browser", "Example question"],
	] as const)(
		"filters %s disclosures and provides an input-group search",
		(section, id, query, title) => {
			const { search, total, visible } = applyHelpSearch(section, id, query);
			expect(search.labels?.[0]?.classList.contains("instui-screen-reader-content")).toBe(true);
			expect(
				search.closest(".instui-input-group")?.querySelector(".before .-icon-search"),
			).not.toBeNull();
			expect(visible).toHaveLength(1);
			expect(visible[0]?.querySelector("summary")?.textContent).toBe(title);
			expect(visible[0]?.open).toBe(true);
			expect(document.querySelector("#help-search-results")?.textContent).toBe(
				`1 of ${total} results`,
			);
			expect(document.querySelector<HTMLElement>("#help-search-empty")?.hidden).toBe(true);
			assertNoHelpSearchResults(search, total);
			search.value = "";
			search.dispatchEvent(new Event("input"));
			expect(visible[0]?.open).toBe(false);
		},
	);

	it("matches plus-delimited diagnostics when searching with spaces", () => {
		const { total, visible } = applyHelpSearch("issues", "issues-search", "The following scopes");

		expect(visible).toHaveLength(1);
		expect(visible[0]?.querySelector("summary")?.textContent).toBe("Encoded diagnostic");
		expect(document.querySelector("#help-search-results")?.textContent).toBe(
			`1 of ${total} results`,
		);
	});

	it.each(["faqs", "issues"] as const)(
		"shows the %s result count only while actively filtering",
		(section) => {
			document.body.innerHTML = renderHelp(section);
			const results = document.querySelector<HTMLElement>("#help-search-results")!;
			expect(results.hidden).toBe(true);
			bindHelpSearch(document.body);
			const search = document.querySelector<HTMLInputElement>("[data-help-search]")!;
			expect(results.hidden).toBe(true);
			for (const value of ["Canvas", "no-such-result", "", " \t "]) {
				search.value = value;
				search.dispatchEvent(new Event("input"));
				expect(results.hidden).toBe(value.trim() === "");
			}
		},
	);

	it("presents every curated client and all four combinations from existing source statuses", () => {
		document.body.innerHTML = renderHelp("clients");
		const curated = CLIENTS.filter(({ group }) => group === "Curated");
		expect(document.querySelectorAll(".help-matrix tbody tr")).toHaveLength(curated.length);
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
					expect(cell.querySelector("p")).toBeNull();
					if (!issue && status.kind === "untested") {
						expect(cell.textContent).toBe("Untested");
						expect(cell.querySelector("p")).toBeNull();
					}
				}
			}
		}
		expect(document.querySelector('[data-matrix-client="generic"]')).toBeNull();
		expect(document.querySelector("#client-matrix-legend")).not.toBeNull();
	});

	it.each([
		["faqs", "faq", FAQS],
		["issues", "issue", COMMON_ISSUES],
	] as const)(
		"groups %s entries using accessible headings and Pantoken toggle-details",
		(topic, prefix, groups) => {
			document.body.innerHTML = renderHelp(topic);
			expect(
				[...document.querySelectorAll("#help-content h3")].map((heading) => heading.textContent),
			).toEqual([
				...groups.map(({ title }) => title),
				...(topic === "issues" ? ["Known Issues"] : []),
			]);
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
				).toEqual(group.entries.map(({ title }) => formattedHelpText(title)));
				for (const [index, details] of [...section.querySelectorAll("details")]
					.slice(0, group.entries.length)
					.entries()) {
					expect(details.open).toBe(false);
					const entry = group.entries[index]!;
					if (entry.type === "list") {
						expect(
							[...details.querySelectorAll("ul > li")].map((item) => item.textContent),
						).toEqual(entry.text.map(formattedHelpText));
					} else {
						expect(
							[...details.querySelectorAll(":scope > div > p")].map(
								(paragraph) => paragraph.textContent,
							),
						).toEqual(
							entry.text
								.split(/\r\n?|\n/u)
								.map((paragraph) => paragraph.trim())
								.filter(Boolean)
								.map(formattedHelpText),
						);
					}
					details.querySelector("summary")!.click();
					expect(details.open).toBe(true);
					details.querySelector("summary")!.click();
					expect(details.open).toBe(false);
				}
			}
		},
	);

	it("renders generated known issues as collapsed, interactive disclosures", () => {
		document.body.innerHTML = renderHelp("issues");
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

	it.each([
		["faqs", FAQS],
		["issues", COMMON_ISSUES],
	] as const)("formats %s titles and answers while escaping source HTML", (section, groups) => {
		const entry = groups[0]!.entries[0]!;
		const original = { ...entry };
		try {
			entry.title = "Use **Canvas** with `client_id`";
			entry.text = 'Keep **`<secret>` private**. <img src=x onerror="alert(1)">';
			document.body.innerHTML = renderHelp(section);
			const disclosure = document.querySelector("#help-entries details")!;
			expect(disclosure.querySelector("summary strong")?.textContent).toBe("Canvas");
			expect(disclosure.querySelector("summary code")?.textContent).toBe("client_id");
			expect(disclosure.querySelector("p strong code")?.textContent).toBe("<secret>");
			expect(disclosure.querySelector("img, secret")).toBeNull();
		} finally {
			Object.assign(entry, original);
		}
	});

	it("keeps reasons in Known Issues and shows only status in Supported Clients", () => {
		const client = CLIENTS.find(({ id }) => id === "claude-code")!;
		const original = client.status;
		try {
			client.status = {
				kind: "known-issue",
				reason: '**Retry** with `client_id`. <img src=x onerror="alert(1)">',
			};
			document.body.innerHTML = renderHelp("clients") + renderHelp("issues");
			expect(document.querySelector("img")).toBeNull();
			expect(document.body.textContent).toContain('<img src=x onerror="alert(1)">');
			const cell = document.querySelector('[data-matrix-client="claude-code"] td')!;
			expect(cell.textContent).toBe("Known issue");
			expect(cell.querySelector("p, strong, code")).toBeNull();
			const selector = '[aria-labelledby="known-issues-heading"] details';
			expect(document.querySelector(`${selector} strong`)?.textContent).toBe("Retry");
			expect(document.querySelector(`${selector} code`)?.textContent).toBe("client_id");
		} finally {
			client.status = original;
		}
	});

	it.each([
		["faqs", FAQS],
		["issues", COMMON_ISSUES],
	] as const)(
		"renders %s list entries with inline formatting and searchable text",
		(section, groups) => {
			const entries = groups[0]!.entries;
			entries.push({
				title: "List example",
				type: "list",
				text: ["Use **Canvas**.", "Keep `<secret>` private. <img src=x>"],
			});
			try {
				document.body.innerHTML = renderHelp(section);
				bindHelpSearch(document.body);
				const list = document.querySelector("#help-entries ul.instui-list")!;
				expect(list.querySelectorAll(":scope > li")).toHaveLength(2);
				expect(list.querySelector("strong")?.textContent).toBe("Canvas");
				expect(list.querySelector("code")?.textContent).toBe("<secret>");
				expect(list.querySelector("img")).toBeNull();
				const search = document.querySelector<HTMLInputElement>("[data-help-search]")!;
				search.value = "private";
				search.dispatchEvent(new Event("input"));
				expect(list.closest("details")?.hidden).toBe(false);
				expect(list.closest("details")?.open).toBe(true);
			} finally {
				entries.pop();
			}
		},
	);

	it.each(["faqs", "issues"] as const)(
		"renders newline-separated paragraphs in %s answers and list items",
		(section) => {
			const groups = section === "faqs" ? FAQS : COMMON_ISSUES;
			const entries = groups[0]!.entries;
			const text = "{{icon:check}} **First**.\n\nSecond `paragraph`.\r\n<img src=x>";
			entries.push(
				{ title: "Paragraph example", text },
				{ title: "List paragraph example", type: "list", text: [text] },
			);
			try {
				document.body.innerHTML = renderHelp(section);
				for (const title of ["Paragraph example", "List paragraph example"]) {
					const details = [...document.querySelectorAll("details")].find(
						(entry) => entry.querySelector("summary")?.textContent === title,
					)!;
					expect(details.querySelectorAll("p")).toHaveLength(3);
					expect(details.querySelector("p strong")?.textContent).toBe("First");
					expect(details.querySelector("p .-icon-check")).not.toBeNull();
					expect(details.querySelector("p code")?.textContent).toBe("paragraph");
					expect(details.querySelector("img")).toBeNull();
					expect(details.querySelectorAll("li")).toHaveLength(title.startsWith("List") ? 1 : 0);
				}
			} finally {
				entries.splice(-2);
			}
		},
	);

	it("shows Verified without validation notes in Supported Clients", () => {
		const client = CLIENTS.find(({ id }) => id === "claude-code")!;
		const original = client.status;
		try {
			client.status = {
				kind: "validated",
				testedAt: "2026-10-20",
				note: "Tested **public** keys with `client_id`.",
			};
			document.body.innerHTML = renderHelp("clients");
			const row = document.querySelector('[data-matrix-client="claude-code"]')!;
			expect([...row.querySelectorAll("td")].map((cell) => cell.textContent)).toEqual([
				"Verified",
				"Verified",
				"Verified",
				"Verified",
			]);
			expect(row.querySelector("td strong, td code, td p")).toBeNull();
		} finally {
			client.status = original;
		}
	});
});

describe("contact issue links", () => {
	const context = { client: "claude-code", key: "public", install: "personal" } as const;

	it("prefills validation reports", () => {
		const url = new URL(
			contactIssueUrl("canvas-mcp-validation.yml", "windows", context, "2026-01-02"),
		);
		expect(url.searchParams.get("template")).toBe("canvas-mcp-validation.yml");
		expect(url.searchParams.get("client")).toContain("Claude Code");
		expect(url.searchParams.get("platform")).toBe("Windows");
		expect(url.searchParams.get("labels")).toBe("client: claude-code,provider: anthropic");
		expect(url.searchParams.get("date")).toBe("2026-01-02");
		expect(url.searchParams.get("key")).toBe("Public");
		expect(url.searchParams.get("install")).toBe("Personal");
	});

	it("leaves FAQ and common issue templates unfilled", () => {
		for (const template of ["canvas-mcp-faq.yml", "canvas-mcp-common-issues.yml"])
			expect([...new URL(contactIssueUrl(template, "mac", context)).searchParams.keys()]).toEqual([
				"template",
			]);
	});

	it("renders prefilled links in the contact section", () => {
		const html = renderHelp("contact", "mac", context);
		expect(html).toContain("template=canvas-mcp-client.yml&amp;client=");
	});
});

describe("issue labels", () => {
	it("defines unique GitHub-valid labels for every client and provider", () => {
		const labels = allIssueLabels();
		expect(new Set(labels.map(({ name }) => name)).size).toBe(labels.length);
		for (const { name, description } of labels) {
			expect(name.length).toBeLessThanOrEqual(50);
			expect(description.length).toBeLessThanOrEqual(100);
		}
		for (const client of CLIENTS)
			expect(labels.map(({ name }) => name)).toContain(`client: ${client.id}`);
	});
});
