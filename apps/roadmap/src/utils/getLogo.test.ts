// @vitest-environment node

import { beforeAll, describe, expect, it, vi } from "vitest";
let getLogo = undefined;

const mockLogos = {
  canvas: "canvas-logo",
  impact: "impact-logo",
  instructure: "instructure-logo",
  mastery: "mastery-logo",
};

vi.mock("../components/logos", () => ({
  Logos: mockLogos,
}));

describe("getLogo", () => {
  beforeAll(async () => {
    const module = await import("./getLogo");
    getLogo = module.default;
  });

  it("returns correct logo for known brand (single word)", () => {
    expect(getLogo("Canvas")).toBe("canvas-logo");
    expect(getLogo("Instructure")).toBe("instructure-logo");
    expect(getLogo("Mastery")).toBe("mastery-logo");
    expect(getLogo("Impact")).toBe("impact-logo");
  });

  it("returns correct logo for known brand (multiple words)", () => {
    expect(getLogo("Canvas LMS")).toBe("canvas-logo");
    expect(getLogo("Mastery Connect")).toBe("mastery-logo");
    expect(getLogo("Impact by Instructure")).toBe("impact-logo");
  });

  it("returns correct logo for known brand (case insensitive)", () => {
    expect(getLogo("CANVAS")).toBe("canvas-logo");
    expect(getLogo("canvas")).toBe("canvas-logo");
    expect(getLogo("cAnVaS")).toBe("canvas-logo");
  });

  it("returns instructure logo for unknown brand", () => {
    expect(getLogo("UnknownBrand")).toBe("instructure-logo");
    expect(getLogo("Other LMS")).toBe("instructure-logo");
  });

  it("returns instructure logo for empty string", () => {
    expect(getLogo("")).toBe("instructure-logo");
  });

  it("trims spaces and returns correct logo", () => {
    expect(getLogo(" Canvas ")).toBe("canvas-logo");
    expect(getLogo("   Impact by Instructure")).toBe("impact-logo");
    expect(getLogo("Mastery Connect   ")).toBe("mastery-logo");
  });

  it("returns instructure logo for whitespace only", () => {
    expect(getLogo("   ")).toBe("instructure-logo");
  });
});
