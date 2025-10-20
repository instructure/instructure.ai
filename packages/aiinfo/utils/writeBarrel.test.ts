import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

/* -------------------- Hoisted Mocks -------------------- */
const fsMocks = {
	existsSync: vi.fn(),
	readdirSync: vi.fn(),
	statSync: vi.fn(),
	writeFileSync: vi.fn(),
};
vi.mock("node:fs", () => fsMocks);

const formatTsMock = vi.fn((code: string) => code);
vi.mock("../utils/formatTs", () => ({
	formatTs: formatTsMock,
}));

/* -------------------- Helpers -------------------- */
const CWD = "/tmp/project";
vi.spyOn(process, "cwd").mockReturnValue(CWD);

type FSConfig = {
	entries: string[];
	dirs: string[];
	withIndex: string[];
};

const resetFsConfig = (cfg: FSConfig) => {
	fsMocks.readdirSync.mockImplementation(() => cfg.entries);
	fsMocks.statSync.mockImplementation((p: string) => {
		const name = path.basename(p);
		return { isDirectory: () => cfg.dirs.includes(name) };
	});
	fsMocks.existsSync.mockImplementation((p: string) =>
		cfg.withIndex.some(
			(d) => p === path.join(path.resolve(CWD, "src", "components"), d, "index.tsx"),
		),
	);
	fsMocks.writeFileSync.mockImplementation(() => {});
	formatTsMock.mockImplementation((code: string) => code);
};

const importSubject = async () => {
	const mod = await import("./writeBarrel.ts");
	// Use unknown for opts type, since writeBarrel accepts various option shapes
	return mod.writeBarrel as (opts?: unknown) => void;
};

const getWritten = (): string => {
	const v = fsMocks.writeFileSync.mock.calls[0]?.[1];
	if (typeof v !== "string") throw new Error("No barrel content written");
	return v;
};
const getWrittenPath = () =>
	fsMocks.writeFileSync.mock.calls[0]?.[0] as string | undefined;

/* -------------------- Tests -------------------- */
describe("writeBarrel", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(process, "cwd").mockReturnValue(CWD);
	});

	it("writes barrel with sorted uids (default sort)", async () => {
		resetFsConfig({
			dirs: ["beta", "alpha"],
			entries: ["beta", "alpha", "misc.txt"],
			withIndex: ["beta", "alpha"],
		});
		const writeBarrel = await importSubject();
		writeBarrel();
		expect(fsMocks.writeFileSync).toHaveBeenCalledTimes(1);
		const out = getWritten();
		expect(out).toContain('import { alpha } from "./components/alpha";');
		expect(out).toContain('import { beta } from "./components/beta";');
		const iAlpha = out.indexOf("import { alpha }");
		const iBeta = out.indexOf("import { beta }");
		expect(iAlpha).toBeLessThan(iBeta);
		expect(out).toMatch(/const AiInfo: AiInfoProps = {\s+alpha,\s+beta,\s+};/);
		expect(out).toContain("const nutritionFacts");
		expect(out).toContain("const dataPermissionLevels");
		expect(out).toContain("const aiInformation");
		expect(out).toMatch(/export type \* from "\.\/types";/);
		expect(out).toMatch(/export default AiInfo;/);
		expect(formatTsMock).toHaveBeenCalledWith(expect.any(String), "index.ts");
		const expectedPath = path.join(path.resolve(CWD, "src"), "index.ts");
		expect(getWrittenPath()).toBe(expectedPath);
	});

	it("preserves input order when sort disabled", async () => {
		resetFsConfig({
			dirs: ["zeta", "alpha", "beta"],
			entries: ["zeta", "alpha", "beta"],
			withIndex: ["zeta", "alpha", "beta"],
		});
		const writeBarrel = await importSubject();
		writeBarrel({ sort: false });
		const out = getWritten();
		const iZeta = out.indexOf("import { zeta }");
		const iAlpha = out.indexOf("import { alpha }");
		const iBeta = out.indexOf("import { beta }");
		expect(iZeta).toBeLessThan(iAlpha);
		expect(iAlpha).toBeLessThan(iBeta);
		expect(out).toMatch(
			/const AiInfo: AiInfoProps = {\s+zeta,\s+alpha,\s+beta,\s+};/,
		);
	});

	it("uses custom outFileName option", async () => {
		resetFsConfig({
			dirs: ["alpha"],
			entries: ["alpha"],
			withIndex: ["alpha"],
		});
		const writeBarrel = await importSubject();
		writeBarrel({ outFileName: "barrel.ts" });
		const expectedPath = path.join(path.resolve(CWD, "src"), "barrel.ts");
		expect(getWrittenPath()).toBe(expectedPath);
	});

	it("throws when invalid identifiers present and skipping disabled", async () => {
		resetFsConfig({
			dirs: ["alpha", "invalid-name", "beta"],
			entries: ["alpha", "invalid-name", "beta"],
			withIndex: ["alpha", "invalid-name", "beta"],
		});
		const writeBarrel = await importSubject();
		expect(() => writeBarrel()).toThrow(
			/These uids are not valid TS identifiers: invalid-name/,
		);
		expect(fsMocks.writeFileSync).not.toHaveBeenCalled();
	});

	it("skips invalid identifiers when skipInvalidIdentifiers true", async () => {
		resetFsConfig({
			dirs: ["alpha", "invalid-name", "beta"],
			entries: ["alpha", "invalid-name", "beta"],
			withIndex: ["alpha", "invalid-name", "beta"],
		});
		const writeBarrel = await importSubject();
		writeBarrel({ skipInvalidIdentifiers: true });
		const out = getWritten();
		expect(out).toContain('import { alpha } from "./components/alpha";');
		expect(out).toContain('import { beta } from "./components/beta";');
		expect(out).not.toContain("invalid-name");
		expect(out).toMatch(/const AiInfo: AiInfoProps = {\s+alpha,\s+beta,\s+};/);
	});

	it("handles case with only invalid identifiers producing no feature imports", async () => {
		resetFsConfig({
			dirs: ["bad-folder", "another-bad"],
			entries: ["bad-folder", "another-bad"],
			withIndex: ["bad-folder", "another-bad"],
		});
		const writeBarrel = await importSubject();
		writeBarrel({ skipInvalidIdentifiers: true });
		const out = getWritten();
		expect(out).toContain("// no feature folders found");
		expect(out).toMatch(/const AiInfo: AiInfoProps = {\s*};/);
	});

	it("wraps error when directory read fails", async () => {
		resetFsConfig({
			dirs: [],
			entries: [],
			withIndex: [],
		});
		fsMocks.readdirSync.mockImplementation(() => {
			throw new Error("boom");
		});
		const writeBarrel = await importSubject();
		expect(() => writeBarrel()).toThrow(/Failed to read directory .*src.*boom/);
		expect(fsMocks.writeFileSync).not.toHaveBeenCalled();
	});

	it("wraps error when formatTs throws", async () => {
		resetFsConfig({
			dirs: ["alpha"],
			entries: ["alpha"],
			withIndex: ["alpha"],
		});
		formatTsMock.mockImplementation(() => {
			throw new Error("fmt fail");
		});
		const writeBarrel = await importSubject();
		expect(() => writeBarrel()).toThrow(
			/Failed to format TypeScript code: fmt fail/,
		);
		expect(fsMocks.writeFileSync).not.toHaveBeenCalled();
	});

	it("wraps error when writeFileSync fails", async () => {
		resetFsConfig({
			dirs: ["alpha"],
			entries: ["alpha"],
			withIndex: ["alpha"],
		});
		fsMocks.writeFileSync.mockImplementation(() => {
			throw new Error("disk full");
		});
		const writeBarrel = await importSubject();
		expect(() => writeBarrel()).toThrow(
			/Failed to write barrel file .*disk full/,
		);
	});

	it("output includes pluck helper, types import, and exports for each uid", async () => {
		resetFsConfig({
			dirs: ["gamma", "alpha"],
			entries: ["gamma", "alpha"],
			withIndex: ["gamma", "alpha"],
		});
		const writeBarrel = await importSubject();
		writeBarrel();
		const out = getWritten();
		expect(out).toMatch(/import type {\s+AiInfoProps,/);
		expect(out).toContain("const pluck = <");
		expect(out).toContain("const nutritionFacts:");
		expect(out).toContain("const dataPermissionLevels:");
		expect(out).toContain("const aiInformation:");
		expect(out).toMatch(/export {\s+AiInfo,\s+nutritionFacts,/);
		expect(out).toMatch(/export default AiInfo;/);
		const occurrencesAlpha = (out.match(/alpha/g) || []).length;
		const occurrencesGamma = (out.match(/gamma/g) || []).length;
		expect(occurrencesAlpha).toBeGreaterThanOrEqual(3);
		expect(occurrencesGamma).toBeGreaterThanOrEqual(3);
	});

	it("calls formatTs with generated code before writing", async () => {
		resetFsConfig({
			dirs: ["alpha", "beta"],
			entries: ["alpha", "beta"],
			withIndex: ["alpha", "beta"],
		});
		const writeBarrel = await importSubject();
		writeBarrel();
		expect(formatTsMock).toHaveBeenCalledTimes(1);
		expect(fsMocks.writeFileSync).toHaveBeenCalledTimes(1);
		const codePassed = formatTsMock.mock.calls[0][0];
		expect(codePassed).toContain('import { alpha } from "./components/alpha";');
		expect(codePassed).toContain('import { beta } from "./components/beta";');
		expect(codePassed).toContain("const AiInfo: AiInfoProps = {");
	});
});
