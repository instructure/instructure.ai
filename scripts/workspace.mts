/// <reference path="../types/index.d.ts" />

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { name } from "../package.json" with { type: "json" };

// Regex to match valid NPM unscoped package names and scoped workspace names.
const pn = /^[a-z0-9\-~][a-z0-9\-._~]*$/;
const wn = /^@([a-z0-9\-~][a-z0-9\-._~]*)$/;
const fn = new RegExp(`^${wn.source.slice(1, -1)}/${pn.source.slice(1, -1)}$`);

const isValidFullPackageName = (pkg: string): pkg is FullPackageName => {
	return fn.test(pkg);
};

const isValidPackageName = (pkg: string): pkg is PackageName => {
	return pn.test(pkg);
};

const isValidWorkspaceName = (ws: string): ws is WorkspaceName => {
	return wn.test(ws);
};

const getPackageJson = (
	pkg: PackageName | FullPackageName,
): { content: PackageJson; path: string } => {
	if (!isValidPackageName(pkg) && !isValidFullPackageName(pkg)) {
		exitWithError("Error: Invalid package name.");
	}
	const packageName = isValidFullPackageName(pkg) ? getPackageName(pkg) : pkg;
	const pkgJsonPath = join(
		__dirname,
		"../packages",
		packageName,
		"package.json",
	);
	try {
		return { content: require(pkgJsonPath), path: pkgJsonPath };
	} catch (err) {
		exitWithError(
			`Error: Could not read package.json for package '${packageName}'.`,
			err,
		);
	}
	return { content: {} as PackageJson, path: "" };
};

const getRootPackage = (): FullPackageName => {
	if (!isValidFullPackageName(name)) {
		exitWithError(
			`Error: Package ${name} is not defined or not in the expected format '@scope/name' in package.json`,
		);
	}
	const RootPackage: FullPackageName = name as FullPackageName;

	return RootPackage;
};

const getWorkspace = (name: FullPackageName): WorkspaceName => {
	if (!isValidFullPackageName(name)) {
		exitWithError(
			"Error: package name is not defined or not in the expected format '@scope/name' in package.json",
		);
	}
	const Workspace: WorkspaceName = name.split("/")[0] as WorkspaceName;
	if (!isValidWorkspaceName(Workspace))
		exitWithError("Error: Invalid workspace name.");

	return Workspace;
};

const getPackageName = (name: FullPackageName): PackageName => {
	if (!isValidFullPackageName(name)) {
		exitWithError(
			"Error: package name is not defined or not in the expected format '@scope/name' in package.json",
		);
	}
	return name.split("/")[1] as PackageName;
};

const getFullPackageName = (name: PackageName): FullPackageName => {
	if (!isValidPackageName(name)) {
		exitWithError("Error: Invalid package name.");
	}
	return `${getWorkspace(getRootPackage())}/${name}` as FullPackageName;
};

const getPackages = (type?: WorkspaceType): PackageName[] => {
	const appsDir = join(process.cwd(), "apps");
	const pkgsDir = join(process.cwd(), "packages");

	const packagesDirs =
		type === "app"
			? [appsDir]
			: type === "package"
				? [pkgsDir]
				: [appsDir, pkgsDir];
	const workspaceName = getWorkspace(getRootPackage() as FullPackageName);
	let allDirs: string[] = [];
	for (const dirPath of packagesDirs) {
		try {
			const dirs = readdirSync(dirPath, { withFileTypes: true })
				.filter((dirent) => dirent.isDirectory())
				.map((dirent) => ({ base: dirPath, name: dirent.name }));
			allDirs = allDirs.concat(dirs.map((d) => JSON.stringify(d)));
		} catch (_err) {
			// Ignore missing folders
		}
	}

	const packageNames = allDirs
		.map((dirStr) => {
			const dir = JSON.parse(dirStr);
			try {
				const pkgJsonPath = join(dir.base, dir.name, "package.json");
				const pkgJson = require(pkgJsonPath);
				if (
					isValidFullPackageName(pkgJson.name) &&
					pkgJson.name.startsWith(workspaceName)
				) {
					return pkgJson.name.split("/")[1] as PackageName;
				} else {
					console.warn(
						`Warning: Invalid package name '${pkgJson.name}' in ${dir.base}/${dir.name}/package.json`,
					);
					return null;
				}
			} catch (_err) {
				console.warn(
					`Warning: Could not read package.json for ${dir.base}/${dir.name}`,
				);
				return null;
			}
		})
		.filter((name): name is PackageName => !!name);

	return [getPackageName(getRootPackage()), ...packageNames];
};

const exitWithError = (message: string, error?: Error | string | unknown) => {
	console.error(message);
	if (error instanceof Error) {
		console.error(error.stack);
	} else if (typeof error === "string") {
		console.error(error);
	}
	process.exit(1);
};

const unknownError = (error?: Error | string | unknown) =>
	exitWithError("An unknown error occurred.", error);

class WorkspaceClass implements WorkspaceInfo {
	private workspaceName: WorkspaceName;
	private workspacePackages: PackageName[];
	private workspaceApps: PackageName[];
	private workspaceAll: PackageName[];

	constructor(
		workspaceName?: WorkspaceName,
		workspacePackages?: PackageName[],
		workspaceApps?: PackageName[],
		workspaceAll?: PackageName[],
	) {
		this.workspaceName =
			workspaceName ?? getWorkspace(getRootPackage() as FullPackageName);
		this.workspacePackages = workspacePackages ?? getPackages("package");
		this.workspaceApps =
			workspaceApps ??
			getPackages("app").filter(
				(app) => app !== getPackageName(getRootPackage()),
			);
		this.workspaceAll = workspaceAll ?? getPackages();
	}

	name(): WorkspaceName {
		return this.workspaceName;
	}

	fullPackageName(index: number): FullPackageName {
		const fullName: FullPackageName = `${this.workspaceName}/${this.workspaceAll[index]}`;
		if (!isValidFullPackageName(fullName)) {
			exitWithError("Error: Invalid full package name.");
		}
		return fullName;
	}

	rootPackage(): FullPackageName {
		return this.fullPackageName(0);
	}

	allPackages(): FullPackageName[] {
		return this.workspaceAll.map((_pkg, index) => this.fullPackageName(index));
	}

	all(): FullPackageName[] {
		return this.workspaceAll.map((_pkg, index) => this.fullPackageName(index));
	}

	packages(): FullPackageName[] {
		return this.workspacePackages.map((app) => getFullPackageName(app));
	}

	apps(): FullPackageName[] {
		return this.workspaceApps.map((app) => getFullPackageName(app));
	}

	info(): WorkspaceObj {
		// biome-ignore assist/source/useSortedKeys: manual order for console output
		return {
			name: this.workspaceName,
			apps: this.workspaceApps,
			packages: this.workspacePackages,
		};
	}
}

class CommandClass implements CommandInfo {
	args: string[];
	constructor(args: string[]) {
		this.args = args || process.argv;
	}
	get command() {
		return this.args[0] as WorkspaceCommand["command"];
	}
	get package() {
		return this.args[1] as PackageName | FullPackageName | undefined;
	}
	help(script?: WorkspaceCommand["script"]) {
		console.log(`
Usage: ${script ? script : "Workspace"} <command> [options]

Commands:
  all                   Execute all packages in the workspace, including root
  package <name>        Execute package <name> or <scope>/<name>
  packages              Execute all packages
  app <name>            Execute app <name> or <scope>/<name>
	apps                  Execute all apps
  root                  Execute against the root package
  help                  Show this help message
  name                  Show the workspace name
`);
	}
}

const Workspace = (
	args: WorkspaceCommand["args"] = process.argv.slice(2) ?? [],
	script: WorkspaceCommand["script"] = process.env.SCRIPT,
): WorkspaceCommand => {
	const workspace = new WorkspaceClass();
	const command = new CommandClass(args);

	const exportObj: WorkspaceCommand = {
		args: command.args,
		command: command.command,
		script: script,
	};

	switch (command.command) {
		case "help":
			command.help(script);
			return exportObj;
		case "name":
			exportObj.output = workspace.name();
			break;
		case "workspace":
			exportObj.output = workspace.info();
			break;
		case "all":
			exportObj.output = workspace.all();
			break;
		case "packages":
			exportObj.output = workspace.packages();
			break;
		case "apps":
			exportObj.output = workspace.apps();
			break;
		case "root":
			exportObj.output = workspace.rootPackage();
			break;
		case "package": {
			const pkg = command.package;
			if (!pkg) {
				exitWithError("Error: Package name is required.");
				return exportObj;
			}
			let fullPkg: FullPackageName | undefined;
			if (isValidFullPackageName(pkg)) {
				fullPkg = workspace.packages().find((p) => p === pkg);
			} else if (isValidPackageName(pkg)) {
				fullPkg = workspace.packages().find((p) => p.endsWith(`/${pkg}`));
			}
			if (!fullPkg) {
				exitWithError(
					`Error: ${isValidFullPackageName(pkg) ? pkg : `${workspace.name()}/${pkg}`} is not in the workspace.`,
				);
				return exportObj;
			}
			exportObj.output = fullPkg;
			break;
		}
		case "app": {
			const pkg = command.package;
			if (!pkg) {
				exitWithError("Error: App name is required.");
				return exportObj;
			}
			const appFullName = isValidFullPackageName(pkg)
				? workspace.apps().find((app) => app === pkg)
				: isValidPackageName(pkg)
					? workspace.apps().find((app) => app.endsWith(`/${pkg}`))
					: undefined;
			if (!appFullName) {
				exitWithError(
					`Error: ${isValidFullPackageName(pkg) ? pkg : `${workspace.name()}/${pkg}`} is not in the workspace.`,
				);
				return exportObj;
			}
			exportObj.output = appFullName;
			break;
		}
		default:
			if (isValidFullPackageName(command.command)) {
				exportObj.output = command.command;
			} else if (isValidPackageName(command.command)) {
				exportObj.output = getFullPackageName(command.command);
			} else {
				exportObj.output = undefined;
				exitWithError(`Unknown command: ${command.command}`);
			}
			break;
	}

	return exportObj;
};

const isValidCommand = (
	cmd: WorkspaceCommand["command"],
	cmds: readonly WorkspaceCommand["command"][] = [],
): boolean => {
	if (
		cmds.includes(cmd) ||
		isValidFullPackageName(cmd) ||
		isValidPackageName(cmd)
	) {
		return true;
	} else {
		exitWithError(
			`Error: Invalid command '${cmd}'. Valid commands are: ${cmds.join(", ")}`,
		);
		return false;
	}
};

const isValidPackage = (
	pkg: PackageName | FullPackageName,
	pkgs: PackageName[] = getPackages(),
): boolean => {
	const packageName = isValidFullPackageName(pkg) ? getPackageName(pkg) : pkg;
	return pkgs.includes(packageName) && isValidPackageName(packageName);
};

const isAvailablePackage = (
	pkg: PackageName,
	pkgs: PackageName[] = getPackages(),
): boolean => {
	return !pkgs.includes(pkg) && isValidPackageName(pkg);
};

const exec = (
	cmd: string | ((...args: unknown[]) => unknown),
	options: Record<string, unknown> = { args: [] },
) => {
	try {
		if (typeof cmd === "function") {
			(cmd as (...args: unknown[]) => unknown)(
				...((options.args as unknown[]) ?? []),
			);
		} else {
			const { args, ...restOptions } = options as { args?: unknown[] };
			const extraArgs =
				args && Array.isArray(args) && args.length > 0 ? args.map(String) : [];
			execFileSync(cmd, extraArgs, {
				...restOptions,
				shell: true,
				stdio: "inherit",
			});
		}
	} catch (e) {
		exitWithError(`Error executing command: ${e}`);
	}
};

export {
	Workspace,
	isValidCommand,
	isValidPackage,
	isValidFullPackageName,
	isValidPackageName,
	exec,
	isAvailablePackage,
	exitWithError,
	unknownError,
	getPackageName,
	getPackages,
	getFullPackageName,
	getRootPackage,
	getPackageJson,
};
