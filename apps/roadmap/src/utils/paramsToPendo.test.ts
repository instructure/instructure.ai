import { describe, expect, it } from "vitest";
import paramsToPendo from "./paramsToPendo";

const createValidPendoAPIFeature = (
  overrides: {
    feature?: Partial<PendoAPIFeature["feature"]>;
    product?: Partial<PendoAPIFeature["product"]>;
  } = {},
): PendoAPIFeature => ({
  feature: {
    description: undefined,
    links: undefined,
    stage: "In Progress",
    title: "Test Feature",
    labels: ["label1", "label2"],
    ...overrides.feature,
  },
  product: {
    name: "Product A",
    area: "Area 1",
    logo: undefined,
    color: undefined,
    ...overrides.product,
  },
});

const createValidPendoAPI = (features: PendoAPIFeature[] = []): PendoAPI => ({
  results: features.length > 0 ? features : [createValidPendoAPIFeature()],
});

describe("paramsToPendo", () => {
  describe("parameter validation", () => {
    it("should return undefined when params is null", () => {
      const result = paramsToPendo(undefined);
      expect(result).toBeUndefined();
    });

    it("should return undefined when params is empty string", () => {
      const result = paramsToPendo("");
      expect(result).toBeUndefined();
    });

    it("should return undefined when params is invalid JSON", () => {
      const result = paramsToPendo("invalid-json");
      expect(result).toBeUndefined();
    });

    it("should return undefined when params cannot be decoded", () => {
      const result = paramsToPendo("%E0%A4%A");
      expect(result).toBeUndefined();
    });
  });

  describe("type validation", () => {
    it("should return undefined when parsed params is not an object", () => {
      const result = paramsToPendo(JSON.stringify("not-an-object"));
      expect(result).toBeUndefined();
    });

    it("should return undefined when parsed params is an array", () => {
      const result = paramsToPendo(JSON.stringify([]));
      expect(result).toBeUndefined();
    });

    it("should return undefined when results property is missing", () => {
      const result = paramsToPendo(JSON.stringify({}));
      expect(result).toBeUndefined();
    });

    it("should return undefined when results is not an array", () => {
      const result = paramsToPendo(JSON.stringify({ results: "not-an-array" }));
      expect(result).toBeUndefined();
    });
  });

  describe("feature validation", () => {
    it("should return undefined when feature property is missing", () => {
      const invalidData = {
        results: [{ product: { area: "Area 1", name: "Product A" } }],
      };
      const result = paramsToPendo(JSON.stringify(invalidData));
      expect(result).toBeUndefined();
    });

    it("should return undefined when feature is not an object", () => {
      const invalidData = {
        results: [{ feature: "not-an-object", product: { area: "Area 1", name: "Product A" } }],
      };
      const result = paramsToPendo(JSON.stringify(invalidData));
      expect(result).toBeUndefined();
    });

    it("should return undefined when feature.stage is missing", () => {
      const invalidData = {
        results: [
          {
            feature: { title: "Test" },
            product: { area: "Area 1", name: "Product A" },
          },
        ],
      };
      const result = paramsToPendo(JSON.stringify(invalidData));
      expect(result).toBeUndefined();
    });

    it("should return undefined when feature.title is missing", () => {
      const invalidData = {
        results: [
          {
            feature: { stage: "In Progress" },
            product: { area: "Area 1", name: "Product A" },
          },
        ],
      };
      const result = paramsToPendo(JSON.stringify(invalidData));
      expect(result).toBeUndefined();
    });
  });

  describe("product validation", () => {
    it("should return undefined when product property is missing", () => {
      const invalidData = {
        results: [{ feature: { stage: "In Progress", title: "Test" } }],
      };
      const result = paramsToPendo(JSON.stringify(invalidData));
      expect(result).toBeUndefined();
    });

    it("should return undefined when product is not an object", () => {
      const invalidData = {
        results: [{ feature: { stage: "In Progress", title: "Test" }, product: "not-an-object" }],
      };
      const result = paramsToPendo(JSON.stringify(invalidData));
      expect(result).toBeUndefined();
    });

    it("should return undefined when product.name is missing", () => {
      const invalidData = {
        results: [
          {
            feature: { stage: "In Progress", title: "Test" },
            product: { area: "Area 1" },
          },
        ],
      };
      const result = paramsToPendo(JSON.stringify(invalidData));
      expect(result).toBeUndefined();
    });

    it("should return undefined when product.area is missing", () => {
      const invalidData = {
        results: [
          {
            feature: { stage: "In Progress", title: "Test" },
            product: { name: "Product A" },
          },
        ],
      };
      const result = paramsToPendo(JSON.stringify(invalidData));
      expect(result).toBeUndefined();
    });
  });

  describe("valid data processing", () => {
    it("should parse and return valid roadmap data", () => {
      const validData = createValidPendoAPI();
      const encoded = encodeURIComponent(JSON.stringify(validData));
      const result = paramsToPendo(encoded);

      expect(result).toBeDefined();
      expect(result?.features).toHaveLength(1);
      expect(result?.stages).toContain("In Progress");
      expect(result?.products).toContain("Product A");
      expect(result?.productAreas).toContain("Area 1");
      expect(result?.labels).toContain("label1");
      expect(result?.labels).toContain("label2");
    });

    it("should handle URL encoded params", () => {
      const validData = createValidPendoAPI();
      const encoded = encodeURIComponent(JSON.stringify(validData));
      const result = paramsToPendo(encoded);

      expect(result).toBeDefined();
      expect(result?.features).toHaveLength(1);
    });

    it("should handle non-encoded JSON string", () => {
      const validData = createValidPendoAPI();
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result).toBeDefined();
      expect(result?.features).toHaveLength(1);
    });

    it("should extract unique stages from multiple features", () => {
      const features = [
        createValidPendoAPIFeature({ feature: { stage: "Planning" } }),
        createValidPendoAPIFeature({ feature: { stage: "In Progress" } }),
        createValidPendoAPIFeature({ feature: { stage: "Planning" } }),
        createValidPendoAPIFeature({ feature: { stage: "Completed" } }),
      ];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.stages).toHaveLength(3);
      expect(result?.stages).toContain("Planning");
      expect(result?.stages).toContain("In Progress");
      expect(result?.stages).toContain("Completed");
    });

    it("should extract unique products from multiple features", () => {
      const features = [
        createValidPendoAPIFeature({ product: { name: "Product A" } }),
        createValidPendoAPIFeature({ product: { name: "Product B" } }),
        createValidPendoAPIFeature({ product: { name: "Product A" } }),
        createValidPendoAPIFeature({ product: { name: "Product C" } }),
      ];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.products).toHaveLength(3);
      expect(result?.products).toContain("Product A");
      expect(result?.products).toContain("Product B");
      expect(result?.products).toContain("Product C");
    });

    it("should extract unique product areas from multiple features", () => {
      const features = [
        createValidPendoAPIFeature({ product: { area: "Area 1" } }),
        createValidPendoAPIFeature({ product: { area: "Area 2" } }),
        createValidPendoAPIFeature({ product: { area: "Area 1" } }),
        createValidPendoAPIFeature({ product: { area: "Area 3" } }),
      ];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.productAreas).toHaveLength(3);
      expect(result?.productAreas).toContain("Area 1");
      expect(result?.productAreas).toContain("Area 2");
      expect(result?.productAreas).toContain("Area 3");
    });

    it("should flatten and extract unique labels from multiple features", () => {
      const features = [
        createValidPendoAPIFeature({ feature: { labels: ["tag1", "tag2"] } }),
        createValidPendoAPIFeature({ feature: { labels: ["tag2", "tag3"] } }),
        createValidPendoAPIFeature({ feature: { labels: ["tag1", "tag4"] } }),
      ];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.labels).toHaveLength(4);
      expect(result?.labels).toContain("tag1");
      expect(result?.labels).toContain("tag2");
      expect(result?.labels).toContain("tag3");
      expect(result?.labels).toContain("tag4");
    });

    it("should filter out falsy values from stages", () => {
      const features = [
        createValidPendoAPIFeature({ feature: { stage: "Planning" } }),
        createValidPendoAPIFeature({ feature: { stage: undefined } }),
        createValidPendoAPIFeature({ feature: { stage: "" } }),
        createValidPendoAPIFeature({ feature: { stage: "Completed" } }),
      ];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.stages).toEqual(["Planning", "Completed"]);
    });

    it("should filter out falsy values from products", () => {
      const features = [
        createValidPendoAPIFeature({ product: { name: "Product A" } }),
        createValidPendoAPIFeature({ product: { name: undefined } }),
        createValidPendoAPIFeature({ product: { name: "" } }),
        createValidPendoAPIFeature({ product: { name: "Product B" } }),
      ];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result).toBeUndefined();
    });

    it("should filter out falsy values from product areas", () => {
      const features = [
        createValidPendoAPIFeature({ product: { area: "Area 1" } }),
        createValidPendoAPIFeature({ product: { area: undefined } }),
        createValidPendoAPIFeature({ product: { area: "" } }),
        createValidPendoAPIFeature({ product: { area: "Area 2" } }),
      ];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.productAreas).toEqual(["Area 1", "Area 2"]);
    });

    it("should filter out falsy values from labels", () => {
      const features = [createValidPendoAPIFeature({ feature: { labels: ["tag1", "", "tag2"] } })];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.labels).toEqual(["tag1", "tag2"]);
    });

    it("should handle empty results array", () => {
      const validData = { results: [] };
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result).toBeDefined();
      expect(result?.features).toEqual([]);
      expect(result?.stages).toEqual([]);
      expect(result?.products).toEqual([]);
      expect(result?.productAreas).toEqual([]);
      expect(result?.labels).toEqual([]);
    });

    it("should preserve all features in the results", () => {
      const features = [
        createValidPendoAPIFeature({ feature: { title: "Feature 1" } }),
        createValidPendoAPIFeature({ feature: { title: "Feature 2" } }),
        createValidPendoAPIFeature({ feature: { title: "Feature 3" } }),
      ];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.features).toHaveLength(3);
      expect(result?.features[0].feature.title).toBe("Feature 1");
      expect(result?.features[1].feature.title).toBe("Feature 2");
      expect(result?.features[2].feature.title).toBe("Feature 3");
    });

    it("should handle features with empty labels array", () => {
      const features = [createValidPendoAPIFeature({ feature: { labels: [] } })];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.labels).toEqual([]);
    });

    it("should handle features with undefined labels", () => {
      const features = [createValidPendoAPIFeature({ feature: { labels: undefined } })];
      const validData = createValidPendoAPI(features);
      const result = paramsToPendo(JSON.stringify(validData));

      expect(result?.labels).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("should handle very long parameter strings", () => {
      const features = Array.from({ length: 100 }, (_, i) =>
        createValidPendoAPIFeature({ feature: { title: `Feature ${i}` } }),
      );
      const validData = createValidPendoAPI(features);
      const encoded = encodeURIComponent(JSON.stringify(validData));
      const result = paramsToPendo(encoded);

      expect(result).toBeDefined();
      expect(result?.features).toHaveLength(100);
    });

    it("should handle special characters in feature data", () => {
      const features = [
        createValidPendoAPIFeature({
          feature: { title: "Feature with special chars: !@#$%^&*()" },
          product: { name: "Product & Co." },
        }),
      ];
      const validData = createValidPendoAPI(features);
      const encoded = encodeURIComponent(JSON.stringify(validData));
      const result = paramsToPendo(encoded);

      expect(result?.features[0].feature.title).toBe("Feature with special chars: !@#$%^&*()");
      expect(result?.products).toContain("Product & Co.");
    });

    it("should handle unicode characters", () => {
      const features = [
        createValidPendoAPIFeature({
          feature: { title: "特殊功能 🚀" },
          product: { name: "Продукт А" },
        }),
      ];
      const validData = createValidPendoAPI(features);
      const encoded = encodeURIComponent(JSON.stringify(validData));
      const result = paramsToPendo(encoded);

      expect(result?.features[0].feature.title).toBe("特殊功能 🚀");
      expect(result?.products).toContain("Продукт А");
    });
  });
});
