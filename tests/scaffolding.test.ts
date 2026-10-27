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
import config from "../vite.config.mts";

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
	it.each(["vanilla", "react", "esm"])(
		"creates the %s starter using vp create",
		(template) => {
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
			if (template !== "esm")
				expect(existsSync(join(directory, "tests/package.test.ts"))).toBe(true);
		},
		30000,
	);

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

	it("rejects workspace-wide package name collisions before creating files or fetching guidance", async () => {
		const collisionRoot = mkdtempSync(join(tmpdir(), "vite-plus-names-"));
		const fetch = vi.fn();
		vi.stubGlobal("fetch", fetch);
		try {
			for (const [directory, name] of [
				[".", "shared-configs"],
				["apps/different-app-directory", "existing-app"],
				["packages/different-library-directory", "aiinfo"],
			]) {
				mkdirSync(join(collisionRoot, directory), { recursive: true });
				writeFileSync(
					join(collisionRoot, directory, "package.json"),
					JSON.stringify({ name: `@instructure.ai/${name}` }),
				);
			}
			for (const template of templates) {
				for (const name of ["shared-configs", "existing-app", "aiinfo"]) {
					await expect(generate(template, name, collisionRoot)).rejects.toThrow(
						`Workspace package @instructure.ai/${name} already exists`,
					);
					expect(
						existsSync(join(collisionRoot, template === "esm" ? "packages" : "apps", name)),
					).toBe(false);
				}
			}
			await expect(generate("esm", "fixture-vanilla", fixture)).rejects.toThrow(
				"Workspace package @instructure.ai/fixture-vanilla already exists",
			);
			await expect(generate("vanilla", "fixture-esm", fixture)).rejects.toThrow(
				"Workspace package @instructure.ai/fixture-esm already exists",
			);
			expect(fetch).not.toHaveBeenCalled();
		} finally {
			vi.unstubAllGlobals();
			rmSync(collisionRoot, { recursive: true, force: true });
		}
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
		mkdirSync(join(fixture, "apps/site"));
		writeFileSync(
			join(fixture, "apps/site/package.json"),
			JSON.stringify({ name: "@instructure.ai/site", private: true, type: "module" }),
		);
		writeFileSync(
			join(fixture, "apps/site/vite.config.mts"),
			`export default ${JSON.stringify({
				run: {
					tasks: {
						build: {
							command: "vpx ../../scripts/site.mts",
							dependsOn: ["@instructure.ai/shared-configs#prepare:site"],
						},
					},
				},
			})};`,
		);
		mkdirSync(join(fixture, "scripts"));
		writeFileSync(
			join(fixture, "scripts/prepareSite.mts"),
			`import { rmSync, mkdirSync } from "node:fs";
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");`,
		);
		writeFileSync(
			join(fixture, "scripts/site.mts"),
			`import { writeFileSync } from "node:fs";
writeFileSync("../../dist/index.html", "site");`,
		);
		writeFileSync(
			join(fixture, "scripts/issues.mts"),
			`import { existsSync, writeFileSync } from "node:fs";
for (const name of ["index.html", "fixture-vanilla/index.html", "fixture-react/index.html", "fixture-instui/index.html"]) {
  if (!existsSync("dist/" + name)) throw new Error("Missing deployed output: " + name);
}
writeFileSync("dist/issues-complete", "ok");`,
		);
		writeFileSync(
			join(fixture, "vite.config.mts"),
			`export default ${JSON.stringify({
				run: {
					cache: false,
					tasks: {
						"build:apps": config.run?.tasks?.["build:apps"],
						"prepare:site": config.run?.tasks?.["prepare:site"],
					},
				},
			})};`,
		);
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
		execFileSync("pnpm", ["exec", "vp", "run", "build:apps"], {
			cwd: fixture,
			encoding: "utf8",
			timeout: 60000,
		});
		expect(existsSync(join(fixture, "dist/issues-complete"))).toBe(true);
	}, 240000);
});
