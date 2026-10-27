import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, it } from "vite-plus/test";

it("loads maintenance scripts in the real vpx runtime without refreshing data", () => {
	const root = resolve(import.meta.dirname, "..");
	const fixture = mkdtempSync(join(tmpdir(), "vite-plus-maintenance-"));
	const probe = join(fixture, "probe.mts");
	const script = (name: string) =>
		pathToFileURL(resolve(root, `packages/aiinfo/scripts/${name}.mts`)).href;
	writeFileSync(
		probe,
		`
		import { parseCSV } from ${JSON.stringify(script("updateCache"))};
		import { WriteEntries } from ${JSON.stringify(script("writeEntries"))};
		import { ClearCache } from ${JSON.stringify(script("clearCache"))};
		if (typeof WriteEntries !== "function" || typeof ClearCache !== "function") throw new Error("Missing maintenance exports");
		if (!parseCSV("uid,name\\nexample,Example").raw.includes("Example")) throw new Error("CSV parser did not run");
		console.log("maintenance-runtime-ok");
	`,
	);
	try {
		const require = createRequire(import.meta.url);
		const vpx = join(dirname(require.resolve("vite-plus/package.json")), "bin/vpx");
		const output = execFileSync(process.execPath, [vpx, probe], {
			encoding: "utf8",
			timeout: 30000,
			env: { ...process.env, UPDATE: "", WRITE: "", CLEAR: "" },
		});
		expect(output).toContain("maintenance-runtime-ok");
	} finally {
		rmSync(fixture, { recursive: true, force: true });
	}
});
