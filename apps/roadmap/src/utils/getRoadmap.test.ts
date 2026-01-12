// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let getRoadmap = undefined;
let paramsToPendo = undefined;
let getRoadmapModule = undefined;

const mockRoadmap = { features: ["feature1", "feature2"] };
vi.mock("./paramsToPendo", () => ({
  default: vi.fn(() => mockRoadmap),
}));

const simulateMessageEvent = (handler: any, value: any) => {
  handler({ data: value });
};

const setupSpies = () => ({
  addEventListenerSpy: vi.spyOn(globalThis, "addEventListener"),
  postMessageSpy: vi.spyOn(globalThis.parent, "postMessage").mockImplementation(() => {}),
  removeEventListenerSpy: vi.spyOn(globalThis, "removeEventListener"),
});

const importModulesAndResetCache = async () => {
  const getRoadmapImport = await import("./getRoadmap");
  getRoadmap = getRoadmapImport.default;
  let mod = await import("./paramsToPendo");
  paramsToPendo = mod.default;
  const roadmapMod = await import("./getRoadmap");
  getRoadmapModule = {
    get cachedRoadmap() {
      return roadmapMod.cachedRoadmap;
    },
    set cachedRoadmap(val) {
      roadmapMod.cachedRoadmap = val;
    },
    get roadmapPromise() {
      return roadmapMod.roadmapPromise;
    },
    set roadmapPromise(val) {
      roadmapMod.roadmapPromise = val;
    },
  };
  getRoadmapModule.cachedRoadmap = undefined;
  getRoadmapModule.roadmapPromise = undefined;
  vi.mocked(paramsToPendo).mockClear();
};

const NEXT_TICK_TIMEOUT_MS = 0;

const captureHandler = (spy: any) => {
  let capturedHandler: any = undefined;
  spy.mockImplementation((_eventType: string, fn: any) => {
    capturedHandler = fn;
  });
  return () => capturedHandler;
};

const testUndefinedEventDataValue = async (addEventListenerSpy: any, paramsToPendo: any) => {
  getRoadmapModule.cachedRoadmap = undefined;
  getRoadmapModule.roadmapPromise = undefined;

  const getHandler = captureHandler(addEventListenerSpy);
  getRoadmap();

  await new Promise((resolve) => setTimeout(resolve, NEXT_TICK_TIMEOUT_MS));

  const handler = getHandler();
  if (typeof handler !== "function") {
    throw new Error("handler was not set by addEventListenerSpy");
  }
  handler({ data: {} });

  const WAIT_TIMEOUT_MS = 10;
  await new Promise((resolve) => setTimeout(resolve, WAIT_TIMEOUT_MS));
  expect(paramsToPendo).not.toHaveBeenCalled();
};

const assertPostMessageAndListener = (
  handler: any,
  promise: Promise<any>,
  spies: { postMessageSpy: any; addEventListenerSpy: any },
) => {
  expect(spies.postMessageSpy).toHaveBeenCalledWith({ type: "getRoadmap" }, "*");
  expect(spies.addEventListenerSpy).toHaveBeenCalledWith("message", expect.any(Function));
  simulateMessageEvent(handler, { value: "some-value" });
  return promise;
};

describe("getRoadmap", () => {
  let postMessageSpy: any = undefined;
  let addEventListenerSpy: any = undefined;
  let removeEventListenerSpy: any = undefined;

  beforeEach(async () => {
    const spies = setupSpies();
    ({ postMessageSpy } = spies);
    ({ addEventListenerSpy } = spies);
    ({ removeEventListenerSpy } = spies);
    await importModulesAndResetCache();
  });

  afterEach(() => {
    postMessageSpy.mockRestore();
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("should post message and resolve with roadmap when event received", async () => {
    const getHandler = captureHandler(addEventListenerSpy);
    const promise = getRoadmap();

    await new Promise((resolve) => setTimeout(resolve, NEXT_TICK_TIMEOUT_MS));

    const handler = getHandler();
    await assertPostMessageAndListener(handler, promise, { addEventListenerSpy, postMessageSpy });

    const result = await promise;
    expect(paramsToPendo).toHaveBeenCalledWith("some-value");
    expect(result).toEqual(mockRoadmap);
    expect(removeEventListenerSpy).toHaveBeenCalledWith("message", handler);
  });

  it("should return cached roadmap if available", async () => {
    getRoadmapModule.cachedRoadmap = mockRoadmap;

    const result = await getRoadmap();
    expect(result).toEqual(mockRoadmap);
    expect(postMessageSpy).not.toHaveBeenCalled();
  });
});
