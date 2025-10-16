/// <reference path="../types/index.d.ts" />

import {
	exec,
	exitWithError,
	getFullPackageName,
	getPackagePath,
	getRootPackage,
	isValidCommand,
	isValidPackage,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { command, output, args } = Workspace();
	const testCommands: AllowedCommands = [
		"all",
		"package",
		"app",
		"root",
	] as const;

	if (!isValidCommand(command, testCommands))
		exitWithError("Invalid test command.");

	const testPackage = (pkg: FullPackageName, args: CommandExtraArgs) => {
		exec(`pnpx vitest run --config=${getPackagePath(pkg)}/vitest.config.mts`, {
			args,
		});
	};

	const testPackages = (
		packages: FullPackageName[],
		args: CommandExtraArgs,
	) => {
		packages.forEach((pkg) => {
			testPackage(pkg, args);
		});
	};

	try {
		switch (command) {
			case "all":
				exec(`pnpx vitest run`, { args: args.slice(2) });
				break;
			case "root":
				testPackage(getRootPackage(), args.slice(1));
				break;
			case "app":
				if (output) {
					testPackage(output as FullPackageName, args.slice(2));
				} else {
					console.log(
						"No app found in workspace. Did you mean `test package <name>`?",
					);
				}
				break;
			case "package":
				if (output) {
					testPackage(output as FullPackageName, args.slice(2));
				} else {
					console.log(
						"No package found in workspace. Did you mean `test app <name>`?",
					);
				}
				break;
			case "apps":
				if (Array.isArray(output) && output.length) {
					console.log("Apps is not currently supported.");
				} else {
					console.log("No apps found in workspace.");
				}
				break;
			case "packages":
				if (Array.isArray(output) && output.length) {
					console.log("Packages is not currently supported.");
				} else {
					console.log("No packages found in workspace.");
				}
				break;
			default:
				if (isValidPackage(command)) {
					testPackage(getFullPackageName(command) as FullPackageName, args.slice(1));
				} else {
					exitWithError(`Unknown test command: ${command}`);
				}	
		}
	} catch (error) {
		exitWithError("Test failed:", error);
	}
};
main().catch((e) => unknownError(e));
