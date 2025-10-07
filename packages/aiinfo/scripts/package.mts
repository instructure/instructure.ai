/// <reference path="../types/index.d.ts" />

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { unknownError } from "@instructure.ai/shared-configs/workspace";
import { execFileSync } from "node:child_process";
import Arborist from "@npmcli/arborist";
import packlist from "npm-packlist";
import pkg from "../package.json" with { type: "json" };
import { Log } from "../utils";
import type { LogObject } from "../types";

interface PackageJson {
	name: string;
	version: string;
	types: string;
	type: string;
	dependencies: Record<string, string>;
	devDependencies?: Record<string, string>;
	private?: boolean;
	scripts?: Record<string, string>;
	files?: string[];
}

const main = async () => {
	const start = true;
	const end = true;
	const color: LogObject["color"] = "yellowBright";

	Log({ message: `Packaging ${pkg.name}`, type: "info", start, color });
	// 1. Create temp dir
	const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "aiinfo-pack-"));
	const pkgDir = path.resolve(__dirname, "..");

	// Use Arborist to load the actual tree
	const arborist = new Arborist({ path: pkgDir });
	const tree = await arborist.loadActual();

	// Use packlist with the Arborist tree
	const filesToPack = await packlist(tree);

	// 3. Copy files to tmpDir
	for (const relPath of filesToPack) {
		const srcPath = path.join(pkgDir, relPath);
		const destPath = path.join(tmpDir, relPath);
		const stat = await fs.stat(srcPath);
		if (stat.isDirectory()) {
			await fs.mkdir(destPath, { recursive: true });
		} else {
			await fs.mkdir(path.dirname(destPath), { recursive: true });
			await fs.copyFile(srcPath, destPath);
		}
	}

	const pkgData: PackageJson = { ...pkg };
	const toRemove: (keyof PackageJson)[] = [
		"private",
		"scripts",
		"devDependencies",
		"files",
	];
	for (const key of toRemove) {
		if (key in pkgData) {
			delete pkgData[key];
		}
	}
	await fs.writeFile(
		path.join(tmpDir, "package.json"),
		JSON.stringify(pkgData, null, 2),
	);

	const distDir = path.resolve(__dirname, "../dist");
	await fs.mkdir(distDir, { recursive: true });
	execFileSync("pnpm", ["pack", "--pack-destination", distDir], { cwd: tmpDir, stdio: "inherit" });

await fs.rm(tmpDir, { force: true, recursive: true });
	Log({ message: "", type: "info", end, color });

};

main().catch((e) => unknownError(e));
