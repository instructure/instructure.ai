import { describe, expect, it } from "vitest";
import { CSVURL, TEMPLATE_PACKAGE } from "./consts";

const ALLOWED_PLACEHOLDERS = [
	"<<uid>>",
	"<<data>>",
	"<<nutritionFacts>>",
	"<<dataPermissionLevels>>",
	"<<aiInformation>>",
];

describe("consts.ts TEMPLATE_PACKAGE", () => {
	it("TEMPLATE_PACKAGE is a non-empty string", () => {
		expect(typeof TEMPLATE_PACKAGE).toBe("string");
		expect(TEMPLATE_PACKAGE.length).toBeGreaterThan(50);
	});

	it("CSVURL matches the expected published CSV endpoint", () => {
		expect(CSVURL).toBe(
			"https://docs.google.com/spreadsheets/d/e/2PACX-1vRTUoO92jyiHlJq36oKbtCdL57J7bdOKJbhxRahR2YTR6lTyfhQyo5kidHRwk45jagV9C9DXf80SgfS/pub?gid=2000446087&single=true&output=csv",
		);
		expect(CSVURL).toContain("output=csv");
	});

	it("contains required import lines with correct modules and specifiers", () => {
		expect(TEMPLATE_PACKAGE).toContain(
			'import { Button } from "@instructure/ui-buttons";',
		);
		expect(TEMPLATE_PACKAGE).toContain(
			'import type { AiInfoFeatureProps } from "../types";',
		);
		expect(TEMPLATE_PACKAGE).toContain(
			'import type { AiInformationProps, DataPermissionLevelsProps, NutritionFactsProps } from "@instructure/ui";',
		);
	});

	it("contains all expected placeholders", () => {
		for (const ph of ALLOWED_PLACEHOLDERS) {
			expect(TEMPLATE_PACKAGE).toContain(ph);
		}
	});

	it("placeholder occurrence counts are correct", () => {
		const count = (ph: string) =>
			(
				TEMPLATE_PACKAGE.match(
					new RegExp(ph.replace(/\\/g, "\\\\").replace(/[<>]/g, "\\$&"), "g"),
				) || []
			).length;
		expect(count("<<uid>>")).toBe(3); // declaration + named export + default export
		expect(count("<<data>>")).toBe(1);
		expect(count("<<nutritionFacts>>")).toBe(1);
		expect(count("<<dataPermissionLevels>>")).toBe(1);
		expect(count("<<aiInformation>>")).toBe(1);
	});

	it("does not contain unexpected placeholder tokens", () => {
		const found = Array.from(TEMPLATE_PACKAGE.matchAll(/<<[^>]+>>/g)).map(
			(m) => (m as RegExpMatchArray)[0],
		);
		const unique = Array.from(new Set(found));
		// Ensure each found is allowed
		unique.forEach((ph) => {
			expect(ALLOWED_PLACEHOLDERS).toContain(ph);
		});
		// Ensure no allowed placeholder is missing
		ALLOWED_PLACEHOLDERS.forEach((ph) => {
			expect(unique).toContain(ph);
		});
	});

	it("has expected variable declarations with placeholders", () => {
		expect(TEMPLATE_PACKAGE).toContain(
			"const <<uid>>: AiInfoFeatureProps = <<data>>;",
		);
		expect(TEMPLATE_PACKAGE).toContain(
			"const nutritionFacts: NutritionFactsProps = <<nutritionFacts>>;",
		);
		expect(TEMPLATE_PACKAGE).toContain(
			"const dataPermissionLevels: DataPermissionLevelsProps = <<dataPermissionLevels>>;",
		);
		expect(TEMPLATE_PACKAGE).toContain(
			"const aiInformation: AiInformationProps = <<aiInformation>>;",
		);
	});

	it("has expected export lines referencing placeholders", () => {
		const namedExportLine =
			"export { <<uid>>, nutritionFacts, dataPermissionLevels, aiInformation };";
		const defaultExportLine = "export default <<uid>>;";
		expect(TEMPLATE_PACKAGE).toContain(namedExportLine);
		expect(TEMPLATE_PACKAGE).toContain(defaultExportLine);
		expect(TEMPLATE_PACKAGE.indexOf(namedExportLine)).toBeLessThan(
			TEMPLATE_PACKAGE.indexOf(defaultExportLine),
		);
	});

	it("declaration order is uid, nutritionFacts, dataPermissionLevels, aiInformation", () => {
		const iUid = TEMPLATE_PACKAGE.indexOf("const <<uid>>");
		const iNF = TEMPLATE_PACKAGE.indexOf("const nutritionFacts");
		const iPerm = TEMPLATE_PACKAGE.indexOf("const dataPermissionLevels");
		const iAI = TEMPLATE_PACKAGE.indexOf("const aiInformation");
		expect(iUid).toBeGreaterThan(-1);
		expect(iNF).toBeGreaterThan(iUid);
		expect(iPerm).toBeGreaterThan(iNF);
		expect(iAI).toBeGreaterThan(iPerm);
	});

	it("placeholders appear as standalone tokens (not partially embedded)", () => {
		const badEmbedding = /[A-Za-z0-9_]<</;
		expect(badEmbedding.test(TEMPLATE_PACKAGE)).toBe(false);
	});

	it("ends with newline after default export (stable ending)", () => {
		expect(TEMPLATE_PACKAGE.trimEnd().endsWith("export default <<uid>>;")).toBe(
			true,
		);
	});

	// Replaced brittle inline snapshot with explicit normalized comparison
	it("matches expected template content (normalized)", () => {
		const normalized = TEMPLATE_PACKAGE.replace(/\r\n/g, "\n").trim();
		const expected = `import { Button } from "@instructure/ui-buttons";
import type { AiInfoFeatureProps } from "../types";
import type { AiInformationProps, DataPermissionLevelsProps, NutritionFactsProps } from "@instructure/ui-instructure";

const <<uid>>: AiInfoFeatureProps = <<data>>;

const nutritionFacts: NutritionFactsProps = <<nutritionFacts>>;

const dataPermissionLevels: DataPermissionLevelsProps = <<dataPermissionLevels>>;

const aiInformation: AiInformationProps = <<aiInformation>>;

export { <<uid>>, nutritionFacts, dataPermissionLevels, aiInformation };
export default <<uid>>;`;
		expect(normalized).toBe(expected);
	});
});
