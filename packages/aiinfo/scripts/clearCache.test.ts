import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFsWrite = vi.fn();
const mockLog = vi.fn();

function mockSuccessFs() {
	mockFsWrite.mockImplementation(() => {});
}
function mockFailFs() {
	mockFsWrite.mockImplementation(() => {
		throw new Error("write fail");
	});
}

function applyMocks() {
	vi.mock("node:fs", () => ({
		default: { writeFileSync: mockFsWrite },
		writeFileSync: mockFsWrite,
	}));
	vi.mock("node:path", async (orig) => {
		// Use real path for realistic absolute resolution
		const real = await orig();
		return real;
	});
	vi.mock("../utils", () => ({
		Log: mockLog,
	}));
}

async function flushMicrotasks() {
	await Promise.resolve();
	await new Promise((r) => setTimeout(r, 0));
}

describe("scripts/clearCache.mts", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		delete process.env.CLEAR;
		mockFsWrite.mockReset();
		mockLog.mockReset();
	});

	it("exports main and ClearCache as the same function", async () => {
		mockSuccessFs();
		applyMocks();
		const mod = await import("./clearCache.mts");
		expect(typeof mod.main).toBe("function");
		expect(mod.ClearCache).toBe(mod.main);
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
		// Pretty JSON: verify indentation (contains newline + two spaces)
		expect((content as string).includes('\n  "CSV": ""')).toBe(true);
	});

	it("main resolves without throwing", async () => {
		mockSuccessFs();
		applyMocks();
		const { main } = await import("./clearCache.mts");
		await expect(main()).resolves.not.toThrow();
	});

	it("runs side-effect when CLEAR is set (success path)", async () => {
		process.env.CLEAR = "1";
		mockSuccessFs();
		applyMocks();
		const exitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation((() => undefined) as unknown as typeof process.exit);
		await import("./clearCache.mts");
		await flushMicrotasks();
		expect(mockFsWrite).toHaveBeenCalledTimes(1);
		expect(exitSpy).not.toHaveBeenCalled();
		expect(mockLog).not.toHaveBeenCalled();
		exitSpy.mockRestore();
	});

	it("logs error and exits with code 2 when write fails under CLEAR", async () => {
		process.env.CLEAR = "1";
		mockFailFs();
		applyMocks();
		const exitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation((() => undefined) as unknown as typeof process.exit);
		await import("./clearCache.mts");
		await flushMicrotasks();
		expect(mockFsWrite).toHaveBeenCalledTimes(1);
		expect(mockLog).toHaveBeenCalledTimes(1);
		const [arg] = mockLog.mock.calls[0];
		expect(arg.color).toBe("redBright");
		expect(Array.isArray(arg.message)).toBe(true);
		expect(
			(arg.message as unknown[]).some((m) => String(m).includes("write fail")),
		).toBe(true);
		expect(exitSpy).toHaveBeenCalledWith(2);
		exitSpy.mockRestore();
	});
});
