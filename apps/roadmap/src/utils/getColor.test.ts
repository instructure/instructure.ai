// @vitest-environment node

import { describe, expect, it } from "vitest";
import { Colors } from "../components";
import getColor from "./getColor";

// Mock type for PendoAPIFeature["product"]["name"]
type ProductName = string;

describe("getColor - known brands", () => {
  it("returns the correct color for canvas", () => {
    const product: ProductName = "Canvas LMS";
    expect(getColor(product)).toBe(Colors.canvas);
  });

  it("returns the correct color for ignite", () => {
    const product: ProductName = "Ignite AI";
    expect(getColor(product)).toBe(Colors.ignite);
  });

  it("returns the correct color for instructure", () => {
    const product: ProductName = "Instructure Platform";
    expect(getColor(product)).toBe(Colors.instructure);
  });

  it("returns the correct color for mastery", () => {
    const product: ProductName = "Mastery Connect";
    expect(getColor(product)).toBe(Colors.mastery);
  });

  it("returns the correct color for parchment", () => {
    const product: ProductName = "Parchment Service";
    expect(getColor(product)).toBe(Colors.parchment);
  });

  it("returns the correct color for studio", () => {
    const product: ProductName = "Studio Video";
    expect(getColor(product)).toBe(Colors.studio);
  });
});

describe("getColor - edge cases", () => {
  it("returns instructure color for an unknown brand", () => {
    const product: ProductName = "UnknownBrand Something";
    expect(getColor(product)).toBe(Colors.instructure);
  });

  it("handles single-word product names", () => {
    const product: ProductName = "Canvas";
    expect(getColor(product)).toBe(Colors.canvas);
  });

  it("is case-insensitive for brand name", () => {
    const product: ProductName = "CANVAS LMS";
    expect(getColor(product)).toBe(Colors.canvas);
  });

  it("returns instructure color for empty string", () => {
    const product: ProductName = "";
    expect(getColor(product)).toBe(Colors.instructure);
  });
});
