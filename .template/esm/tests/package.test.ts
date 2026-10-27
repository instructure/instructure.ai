import { describe, expect, it } from "vite-plus/test";
import { name } from "../package.json" with { type: "json" };

describe("library manifest", () => {
	it("uses the workspace scope", () => {
		expect(name).toMatch(/^@instructure\.ai\//);
	});
});
