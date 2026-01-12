// @vitest-environment node

import { describe, expect, it } from "vitest";
import getProductArea from "./getProductArea";

describe("getProductArea", () => {
  it("returns undefined if area is undefined", () => {
    expect(getProductArea(undefined)).toBeUndefined();
  });

  it("returns undefined if area is null", () => {
    // oxlint-disable-next-line no-null: Testing null case
    expect(getProductArea(null)).toBeUndefined();
  });

  it("returns undefined if area is empty string", () => {
    expect(getProductArea("")).toBeUndefined();
  });

  it("returns undefined if area does not contain ' - '", () => {
    expect(getProductArea("Canvas")).toBeUndefined();
    expect(getProductArea("Canvas-Product")).toBeUndefined();
  });

  it("returns second part if area contains ' - '", () => {
    expect(getProductArea("Canvas - Product")).toBe("Product");
    expect(getProductArea("Mastery - Analytics")).toBe("Analytics");
  });

  it("returns undefined if second part is missing", () => {
    expect(getProductArea("Canvas - ")).toBeUndefined();
    expect(getProductArea("Canvas -")).toBeUndefined();
    expect(getProductArea(" - ")).toBeUndefined();
  });

  it("returns second part even if there are more than two parts", () => {
    expect(getProductArea("Canvas - Product - Extra")).toBe("Product");
    expect(getProductArea("A - B - C - D")).toBe("B");
  });

  it("trims whitespace from the returned product area", () => {
    expect(getProductArea("Canvas -   Product Area  ")).toBe("  Product Area  ");
  });
});
