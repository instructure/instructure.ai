import { describe, expect, it } from "vitest";
import { entryToObj } from "./entryToObj";

type CSVCell = string | number | undefined;
type CSVRow = CSVCell[];

// Helper to build a valid 24-length CSV row
const buildEntry = (overrides: Record<number, CSVCell> = {}): CSVRow => {
	const base: CSVRow = [
		"UID", // 0 uid
		"REV", // 1 revision
		"FEAT_NAME", // 2 feature.name
		"FEAT_DESC", // 3 feature.description
		"MODEL_NAME", // 4 model.name
		"MODEL_DESC", // 5 model.description
		"MODEL_TRAINED", // 6 model.trained
		"MODEL_DATA", // 7 model.data
		"MODEL_DATA_DESC", // 8 model.dataDescription
		"RETENTION", // 9 compliance.retention
		"LOGGING", // 10 compliance.logging
		"LOGGING_DESC", // 11 compliance.loggingDescription
		"REGIONS", // 12 compliance.regions
		"REGIONS_DESC", // 13 compliance.regionsDescription
		"PII", // 14 compliance.pii
		"PII_DESC", // 15 compliance.piiDescription
		"SETTINGS", // 16 outputs.settings
		"HUMAN", // 17 outputs.human
		"HUMAN_DESC", // 18 outputs.humanDescription
		"GUARDRAILS", // 19 outputs.guardrails
		"RISKS", // 20 outputs.risks
		"OUTCOMES", // 21 outputs.outcomes
		"GROUP_A", // 22 group
		"1", // 23 permissions
	];
	Object.entries(overrides).forEach(([k, v]) => {
		base[Number(k)] = v;
	});
	return base;
};

// Helper to coerce CSVRow to string[]
function csvRowToStringArray(row: CSVRow): string[] {
	return row.map((cell) =>
		typeof cell === "string"
			? cell
			: typeof cell === "number"
				? String(cell)
				: "",
	);
}

describe("entryToObj", () => {
	it("maps each CSV index to the correct nested object field (happy path)", () => {
		const row: CSVRow = buildEntry();
		const result = entryToObj(csvRowToStringArray(row));
		expect(result.uid).toBe("uid");
		expect(result.revision).toBe(row[1]);
		expect(result.feature).toEqual({ description: row[3], name: row[2] });
		expect(result.model).toEqual({
			data: row[7],
			dataDescription: row[8],
			description: row[5],
			name: row[4],
			trained: row[6],
		});
		expect(result.compliance).toEqual({
			logging: row[10],
			loggingDescription: row[11],
			pii: row[14],
			piiDescription: row[15],
			regions: row[12],
			regionsDescription: row[13],
			retention: row[9],
		});
		expect(result.outputs).toEqual({
			guardrails: row[19],
			human: row[17],
			humanDescription: row[18],
			outcomes: row[21],
			risks: row[20],
			settings: row[16],
		});
		expect(result.group).toBe(row[22]);
		expect(result.permissions).toBe(row[23]);
	});

	it("does not mutate the original array", () => {
		const row: CSVRow = buildEntry();
		const snapshot = row.slice();
		entryToObj(csvRowToStringArray(row));
		expect(row).toEqual(snapshot);
		expect(row[0]).toBe("UID");
	});

	it("throws with descriptive error when length < 24", () => {
		const row: CSVRow = buildEntry();
		row.pop(); // now 23
		expect(row).toHaveLength(23);
		expect(() => entryToObj(csvRowToStringArray(row))).toThrowError(
			/Invalid entry length: expected 24, got 23/,
		);
		try {
			entryToObj(csvRowToStringArray(row));
		} catch (e) {
			// Use unknown and type guard for error
			if (e && typeof e === "object" && "message" in e) {
				expect((e as { message: string }).message).toMatch(/Entry:/);
				expect((e as { message: string }).message).toMatch(/"UID"/);
			} else {
				throw e;
			}
		}
	});

	it("throws with descriptive error when length > 24", () => {
		const row: CSVRow = buildEntry();
		row.push("EXTRA");
		expect(row).toHaveLength(25);
		expect(() => entryToObj(csvRowToStringArray(row))).toThrowError(
			/Invalid entry length: expected 24, got 25/,
		);
	});

	it("lowercases only the uid field (index 0)", () => {
		const row: CSVRow = buildEntry({ 0: "ABC-DEF", 2: "MiXeD_Feature" });
		const result = entryToObj(csvRowToStringArray(row));
		expect(result.uid).toBe("abc-def");
		expect(result.feature.name).toBe("MiXeD_Feature");
	});

	it("preserves empty string and undefined values", () => {
		const row: CSVRow = buildEntry({
			5: "", // model.description
			11: undefined, // compliance.loggingDescription
			18: "", // outputs.humanDescription
		});
		const result = entryToObj(csvRowToStringArray(row));
		expect(result.model.description).toBe("");
		// Accepts both "" and undefined for loggingDescription
		expect(
			result.compliance.loggingDescription === undefined ||
				result.compliance.loggingDescription === "",
		).toBe(true);
		expect(result.outputs.humanDescription).toBe("");
	});

	it("accepts numeric revision without coercion", () => {
		const row: CSVRow = buildEntry({ 1: 42 });
		const result = entryToObj(csvRowToStringArray(row));
		expect(result.revision).toBe("42");
		expect(typeof result.revision).toBe("string");
	});

	it("maps permissions (last index) exactly as provided", () => {
		const row: CSVRow = buildEntry({ 23: "3" });
		const result = entryToObj(csvRowToStringArray(row));
		expect(result.permissions).toBe("3");
	});

	it("handles sparse values (some indices undefined) as-is", () => {
		const row: CSVRow = buildEntry({ 14: undefined, 19: undefined });
		const result = entryToObj(csvRowToStringArray(row));
		expect(result.compliance.pii).toBe("");
		expect(result.outputs.guardrails).toBe("");
	});

	it("maps a real-world example correctly", () => {
		const row: CSVRow = [
			"uidX",
			"Feature X",
			"Feature X description",
			"groupX",
			"Base Model",
			"Model description",
			"Trained with user data",
			"Data Shared",
			"Details about shared data",
			"30 days",
			"Enabled",
			"Logging description",
			"US/EU",
			"Regions description",
			"Filtered",
			"PII handling description",
			"Guardrails enabled",
			"Human in the loop",
			"", // outputs.humanDescription
			"Per-course",
			"Potential risks listed",
			"Intended outcomes listed",
			"1",
			"rev-1",
		];
		const result = entryToObj(csvRowToStringArray(row));
		expect(result.model.description).toBe("Model description");
		expect(result.compliance.loggingDescription).toBe("Logging description");
		expect(result.outputs.humanDescription).toBe("");
	});
});
