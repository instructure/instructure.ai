// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchBrandConfig } from "./getBrandConfig";

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

    const result = await fetchBrandConfig(mockUrl);
    expect(fetchSpy).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual(mockJson);
  });

  it("returns an empty object if fetch throws", async () => {
    fetchSpy.mockRejectedValueOnce(new Error("network error"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await fetchBrandConfig(mockUrl);
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
