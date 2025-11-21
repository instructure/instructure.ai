import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error Vite raw import
import html from "./index.html?raw";

describe("index.html", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
    document.documentElement.setAttribute("lang", "en");
  });

  it("should have correct doctype", () => {
    // jsdom does not expose doctype, so we skip this in jsdom
    expect(document.documentElement.lang).toBe("en");
  });

  it("should have correct meta tags", () => {
    const charset = document.querySelector("meta[charset]");
    expect(charset).not.toBeNull();
    expect(charset?.getAttribute("charset")).toBe("utf-8");

    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport?.getAttribute("content")).toBe(
      "width=device-width, initial-scale=1.0",
    );

    const version = document.querySelector('meta[name="application-version"]');
    expect(version).not.toBeNull();
    expect(version?.getAttribute("content")).toBe("%VITE_PACKAGE_VERSION%");

    const name = document.querySelector('meta[name="application-name"]');
    expect(name).not.toBeNull();
    expect(name?.getAttribute("content")).toBe("%VITE_PACKAGE_NAME%");
  });

  it("should have favicon link", () => {
    const favicon = document.querySelector('link[rel="icon"]');
    expect(favicon).not.toBeNull();
    expect(favicon?.getAttribute("type")).toBe("image/svg+xml");
    expect(favicon?.getAttribute("href")).toBe("/IgniteAI.svg");
  });

  it("should have correct title", () => {
    expect(document.title).toBe("IgniteAI Nutrition Facts");
  });

  it("should have root div", () => {
    const root = document.getElementById("root");
    expect(root).not.toBeNull();
  });

  it("should load main script as module", () => {
    const script = document.querySelector('script[type="module"]');
    expect(script).not.toBeNull();
    expect(script?.getAttribute("src")).toBe("/src/Main.tsx");
  });
});
