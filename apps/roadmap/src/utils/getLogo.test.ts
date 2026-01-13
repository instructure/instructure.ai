// @vitest-environment node

import type React from "react";
import type { SVGProps } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

let getLogo: (brand: string) => React.FC<SVGProps<SVGSVGElement>>;

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
    // @ts-ignore
    getLogo = module.default;
    expect(getLogo).toBeDefined();
  });

  it("returns correct logo for known brand (single word)", () => {
    expect(getLogo("Canvas")).toBe(mockLogos.canvas);
    expect(getLogo("Instructure")).toBe(mockLogos.instructure);
    expect(getLogo("Mastery")).toBe(mockLogos.mastery);
    expect(getLogo("Impact")).toBe(mockLogos.impact);
  });

  it("returns correct logo for known brand (multiple words)", () => {
    expect(getLogo("Canvas LMS")).toBe(mockLogos.canvas);
    expect(getLogo("Mastery Connect")).toBe(mockLogos.mastery);
    expect(getLogo("Impact by Instructure")).toBe(mockLogos.impact);
  });

  it("returns correct logo for known brand (case insensitive)", () => {
    expect(getLogo("CANVAS")).toBe(mockLogos.canvas);
    expect(getLogo("canvas")).toBe(mockLogos.canvas);
    expect(getLogo("cAnVaS")).toBe(mockLogos.canvas);
  });

  it("returns instructure logo for unknown brand", () => {
    expect(getLogo("UnknownBrand")).toBe(mockLogos.instructure);
    expect(getLogo("Other LMS")).toBe(mockLogos.instructure);
  });

  it("returns instructure logo for empty string", () => {
    expect(getLogo("")).toBe(mockLogos.instructure);
  });

  it("trims spaces and returns correct logo", () => {
    expect(getLogo(" Canvas ")).toBe(mockLogos.canvas);
    expect(getLogo("   Impact by Instructure")).toBe(mockLogos.impact);
    expect(getLogo("Mastery Connect   ")).toBe(mockLogos.mastery);
  });

  it("returns instructure logo for whitespace only", () => {
    expect(getLogo("   ")).toBe(mockLogos.instructure);
  });
});
