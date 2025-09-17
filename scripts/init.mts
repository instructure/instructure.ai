import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

type Template = "vanilla" | "react";

const USAGE = `Usage: vite-node init.mts <packagename> [--template "vanilla" | "react"]`;

async function main() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.error(USAGE);
		process.exit(1);
	}

	const PACKAGENAME = args[0] ? args[0].trim() : "";
	let TEMPLATE: Template = "vanilla";
	const REPLACESTRING = "<<packagename>>";

	// Parse optional --template argument
	const tIdx = args.indexOf("--template");
	if (tIdx !== -1 && args[tIdx + 1]) {
		const tArg = args[tIdx + 1];
		if (typeof tArg === "string") {
			const t = tArg.trim().toLowerCase();
			if (t === "react" || t === "vanilla") TEMPLATE = t as Template;
		}
	}

	// Validate NPM package name (unscoped)
	const validPkg = /^[a-z0-9][a-z0-9.-]*$/;
	if (!validPkg.test(PACKAGENAME)) {
		console.error(
			"Error: Package name must be a valid NPM package name: lowercase letters, numbers, hyphens, periods, and start with a letter or number.",
		);
		process.exit(1);
	}

	const cwd = process.cwd();
	const pkgDir = path.resolve(cwd, "packages", PACKAGENAME);
	const sharedTplDir = path.resolve(cwd, ".template", "shared");
	const chosenTplDir = path.resolve(cwd, ".template", TEMPLATE);

	// Check if package already exists
	if (await pathExists(pkgDir)) {
		console.error(
			`Error: Package '${PACKAGENAME}' already exists in ./packages.`,
		);
		process.exit(1);
	}

	console.log(`Initializing package: ${PACKAGENAME}`);
	console.log(`Using template: ${TEMPLATE}`);

	// Create directory
	await fs.mkdir(pkgDir, { recursive: true });

	// Copy template contents
	await safeCopyDir(sharedTplDir, pkgDir);
	await safeCopyDir(chosenTplDir, pkgDir);

	// Replace placeholders in specific files
	await replaceInFile(
		path.join(pkgDir, "package.json"),
		REPLACESTRING,
		PACKAGENAME,
	);
	await replaceInFile(
		path.join(pkgDir, "README.md"),
		REPLACESTRING,
		PACKAGENAME,
	);

	// Install dependencies for the new package (pnpm workspace)
	console.log("Installing dependencies...");
	try {
		execSync(`pnpm --filter ${shellEscape(PACKAGENAME)} install`, {
			cwd,
			stdio: "inherit",
		});
	} catch (_e) {
		console.error("Error running pnpm install for the new package.");
		process.exit(1);
	}

	console.log(`Package '${PACKAGENAME}' initialized successfully.`);
	console.log(`\`pnpm dev ${PACKAGENAME}\` to run the development server.`);
	process.exit(0);
}

/** Utilities */

async function pathExists(p: string): Promise<boolean> {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

async function safeCopyDir(src: string, dest: string) {
	if (!(await pathExists(src))) return;
	const entries = await fs.readdir(src, { withFileTypes: true });
	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);
		if (entry.isDirectory()) {
			await fs.mkdir(destPath, { recursive: true });
			await safeCopyDir(srcPath, destPath);
		} else if (entry.isSymbolicLink()) {
			const real = await fs.readlink(srcPath);
			await fs.symlink(real, destPath);
		} else {
			await fs.copyFile(srcPath, destPath);
		}
	}
}

async function replaceInFile(
	filePath: string,
	search: string,
	replacement: string,
) {
	if (!(await pathExists(filePath))) return;
	const content = await fs.readFile(filePath, "utf8");
	const updated = content.split(search).join(replacement);
	if (updated !== content) {
		await fs.writeFile(filePath, updated, "utf8");
	}
}

// ultra-minimal shell escaping for a single arg (no spaces in your regex anyway, but safe)
function shellEscape(s: string) {
	if (/^[A-Za-z0-9._\-@/]+$/.test(s)) return s;
	// fall back to single-quoting with escaping
	return `'${s.replace(/'/g, `'\\''`)}'`;
}

main().catch((err) => {
	console.error(err instanceof Error ? err.message : String(err));
	process.exit(1);
});
