import { beforeEach, describe, expect, it, vi } from "vitest";

// Hoisted ansis mock
interface AnsisMock {
	bold: (s: string) => string;
	cyan: (s: string) => string;
	green: (s: string) => string;
	red: (s: string) => string;
	underline: (s: string) => string;
}
const ansisBacking: AnsisMock = {
	bold: (s: string) => `<bold>${s}</bold>`,
	cyan: (s: string) => `<cyan>${s}</cyan>`,
	green: (s: string) => `<green>${s}</green>`,
	red: (s: string) => `<red>${s}</red>`,
	underline: (s: string) => `<underline>${s}</underline>`,
};
vi.mock<typeof import('ansis')>("ansis", () => ({ default: ansisBacking }));

const importSubject = async () => {
	const mod = await import("./log.ts");
	// Use unknown for input type, since Log accepts string | object | array
	return mod.Log as (c: unknown) => void;
};

const spyAll = () => {
	return {
		error: vi.spyOn(console, "error").mockImplementation(() => {}),
		group: vi.spyOn(console, "group").mockImplementation(() => {}),
		groupEnd: vi.spyOn(console, "groupEnd").mockImplementation(() => {}),
		info: vi.spyOn(console, "info").mockImplementation(() => {}),
		log: vi.spyOn(console, "log").mockImplementation(() => {}),
		warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
	};
};

describe("log utility", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		// restore ansis backing (in case modified)
		ansisBacking.red = (s: string) => `<red>${s}</red>`;
		ansisBacking.cyan = (s: string) => `<cyan>${s}</cyan>`;
		ansisBacking.green = (s: string) => `<green>${s}</green>`;
		ansisBacking.bold = (s: string) => `<bold>${s}</bold>`;
		ansisBacking.underline = (s: string) => `<underline>${s}</underline>`;
	});

	it("creates colored + styled group header in start mode", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ color: "red", message: "Title", start: true, style: "bold" });
		expect(spies.group).toHaveBeenCalledTimes(1);
		const header = spies.group.mock.calls[0][0];
		expect(header).toMatch(/^<bold><red>╔/);
		expect(header).toContain("Title");
		expect(header).toMatch(/╚/); // bottom border
		// Verify 38 line chars between borders in top line
		const topLine = header.match(/╔(═+)╗/)?.[1];
		expect(topLine?.length).toBe(38);
		// No message logged
		expect(spies.log).not.toHaveBeenCalled();
	});

	it("outputs colored footer in end mode and closes group", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ color: "red", end: true, type: "log" });
		expect(spies.groupEnd).toHaveBeenCalledTimes(1);
		expect(spies.log).toHaveBeenCalledTimes(1);
		const footerCall = spies.log.mock.calls[0][0];
		expect(footerCall).toMatch(/<red>═{40}<\/red>\n$/);
		// groupEnd should be called before log footer
		const groupEndIndex = spies.groupEnd.mock.invocationCallOrder[0];
		const logIndex = (spies.log.mock as { invocationCallOrder: number[] })
			.invocationCallOrder[0];
		expect(groupEndIndex).toBeLessThan(logIndex);
	});

	it("falls back to plain footer when color invalid", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ color: "nope", end: true, type: "log" });
		const footer = spies.log.mock.calls[0][0];
		expect(footer).toContain("════════════════════════════════════════"); // 40 chars
		expect(footer).not.toMatch(/<red>|<cyan>|<green>/);
	});

	it("logs simple string content directly", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log("Plain");
		expect(spies.log).toHaveBeenCalledTimes(1);
		expect(spies.log.mock.calls[0][0]).toBe("Plain");
	});

	it("logs each element of simple array content", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log(["A", "B"]);
		expect(spies.log).toHaveBeenCalledTimes(2);
		expect(spies.log.mock.calls.map((c) => c[0])).toStrictEqual(["A", "B"]);
	});

	it("formats object message with color and style using specified console method", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ color: "red", message: "WarnMe", style: "bold", type: "warn" });
		expect(spies.warn).toHaveBeenCalledTimes(1);
		const out = spies.warn.mock.calls[0][0];
		expect(out).toBe("<bold><red>WarnMe</red></bold>");
	});

	it("formats each array message entry with color/style", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({
			color: "green",
			message: ["One", "Two"],
			style: "bold",
			type: "info",
		});
		expect(spies.info).toHaveBeenCalledTimes(2);
		const outputs = spies.info.mock.calls.map((c) => c[0]);
		expect(outputs).toStrictEqual([
			"<bold><green>One</green></bold>",
			"<bold><green>Two</green></bold>",
		]);
	});

	it("skips formatting for invalid color/style", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ color: "zzz", message: "Msg", style: "yyy" });
		expect(spies.log).toHaveBeenCalledTimes(1);
		expect(spies.log.mock.calls[0][0]).toBe("Msg");
	});

	it("falls back when style formatter throws", async () => {
		ansisBacking.bold = () => {
			throw new Error("Formatter boom");
		};
		const Log = await importSubject();
		const spies = spyAll();
		Log({ color: "red", message: "Boom", style: "bold" });
		expect(spies.log).toHaveBeenCalledTimes(1);
		expect(spies.error).toHaveBeenCalled(); // internal error log
		expect(spies.log.mock.calls[0][0]).toBe("Error formatting log message");
	});

	it("handles nonexistent console method and logs error + fallback message", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ message: "X", type: "nonexistent" });
		expect(spies.error).toHaveBeenCalled();
		expect(
			spies.error.mock.calls.some((c) => String(c[0]).includes("Error in Log")),
		).toBeTruthy();
		expect(spies.log).toHaveBeenCalled();
		expect(
			spies.log.mock.calls.some((c) => c[0] === "Error logging message"),
		).toBeTruthy();
	});

	it("logs numeric primitive content", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log(123);
		expect(spies.log).toHaveBeenCalledTimes(1);
		expect(spies.log.mock.calls[0][0]).toBe(123);
	});

	it("formats array message with mixed types (strings styled, numbers unchanged)", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ color: "cyan", message: ["A", 7], style: "underline", type: "log" });
		expect(spies.log).toHaveBeenCalledTimes(2);
		expect(spies.log.mock.calls[0][0]).toBe(
			"<underline><cyan>A</cyan></underline>",
		);
		expect(spies.log.mock.calls[1][0]).toBe(7);
	});

	it("produces deterministic formatting across multiple calls", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		const payload = { color: "red", message: "Stable", style: "bold" };
		Log(payload);
		Log(payload);
		expect(spies.log).toHaveBeenCalledTimes(2);
		const [first, second] = spies.log.mock.calls.map((c) => c[0]);
		expect(first).toBe(second);
	});

	it("start mode returns early without logging message content", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ message: "Header", start: true });
		expect(spies.group).toHaveBeenCalledTimes(1);
		expect(spies.log).not.toHaveBeenCalled();
	});

	it("end mode appends newline after footer", async () => {
		const Log = await importSubject();
		const spies = spyAll();
		Log({ end: true });
		const footerOut = spies.log.mock.calls[0][0];
		expect(footerOut.endsWith("\n")).toBeTruthy();
	});
});
