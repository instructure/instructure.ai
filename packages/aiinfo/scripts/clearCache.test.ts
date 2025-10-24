import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFsWrite = vi.fn();
const mockLog = vi.fn();

function mockSuccessFs() {
	mockFsWrite.mockImplementation(() => {});
}

function applyMocks() {
	vi.mock("node:fs", () => ({
		default: { writeFileSync: mockFsWrite },
		writeFileSync: mockFsWrite,
	}));
	vi.mock("node:path", async (orig) => {
		const real = await orig();
		return real;
	});
	vi.mock("../utils", () => ({
		Log: mockLog,
	}));
}

describe("scripts/clearCache.mts", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		delete process.env.CLEAR;
		mockFsWrite.mockReset();
		mockLog.mockReset();
	});

	it("exports main and clearCache as the same function", async () => {
		mockSuccessFs();
		applyMocks();
		const mod = await import("./clearCache.mts");
		expect(typeof mod.main).toBe("function");
		expect(mod.clearCache).toBe(mod.main);
	});

	it("main writes empty checksum JSON", async () => {
		mockSuccessFs();
		applyMocks();
		const { main } = await import("./clearCache.mts");
		await main();
		expect(mockFsWrite).toHaveBeenCalledTimes(1);
		const [writtenPath, content] = mockFsWrite.mock.calls[0];
		expect(typeof writtenPath).toBe("string");
		expect(writtenPath.endsWith("/cache/checksum.json")).toBe(true);
		const parsed = JSON.parse(content as string);
		expect(parsed).toEqual({ CSV: "" });
		expect((content as string).includes('\n  "CSV": ""')).toBe(true);
	});

	it("main resolves without throwing", async () => {
		mockSuccessFs();
		applyMocks();
		const { main } = await import("./clearCache.mts");
		await expect(main()).resolves.not.toThrow();
	});
});
