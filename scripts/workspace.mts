import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
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

const getPackages = (): PackageName[] => {
	const packagesDir = join(process.cwd(), "packages");
	const workspaceName = getWorkspace(getRootPackage() as FullPackageName);
	const dirs = readdirSync(packagesDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	if (dirs.length === 0)
		console.warn("Warning: No packages found in the ./packages directory.");

	const packageNames = dirs
		.map((dir) => {
			const pkgJsonPath = join(packagesDir, dir, "package.json");
			const pkgJson = JSON.parse(
				readFileSync(pkgJsonPath, { encoding: "utf-8" }),
			);
			if (
				isValidFullPackageName(pkgJson.name) &&
				pkgJson.name.startsWith(workspaceName)
			) {
				return pkgJson.name.split("/")[1] as PackageName;
			} else {
				console.warn(
					`Warning: Invalid package name '${pkgJson.name}' in ${dir}/package.json`,
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

	constructor(
		workspaceName?: WorkspaceName,
		workspacePackages?: PackageName[],
	) {
		this.workspaceName =
			workspaceName ?? getWorkspace(getRootPackage() as FullPackageName);
		this.workspacePackages = workspacePackages ?? getPackages();
	}

	name(): WorkspaceName {
		return this.workspaceName;
	}

	fullPackageName(index: number): FullPackageName {
		return `${this.workspaceName}/${this.workspacePackages[index]}` as FullPackageName;
	}

	rootPackage(): FullPackageName {
		return `${this.workspaceName}/${this.workspacePackages[0]}` as FullPackageName;
	}

	allPackages(): FullPackageName[] {
		return this.workspacePackages.map(
			(_pkg, index) =>
				`${this.workspaceName}/${this.workspacePackages[index]}` as FullPackageName,
		);
	}

	packages(): FullPackageName[] {
		return this.workspacePackages
			.map((_pkg, index) => this.fullPackageName(index))
			.slice(1);
	}

	info(): WorkspaceObj {
		return {
			name: this.workspaceName,
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
		return this.args[0];
	}
	get package() {
		return this.args[1];
	}
	help(script?: WorkspaceCommand["script"]) {
		console.log(`
Usage: ${script ? script : "Workspace"} <command> [options]

Commands:
  all                   Execute all packages in the workspace
  package <name>        Execute package <name> or <scope>/<name>
  packages              Execute all packages except the root package
  root                  Execute against the root package
  help                  Show this help message
	name									Show the workspace name
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
			exportObj.output = workspace.allPackages();
			break;
		case "packages":
			exportObj.output = workspace.packages();
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

			let index = -1;

			if (isValidFullPackageName(pkg)) {
				index = workspace.allPackages().indexOf(pkg);
			} else {
				index = workspace
					.allPackages()
					.findIndex((fullPkg) => fullPkg.endsWith(`/${pkg}`));
			}

			if (index === -1) {
				exitWithError(
					`Error: ${isValidFullPackageName(pkg) ? pkg : `${workspace.name()}/${pkg}`} is not in the workspace.`,
				);
				return exportObj;
			}

			exportObj.output = workspace.allPackages()[index];
			break;
		}
		default:
			exitWithError(`Unknown command: ${command.command}`);
			break;
	}

	return exportObj;
};

const isValidCommand = (
	cmd: string,
	cmds: WorkspaceCommand["command"][] = [],
): boolean => {
	if (cmds.includes(cmd)) {
		return true;
	} else {
		exitWithError(
			`Error: Invalid command '${cmd}'. Valid commands are: ${cmds.join(", ")}`,
		);
		return false;
	}
};

const isValidPackage = (
	pkg: PackageName,
	pkgs: PackageName[] = getPackages(),
): boolean => {
	return pkgs.includes(pkg) && isValidPackageName(pkg);
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
				args && Array.isArray(args) && args.length > 0
					? ` ${args.map(String).join(" ")}`
					: "";
			execSync(`${cmd}${extraArgs}`, {
				...restOptions,
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
	exec,
	isAvailablePackage,
	exitWithError,
	unknownError,
};
