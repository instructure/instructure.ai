import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const readManifest = (relativePath: string) =>
	JSON.parse(readFileSync(new URL(relativePath, import.meta.url), "utf8"));

describe("workspace toolchain", () => {
	const root = readManifest("../package.json");

	it("uses TypeScript 7 and checks the root explicitly", () => {
		expect(root.devDependencies.typescript).toMatch(/^\^7\./);
		expect(root.devDependencies["@typescript/native-preview"]).toBeUndefined();
		expect(root.scripts["typecheck:root"]).toBe("tsc --noEmit -p tsconfig.json");
		expect(root.scripts.typecheck).toContain("pnpm typecheck:root");
		expect(root.scripts["build:root"]).toBe("pnpm --filter @instructure.ai/site build");
	});

	it("keeps coverage providers matched to Vitest", () => {
		expect(root.devDependencies["@vitest/coverage-istanbul"]).toBe(root.devDependencies.vitest);
		expect(root.devDependencies["@vitest/coverage-v8"]).toBe(root.devDependencies.vitest);
	});

	it.each([
		".",
		"apps/nutritionfacts",
		"apps/roadmap",
		"apps/site",
		"packages/aiinfo",
		".template/esm",
		".template/instui",
		".template/react",
		".template/vanilla",
	])("uses supported formatter settings in %s", (directory) => {
		const config = parse(
			readFileSync(new URL(`../${directory}/.oxfmtrc.jsonc`, import.meta.url), "utf8"),
		);
		const schema = readManifest("../node_modules/oxfmt/configuration_schema.json");
		for (const key of Object.keys(config)) {
			expect(key === "$schema" || Object.hasOwn(schema.properties, key)).toBe(true);
		}
		expect(config.useTabs).toBe(true);
	});

	it.each(["esm", "instui", "react", "vanilla"])("keeps the %s starter installable", (template) => {
		const starter = readManifest(`../.template/${template}/package.json`);
		expect(starter.scripts.typecheck).toBe("tsc --noEmit");
		expect(starter.engines.node).toBe(root.engines.node);
		expect(starter.devDependencies["@instructure.ai/shared-configs"]).toBe("workspace:^");
		if (starter.dependencies?.react) {
			const app = readManifest("../apps/nutritionfacts/package.json");
			expect(starter.dependencies.react).toBe(app.dependencies.react);
			expect(starter.dependencies["react-dom"]).toBe(app.dependencies["react-dom"]);
		}
	});

	it("publishes declarations for both module systems", () => {
		const library = readManifest("../packages/aiinfo/package.json");
		for (const mode of ["import", "require"]) {
			const entry = library.exports["."][mode];
			expect(
				readFileSync(new URL(`../packages/aiinfo/${entry.types}`, import.meta.url), "utf8"),
			).toContain("AiInfo");
			expect(
				readFileSync(new URL(`../packages/aiinfo/${entry.default}`, import.meta.url), "utf8"),
			).toContain("AiInfo");
		}
	});
});
