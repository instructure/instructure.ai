/**
 * @vitest-environment node
 */

import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { name } from "../package.json" with { type: "json" };

const pkgRoot = new URL("..", import.meta.url);

const readReadme = async () => {
	return readFile(new URL("./README.md", pkgRoot), "utf8");
};

describe("README.md", () => {
	it('starts with "# <package name>"', async () => {
		const readme = await readReadme();
		const firstLine = readme.split(/\r?\n/, 1)[0].replace(/^\uFEFF/, "");
		expect(firstLine).toBe(`# ${name}`);
	});

	it("is not empty and has at least one heading", async () => {
		const readme = await readReadme();
		expect(readme.trim().length).toBeGreaterThan(0);
		expect(/^\s*#\s+\S+/.test(readme)).toBe(true);
	});
});
