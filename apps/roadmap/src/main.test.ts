// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";

// Mock react-dom/client for ESM
const renderSpy = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderSpy }));
vi.mock("react-dom/client", () => ({
  createRoot: createRootMock,
}));

// Mock App
vi.mock("./app", () => ({
  __esModule: true,
  default: function App() {
    return React.createElement("div", { "data-testid": "app" });
  },
}));

describe("main.tsx", () => {
  let rootElem: HTMLElement | undefined = undefined;

  beforeEach(() => {
    vi.resetModules();
    // Remove any existing root element
    const existing = document.getElementById("root");
    if (existing) {
      existing.remove();
    }
    // Add a new root element
    rootElem = document.createElement("div");
    rootElem.id = "root";
    document.body.appendChild(rootElem);
    renderSpy.mockClear();
    createRootMock.mockClear();
  });

  afterEach(() => {
    const elem = document.getElementById("root");
    if (elem) {
      elem.remove();
    }
  });

  it("throws an error if root element is not found", async () => {
    // Remove root element before import
    if (rootElem?.parentNode) {
      rootElem.parentNode.removeChild(rootElem);
    }
    vi.resetModules();
    // Importing should throw
    await expect(import("./main")).rejects.toThrow("Root element not found");
  });

  it("calls createRoot with the root element", async () => {
    await import("./main");
    expect(createRootMock).toHaveBeenCalledWith(rootElem);
  });

  it("renders StrictMode > App", async () => {
    await import("./main");
    expect(renderSpy).toHaveBeenCalledTimes(1);

    const [[rendered]] = renderSpy.mock.calls;
    expect(React.isValidElement(rendered)).toBeTruthy();
    expect(rendered.type).toBe(React.StrictMode);

    const app = React.Children.only(rendered.props.children);
    expect(
      app.type.name || app.type.displayName || (typeof app.type === "string" && app.type) || "",
    ).toMatch(/App/);
  });
});
