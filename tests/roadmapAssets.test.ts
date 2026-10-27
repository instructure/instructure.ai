import { execFileSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it } from "vite-plus/test";
import config from "../apps/roadmap/vite.config.mts";

it("removes obsolete Roadmap assets before rebuilding public output", () => {
	const root = resolve(import.meta.dirname, "..");
	const roadmap = join(root, "apps/roadmap");
	const fixture = mkdtempSync(join(tmpdir(), "roadmap-assets-"));
	try {
		for (const file of ["package.json", "scripts"]) {
			cpSync(join(roadmap, file), join(fixture, file), { recursive: true });
		}
		writeFileSync(
			join(fixture, "vite.config.mts"),
			`export default ${JSON.stringify({ pack: config.pack })};`,
		);
		writeFileSync(join(fixture, "tsconfig.json"), "{}");
		symlinkSync(join(root, "node_modules"), join(fixture, "node_modules"), "dir");
		for (const directory of ["scripts", "styles", "fonts", "images", "apis"]) {
			mkdirSync(join(fixture, "src/assets", directory), { recursive: true });
		}
		writeFileSync(join(fixture, "src/assets/scripts/index.ts"), 'console.log("theme");');
		writeFileSync(join(fixture, "src/assets/styles/index.css"), "body { color: red; }");
		for (const name of ["current", "obsolete"]) {
			writeFileSync(join(fixture, `src/assets/images/${name}.svg`), "<svg/>");
			writeFileSync(join(fixture, `src/assets/apis/${name}.json`), '{ "name": "API" }');
		}
		const build = () =>
			execFileSync("pnpm", ["build:assets"], {
				cwd: fixture,
				encoding: "utf8",
				timeout: 60000,
			});
		build();
		expect(existsSync(join(fixture, "public/images/obsolete.svg"))).toBe(true);
		expect(existsSync(join(fixture, "public/apis/obsolete.json"))).toBe(true);

		rmSync(join(fixture, "src/assets/images/obsolete.svg"));
		rmSync(join(fixture, "src/assets/apis/obsolete.json"));
		build();
		for (const file of ["images/obsolete.svg", "apis/obsolete.json"]) {
			expect(existsSync(join(fixture, "public", file))).toBe(false);
		}
		for (const file of [
			"images/current.svg",
			"apis/current.json",
			"themeEditor.js",
			"themeEditor.css",
		]) {
			expect(existsSync(join(fixture, "public", file))).toBe(true);
		}
		expect(readFileSync(join(fixture, "public/apis/current.json"), "utf8")).toBe('{"name":"API"}');
	} finally {
		rmSync(fixture, { recursive: true, force: true });
	}
}, 120000);
