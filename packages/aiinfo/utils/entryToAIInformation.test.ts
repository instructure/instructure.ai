import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../strings", () => ({
  aiInformationStrings: {
    en: {
      data: {
        modelNameText: "Model Name",
        nutritionFactsModalTriggerText: "Nutrition Facts",
        permissionLevelText: "Permission Level",
        permissionLevelsModalTriggerText: "Permission Levels",
      },
      trigger: undefined,
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

vi.mock>(() => ({
  entryToNutritionFacts: vi.fn((entry: Record<string, unknown>) => ({
    data: [{ calories: 0 }, { tokens: 123 }],
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
    data: [
      { description: "", highlighted: undefined, level: "L1", title: "" },
      { description: "", highlighted: undefined, level: "L2", title: "" },
      { description: "", highlighted: undefined, level: "L3", title: "" },
    ],
  })),
}));

interface AIInformationResult {
  trigger: undefined;
  data: {
    description: string;
    featureName: string;
    modelName: string;
    permissionLevel: string;
    modelNameText: string;
    nutritionFactsModalTriggerText: string;
    permissionLevelsModalTriggerText: string;
    permissionLevelText: string;
  }[];
  nutritionFactsData: Record<string, unknown>[];
  nutritionFactsFeatureName: string;
  dataPermissionLevelsCurrentFeature: string;
  dataPermissionLevelsData: unknown[];
}

const importSubject = async () => {
  const mod = await import("./entryToAIInformation.ts");
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

    expect(result.trigger).toBeUndefined();
    expect(Array.isArray(result.data)).toBeTruthy();
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

    expect(result.nutritionFactsData).toStrictEqual([
      { calories: 0 },
      { tokens: 123 },
    ]);
    expect(result.nutritionFactsFeatureName).toBe("CoolFeature");
    expect(result.dataPermissionLevelsCurrentFeature).toBe("Current Feature");
    expect(result.dataPermissionLevelsData).toStrictEqual([
      { description: "", highlighted: undefined, level: "L1", title: "" },
      { description: "", highlighted: undefined, level: "L2", title: "" },
      { description: "", highlighted: undefined, level: "L3", title: "" },
    ]);
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
    ).toThrow(/Error in entryToAIInformation: Error: Boom/);
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
