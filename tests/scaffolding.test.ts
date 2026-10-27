import { execFileSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { afterAll, describe, expect, it, vi } from "vite-plus/test";
import { generate } from "../.template/generate.mjs";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
const fixture = mkdtempSync(join(tmpdir(), "vite-plus-starters-"));
const templates = ["vanilla", "react", "instui", "esm"];
mkdirSync(join(fixture, "apps"));
mkdirSync(join(fixture, "packages"));
cpSync(join(root, ".template"), join(fixture, ".template"), { recursive: true });
writeFileSync(
	join(fixture, "package.json"),
	JSON.stringify({
		name: "@instructure.ai/shared-configs",
		private: true,
		type: "module",
		packageManager: "pnpm@12.15.0",
	}),
);
writeFileSync(join(fixture, "pnpm-workspace.yaml"), "packages:\n  - apps/*\n  - packages/*\n");
writeFileSync(
	join(fixture, "vite.config.mts"),
	`export default ${JSON.stringify({
		create: {
			templates: templates.map((name) => ({
				name,
				description: `${name} starter`,
				template: `./.template/generators/${name}`,
			})),
		},
	})};`,
);
const vp = join(dirname(require.resolve("vite-plus/package.json")), "bin/vp");

afterAll(() => rmSync(fixture, { recursive: true, force: true }), 60000);

describe("native Vite+ starter entry points", () => {
	it.each(["vanilla", "react", "esm"])("creates the %s starter using vp create", (template) => {
		execFileSync(
			process.execPath,
			[vp, "create", template, "--no-interactive", "--", `fixture-${template}`],
			{
				cwd: fixture,
				encoding: "utf8",
				timeout: 30000,
			},
		);
		const directory = join(
			fixture,
			template === "esm" ? "packages" : "apps",
			`fixture-${template}`,
		);
		const pkg = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
		expect(pkg.name).toBe(`@instructure.ai/fixture-${template}`);
		expect(pkg.engines.node).toBe(">=26.12.1");
		expect(pkg.devDependencies["vite-plus"]).toBe("catalog:");
		expect(existsSync(join(directory, "vite.config.mts"))).toBe(true);
		if (template !== "esm") expect(existsSync(join(directory, "tests/package.test.ts"))).toBe(true);
	});

	it("renders InstUI-specific guidelines without making test network requests", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Fixture InstUI guidance")));
		try {
			const directory = await generate("instui", "fixture-instui", fixture);
			expect(readFileSync(join(directory, ".github/copilot-instructions.md"), "utf8")).toContain(
				"Fixture InstUI guidance",
			);
		} finally {
			vi.unstubAllGlobals();
		}
	});

	it("rejects name traversal and existing directories", async () => {
		await expect(generate("vanilla", "../escape", fixture)).rejects.toThrow();
		await expect(generate("vanilla", "fixture-vanilla", fixture)).rejects.toThrow();
	});

	it("installs, typechecks, tests, and builds all four generated starters", () => {
		for (const file of [
			"package.json",
			"pnpm-lock.yaml",
			"pnpm-workspace.yaml",
			"tsconfig.json",
			"tsconfig.node.json",
			"vite.config.app.mts",
			"vite.config.react.mts",
			"vitest.config.shared.mts",
			"types",
			"plugins/vitest.plugin.coverageReporter.cjs",
		]) {
			const target = join(fixture, file);
			mkdirSync(dirname(target), { recursive: true });
			cpSync(join(root, file), target, { recursive: true });
		}
		const store = execFileSync("pnpm", ["store", "path"], {
			cwd: root,
			encoding: "utf8",
		}).trim();
		// New importers may need registry metadata missing after CI's frozen workspace install.
		execFileSync(
			"pnpm",
			[
				"install",
				"--prefer-offline",
				"--ignore-scripts",
				"--no-frozen-lockfile",
				"--store-dir",
				store,
			],
			{
				cwd: fixture,
				env: { ...process.env, CI: "1" },
				encoding: "utf8",
				timeout: 120000,
			},
		);
		for (const command of ["typecheck", "test", "build"]) {
			execFileSync(
				"pnpm",
				["exec", "vp", "run", "--filter", "./apps/*", "--filter", "./packages/*", command],
				{
					cwd: fixture,
					encoding: "utf8",
					timeout: 60000,
				},
			);
		}
	}, 240000);
});
