import { readFile } from "node:fs/promises";
import postcss, { type Container } from "postcss";
import { describe, expect, it } from "vitest";

const stylesheet = postcss.parse(
	await readFile(new URL("../src/main.css", import.meta.url), "utf8"),
);

function declarations(container: Container, selector: string): Map<string, string> {
	const rule = container.nodes?.find(
		(node) => node.type === "rule" && node.selectors.some((part) => part.trim() === selector),
	);
	return new Map(
		rule?.type === "rule"
			? rule.nodes.filter((node) => node.type === "decl").map((node) => [node.prop, node.value])
			: [],
	);
}

describe("accessibility styles", () => {
	it.each([
		".lede",
		".field-hint",
		".optional",
		".value-label",
		".intro-copy",
		".steps-list p",
		".setting-value-muted",
		".page-footer",
	])("uses opaque semantic muted text for %s", (selector) => {
		expect(declarations(stylesheet, selector).get("color")).toBe("var(--instui-color-text-muted)");
	});

	it("keeps disabled instructional checkbox labels readable without enabling inputs", () => {
		expect(
			declarations(stylesheet, ".settings-table .setting-checkbox").get(
				"--instui-component-checkbox-label-disabled-color",
			),
		).toBe("var(--instui-color-text-base)");
	});

	it.each([
		".table-copy-cell pre:focus-visible",
		".shiki-block pre:focus-visible",
		".scope-manifest:focus-visible",
	])("draws an inset focus indicator inside the clipped %s", (selector) => {
		const styles = declarations(stylesheet, selector);
		expect(styles.get("outline")).toBe("2px solid var(--instui-color-text-info)");
		expect(styles.get("outline-offset")).toBe("-2px");
	});

	it("limits forced-color opt-outs to icon masks and uses system foreground colors", () => {
		const forcedColors = stylesheet.nodes.find(
			(node) =>
				node.type === "atrule" &&
				node.name === "media" &&
				node.params === "(forced-colors: active)",
		);
		expect(forcedColors?.type).toBe("atrule");
		if (forcedColors?.type !== "atrule") throw new Error("Forced-colors styles missing");
		const icon = declarations(
			forcedColors,
			".site-shell :is(.instui-button, .instui-close-button)::before",
		);
		expect(icon.get("forced-color-adjust")).toBe("none");
		expect(icon.get("background-color")).toBe("ButtonText");
		expect(
			declarations(
				forcedColors,
				".site-shell :is(.instui-button, .instui-close-button):disabled::before",
			).get("background-color"),
		).toBe("GrayText");
		stylesheet.walkDecls("forced-color-adjust", (decl) => {
			expect(decl.parent?.type).toBe("rule");
			if (decl.parent?.type === "rule") expect(decl.parent.selector).toContain("::before");
		});
	});
});
