import { describe, expect, it } from "vitest";
import { strings as nutritionFactsStrings } from "./nutritionFacts";

describe("nutritionFacts strings", () => {
  it("exposes 'en' locale", () => {
    expect(nutritionFactsStrings).toHaveProperty("en");
  });

  it("has required top-level keys with correct literals", () => {
    const nf = nutritionFactsStrings.en as Record<string, unknown>;
    const required = [
      "modalLabel",
      "title",
      "data",
      "closeButtonText",
      "closeIconButtonScreenReaderLabel",
      "triggerText",
    ];
    required.forEach((k) => {
      expect(nf[k]).toBeDefined();
    });
    expect(nf.title).toBe("AI Nutrition Facts");
    expect(nf.triggerText).toBe("Nutrition Facts");
    expect(nf.closeButtonText).toBe("Close");
    expect(nf.closeIconButtonScreenReaderLabel).toBe("Close");
    expect(nf.closeButtonText).toBe(nf.closeIconButtonScreenReaderLabel);
    expect(nf.modalLabel).toBe("This is a modal for AI facts");
  });

  it("has three data blocks with expected lengths and titles", () => {
    const nf = nutritionFactsStrings.en;
    expect(Array.isArray(nf.data)).toBeTruthy();
    expect(nf.data).toHaveLength(3);

    const [modelBlock, privacyBlock, outputsBlock] = nf.data;

    expect(modelBlock.blockTitle).toBe("Model & Data");
    expect(modelBlock.segmentData).toHaveLength(3);
    expect(modelBlock.segmentData.map((s) => s.segmentTitle)).toStrictEqual([
      "Base Model",
      "Trained with User Data",
      "Data Shared with Model",
    ]);

    expect(privacyBlock.blockTitle).toBe("Privacy & Compliance");
    expect(privacyBlock.segmentData).toHaveLength(4);
    expect(privacyBlock.segmentData.map((s) => s.segmentTitle)).toStrictEqual([
      "Data Retention",
      "Data Logging",
      "Regions Supported",
      "PII",
    ]);

    expect(outputsBlock.blockTitle).toBe("Outputs");
    expect(outputsBlock.segmentData).toHaveLength(5);
    expect(outputsBlock.segmentData.map((s) => s.segmentTitle)).toStrictEqual([
      "AI Settings Control",
      "Human in the Loop",
      "Guardrails",
      "Expected Risks",
      "Intended Outcomes",
    ]);
  });

  it("has correct total number of segments", () => {
    const nf = nutritionFactsStrings.en;
    const allSegments = nf.data.flatMap((b) => b.segmentData);
    expect(allSegments).toHaveLength(12);
  });

  it("ensures all segment titles are unique and capitalized", () => {
    const nf = nutritionFactsStrings.en;
    const titles = nf.data.flatMap((b) =>
      b.segmentData.map((s) => s.segmentTitle),
    );
    const set = new Set(titles);
    expect(set.size).toBe(titles.length);
    titles.forEach((t) => {
      expect(/^[A-Z]/.test(t)).toBeTruthy();
    });
  });

  it("ensures all segment descriptions are present and non-empty", () => {
    const nf = nutritionFactsStrings.en;
    nf.data.forEach((block) => {
      block.segmentData.forEach((seg) => {
        expect(typeof seg.description).toBe("string");
        expect(seg.description.length).toBeGreaterThan(0);
      });
    });
  });

  it("first segment title is 'Base Model' (regression guard used elsewhere)", () => {
    const nf = nutritionFactsStrings.en;
    expect(nf.data[0].segmentData[0].segmentTitle).toBe("Base Model");
  });

  it("no undefined at top level", () => {
    const nf = nutritionFactsStrings.en as Record<string, unknown>;
    Object.entries(nf).forEach(([, v]) => {
      expect(v).toBeDefined();
    });
  });

  it("blocks have only expected keys", () => {
    const nf = nutritionFactsStrings.en;
    nf.data.forEach((block) => {
      expect(Object.keys(block).toSorted()).toStrictEqual([
        "blockTitle",
        "segmentData",
      ]);
    });
  });

  it("segment entries have only expected keys", () => {
    const nf = nutritionFactsStrings.en;
    nf.data.forEach((block) => {
      block.segmentData.forEach((seg) => {
        expect(Object.keys(seg).toSorted()).toStrictEqual([
          "description",
          "segmentTitle",
        ]);
      });
    });
  });

  it("snapshot of english nutrition facts strings", () => {
    expect(nutritionFactsStrings.en).toMatchSnapshot();
  });
});
