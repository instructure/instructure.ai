import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFsWrite = vi.fn();
const mockFsRead = vi.fn(() => "");
const mockLog = vi.fn();
const mockWriteChangelog = vi.fn();
const mockFetch = vi.fn();

function hashValue(data: string) {
	return createHash("shake128", { outputLength: 32 })
		.update(JSON.stringify(data))
		.digest("hex");
}
function hashEntry(entry: string[]) {
	return hashValue(JSON.stringify(entry));
}

interface MockOptions {
	oldCSV: string;
	newCSV: string;
	sideEffect?: boolean;
	ci?: boolean;
	fetchThrows?: boolean;
}
const cacheState = {
	cache: "",
	checksum: {} as Record<string, string>,
};
vi.mock("../cache", () => cacheState);

let originalArg1: string | undefined;

beforeEach(() => {
	vi.resetModules();
	vi.clearAllMocks();
	mockFsWrite.mockReset();
	mockLog.mockReset();
	mockWriteChangelog.mockReset();
	mockFetch.mockReset();
	delete process.env.UPDATE;
	delete process.env.CI;
	delete process.env.VERBOSE_UPDATE;
	if (!originalArg1) originalArg1 = process.argv[1];
	process.argv[1] = originalArg1 ?? "";
});

// Helper to force direct invocation semantics for side‑effect cases
function simulateDirectInvocation() {
	// Absolute path the module will compare against
	const modulePath = new URL("./updateCache.mts", import.meta.url).pathname;
	process.argv[1] = modulePath;
}

function applyMocks(opts: MockOptions) {
	const {
		oldCSV,
		newCSV,
		sideEffect = false,
		ci = false,
		fetchThrows = false,
	} = opts;

	// Derive entries as arrays (split lines & commas)
	const parseRaw = (raw: string) =>
		raw
			.trim()
			.split("\n")
			.filter(Boolean)
			.map((l) => l.split(","));
	const oldEntries = parseRaw(oldCSV);
	const oldChecksums: Record<string, string> = {
		csv: hashValue(oldCSV),
	};
	for (const entry of oldEntries) {
		oldChecksums[entry[0]] = hashEntry(entry);
	}

	cacheState.cache = oldCSV;
	cacheState.checksum = oldChecksums;

	mockLog.mockImplementation(() => {});
	mockWriteChangelog.mockImplementation(() => {
		return { success: true };
	});

	vi.mock("../utils", () => ({
		CSVURL: "https://example.com/cache.csv",
		entryToObj: (arr: string[]) => ({ raw: arr, uid: arr[0] }),
		Log: mockLog,
		writeBarrel: vi.fn(),
		writeChangelog: mockWriteChangelog,
		writeEntry: vi.fn(),
	}));

	vi.mock("node:fs", () => ({
		default: {
			existsSync: () => true,
			readFileSync: mockFsRead,
			writeFileSync: mockFsWrite,
		},
		existsSync: () => true,
		readFileSync: mockFsRead,
		writeFileSync: mockFsWrite,
	}));

	vi.mock("papaparse", async (orig) => {
		const real = await orig();
		return real;
	});

	mockFetch.mockImplementation(async () => {
		if (fetchThrows) {
			throw new Error("fetch failed");
		}
		return {
			text: async () => newCSV,
		};
	});
	global.fetch = mockFetch;

	if (sideEffect) {
		process.env.UPDATE = "1";
		process.env.VERBOSE_UPDATE = "1";
		simulateDirectInvocation();
	}
	if (ci) process.env.CI = "1";
}

async function flushMicrotasks() {
	await Promise.resolve();
	await new Promise((r) => setTimeout(r, 0));
}

// Removed duplicate beforeEach

describe("updateCache.mts parseCSV", () => {
	it("parseCSV parses CSV lines into array entries", async () => {
		applyMocks({
			newCSV: "uid1,name1,desc1",
			oldCSV: "uid1,name1,desc1",
		});
		const mod = await import("./updateCache.mts");
		const sample = "a,b,c\nd,e,f";
		const result = mod.parseCSV(sample);
		expect(result.raw).toBe(sample);
		expect(result.parsed).toEqual([
			["a", "b", "c"],
			["d", "e", "f"],
		]);
	});
});

// Removed: main behavior without side-effect tests (writeEntries/barrel logic)

describe("side-effect import with UPDATE env", () => {
	it("exits with code 0 when cache updated", async () => {
		const oldCSV = "uid1,name1,desc1";
		const newCSV = "uid1,name1,desc1-mod";
		applyMocks({ newCSV, oldCSV, sideEffect: true });
		const exitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation((() => undefined) as unknown as typeof process.exit);
		const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await import("./updateCache.mts");
		await flushMicrotasks();
		expect(exitSpy).toHaveBeenCalledWith(0);
		expect(
			logSpy.mock.calls.some((c) => c[0].includes('"cacheUpdated":true')),
		).toBe(true);
		exitSpy.mockRestore();
		logSpy.mockRestore();
	});

	// Removed: error case for writeEntry failure (no longer relevant)
});

describe("checksum structural assertions", () => {
	it("produces 64-char hex checksums for entries and csv", async () => {
		const oldCSV = "uid1,name1,desc1";
		const newCSV = "uid1,name1,desc1-mod";
		applyMocks({ newCSV, oldCSV });
		const { main } = await import("./updateCache.mts");
		await main();
		const checksumCall = mockFsWrite.mock.calls.find((c) =>
			String(c[0]).endsWith("checksum.json"),
		);
		const parsed = JSON.parse(checksumCall?.[1] as string) as Record<
			string,
			string
		>;
		for (const [_k, v] of Object.entries(parsed)) {
			expect(typeof v).toBe("string");
			expect(v.length).toBe(64);
			expect(/^[0-9a-f]+$/.test(v)).toBe(true);
		}
	});
});
