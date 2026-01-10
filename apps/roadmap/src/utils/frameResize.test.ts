// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import frameResize from "./frameResize";

describe("frameResize", () => {
  const MOCK_SCROLL_HEIGHT = 1234;
  let postMessageSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(window.parent, "postMessage");
  let originalScrollHeight: PropertyDescriptor | undefined = undefined;

  beforeEach(() => {
    postMessageSpy = vi.spyOn(window.parent, "postMessage").mockImplementation(() => {});
    // Save and mock scrollHeight
    originalScrollHeight = Object.getOwnPropertyDescriptor(
      document.documentElement,
      "scrollHeight",
    );
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      get: () => MOCK_SCROLL_HEIGHT,
    });
  });

  afterEach(() => {
    postMessageSpy.mockRestore();
    // Restore scrollHeight
    if (originalScrollHeight) {
      Object.defineProperty(document.documentElement, "scrollHeight", originalScrollHeight);
    } else {
      // TypeScript does not include scrollHeight as a writable property, but for testing we can safely cast to unknown and then to the correct type
      // oxlint-disable-next-line no-unsafe-type-assertion
      delete (document.documentElement as unknown as { scrollHeight?: number }).scrollHeight;
    }
  });

  it("posts a message to the parent window with correct subject and height", () => {
    frameResize();
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        height: MOCK_SCROLL_HEIGHT,
        subject: "lti.frameResize",
      },
      "*",
    );
  });

  it("uses the current document.documentElement.scrollHeight", () => {
    const TEST_SCROLL_HEIGHT = 5678;
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      get: () => TEST_SCROLL_HEIGHT,
    });
    frameResize();
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        height: TEST_SCROLL_HEIGHT,
        subject: "lti.frameResize",
      },
      "*",
    );
  });

  it("always uses subject 'lti.frameResize'", () => {
    frameResize();
    const FIRST_CALL = 0;
    const MESSAGE_ARG = 0;
    const call = postMessageSpy.mock.calls[FIRST_CALL];
    const callArg = call[MESSAGE_ARG];
    if (
      typeof callArg === "object" &&
      callArg !== null &&
      "subject" in callArg &&
      typeof (callArg as Record<string, unknown>).subject === "string"
    ) {
      expect((callArg as Record<string, unknown>).subject).toBe("lti.frameResize");
    } else {
      throw new Error("callArg is not the expected message object");
    }
  });

  it("always posts to '*'", () => {
    frameResize();
    const FIRST_CALL = 0;
    const TARGET_ORIGIN_ARG = 1;
    const call = postMessageSpy.mock.calls[FIRST_CALL];
    const targetOrigin = call[TARGET_ORIGIN_ARG];
    expect(targetOrigin).toBe("*");
  });
});
