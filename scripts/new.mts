import { promises as fs } from "node:fs";
import path from "node:path";
import {
	exec,
	exitWithError,
	isAvailablePackage,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const TEMPLATES = ["vanilla", "react", "instui"] as const;

const USAGE = `new <packagename> [--template ${TEMPLATES.join(" | ")}]`;

async function main() {
	const { output } = Workspace(["workspace"], "new");

	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.error(USAGE);
		process.exit(1);
	}

	const PACKAGENAME = args[0] ? args[0].trim() : "";

	if (!PACKAGENAME)
		exitWithError("Error: Package name is required as the first argument.");

	const workspaceName =
		output && typeof output === "object" && "name" in output
			? output.name
			: undefined;

	if (!workspaceName) exitWithError("No workspace name found in output.");

	if (!isAvailablePackage(PACKAGENAME))
		exitWithError(
			`Package '${PACKAGENAME}' already exists in workspace ${workspaceName}.`,
		);

	let TEMPLATE: WorkspaceTemplate = "vanilla";
	const REPLACESTRING = "<<packagename>>";
	const FULLPACKAGENAME = `${workspaceName}/${PACKAGENAME}`;

	const tIdx = args.indexOf("--template");
	const tShortIdx = args.indexOf("-T");
	const templateIdx = tIdx !== -1 ? tIdx : tShortIdx;

	if (templateIdx !== -1 && args[templateIdx + 1]) {
		const tArg = args[templateIdx + 1];
		if (typeof tArg === "string") {
			const t: WorkspaceTemplate = tArg
				.trim()
				.toLowerCase() as WorkspaceTemplate;
			if (TEMPLATES.includes(t)) TEMPLATE = t;
		}
	}

	// Validate NPM package name (unscoped)
	console.log(`Creating package '${PACKAGENAME}'...`);
	if (!isAvailablePackage(PACKAGENAME))
		exitWithError(
			"Error: Package name must be a valid NPM package name: lowercase letters, numbers, hyphens, periods, and start with a letter or number.",
		);

	const cwd = process.cwd();
	const pkgDir = path.resolve(cwd, "packages", PACKAGENAME);
	const sharedTplDir = path.resolve(cwd, ".template", "shared");
	const chosenTplDir = path.resolve(cwd, ".template", TEMPLATE);

	// Check if package already exists
	if (await pathExists(pkgDir))
		exitWithError(
			`Error: Package '${PACKAGENAME}' already exists in ./packages.`,
		);

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
		FULLPACKAGENAME,
	);
	await replaceInFile(
		path.join(pkgDir, "README.md"),
		REPLACESTRING,
		FULLPACKAGENAME,
	);

	// Install dependencies for the new package (pnpm workspace)
	console.log("Installing dependencies...");
	exec(`pnpm --filter ${PACKAGENAME} install`, { cwd });

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

main().catch((err) => exitWithError("Error running new script.", err));
