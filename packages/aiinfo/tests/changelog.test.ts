import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function readChangelogFirstLine(): Promise<string> {
	const changelogUrl = new URL("../Changelog.md", import.meta.url);
	const contents = await readFile(changelogUrl, "utf8");
	// Normalize potential BOM and split into lines
	const firstLine = contents
		.replace(/^\uFEFF/, "")
		.split(/\r?\n/, 1)[0]
		?.trim();
	return firstLine;
}

describe("Changelog.md", () => {
	it('exists and starts with "# Changelog"', async () => {
		const firstLine = await readChangelogFirstLine();
		expect(firstLine).toBeDefined();
		expect(firstLine).toBe("# Changelog");
	});

	it("has a proper changelog header format", async () => {
		const firstLine = await readChangelogFirstLine();
		expect(/^# Changelog\b/.test(firstLine)).toBe(true);
	});
});
