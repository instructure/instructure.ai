// @vitest-environment jsdom

import { describe, expect, it } from "vite-plus/test";
import catalog from "../src/help/tools.generated.json";
import { renderHelp } from "../src/help/render";
import { bindToolFilters, renderTool, toolFilterQuery } from "../src/help/tools";

describe("Available Tools", () => {
	it("publishes only card fields and the catalog date", () => {
		expect(Object.keys(catalog).sort()).toEqual(["catalog", "tools"]);
		expect(catalog.catalog).toBe("2026-09-29");
		expect(catalog.tools).toHaveLength(141);
		for (const tool of catalog.tools) {
			expect(Object.keys(tool).sort()).toEqual([
				"description",
				"example",
				"readOnly",
				"resource",
				"roles",
				"title",
			]);
			expect(tool.description).not.toContain("**Instructions:**");
			expect(tool.description).not.toContain("**Examples:**");
		}
	});

	it("renders all cards in order with only displayed metadata", () => {
		document.body.innerHTML = renderHelp("tools");
		const date = document.querySelector("time")!;
		expect(date.textContent).toBe(catalog.catalog);
		expect(date.compareDocumentPosition(document.querySelector("#tool-search")!) & 4).toBe(4);
		expect(
			document
				.querySelector<HTMLLabelElement>('label[for="tool-search"]')
				?.classList.contains("instui-screen-reader-content"),
		).toBe(true);
		expect(
			document
				.querySelector("#tool-search")
				?.closest(".instui-input-group")
				?.querySelector(".before .-icon-search"),
		).not.toBeNull();
		const cards = [...document.querySelectorAll("[data-tool-card]")];
		expect(cards).toHaveLength(141);
		expect(
			document.querySelector("[data-tool-name], #tool-source, #tool-list details, #tool-list dl"),
		).toBeNull();
		for (const [index, tool] of catalog.tools.entries()) {
			const card = cards[index]!;
			expect(card.matches(".instui-card.-variant-nested")).toBe(true);
			expect([...card.querySelector(".content")!.children].map((child) => child.tagName)).toEqual([
				"H3",
				"P",
				"P",
				"H4",
				"DIV",
			]);
			expect(card.querySelector("h3")?.textContent).toBe(tool.title);
			expect(card.querySelector(".tool-access")?.textContent).not.toMatch(/Access:|Roles:|·/u);
			const roles = tool.roles
				.map((role) => (role === "ta" ? "TA" : role.charAt(0).toUpperCase() + role.slice(1)))
				.sort((left, right) => left.localeCompare(right, "en"));
			expect(
				[...card.querySelectorAll(".tool-access .instui-pill")].map((pill) => pill.textContent),
			).toEqual([
				tool.resource.charAt(0).toUpperCase() + tool.resource.slice(1),
				tool.readOnly ? "Read only" : "Write access",
				...roles,
			]);
			expect(
				card.querySelector(".tool-access .instui-pill")?.classList.contains("-color-info"),
			).toBe(true);
			expect(
				card.querySelectorAll(".tool-access > .instui-pill.-color-info, .tool-access-pill"),
			).toHaveLength(2);
			expect(card.querySelector(".language-prompt pre.shiki code")?.textContent).toBe(tool.example);
			const copy = card.querySelector<HTMLButtonElement>(".shiki-copy")!;
			expect(copy.dataset.copy).toBe(tool.example);
			expect(copy.getAttribute("aria-label")).toBe("Copy example");
			expect(copy.disabled).toBe(false);
			expect(copy.hasAttribute("data-copy-template")).toBe(false);
		}
	});

	it("formats inline text and escapes HTML without interpolating placeholders", () => {
		document.body.innerHTML = `<ul>${renderTool({
			title: "**Tool** for `course_id` <script>bad()</script>",
			description: "Use `course_id` and **the course** with `{value}`. <img src=x>",
			roles: ["<teacher>"],
			readOnly: true,
			example: "<img src=x>",
			resource: "quiz",
		})}</ul>`;
		expect(document.querySelector("script, img")).toBeNull();
		expect(document.querySelector("h3 strong")?.textContent).toBe("Tool");
		expect(document.querySelector("h3 code")?.textContent).toBe("course_id");
		expect(
			[...document.querySelectorAll(".tool-description code")].map((code) => code.textContent),
		).toEqual(["course_id", "{value}"]);
		expect(document.querySelector(".tool-description strong")?.textContent).toBe("the course");
		expect(document.querySelector(".tool-access")?.textContent).toContain("<teacher>");
		expect(document.querySelector(".language-prompt code")?.textContent).toBe("<img src=x>");
	});

	it("does not invent an example when metadata has none", () => {
		document.body.innerHTML = `<ul>${renderTool({
			title: "Tool",
			description: "Only a description.",
			resource: "quiz",
			roles: [],
			readOnly: true,
		})}</ul>`;
		expect(document.querySelector(".shiki-block, h4")).toBeNull();
	});

	it("combines text, access, and roles using only visible content", () => {
		document.body.innerHTML = renderHelp("tools");
		bindToolFilters(document.body);
		const search = document.querySelector<HTMLInputElement>("#tool-search")!;
		const access = document.querySelector<HTMLSelectElement>("#tool-access-filter")!;
		const role = document.querySelector<HTMLFieldSetElement>("#tool-role-filter")!;
		const student = role.querySelector<HTMLInputElement>('input[value="student"]')!;
		const roleLabels = [...role.querySelectorAll("label")].map((label) => label.textContent!);
		expect(roleLabels).toEqual(
			[...roleLabels].sort((left, right) => left.localeCompare(right, "en")),
		);
		for (const value of ["read", "write"]) {
			access.value = value;
			student.checked = true;
			search.value = "ASSIGNMENT";
			access.dispatchEvent(new Event("change"));
			const expected = catalog.tools.filter(
				(tool) =>
					tool.readOnly === (value === "read") &&
					tool.roles.includes("student") &&
					[tool.title, tool.description, tool.resource, tool.example]
						.join(" ")
						.toLowerCase()
						.includes("assignment"),
			);
			expect(
				[...document.querySelectorAll<HTMLElement>("[data-tool-card]")].filter(
					(card) => !card.hidden,
				),
			).toHaveLength(expected.length);
			expect(document.querySelector("#tool-results")?.textContent).toBe(
				`${expected.length} of 141 tools`,
			);
		}
		access.value = "";
		student.checked = false;
		search.focus();
		for (const removed of ["canvas-get_assignment", "url:GET|/api/v1", "**Instructions:**"]) {
			search.value = removed;
			search.dispatchEvent(new Event("input"));
			expect(document.querySelector("#tool-results")?.textContent).toBe("0 of 141 tools");
			expect(document.querySelector<HTMLElement>("#tool-empty")?.hidden).toBe(false);
			expect(document.activeElement).toBe(search);
		}
		search.value = " ";
		role.dispatchEvent(new Event("change"));
		expect(document.querySelector("#tool-results")?.textContent).toBe("141 of 141 tools");
		expect(document.querySelector<HTMLElement>("#tool-empty")?.hidden).toBe(true);
	});

	it("matches any checked role, updates on checkbox changes, and shows all when unchecked", () => {
		document.body.innerHTML = renderHelp("tools");
		bindToolFilters(document.body);
		const roles = document.querySelector<HTMLFieldSetElement>("#tool-role-filter")!;
		const checkboxes = [...roles.querySelectorAll<HTMLInputElement>("input")];
		expect(roles.querySelector("legend")?.textContent).toBe("Roles");
		expect(checkboxes.every((checkbox) => !checkbox.checked)).toBe(true);
		for (const selected of [["student"], ["student", "admin"], []]) {
			for (const checkbox of checkboxes) checkbox.checked = selected.includes(checkbox.value);
			checkboxes[0]!.dispatchEvent(new Event("change", { bubbles: true }));
			const expected = catalog.tools.filter(
				(tool) => !selected.length || selected.some((role) => tool.roles.includes(role)),
			);
			const visible = [...document.querySelectorAll<HTMLElement>("[data-tool-card]")].filter(
				(card) => !card.hidden,
			);
			expect(visible.map((card) => card.querySelector("h3")?.textContent)).toEqual(
				expected.map((tool) => tool.title),
			);
		}
	});

	it("restores resource filters from query params and combines them with search, access, and roles", () => {
		document.body.innerHTML = renderHelp("tools");
		let updated = "";
		bindToolFilters(
			document.body,
			"toolResource=quiz&toolAccess=write&toolRole=teacher&toolSearch=quiz",
			(query) => {
				updated = query;
			},
		);
		const expected = catalog.tools.filter(
			(tool) => tool.resource === "quiz" && !tool.readOnly && tool.roles.includes("teacher"),
		);
		expect(
			[...document.querySelectorAll<HTMLElement>("[data-tool-card]")].filter(
				(card) => !card.hidden,
			),
		).toHaveLength(expected.length);
		const resource = document.querySelector<HTMLSelectElement>("#tool-resource-filter")!;
		expect(resource.value).toBe("quiz");
		resource.value = "assignment";
		resource.dispatchEvent(new Event("change"));
		expect(new URLSearchParams(updated).get("toolResource")).toBe("assignment");
		expect(new URLSearchParams(updated).get("toolAccess")).toBe("write");
		expect(new URLSearchParams(updated).getAll("toolRole")).toEqual(["teacher"]);
	});

	it("normalizes unknown and duplicate filter query values", () => {
		expect(
			toolFilterQuery(
				"toolResource=missing&toolAccess=bad&toolRole=teacher&toolRole=teacher&toolRole=missing&secret=x",
			).toString(),
		).toBe("toolRole=teacher");
	});
});
