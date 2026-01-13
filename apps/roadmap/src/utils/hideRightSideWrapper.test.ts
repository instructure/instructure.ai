// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let hideRightSideWrapper: (() => void) | undefined = undefined;

const setupSpies = () => ({
  postMessageSpy: vi.spyOn(globalThis.parent, "postMessage").mockImplementation(() => {}),
});

const importModule = async () => {
  const mod = await import("./hideRightSideWrapper");
  hideRightSideWrapper = mod.default;
};

describe("hideRightSideWrapper", () => {
  let postMessageSpy: any = undefined;

  beforeEach(async () => {
    const spies = setupSpies();
    ({ postMessageSpy } = spies);
    await importModule();
  });

  afterEach(() => {
    postMessageSpy.mockRestore();
  });

  it("should post message to parent window with lti.hideRightSideWrapper subject", () => {
    hideRightSideWrapper!();

    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        subject: "lti.hideRightSideWrapper",
      },
      "*",
    );
  });

  it("should post message to any origin", () => {
    hideRightSideWrapper!();

    expect(postMessageSpy).toHaveBeenCalledWith(expect.any(Object), "*");
  });

  it("should call postMessage exactly once per invocation", () => {
    hideRightSideWrapper!();

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
  });

  it("should be callable multiple times", () => {
    hideRightSideWrapper!();
    hideRightSideWrapper!();
    hideRightSideWrapper!();

    expect(postMessageSpy).toHaveBeenCalledTimes(3);
    expect(postMessageSpy).toHaveBeenNthCalledWith(1, { subject: "lti.hideRightSideWrapper" }, "*");
    expect(postMessageSpy).toHaveBeenNthCalledWith(2, { subject: "lti.hideRightSideWrapper" }, "*");
    expect(postMessageSpy).toHaveBeenNthCalledWith(3, { subject: "lti.hideRightSideWrapper" }, "*");
  });

  it("should not throw errors when called", () => {
    expect(() => hideRightSideWrapper!()).not.toThrow();
  });

  it("should send message with correct structure", () => {
    hideRightSideWrapper!();

    const callArgs = postMessageSpy.mock.calls[0];
    expect(callArgs[0]).toHaveProperty("subject");
    expect(callArgs[0].subject).toBe("lti.hideRightSideWrapper");
    expect(Object.keys(callArgs[0])).toHaveLength(1);
  });

  it("should target parent window specifically", () => {
    hideRightSideWrapper!();

    expect(postMessageSpy).toHaveBeenCalledOnce();
    expect(vi.mocked(window.parent.postMessage)).toBe(postMessageSpy);
  });
});
