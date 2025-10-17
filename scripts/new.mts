/// <reference path="../types/index.d.ts" />

import { promises as fs } from "node:fs";
import path from "node:path";
import {
	exec,
	exitWithError,
	isAvailablePackage,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

async function main() {
	const { output } = Workspace(["workspace"], "new");

	const getTemplate = () => {
		const args = process.argv.slice(2);
		const templateIdx = args.indexOf("--template");
		if (templateIdx !== -1 && args[templateIdx + 1]) {
			const tArg = args[templateIdx + 1];
			if (typeof tArg === "string") {
				const t: WorkspaceTemplate = tArg
					.trim()
					.toLowerCase() as WorkspaceTemplate;
				return t;
			}
		}
		return "vanilla" as WorkspaceTemplate;
	};

	const TEMPLATES = ["vanilla", "react", "instui", "esm"] as const;
	const TYPES = ["app", "package"] as const;
	const TEMPLATE: WorkspaceTemplate = getTemplate();

	const isESM = TEMPLATE === "esm";

	const TYPE: WorkspaceType = isESM ? "package" : "app";
	const USAGE = `new <name> [--template (default) ${TEMPLATES.join(" | ")}] [--type (default)${TYPES.join(" | ")}]`;

	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.error(USAGE);
		process.exit(1);
	}

	const PACKAGENAME = args[0] ? args[0].trim() : "";

	if (!PACKAGENAME)
		exitWithError(`Error: ${TYPE} name is required as the first argument.`);

	const workspaceName =
		output && typeof output === "object" && "name" in output
			? output.name
			: undefined;

	if (!workspaceName) exitWithError("No workspace name found in output.");

	if (!isAvailablePackage(PACKAGENAME))
		exitWithError(
			`'${PACKAGENAME}' already exists in workspace ${workspaceName}.`,
		);

	const REPLACESTRING = "<<packagename>>";
	const CLINAME = "<<cliname>>";
	const FULLPACKAGENAME = `${workspaceName}/${PACKAGENAME}`;
	const INSTUI = "<<instui-guidelines>>";

	// Validate NPM package name (unscoped)
	console.log(`Creating ${TYPE} '${PACKAGENAME}'...`);
	if (!isAvailablePackage(PACKAGENAME))
		exitWithError(
			"Error: Package name must be a valid NPM package name: lowercase letters, numbers, hyphens, periods, and start with a letter or number.",
		);

	const cwd = process.cwd();
	const pkgDir = path.resolve(cwd, `${TYPE}s`, PACKAGENAME);
	const sharedTplDir = path.resolve(cwd, ".template", "shared");
	const chosenTplDir = path.resolve(cwd, ".template", TEMPLATE);

	// Check if package already exists
	if (await pathExists(pkgDir))
		exitWithError(
			`Error: ${TYPE} '${PACKAGENAME}' already exists in ./${TYPE}s.`,
		);

	console.log(`Initializing ${TYPE}: ${PACKAGENAME}`);
	console.log(`Using template: ${TEMPLATE}`);

	// Create directory
	await fs.mkdir(pkgDir, { recursive: true });

	// Copy template contents
	if (!isESM) {
		await safeCopyDir(sharedTplDir, pkgDir);
		// After copying shared configs, rename tests/package.t.ts to tests/package.test.ts
		const testSrc = path.join(pkgDir, "tests/package.t.ts");
		const testDest = path.join(pkgDir, "tests/package.test.ts");
		try {
			// Use moveFile from workspace utils
			const { moveFile } = await import(
				"@instructure.ai/shared-configs/workspace"
			);
			if (await pathExists(testSrc)) {
				moveFile(testSrc, testDest);
			}
		} catch (err) {
			console.warn("Could not rename test file:", err);
		}
	}
	await safeCopyDir(chosenTplDir, pkgDir);

	// Replace placeholders in specific files
	await replaceInFile(
		path.join(pkgDir, "package.json"),
		REPLACESTRING,
		FULLPACKAGENAME,
	);
	await replaceInFile(
		path.join(pkgDir, "README.md"),
		REPLACESTRING,
		FULLPACKAGENAME,
	);

	await replaceInFile(path.join(pkgDir, "README.md"), CLINAME, PACKAGENAME);

	if (TEMPLATE === "instui") {
		const url = "https://instructure.design/llms.txt";
		let guidelines = "";
		try {
			const response = await fetch(url);
			guidelines = (await response.text()) ?? url;
		} catch (err) {
			console.error("Failed to fetch instui guidelines:", err);
			guidelines = url;
		}
		await replaceInFile(
			path.join(pkgDir, "/.github/copilot-instructions.md"),
			INSTUI,
			guidelines,
		);
	}
	await replaceInFile(path.join(pkgDir, "package.json"), CLINAME, PACKAGENAME);

	// Install dependencies for the new package (pnpm workspace)
	console.log("Installing dependencies...");
	exec(`pnpm --filter ${PACKAGENAME} install`, { cwd });

	console.log(`Package '${PACKAGENAME}' initialized successfully.`);
	if (isESM) {
		exec(`pnpm --filter ${PACKAGENAME} build`, { cwd });
		console.log(`\`pnpm ${PACKAGENAME}\` to run the script.`);
	} else {
		console.log(`\`pnpm dev ${PACKAGENAME}\` to run the development server.`);
	}
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

main().catch((err) => exitWithError("Error running new script.", err));

export { main };
