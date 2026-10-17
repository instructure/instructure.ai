import { readFile } from "node:fs/promises";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

const stylesheet = postcss.parse(
	await readFile(new URL("../src/main.css", import.meta.url), "utf8"),
);
const printStyles = stylesheet.nodes.find(
	(node) => node.type === "atrule" && node.name === "media" && node.params === "print",
);

function declarations(selector: string): Map<string, string> {
	const normalize = (value: string) =>
		value
			.replace(/\s*>\s*/gu, ">")
			.replace(/\s+/gu, " ")
			.trim();
	const rule = printStyles?.nodes?.find(
		(node) =>
			node.type === "rule" &&
			node.selector.split(",").some((part) => normalize(part) === normalize(selector)),
	);
	return new Map(
		rule?.nodes?.filter((node) => node.type === "decl").map((node) => [node.prop, node.value]) ??
			[],
	);
}

describe("print styles", () => {
	it("uses a light scheme with black text on a white page", () => {
		expect(declarations("html").get("color-scheme")).toBe("light");
		expect(declarations("html").get("--instui-color-text-base")).toBe("#000");
		expect(declarations("html").get("--instui-color-background-page")).toBe("#fff");
		expect(declarations("body").get("color")).toBe("#000");
		expect(declarations("body").get("background")).toBe("#fff");
	});

	it("removes card elevation and horizontal spacing and hides input borders", () => {
		expect(declarations(".instui-card").get("box-shadow")).toBe("none");
		expect(declarations(".instui-card").get("margin-left")).toBe("0");
		expect(declarations(".instui-card").get("margin-right")).toBe("0");
		expect(declarations(".instui-card").get("padding-left")).toBe("0");
		expect(declarations(".instui-card").get("padding-right")).toBe("0");
		expect(declarations(".instui-card > .content").get("padding-left")).toBe("0");
		expect(declarations(".instui-card > .content").get("padding-right")).toBe("0");
		expect(declarations(".instui-card > .content").get("box-shadow")).toBe("none");
		expect(declarations("input").get("border-color")).toBe("#fff");
	});

	it("hides tab navigation while retaining its printable panel", () => {
		expect(declarations(".instui-tabs .list").get("display")).toBe("none");
	});

	it("adds page breaks after cards marked for print pagination", () => {
		expect(declarations(".print-page-break-after").get("break-after")).toBe("page");
		expect(declarations(".print-page-break-after").get("page-break-after")).toBe("always");
	});

	it("prints the full scope manifest without a height or scroll limit", () => {
		expect(declarations(".scope-manifest").get("height")).toBe("auto");
		expect(declarations(".scope-manifest").get("max-height")).toBe("none");
		expect(declarations(".scope-manifest").get("overflow")).toBe("visible");
	});
});
