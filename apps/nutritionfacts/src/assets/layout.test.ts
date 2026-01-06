import { describe, expect, it } from "vitest";
import type { PageLayout } from "../types";
import { DefaultLayout, Layout } from "./layout";

describe("layout", () => {
  it("should correctly assign all true properties", () => {
    const input: PageLayout = {
      copyright: true,
      disclaimer: true,
      revision: true,
    };
    const layout = new Layout(input);
    expect(layout.copyright).toBeTruthy();
    expect(layout.disclaimer).toBeTruthy();
    expect(layout.revision).toBeTruthy();
  });

  it("should correctly assign all false properties", () => {
    const input: PageLayout = {
      copyright: false,
      disclaimer: false,
      revision: false,
    };
    const layout = new Layout(input);
    expect(layout.copyright).toBeFalsy();
    expect(layout.disclaimer).toBeFalsy();
    expect(layout.revision).toBeFalsy();
  });

  it("should correctly assign mixed property values", () => {
    const input: PageLayout = {
      copyright: true,
      disclaimer: false,
      revision: true,
    };
    const layout = new Layout(input);
    expect(layout.copyright).toBeTruthy();
    expect(layout.disclaimer).toBeFalsy();
    expect(layout.revision).toBeTruthy();
  });

  it("defaultLayout should have all properties true", () => {
    expect(DefaultLayout.copyright).toBeTruthy();
    expect(DefaultLayout.disclaimer).toBeTruthy();
    expect(DefaultLayout.revision).toBeTruthy();
  });
});
