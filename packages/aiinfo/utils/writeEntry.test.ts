import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Entry } from "../types"; // fixed import for Entry type

const mkdirSyncSpy = vi.fn();
const writeFileSyncSpy = vi.fn();
const entryToAIInformationSpy = vi.fn();
const entryToNutritionFactsSpy = vi.fn();
const entryToPermissionLevelsSpy = vi.fn();
const formatTsSpy = vi.fn();
const toTsObjectLiteralSpy = vi.fn<(value: unknown) => string>();

function makeEntry(
	uid: string,
	featureName = "FeatureName",
	revision = "rev-1",
): Entry {
	return {
		compliance: {
			logging: "Enabled",
			loggingDescription: "Logging description",
			pii: "Filtered",
			piiDescription: "PII handling description",
			regions: "US/EU",
			regionsDescription: "Regions description",
			retention: "30 days",
		},
		feature: {
			description: `${featureName} description`,
			name: featureName,
		},
		group: "test-group",
		model: {
			data: "Data Shared",
			dataDescription: "Details about shared data",
			description: "Model description",
			name: "Base Model",
			trained: "Trained with user data",
		},
		outputs: {
			guardrails: "Guardrails enabled",
			human: "Human in the loop",
			humanDescription: "Human review description",
			outcomes: "Intended outcomes listed",
			risks: "Potential risks listed",
			settings: "Per-course",
		},
		permissions: "1",
		revision,
		uid,
	};
}

function mockUtils({
	trigger = "<Button>AI Information</Button>",
	nutritionData = [{ seg: 1 }],
	dplData = [{ level: 1 }],
	aiInfoBase = { something: "x" } as Record<string, unknown>,
	nutritionBase = {
		closeButtonText: "Close",
		closeIconButtonScreenReaderLabel: "Close",
		modalLabel: "Modal",
		title: "NFTitle",
	} as Record<string, unknown>,
	dplBase = { title: "DPLTitle" } as Record<string, unknown>,
}: {
	trigger?: string;
	nutritionData?: Array<Record<string, unknown>>;
	dplData?: Array<Record<string, unknown>>;
	aiInfoBase?: Record<string, unknown>;
	nutritionBase?: Record<string, unknown>;
	dplBase?: Record<string, unknown>;
}) {
	entryToAIInformationSpy.mockReturnValue({
		...aiInfoBase,
		dataPermissionLevelsData: dplData,
		nutritionFactsData: nutritionData,
		trigger,
	});
	entryToNutritionFactsSpy.mockReturnValue({
		...nutritionBase,
		data: nutritionData,
	});
	entryToPermissionLevelsSpy.mockReturnValue({
		...dplBase,
		data: dplData,
	});
	formatTsSpy.mockImplementation((code: string) => code);
	toTsObjectLiteralSpy.mockImplementation(
		(obj) => `/*OBJ*/ ${JSON.stringify(obj)}`,
	);
}

function setupMocks(opts?: Parameters<typeof mockUtils>[0]) {
	vi.resetModules();
	mkdirSyncSpy.mockReset();
	writeFileSyncSpy.mockReset();
	entryToAIInformationSpy.mockReset();
	entryToNutritionFactsSpy.mockReset();
	entryToPermissionLevelsSpy.mockReset();
	formatTsSpy.mockReset();
	toTsObjectLiteralSpy.mockReset();

	vi.mock("node:fs", () => ({
		mkdirSync: mkdirSyncSpy,
		writeFileSync: writeFileSyncSpy,
	}));
	vi.mock("../utils", () => ({
		entryToAIInformation: entryToAIInformationSpy,
		entryToNutritionFacts: entryToNutritionFactsSpy,
		entryToPermissionLevels: entryToPermissionLevelsSpy,
		formatTs: formatTsSpy,
		toTsObjectLiteral: toTsObjectLiteralSpy,
	}));

	mockUtils(opts ?? {});
}

function getWrittenContent() {
	expect(writeFileSyncSpy).toHaveBeenCalled();
	const [, content] = writeFileSyncSpy.mock.calls[0];
	return String(content);
}

describe("writeEntry", () => {
	beforeEach(() => {
		setupMocks();
	});

	it("writes file with expected path and unquoted AI Information trigger", async () => {
		setupMocks({ trigger: "<Button>AI Information</Button>" });
		const { writeEntry } = await import("./writeEntry");
		const entry = makeEntry("abc123", "My Feature", "rev-42");
		await writeEntry(entry);

		const expectedPath = path.resolve(
			process.cwd(),
			"src",
			entry.uid,
			"index.tsx",
		);
		expect(mkdirSyncSpy).toHaveBeenCalledTimes(1);
		expect(mkdirSyncSpy.mock.calls[0][0]).toBe(path.dirname(expectedPath));
		expect(mkdirSyncSpy.mock.calls[0][1]).toEqual({ recursive: true });
		expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
		expect(writeFileSyncSpy.mock.calls[0][0]).toBe(expectedPath);

		const content = getWrittenContent();
		expect(content).toContain('const FEATURE_NAME = "My Feature";');
		expect(content).toContain('const UID = "abc123";');
		expect(content).toContain('revision: "rev-42"');
		expect(content).toContain("trigger: <Button>AI Information</Button>,");
		expect(content).not.toContain(
			'trigger: "<Button>AI Information</Button>",',
		);
	});

	it("does not unquote trigger when different text", async () => {
		setupMocks({ trigger: "<Button>Other</Button>" });
		const { writeEntry } = await import("./writeEntry");
		await writeEntry(makeEntry("uidX"));
		const content = getWrittenContent();
		expect(content).toContain('trigger: "<Button>Other</Button>",');
		expect(content).not.toContain("trigger: <Button>Other</Button>,");
	});

	it("calls toTsObjectLiteral correct number of times and with expected shapes", async () => {
		const dplData = [{ level: 1 }, { level: 2 }];
		const nfData = [{ seg: "a" }, { seg: "b" }];
		setupMocks({ dplData, nutritionData: nfData });
		const { writeEntry } = await import("./writeEntry");
		await writeEntry(makeEntry("uidD"));
		expect(toTsObjectLiteralSpy).toHaveBeenCalledTimes(5);
		const args = toTsObjectLiteralSpy.mock.calls.map((c) => c[0]);
		expect(args[0]).toEqual(dplData);
		expect(args[1]).toEqual(nfData);
		expect(args[2]).toMatchObject({ modalLabel: "Modal" });
		expect((args[2] as Record<string, unknown>).data).toBeUndefined();
		expect(args[3]).toMatchObject({ title: "DPLTitle" });
		expect((args[3] as Record<string, unknown>).data).toBeUndefined();
		expect(args[4]).toMatchObject({ something: "x" });
		expect(
			(args[4] as Record<string, unknown>).dataPermissionLevelsData,
		).toBeUndefined();
		expect(
			(args[4] as Record<string, unknown>).nutritionFactsData,
		).toBeUndefined();
	});

	it("writes multiple entries distinctly", async () => {
		const { writeEntry } = await import("./writeEntry");
		await writeEntry(makeEntry("uid1"));
		await writeEntry(makeEntry("uid2"));
		expect(writeFileSyncSpy).toHaveBeenCalledTimes(2);
		const paths = writeFileSyncSpy.mock.calls.map((c) => c[0]);
		expect(paths[0]).toContain(path.join("src", "uid1", "index.tsx"));
		expect(paths[1]).toContain(path.join("src", "uid2", "index.tsx"));
	});

	it("formatTs output is used then post-processed for trigger", async () => {
		// Call setupMocks first (it resets spies), then set custom implementation
		setupMocks({ trigger: "<Button>AI Information</Button>" });
		formatTsSpy.mockImplementation((code: string) => `// formatted\n${code}`);
		const { writeEntry } = await import("./writeEntry");
		await writeEntry(makeEntry("uidFmt"));
		expect(formatTsSpy).toHaveBeenCalledTimes(1);
		expect(formatTsSpy.mock.calls[0][1]).toBe("index.tsx");
		const content = getWrittenContent();
		expect(content.startsWith("// formatted")).toBe(true);
		expect(content).toContain("trigger: <Button>AI Information</Button>,");
	});

	it("export block includes UID identifier", async () => {
		const { writeEntry } = await import("./writeEntry");
		await writeEntry(makeEntry("uidExport"));
		const content = getWrittenContent();
		expect(content).toMatch(/export\s*\{[\s\S]*uidExport/);
	});

	it("creates expected variable declarations", async () => {
		const { writeEntry } = await import("./writeEntry");
		await writeEntry(makeEntry("uidVars", "Custom Feature", "rev-Z"));
		const content = getWrittenContent();
		expect(/const FEATURE_NAME = "Custom Feature";/.test(content)).toBe(true);
		expect(/const uidVars: AiInfoFeatureProps/.test(content)).toBe(true);
	});
});
