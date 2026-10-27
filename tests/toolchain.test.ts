import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { parse } from "yaml";
import config from "../vite.config.mts";
import { nextVersion } from "../scripts/release.mts";
import appConfig from "../vite.config.app.mts";

const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const manifest = (directory: string) => JSON.parse(read(`${directory}/package.json`));
const root = manifest(".");
const workspace = parse(read("pnpm-workspace.yaml"));

describe("Vite+ workspace", () => {
	it("pins pnpm and one coherent bundled toolchain", () => {
		expect(root.packageManager).toBe("pnpm@12.15.0");
		expect(workspace.catalog["vite-plus"]).toBe("1.4.0");
		expect(workspace.catalog.vite).toBe(
			`npm:@voidzero-dev/vite-plus-core@${workspace.catalog["vite-plus"]}`,
		);
		expect(workspace.overrides).toMatchObject({ "vite@*": "catalog:", "vitest@*": "catalog:" });
		expect(workspace.catalog["@vitest/coverage-istanbul"]).toBe(workspace.catalog.vitest);
		expect(workspace.catalog["@vitest/coverage-v8"]).toBe(workspace.catalog.vitest);
		for (const tool of ["vite-node", "tsdown", "oxlint", "oxfmt"]) {
			expect(root.devDependencies[tool]).toBeUndefined();
		}
	});

	it("separates Node 26 tooling from Node 20 consumer compatibility", () => {
		expect(read(".node-version").trim()).toBe("26.12.1");
		expect(root.engines.node).toBe(">=26.12.1");
		expect(manifest("packages/aiinfo").engines.node).toBe(">=20.0.0");
		expect(read("packages/aiinfo/vite.config.mts")).toContain('target: "node20"');
	});

	it.each(["esm", "instui", "react", "vanilla"])("keeps the %s starter aligned", (template) => {
		const starter = manifest(`.template/${template}`);
		expect(starter.engines.node).toBe(root.engines.node);
		expect(starter.devDependencies["vite-plus"]).toBe("catalog:");
		expect(starter.devDependencies["@instructure.ai/shared-configs"]).toBe("workspace:^");
		expect(starter.scripts.typecheck).toBe("tsc --noEmit");
		expect(config.create?.templates?.some((entry) => entry.name === template)).toBe(true);
	});

	it("removes dispatchers instead of wrapping them", () => {
		for (const name of ["build", "dev", "test", "lint", "preview", "workspace", "info", "new"]) {
			expect(existsSync(new URL(`../scripts/${name}.mts`, import.meta.url))).toBe(false);
		}
		expect(root.exports["./workspace"]).toBeUndefined();
		expect(config.run?.cache).toBe(false);
	});

	it("orders shared output preparation before the root site and other apps", () => {
		expect(read("apps/site/vite.config.mts")).toContain(
			"@instructure.ai/shared-configs#prepare:site",
		);
		for (const app of ["canvas-mcp", "nutritionfacts", "roadmap"]) {
			expect(read(`apps/${app}/vite.config.mts`)).toContain("@instructure.ai/site#build");
		}
		expect(config.run?.tasks?.["build:apps"]).toMatchObject({
			command: "vpx scripts/issues.mts",
			dependsOn: [
				"@instructure.ai/canvas-mcp#build",
				"@instructure.ai/nutritionfacts#build",
				"@instructure.ai/roadmap#build",
			],
		});
	});

	it("checks apps and packages instead of inheriting root blanket ignores", () => {
		for (const ignored of ["apps/**", "packages/**"]) {
			expect(config.lint?.ignorePatterns).not.toContain(ignored);
			expect(config.fmt?.ignorePatterns).not.toContain(ignored);
		}
		expect(config.lint?.options).toMatchObject({ typeAware: true, typeCheck: true });
	});

	it("resolves app metadata from its directory rather than the caller's environment", () => {
		const app = appConfig(new URL("../apps/nutritionfacts", import.meta.url).pathname);
		expect(app.base).toBe("/nutritionfacts");
		expect(app.define?.["import.meta.env.VITE_PACKAGE_NAME"]).toBe('"nutritionfacts"');
		expect(app.define?.["import.meta.env.VITE_PACKAGE_VERSION"]).toBe(
			JSON.stringify(manifest("apps/nutritionfacts").version),
		);
		expect(app.run).toBeUndefined();
		expect(app.lint).toBeUndefined();
	});
});

describe("release version preparation", () => {
	it("increments patches or accepts an explicit higher version", () => {
		expect(nextVersion("1.2.3")).toBe("1.2.4");
		expect(nextVersion("1.2.3", "2.0.0")).toBe("2.0.0");
	});
	it.each(["1.2.3", "1.1.9", "2.x", "bad"])("rejects invalid/non-increasing %s", (version) => {
		expect(() => nextVersion("1.2.3", version)).toThrow();
	});
});
