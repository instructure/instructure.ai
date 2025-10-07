/// <reference path="../types/index.d.ts" />

import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { unknownError } from "@instructure.ai/shared-configs/workspace";
import Arborist from "@npmcli/arborist";
import packlist from "npm-packlist";
import pkg from "../package.json" with { type: "json" };
import type { LogObject } from "../types";
import { Log } from "../utils";

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
	publishConfig?: { access: string };
}

const main = async () => {
	const start = true;
	const end = true;
	const color: LogObject["color"] = "yellowBright";

	Log({ color, message: `Packaging ${pkg.name}`, start, type: "info" });
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
	// Add publishConfig for public access
	pkgData.publishConfig = { access: "public" };
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

	const pubDir = path.resolve(__dirname, "../../../pub");
	await fs.mkdir(pubDir, { recursive: true });
	execFileSync("pnpm", ["pack", "--pack-destination", pubDir], {
		cwd: tmpDir,
		stdio: "inherit",
	});

	await fs.rm(tmpDir, { force: true, recursive: true });
	Log({ color, end, message: "", type: "info" });
};

main().catch((e) => unknownError(e));
