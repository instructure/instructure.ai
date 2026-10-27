import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

const mocks = vi.hoisted(() => ({
	execFileSync: vi.fn(),
	readdirSync: vi.fn(),
	readFileSync: vi.fn(),
	writeFileSync: vi.fn(),
}));
vi.mock("node:child_process", () => ({ execFileSync: mocks.execFileSync }));
vi.mock("node:fs", () => ({
	readdirSync: mocks.readdirSync,
	readFileSync: mocks.readFileSync,
	writeFileSync: mocks.writeFileSync,
}));

describe("tool catalog updater", () => {
	const originalArgv = process.argv;
	const published = {
		catalog: "2026-09-29",
		count: 1,
		tools: [
			{
				name: "canvas-get_assignment",
				description:
					'Published description\n\n**Instructions:** Private instructions.\n\n**Examples:**\n- User: "First prompt" → `{"private":true}`\n- User: "Second prompt" → `{}`',
				scopes: ["url:GET|/api/v1/courses/:course_id/assignments/:id"],
				annotations: { readOnlyHint: true },
			},
		],
	};
	const definition = `export const tool = defineTool({
		toolName: "canvas-get_assignment", since: "2026-09-29", title: "Get Assignment",
		_meta: { roles: ["teacher"], resourceTypes: ["assignment_override", "user"] }
	});`;

	beforeEach(() => {
		vi.resetModules();
		vi.resetAllMocks();
		process.argv = ["vpx", "updateTools.mts", "/fixture/maple"];
		vi.spyOn(process.stdout, "write").mockReturnValue(true);
		mocks.execFileSync.mockImplementation((_command, args: string[]) =>
			args[0] === "rev-parse" ? "revision\n" : "",
		);
		mocks.readdirSync.mockImplementation((path: string) =>
			path.endsWith("tool-catalogs")
				? ["preview.json", "2026-09-16.json", "2026-09-29.json"]
				: ["get-assignment.tool.ts", "old/get-assignment.tool_2026-09-29.ts"],
		);
		mocks.readFileSync.mockImplementation((path: string) => {
			if (path.endsWith(".json")) return JSON.stringify(published);
			return path.includes("/old/")
				? definition.replace('since: "2026-09-29"', 'until: "2026-09-29"')
				: definition;
		});
	});

	afterEach(() => {
		process.argv = originalArgv;
		vi.restoreAllMocks();
	});

	it("selects the newest dated catalog and exports only displayed fields", async () => {
		await import("../scripts/updateTools.mts");
		expect(mocks.writeFileSync).toHaveBeenCalledOnce();
		const result = JSON.parse(mocks.writeFileSync.mock.calls[0]![1]);
		expect(result).toEqual({
			catalog: "2026-09-29",
			tools: [
				{
					title: "Get Assignment",
					roles: ["teacher"],
					description: "Published description",
					readOnly: true,
					resource: "assignment",
					example: "First prompt",
				},
			],
		});
	});

	it("refuses dirty Maple tools or catalogs without writing", async () => {
		mocks.execFileSync.mockReturnValue("dirty");
		await expect(import("../scripts/updateTools.mts")).rejects.toThrow("must be clean");
		expect(mocks.writeFileSync).not.toHaveBeenCalled();
	});

	it("does not mislabel tools with unknown provenance as generated", async () => {
		mocks.readdirSync.mockImplementation((path: string) =>
			path.endsWith("tool-catalogs") ? ["2026-09-29.json"] : [],
		);
		await expect(import("../scripts/updateTools.mts")).rejects.toThrow("verify its provenance");
		expect(mocks.writeFileSync).not.toHaveBeenCalled();
	});

	it("excludes preview-only definitions", async () => {
		mocks.readFileSync.mockImplementation((path: string) =>
			path.endsWith(".json")
				? JSON.stringify(published)
				: definition.replaceAll("2026-09-29", "preview"),
		);
		await expect(import("../scripts/updateTools.mts")).rejects.toThrow("No custom source metadata");
		expect(mocks.writeFileSync).not.toHaveBeenCalled();
	});
});
