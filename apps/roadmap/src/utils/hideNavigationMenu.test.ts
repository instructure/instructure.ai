// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let hideNavigationMenu: (() => void) | undefined = undefined;

const setupSpies = () => ({
  postMessageSpy: vi.spyOn(globalThis.parent, "postMessage").mockImplementation(() => {}),
});

const importModule = async () => {
  const mod = await import("./hideNavigationMenu");
  hideNavigationMenu = mod.default;
};

describe("hideNavigationMenu", () => {
  let postMessageSpy: any = undefined;

  beforeEach(async () => {
    const spies = setupSpies();
    ({ postMessageSpy } = spies);
    await importModule();
  });

  afterEach(() => {
    postMessageSpy.mockRestore();
  });

  it("should post message to parent window with hideNavigationMenu subject", () => {
    hideNavigationMenu!();

    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        subject: "hideNavigationMenu",
      },
      "*",
    );
  });

  it("should post message to any origin", () => {
    hideNavigationMenu!();

    expect(postMessageSpy).toHaveBeenCalledWith(expect.any(Object), "*");
  });

  it("should call postMessage exactly once", () => {
    hideNavigationMenu!();

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
  });

  it("should be callable multiple times", () => {
    hideNavigationMenu!();
    hideNavigationMenu!();
    hideNavigationMenu!();

    expect(postMessageSpy).toHaveBeenCalledTimes(3);
    expect(postMessageSpy).toHaveBeenNthCalledWith(1, { subject: "hideNavigationMenu" }, "*");
    expect(postMessageSpy).toHaveBeenNthCalledWith(2, { subject: "hideNavigationMenu" }, "*");
    expect(postMessageSpy).toHaveBeenNthCalledWith(3, { subject: "hideNavigationMenu" }, "*");
  });

  it("should not throw errors when called", () => {
    expect(() => hideNavigationMenu!()).not.toThrow();
  });
});
