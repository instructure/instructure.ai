import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ChangedEntry } from "../types";
import { writeChangelog } from "./writeChangelog";

const existsSync = vi.spyOn(fs, "existsSync");
const readFileSync = vi.spyOn(fs, "readFileSync");
const writeFileSync = vi.spyOn(fs, "writeFileSync");

let lastWrittenPath: string | null;
let lastWrittenContent = "";
// Capture writes
writeFileSync.mockImplementation((p, c) => {
	lastWrittenPath = String(p);
	lastWrittenContent = String(c);
});

function makeChangedEntry(
	uid: string,
	{
		oldChecksum,
		newChecksum,
		oldEntry,
		newEntry,
	}: {
		oldChecksum?: string;
		newChecksum: string;
		oldEntry?: Record<string, unknown>;
		newEntry?: Record<string, unknown>;
	},
): ChangedEntry {
	return {
		newChecksum,
		newEntry,
		oldChecksum,
		oldEntry,
		uid,
	} as ChangedEntry;
}

beforeEach(() => {
	vi.clearAllMocks();
	lastWrittenContent = "";
	lastWrittenPath = undefined;
	existsSync.mockReturnValue(false);
	readFileSync.mockReturnValue("");
	// Reapply write capture after clearAllMocks (mock implementation was wiped)
	writeFileSync.mockImplementation((p, c) => {
		lastWrittenPath = String(p);
		lastWrittenContent = String(c);
	});
});

describe("writeChangelog", () => {
	it("returns undefined when there are no changed entries", () => {
		const result = writeChangelog({
			changedEntries: [],
			changelogPath: "CHANGELOG.md",
			csvSha: "sha123",
			dateStr: "2024-01-01",
		});
		expect(result).toBeUndefined();
		expect(writeFileSync).not.toHaveBeenCalled();
	});

	it("writes changelog for new entry showing all keys", () => {
		const entry = makeChangedEntry("uid-new", {
			newChecksum: "newSha",
			newEntry: {
				name: "Feature A",
				nested: { value: 1 },
			},
		});
		const result = writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "csvShaX",
			dateStr: "2024-02-02",
		});
		expect(result?.success).toBeTruthy();
		expect(result?.changelog).toContain("## 2024-02-02");
		expect(result?.changelog).toContain("### CSV");
		expect(result?.changelog).toContain("#### SHA");
		expect(result?.changelog).toContain("```diff\ncsvShaX\n```");
		expect(result?.changelog).toContain("### uid-new");
		expect(result?.changelog).toContain("#### name");
		expect(result?.changelog).toContain("#### nested");
		expect(writeFileSync).toHaveBeenCalledTimes(1);
		expect(lastWrittenContent.startsWith("# Changelog")).toBeTruthy();
	});

	it("includes diffs for changed entry with nested objects", () => {
		const entry = makeChangedEntry("uid-diff", {
			newChecksum: "newC",
			newEntry: {
				added: "value",
				name: "Feature",
				nested: { a: 99, b: 2, c: 3 },
			},
			oldChecksum: "oldC",
			oldEntry: {
				name: "Feature",
				nested: { a: 1, b: 2 },
			},
		});
		const result = writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "csvShaY",
			dateStr: "2024-03-03",
		});
		expect(result?.success).toBeTruthy();
		const c = result?.changelog ?? "";
		expect(c).toContain("### uid-diff");
		expect(c).toContain("#### nested.a");
		expect(c).toContain("#### nested.c");
		expect(c).toContain("#### added");
		expect(c).toContain("```diff");
		expect(c).toContain("+ 99");
		expect(c).toContain("- 1");
		expect(c).toContain("+ 3");
		expect(c).toContain("- undefined");
		expect(c).toContain('+ "value"');
	});

	it("unchanged entry only shows SHA section", () => {
		const obj = { name: "Same", nested: { x: 1 } };
		const entry = makeChangedEntry("uid-same", {
			newChecksum: "newSha",
			newEntry: obj,
			oldChecksum: "oldSha",
			oldEntry: obj,
		});
		const result = writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "csvShaZ",
			dateStr: "2024-04-04",
		});
		const c = result?.changelog ?? "";
		expect(c).toContain("### uid-same");
		expect(c).not.toMatch(/#### name:/);
		expect(c).not.toMatch(/#### nested.x:/);
	});

	it("prepends header when missing in existing file", () => {
		existsSync.mockReturnValue(true);
		readFileSync.mockReturnValue("Previous content");
		const entry = makeChangedEntry("uid1", {
			newChecksum: "nc1",
			newEntry: { name: "N1" },
		});
		writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "sha5",
			dateStr: "2024-05-05",
		});
		expect(writeFileSync).toHaveBeenCalled();
		expect(lastWrittenContent.startsWith("# Changelog")).toBeTruthy();
		expect(lastWrittenContent).toContain("## 2024-05-05");
		expect(lastWrittenContent).toContain("Previous content");
		const idxNew = lastWrittenContent.indexOf("## 2024-05-05");
		const idxPrev = lastWrittenContent.indexOf("Previous content");
		expect(idxNew).toBeLessThan(idxPrev);
	});

	it("inserts new section after existing header", () => {
		existsSync.mockReturnValue(true);
		readFileSync.mockReturnValue("# Changelog\n\n## 2024-01-01\n\nOld section");
		const entry = makeChangedEntry("uidX", {
			newChecksum: "ncX",
			newEntry: { name: "NX" },
		});
		writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "sha6",
			dateStr: "2024-06-06",
		});
		const content = lastWrittenContent;
		const headerIdx = content.indexOf("# Changelog");
		const newIdx = content.indexOf("## 2024-06-06");
		const oldIdx = content.indexOf("## 2024-01-01");
		expect(headerIdx).toBe(0);
		expect(newIdx).toBeGreaterThan(headerIdx);
		expect(oldIdx).toBeGreaterThan(newIdx);
	});

	it("handles multiple entries (new + changed)", () => {
		const e1 = makeChangedEntry("uidA", {
			newChecksum: "shaA",
			newEntry: { name: "A" },
		});
		const e2 = makeChangedEntry("uidB", {
			newChecksum: "newB",
			newEntry: { name: "B2", nested: { v: 1 } },
			oldChecksum: "oldB",
			oldEntry: { name: "B", nested: { v: 1 } },
		});
		const result = writeChangelog({
			changedEntries: [e1, e2],
			changelogPath: "CHANGELOG.md",
			csvSha: "sha7",
			dateStr: "2024-07-07",
		});
		const c = result?.changelog ?? "";
		expect(c).toMatch(/### uidA/);
		expect(c).toMatch(/### uidB/);
		expect(c).toContain("#### name");
	});

	it("captures added property diff (old undefined)", () => {
		const entry = makeChangedEntry("uidAdd", {
			newChecksum: "newAdd",
			newEntry: { base: 1, extra: "val" },
			oldChecksum: "oldAdd",
			oldEntry: { base: 1 },
		});
		const result = writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "sha8",
			dateStr: "2024-08-08",
		});
		expect(result?.changelog).toContain("#### extra");
		expect(result?.changelog).toContain('+ "val"');
		expect(result?.changelog).toContain("- undefined");
	});

	it("returns success false on write error", () => {
		writeFileSync.mockImplementation(() => {
			throw new Error("disk full");
		});
		const entry = makeChangedEntry("uidErr", {
			newChecksum: "shaErr",
			newEntry: { name: "Err" },
		});
		const result = writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "sha9",
			dateStr: "2024-09-09",
		});
		expect(result?.success).toBeFalsy();
		expect(result?.error).toBeInstanceOf(Error);
	});

	it("changelog output includes csv SHA", () => {
		const entry = makeChangedEntry("uidSha", {
			newChecksum: "newSha",
			newEntry: { name: "Feature" },
		});
		const result = writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "csvGlobalSha",
			dateStr: "2024-10-10",
		});
		expect(result).toBeDefined();
		expect(result?.changelog).toContain("#### SHA");
		expect(result?.changelog).toContain("```diff\ncsvGlobalSha\n```");
	});

	it("writes changelog", () => {
		const entry = makeChangedEntry("uid-new", {
			newChecksum: "newSha",
			newEntry: {
				name: "Feature A",
				nested: { value: 1 },
			},
		});
		writeChangelog({
			changedEntries: [entry],
			changelogPath: "CHANGELOG.md",
			csvSha: "csvShaX",
			dateStr: "2024-02-02",
		});
		expect(lastWrittenPath).toMatch(/CHANGELOG\.md$/);
		expect(lastWrittenContent.length).toBeGreaterThan(0);
	});
});
