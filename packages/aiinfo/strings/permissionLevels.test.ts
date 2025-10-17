import { describe, expect, it } from "vitest";
import { strings as permissionLevelsStrings } from "./permissionLevels";

describe("permissionLevels strings", () => {
	it("exposes 'en' locale", () => {
		expect(permissionLevelsStrings).toHaveProperty("en");
	});

	it("has required top-level keys with correct literals", () => {
		const pl = permissionLevelsStrings.en as Record<string, unknown>;
		const required = [
			"title",
			"triggerText",
			"modalLabel",
			"closeButtonText",
			"closeIconButtonScreenReaderLabel",
			"currentFeatureText",
			"data",
		];
		required.forEach((k) => {
			expect(pl[k]).not.toBeUndefined();
		});
		expect(pl.title).toBe("Data Permission Levels");
		expect(pl.triggerText).toBe(pl.title);
		expect(pl.modalLabel).toBe("Data Permission Levels modal");
		expect(pl.closeButtonText).toBe("Close");
		expect(pl.closeIconButtonScreenReaderLabel).toBe("Close dialog");
		expect(pl.currentFeatureText).toBe("Current Feature:");
	});

	it("data array has correct length and structure", () => {
		const pl = permissionLevelsStrings.en;
		expect(Array.isArray(pl.data)).toBe(true);
		expect(pl.data).toHaveLength(4);
		pl.data.forEach((entry) => {
			expect(Object.keys(entry).sort()).toEqual([
				"description",
				"level",
				"title",
			]);
			expect(typeof entry.description).toBe("string");
			expect(entry.description.length).toBeGreaterThan(40);
			expect(typeof entry.level).toBe("string");
			expect(/^LEVEL [1-4]$/.test(entry.level)).toBe(true);
			expect(typeof entry.title).toBe("string");
			expect(entry.title.length).toBeGreaterThan(5);
		});
	});

	it("levels are in ascending order and unique", () => {
		const levels = permissionLevelsStrings.en.data.map((d) => d.level);
		expect(levels).toEqual(["LEVEL 1", "LEVEL 2", "LEVEL 3", "LEVEL 4"]);
		const set = new Set(levels);
		expect(set.size).toBe(levels.length);
	});

	it("titles match expected ordered list and are unique", () => {
		const titles = permissionLevelsStrings.en.data.map((d) => d.title);
		expect(titles).toEqual([
			"Descriptive Analytics and Research",
			"AI-Powered Features Without Data Training",
			"AI Customization for Individual Institutions",
			"Collaborative AI Consortium",
		]);
		const set = new Set(titles);
		expect(set.size).toBe(titles.length);
	});

	it("first and last titles are correct", () => {
		const data = permissionLevelsStrings.en.data;
		expect(data[0].title).toBe("Descriptive Analytics and Research");
		expect(data[data.length - 1].title).toBe("Collaborative AI Consortium");
	});

	it("each title starts with an uppercase letter", () => {
		permissionLevelsStrings.en.data.forEach((d) => {
			expect(/^[A-Z]/.test(d.title)).toBe(true);
		});
	});

	it("at least one description mentions AI", () => {
		const hasAI = permissionLevelsStrings.en.data.some((d) =>
			d.description.includes("AI"),
		);
		expect(hasAI).toBe(true);
	});

	it("currentFeatureText not duplicated inside data entries", () => {
		const cf = permissionLevelsStrings.en.currentFeatureText;
		permissionLevelsStrings.en.data.forEach((d) => {
			expect(d.title).not.toBe(cf);
			expect(d.description).not.toBe(cf);
		});
	});

	it("no undefined values at top level", () => {
		const pl = permissionLevelsStrings.en as Record<string, unknown>;
		Object.entries(pl).forEach(([, v]) => {
			expect(v).not.toBeUndefined();
		});
	});

	it("no undefined in any level entry fields", () => {
		permissionLevelsStrings.en.data.forEach((d) => {
			expect(d.description).not.toBeUndefined();
			expect(d.level).not.toBeUndefined();
			expect(d.title).not.toBeUndefined();
		});
	});

	it("snapshot of english permission levels strings", () => {
		expect(permissionLevelsStrings.en).toMatchSnapshot();
	});
});
