import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFsWrite = vi.fn();
const mockFsRead = vi.fn(() => ""); // Return empty string or mock CSV content
const mockLog = vi.fn();
const mockWriteEntry = vi.fn();
const mockWriteBarrel = vi.fn();
const mockWriteChangelog = vi.fn();
const mockFetch = vi.fn();
let lastOldChecksums: Record<string, string> = {};
let capturedChangelogArgs: unknown = null;

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
	writeEntryThrows?: boolean;
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
	mockWriteEntry.mockReset();
	mockWriteBarrel.mockReset();
	mockWriteChangelog.mockReset();
	mockFetch.mockReset();
	capturedChangelogArgs = null;
	delete process.env.UPDATE;
	delete process.env.CI;
	delete process.env.VERBOSE_UPDATE;
	// FIX: Avoid non-null assertion by using a fallback value
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
		writeEntryThrows = false,
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
	lastOldChecksums = oldChecksums;

	cacheState.cache = oldCSV;
	cacheState.checksum = oldChecksums;

	mockLog.mockImplementation(() => {});
	mockWriteEntry.mockImplementation((e) => {
		if (writeEntryThrows) {
			throw new Error("writeEntry failure");
		}
		return e;
	});
	mockWriteBarrel.mockImplementation(() => {});
	mockWriteChangelog.mockImplementation((args) => {
		capturedChangelogArgs = args;
		return { success: true };
	});

	vi.mock("../utils", () => ({
		CSVURL: "https://example.com/cache.csv",
		entryToObj: (arr: string[]) => ({ raw: arr, uid: arr[0] }),
		Log: mockLog,
		writeBarrel: mockWriteBarrel,
		writeChangelog: mockWriteChangelog,
		writeEntry: mockWriteEntry,
	}));

	vi.mock("node:fs", () => ({
		default: {
			writeFileSync: mockFsWrite,
			existsSync: () => true,
			readFileSync: mockFsRead,
		},
		writeFileSync: mockFsWrite,
		existsSync: () => true,
		readFileSync: mockFsRead,
	}));

	vi.mock("papaparse", async (orig) => {
		// Use real papaparse for actual parsing
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
		// ensure JSON output expectation still valid
		process.env.VERBOSE_UPDATE = "1";
		simulateDirectInvocation();
	}
	if (ci) process.env.CI = "1";
}

async function flushMicrotasks() {
	await Promise.resolve();
	await new Promise((r) => setTimeout(r, 0));
}

beforeEach(() => {
	vi.resetModules();
	vi.clearAllMocks();
	mockFsWrite.mockReset();
	mockLog.mockReset();
	mockWriteEntry.mockReset();
	mockWriteBarrel.mockReset();
	mockWriteChangelog.mockReset();
	mockFetch.mockReset();
	capturedChangelogArgs = null;
	delete process.env.UPDATE;
	delete process.env.CI;
	delete process.env.VERBOSE_UPDATE;
	// FIX: Avoid non-null assertion by using a fallback value
	if (!originalArg1) originalArg1 = process.argv[1];
	process.argv[1] = originalArg1 ?? "";
});

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

describe("main behavior without side-effect", () => {
	it("returns true and updates cache when CSV changed", async () => {
		const oldCSV = "uid1,name1,desc1\nuid2,name2,desc2";
		const newCSV = "uid1,name1,desc1-mod\nuid2,name2,desc2";
		applyMocks({ newCSV, oldCSV });
		const { main } = await import("./updateCache.mts");
		const updated = await main();
		expect(updated).toBe(true);

		// Writes: cache.csv + checksum.json
		const writePaths = mockFsWrite.mock.calls.map((c) => c[0]);
		expect(writePaths.some((p) => String(p).endsWith("cache.csv"))).toBe(true);
		expect(writePaths.some((p) => String(p).endsWith("checksum.json"))).toBe(
			true,
		);

		// checksum.json content assertions
		const checksumCall = mockFsWrite.mock.calls.find((c) =>
			String(c[0]).endsWith("checksum.json"),
		);
		expect(checksumCall).toBeTruthy();
		const jsonContent = checksumCall?.[1] as string;
		const parsed = JSON.parse(jsonContent);
		expect(parsed.csv).toBeDefined();
		expect(parsed.uid1).toBeDefined();
		expect(parsed.uid2).toBeDefined();
		// Check hex length (64 chars for 32-byte shake128)
		expect(parsed.uid1.length).toBe(64);
		// uid1 changed
		expect(parsed.uid1).not.toBe(lastOldChecksums.uid1);

		// Entries & barrel & changelog
		expect(mockWriteEntry).toHaveBeenCalledTimes(2);
		expect(mockWriteBarrel).toHaveBeenCalledTimes(1);
		expect(mockWriteChangelog).toHaveBeenCalledTimes(1);

		// FIX: Type capturedChangelogArgs so TypeScript knows its shape
		type ChangelogArgs = { changedEntries: unknown[] };
		const args = capturedChangelogArgs as ChangelogArgs;
		expect(args.changedEntries.length).toBeGreaterThan(0);

		// Log includes Changelog updated
		const logMessages = mockLog.mock.calls.map((c) => c[0]);
		expect(
			logMessages.some(
				(m) =>
					typeof m === "object" &&
					String(m.message).includes("Changelog updated"),
			),
		).toBe(true);
	});

	it("updates checksum for a newly added entry", async () => {
		const oldCSV = "uid1,name1,desc1\nuid2,name2,desc2";
		const newCSV = "uid1,name1,desc1\nuid2,name2,desc2\nuid3,name3,desc3";
		applyMocks({ newCSV, oldCSV });
		const { main } = await import("./updateCache.mts");
		const updated = await main();
		expect(updated).toBe(true);
		const checksumCall = mockFsWrite.mock.calls.find((c) =>
			String(c[0]).endsWith("checksum.json"),
		);
		const parsed = JSON.parse(checksumCall?.[1] as string);
		expect(parsed.uid3).toBeDefined();
		expect(parsed.uid3.length).toBe(64);
		expect(mockWriteEntry).toHaveBeenCalledTimes(3);
	});
});

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

	it("exits with code 2 on update error (writeEntry failure)", async () => {
		const oldCSV = "uid1,name1,desc1";
		const newCSV = "uid1,name1,desc1-mod";
		applyMocks({ newCSV, oldCSV, sideEffect: true, writeEntryThrows: true });
		const exitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation((() => undefined) as unknown as typeof process.exit);
		await import("./updateCache.mts");
		await flushMicrotasks();
		expect(exitSpy).toHaveBeenCalledWith(2);
		exitSpy.mockRestore();
	});
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
