import { beforeEach, describe, expect, it, vi } from "vitest";

// Hoisted mocks (define once). Use vi.fn so we can override implementations in specific tests.
vi.mock("../strings", () => ({
	aiInformationStrings: {
		en: {
			data: {
				modelNameText: "Model Name",
				nutritionFactsModalTriggerText: "Nutrition Facts",
				permissionLevelsModalTriggerText: "Permission Levels",
				permissionLevelText: "Permission Level",
			},
			trigger: "TRIGGER_TEXT",
		},
	},
	permissionLevelsStrings: {
		en: {
			data: [
				{ description: "Level1Desc" },
				{ description: "Level2Desc" },
				{ description: "Level3Desc" },
			],
		},
	},
}));

vi.mock("./", () => ({
	entryToNutritionFacts: vi.fn((entry: Record<string, unknown>) => ({
		data: [{ calories: 0 }, { tokens: 123 }],
		// FIX: Ensure entry.feature is an object with a name property before accessing
		featureName:
			entry &&
			typeof entry.feature === "object" &&
			entry.feature !== null &&
			"name" in entry.feature
				? ((entry.feature as { name?: string }).name ?? "NF Fallback")
				: "NF Fallback",
	})),
	entryToPermissionLevels: vi.fn(() => ({
		currentFeature: "Current Feature",
		data: ["L1", "L2", "L3"],
	})),
}));

type AIInformationResult = {
	trigger: string;
	data: Array<{
		description: string;
		featureName: string;
		modelName: string;
		permissionLevel: string;
		modelNameText: string;
		nutritionFactsModalTriggerText: string;
		permissionLevelsModalTriggerText: string;
		permissionLevelText: string;
	}>;
	nutritionFactsData: Array<Record<string, unknown>>;
	nutritionFactsFeatureName: string;
	dataPermissionLevelsCurrentFeature: string;
	dataPermissionLevelsData: Array<unknown>;
};

const importSubject = async () => {
	const mod = await import("./entryToAIInformation.tsx");
	// FIX: Cast to expected output type so result is not 'unknown'
	return mod.entryToAIInformation as (e: unknown) => AIInformationResult;
};

beforeEach(async () => {
	vi.resetModules();
});

describe("entryToAIInformation", () => {
	it("builds expected structure (happy path)", async () => {
		const entryToAIInformation = await importSubject();
		const entry = {
			feature: { name: "CoolFeature" },
			model: { name: "gpt-xyz" },
			permissions: "2",
		};
		const result = entryToAIInformation(entry);

		expect(result.trigger).toBe("TRIGGER_TEXT");
		expect(Array.isArray(result.data)).toBe(true);
		expect(result.data).toHaveLength(1);

		const item = result.data[0];
		expect(item.description).toBe("Level2Desc");
		expect(item.featureName).toBe("CoolFeature");
		expect(item.modelName).toBe("gpt-xyz");
		expect(item.permissionLevel).toBe("LEVEL 2");
		expect(item.modelNameText).toBe("Model Name");
		expect(item.nutritionFactsModalTriggerText).toBe("Nutrition Facts");
		expect(item.permissionLevelsModalTriggerText).toBe("Permission Levels");
		expect(item.permissionLevelText).toBe("Permission Level");

		expect(result.nutritionFactsData).toEqual([
			{ calories: 0 },
			{ tokens: 123 },
		]);
		expect(result.nutritionFactsFeatureName).toBe("CoolFeature");
		expect(result.dataPermissionLevelsCurrentFeature).toBe("Current Feature");
		expect(result.dataPermissionLevelsData).toEqual(["L1", "L2", "L3"]);
	});

	it('falls back to "Unknown" description when permission index out of range', async () => {
		const entryToAIInformation = await importSubject();
		const entry = {
			feature: { name: "F" },
			model: { name: "M" },
			permissions: "99",
		};
		const result = entryToAIInformation(entry);
		const item = result.data[0];
		expect(item.description).toBe("Unknown");
		expect(item.permissionLevel).toBe("LEVEL 99");
	});

	it("falls back when permissions missing", async () => {
		const entryToAIInformation = await importSubject();
		const entry = {
			feature: { name: "F" },
			model: { name: "M" },
		};
		const result = entryToAIInformation(entry);
		const item = result.data[0];
		expect(item.description).toBe("Unknown");
		expect(item.permissionLevel).toBe("LEVEL Unknown");
	});

	it('falls back to "Unknown" for missing feature/model names', async () => {
		const entryToAIInformation = await importSubject();
		const entry = { permissions: "1" };
		const result = entryToAIInformation(entry);
		const item = result.data[0];
		expect(item.featureName).toBe("Unknown");
		expect(item.modelName).toBe("Unknown");
		expect(item.description).toBe("Level1Desc");
	});

	it("wraps thrown errors with custom message", async () => {
		const entryToAIInformation = await importSubject();
		// Override helper for this test only
		const helpers = await import("./");
		(
			helpers.entryToNutritionFacts as unknown as {
				mockImplementationOnce: (fn: () => void) => void;
			}
		).mockImplementationOnce(() => {
			throw new Error("Boom");
		});

		expect(() =>
			entryToAIInformation({
				feature: { name: "TestFeature" },
				model: { name: "TestModel" },
				permissions: "1",
				revision: "1",
				uid: "test-uid",
			}),
		).toThrowError(/Error in entryToAIInformation: Error: Boom/);
	});

	it("does not let entry fields override static text", async () => {
		const entryToAIInformation = await importSubject();
		const entry = {
			feature: { name: "FeatureX" },
			model: { name: "ModelY" },
			modelNameText: "ShouldNotUse",
			permissions: "1",
		} as Partial<Parameters<typeof entryToAIInformation>[0]>;
		const result = entryToAIInformation(entry);
		const item = result.data[0];
		expect(item.modelNameText).toBe("Model Name");
	});
});
