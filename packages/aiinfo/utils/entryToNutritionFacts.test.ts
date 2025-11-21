import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Hoisted mock with mutable backing object. Avoid referencing runtime-local
 * variables inside vi.mock factory (it is hoisted).
 */
interface NutritionBacking {
  closeButtonText: string;
  closeIconButtonScreenReaderLabel: string;
  data: {
    blockTitle: string;
    segmentData: {
      id?: string;
    }[];
  }[];
  modalLabel: string;
  title: string;
  triggerText: string;
}
let backing: NutritionBacking;

vi.mock("../strings/index.js", () => ({
  get nutritionFactsStrings() {
    return { en: backing };
  },
}));

/* ---------- Backing presets ---------- */
const happyBacking = () => ({
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close modal",
  data: [
    {
      blockTitle: "Model Info",
      segmentData: [
        { id: "modelName" },
        { id: "modelTrained" },
        { id: "modelDataDesc" },
      ],
    },
    {
      blockTitle: "Compliance",
      segmentData: [
        { id: "retention" },
        { id: "logging" },
        { id: "regions" },
        { id: "pii" },
      ],
    },
    {
      blockTitle: "Outputs",
      segmentData: [
        { id: "settings" },
        { id: "human" },
        { id: "guardrails" },
        { id: "risks" },
        { id: "outcomes" },
      ],
    },
  ],
  modalLabel: "Nutrition Facts Modal",
  title: "Model Nutrition Facts",
  triggerText: "View Facts",
});

const shuffledBacking = () => ({
  ...happyBacking(),
  data: [
    {
      blockTitle: "SHUFFLED 1",
      segmentData: [{ id: "a" }, { id: "b" }, { id: "c" }],
    },
    {
      blockTitle: "SHUFFLED 2",
      segmentData: [{ id: "d" }, { id: "e" }, { id: "f" }, { id: "g" }],
    },
    {
      blockTitle: "SHUFFLED 3",
      segmentData: [
        { id: "h" },
        { id: "i" },
        { id: "j" },
        { id: "k" },
        { id: "l" },
      ],
    },
  ],
});

const mismatchBacking = () => ({
  ...happyBacking(),
  data: [
    { blockTitle: "Model Info", segmentData: [{}, {}, {}, {}] },
    { blockTitle: "Compliance", segmentData: [{}, {}, {}, {}] },
    { blockTitle: "Outputs", segmentData: [{}, {}, {}, {}, {}] },
  ],
});

/* ---------- Helpers ---------- */
const setBacking = (factory: () => NutritionBacking) => {
  backing = factory();
};

const buildEntry = () => ({
  compliance: {
    logging: "Enabled",
    loggingDescription: "Stored in secure logs",
    pii: "Redacted",
    piiDescription: "PII stripped before persistence",
    regions: "US, EU",
    regionsDescription: "Multi-region replicated",
    retention: "30 days",
  },
  feature: { name: "SmartCompose" },
  model: {
    dataDescription: "Mixed curated academic + synthetic",
    description: "Primary LLM",
    name: "gpt-smart",
    trained: "2023-09",
  },
  outputs: {
    guardrails: "Toxicity + jailbreak filters",
    human: "Human in loop",
    humanDescription: "QA reviewers verify samples",
    outcomes: "Productivity gain",
    risks: "Hallucination: Medium",
    settings: "Deterministic",
  },
});

const importSubject = async () => {
  const mod = await import("./entryToNutritionFacts.ts");
  // FIX: Cast to unknown first, then to the expected function type to satisfy TypeScript
  return mod.entryToNutritionFacts as unknown as (e: unknown) => {
    closeButtonText: string;
    closeIconButtonScreenReaderLabel: string;
    modalLabel: string;
    title: string;
    triggerText: string;
    featureName: string;
    data: {
      blockTitle: string;
      segmentData: {
        id: string;
        value?: string;
        valueDescription?: string;
      }[];
    }[];
  };
};

/* ---------- Tests ---------- */
describe("entryToNutritionFacts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    setBacking(happyBacking);
  });

  it("maps entry fields into structured nutrition facts (happy path)", async () => {
    const entryToNutritionFacts = await importSubject();
    const entry = buildEntry();
    const result = entryToNutritionFacts(entry);

    // FIX: result is now typed, so no TS error
    expect(result.closeButtonText).toBe("Close");
    expect(result.closeIconButtonScreenReaderLabel).toBe("Close modal");
    expect(result.modalLabel).toBe("Nutrition Facts Modal");
    expect(result.title).toBe("Model Nutrition Facts");
    expect(result.triggerText).toBe("View Facts");
    expect(result.featureName).toBe("SmartCompose");

    expect(result.data).toHaveLength(3);
    const [modelBlock, complianceBlock, outputsBlock] = result.data;

    // Model block
    expect(modelBlock.segmentData).toHaveLength(3);
    expect(modelBlock.segmentData[0]).toMatchObject({
      id: "modelName",
      value: "gpt-smart",
      valueDescription: "Primary LLM",
    });
    expect(modelBlock.segmentData[1]).toMatchObject({
      id: "modelTrained",
      value: "2023-09",
    });
    expect(modelBlock.segmentData[1].valueDescription).toBeUndefined();
    expect(modelBlock.segmentData[2]).toMatchObject({
      id: "modelDataDesc",
      value: "Mixed curated academic + synthetic",
    });

    // Compliance
    expect(complianceBlock.segmentData).toHaveLength(4);
    expect(complianceBlock.segmentData[1]).toMatchObject({
      id: "logging",
      value: "Enabled",
      valueDescription: "Stored in secure logs",
    });

    // Outputs
    expect(outputsBlock.segmentData).toHaveLength(5);
    expect(outputsBlock.segmentData[1]).toMatchObject({
      id: "human",
      value: "Human in loop",
      valueDescription: "QA reviewers verify samples",
    });
  });

  it("includes valueDescription only where source provided", async () => {
    const entryToNutritionFacts = await importSubject();
    const entry = buildEntry();
    const result = entryToNutritionFacts(entry);
    const segs = result.data[0].segmentData;
    expect(segs[0].valueDescription).toBe("Primary LLM");
    expect(segs[1].valueDescription).toBeUndefined();
  });

  it("is index-order dependent: changing block titles does not affect mapping", async () => {
    setBacking(shuffledBacking);
    const entryToNutritionFacts = await importSubject();
    const entry = buildEntry();
    const result = entryToNutritionFacts(entry);
    expect(result.data[0].segmentData[0].value).toBe(entry.model.name);
    expect(result.data[1].segmentData[1].value).toBe(entry.compliance.logging);
    expect(result.data[2].segmentData[1].valueDescription).toBe(
      entry.outputs.humanDescription,
    );
  });

  it("wraps and rethrows errors from setData when segment counts mismatch", async () => {
    setBacking(mismatchBacking);
    const entryToNutritionFacts = await importSubject();
    expect(() => entryToNutritionFacts(buildEntry())).toThrow(
      /Error in entryToNutritionFacts: Error: Segment length mismatch/,
    );
  });
});
