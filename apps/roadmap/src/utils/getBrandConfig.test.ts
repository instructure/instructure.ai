// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchBrandConfig } from "./getBrandConfig";

let localGetBrandConfig: any = undefined;
let localFetchBrandConfig: any = undefined;

beforeEach(async () => {
  vi.resetModules();
  // Re-import after resetting modules
  const mod = await import("./getBrandConfig");
  ({ getBrandConfig: localGetBrandConfig, fetchBrandConfig: localFetchBrandConfig } = mod);
});

const mockUrl = "https://example.com/brand.json";
let postMessageSpy: any = undefined;
let fetchSpy: any = undefined;
const defaultMessageListener = (_event: MessageEvent) => {};
let messageListener: (event: MessageEvent) => void = defaultMessageListener;

const dispatchBrandConfigEvent = (
  url: string,
  useHighContrast: boolean,
  subject = "lti.postMessage",
) => {
  globalThis.dispatchEvent(
    new MessageEvent("message", {
      data: {
        pageSettings: {
          active_brand_config_json_url: url,
          use_high_contrast: useHighContrast,
        },
        subject,
      },
    }),
  );
};

const setupSpies = () => {
  postMessageSpy = vi.spyOn(globalThis.parent, "postMessage").mockImplementation(() => {});
  fetchSpy = vi.spyOn(globalThis, "fetch");
};

const resetModuleState = () => {
  // @ts-ignore
  globalThis.__test_cachedBrandConfig = undefined;
};

const cleanupListeners = () => {
  if (messageListener) {
    globalThis.removeEventListener("message", messageListener);
  }
  messageListener = defaultMessageListener;
};

describe("getBrandConfig", () => {
  beforeEach(() => {
    setupSpies();
    resetModuleState();
    cleanupListeners();
  });

  afterEach(() => {
    postMessageSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  it("posts lti.getPageSettings and resolves with brand config", async () => {
    const mockJson = { foo: "bar" };
    fetchSpy.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockJson),
    } as Partial<Response>);

    const promise = localGetBrandConfig();
    dispatchBrandConfigEvent(mockUrl, false);
    const result = await promise;
    expect(postMessageSpy).toHaveBeenCalledWith({ subject: "lti.getPageSettings" }, "*");
    expect(fetchSpy).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual(mockJson);
  });

  it("returns undefined if use_high_contrast is true", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ foo: "bar" }),
    } as Partial<Response>);

    const promise = localGetBrandConfig();
    dispatchBrandConfigEvent(mockUrl, true);
    const result = await promise;
    expect(result).toBeUndefined();
  });

  it("returns undefined if fetched brandConfig is undefined and use_high_contrast is false", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(undefined),
    } as Partial<Response>);

    const promise = localGetBrandConfig();
    dispatchBrandConfigEvent(mockUrl, false);
    const result = await promise;
    expect(result).toBeUndefined();
  });

  it("caches the result and returns cachedBrandConfig on subsequent calls", async () => {
    const mockJson = { foo: "bar" };
    fetchSpy.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockJson),
    } as Partial<Response>);

    // First call triggers fetch
    const promise = localGetBrandConfig();
    dispatchBrandConfigEvent(mockUrl, false);
    const result = await promise;
    expect(result).toEqual(mockJson);

    // Second call should return cached result immediately
    const cached = await localGetBrandConfig();
    const EXPECTED_CALLS = 1;
    expect(cached).toEqual(mockJson);
    expect(fetchSpy).toHaveBeenCalledTimes(EXPECTED_CALLS);
  });

  it("returns the same promise if called before event resolves", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ foo: "bar" }),
    } as Partial<Response>);
    const promise1 = localGetBrandConfig();
    const promise2 = localGetBrandConfig();
    dispatchBrandConfigEvent(mockUrl, false);
    await expect(promise1).resolves.toStrictEqual(await promise2);
  });

  it("ignores unrelated message events", async () => {
    fetchSpy.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ foo: "bar" }),
    } as Partial<Response>);
    const promise = localGetBrandConfig();
    // Send unrelated event
    dispatchBrandConfigEvent(mockUrl, false, "other");
    // Now send the real event
    dispatchBrandConfigEvent(mockUrl, false);
    const result = await promise;
    expect(result).toEqual({ foo: "bar" });
  });
});

describe("fetchBrandConfig", () => {
  const mockUrl = "https://example.com/brand.json";
  let fetchSpy: any = undefined;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("fetches the given URL and returns parsed JSON", async () => {
    const mockJson = { foo: "bar" };
    fetchSpy.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockJson),
    } as Partial<Response>);

    const result = await localFetchBrandConfig(mockUrl);
    expect(fetchSpy).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual(mockJson);
  });

  it("returns an empty object if fetch throws", async () => {
    fetchSpy.mockRejectedValueOnce(new Error("network error"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await localFetchBrandConfig(mockUrl);
    expect(result).toEqual({});
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to fetch or parse brand config:",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it("returns an empty object if response.json throws", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: vi.fn().mockRejectedValueOnce(new Error("bad json")),
    } as Partial<Response>);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await fetchBrandConfig(mockUrl);
    expect(result).toEqual({});
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to fetch or parse brand config:",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});
