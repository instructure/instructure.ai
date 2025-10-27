import { describe, expect, it, vi } from "vitest";
import type { WriteEntries as WriteEntriesType } from "./writeEntries.mts";

const sampleCSV = "uid1,name1,desc1\nuid2,name2,desc2";

describe("writeEntries.mts", () => {
	it("writes all entries and barrel from cache if no param", async () => {
		vi.resetModules();
		const mockWriteEntry = vi.fn();
		const mockWriteBarrel = vi.fn();
		const mockLog = vi.fn();
		vi.doMock("../utils", () => ({
			entryToObj: (arr: string[]) => ({ raw: arr, uid: arr[0] }),
			Log: mockLog,
			writeBarrel: mockWriteBarrel,
			writeEntry: mockWriteEntry,
		}));
		vi.doMock("node:fs", () => ({
			default: {
				existsSync: () => true,
				readFileSync: () => sampleCSV,
			},
			existsSync: () => true,
			readFileSync: () => sampleCSV,
		}));
		const { writeEntries } = (await vi.importActual("./writeEntries.mts")) as {
			writeEntries: typeof WriteEntriesType;
		};
		await writeEntries();
		expect(mockWriteEntry).toHaveBeenCalledTimes(2);
		expect(mockWriteBarrel).toHaveBeenCalledTimes(1);
		expect(mockLog).toHaveBeenCalledWith({
			color: "cyan",
			message: [expect.stringContaining("uid1")],
		});
		expect(mockLog).toHaveBeenCalledWith({
			color: "cyan",
			message: [expect.stringContaining("uid2")],
		});
	});

	it("writes entries from provided array", async () => {
		vi.resetModules();
		const mockWriteEntry = vi.fn();
		const mockWriteBarrel = vi.fn();
		const mockLog = vi.fn();
		vi.doMock("../utils", () => ({
			entryToObj: (arr: string[]) => ({ raw: arr, uid: arr[0] }),
			Log: mockLog,
			writeBarrel: mockWriteBarrel,
			writeEntry: mockWriteEntry,
		}));
		vi.doMock("node:fs", () => ({
			default: {
				existsSync: () => true,
				readFileSync: () => "",
			},
			existsSync: () => true,
			readFileSync: () => "",
		}));
		const { writeEntries } = (await vi.importActual("./writeEntries.mts")) as {
			writeEntries: typeof WriteEntriesType;
		};
		const arr = [
			["uidA", "nA", "dA"],
			["uidB", "nB", "dB"],
		];
		await writeEntries(arr);
		expect(mockWriteEntry).toHaveBeenCalledTimes(2);
		expect(mockWriteEntry).toHaveBeenCalledWith({
			raw: ["uidA", "nA", "dA"],
			uid: "uidA",
		});
		expect(mockWriteEntry).toHaveBeenCalledWith({
			raw: ["uidB", "nB", "dB"],
			uid: "uidB",
		});
		expect(mockWriteBarrel).toHaveBeenCalledTimes(1);
	});

	it("logs and returns early if no entries", async () => {
		vi.resetModules();
		const mockWriteEntry = vi.fn();
		const mockWriteBarrel = vi.fn();
		const mockLog = vi.fn();
		vi.doMock("../utils", () => ({
			entryToObj: (arr: string[]) => ({ raw: arr, uid: arr[0] }),
			Log: mockLog,
			writeBarrel: mockWriteBarrel,
			writeEntry: mockWriteEntry,
		}));
		vi.doMock("node:fs", () => ({
			default: {
				existsSync: () => true,
				readFileSync: () => "",
			},
			existsSync: () => true,
			readFileSync: () => "",
		}));
		const { writeEntries } = (await vi.importActual("./writeEntries.mts")) as {
			writeEntries: typeof WriteEntriesType;
		};
		await writeEntries();
		expect(mockWriteEntry).not.toHaveBeenCalled();
		expect(mockWriteBarrel).not.toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledWith({
			color: "yellow",
			message: ["No entries to write."],
		});
	});
});
