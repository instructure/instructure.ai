// scripts/info.test.mts
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the workspace module
vi.mock("@instructure.ai/shared-configs/workspace", () => {
	const mockExec = vi.fn();
	const mockUnknownError = vi.fn();
	const mockWorkspace = vi.fn(() => ({ output: "mocked output" }));
	return {
		exec: mockExec,
		unknownError: mockUnknownError,
		Workspace: mockWorkspace,
	};
});

// Import after mocking
import * as workspaceModule from "@instructure.ai/shared-configs/workspace";
import { main } from "./info.mts";

describe("scripts/info.mts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should call Workspace with ['workspace']", async () => {
		await main();
		expect(workspaceModule.Workspace).toHaveBeenCalledWith(["workspace"]);
	});

	it("should call exec with a function that logs output", async () => {
		const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await main();
		expect(workspaceModule.exec).toHaveBeenCalled();
		// Get the function passed to exec and call it
		const fn = (workspaceModule.exec as ReturnType<typeof vi.fn>).mock.calls[0][0];
		fn();
		expect(consoleLogSpy).toHaveBeenCalledWith("mocked output");
		consoleLogSpy.mockRestore();
	});

	it("should export main", () => {
		expect(typeof main).toBe("function");
	});

	it("should throw if Workspace throws", async () => {
		(vi.mocked(workspaceModule.Workspace)).mockImplementationOnce(() => {
			throw new Error("fail");
		});
		await expect(main()).rejects.toThrow("fail");
	});
});
