/// <reference path="../types/index.d.ts" />

import {
	exec,
	exitWithError,
	getFullPackageName,
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
		"packages",
		"package",
		"apps",
		"app",
		"root",
	] as const;

	if (!isValidCommand(command, testCommands))
		exitWithError("Invalid test command.");

	const testPackage = (pkg: FullPackageName, args: CommandExtraArgs) => {
		console.log(`test ${pkg}`);
		exec(`pnpx vitest run --project=${pkg}`, { args: args.slice(2) });
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
				console.log("Testing all:");
				console.log(output);
				exec(`pnpx vitest`);
				break;
			case "root":
				console.log("Testing root package:");
				testPackage(getRootPackage(), args);
				break;
			case "app":
				if (output) {
					testPackage(output as FullPackageName, args);
				} else {
					console.log(
						"No app found in workspace. Did you mean `test package <name>`?",
					);
				}
				break;
			case "package":
				if (output) {
					testPackage(output as FullPackageName, args);
				} else {
					console.log(
						"No package found in workspace. Did you mean `test app <name>`?",
					);
				}
				break;
			case "apps":
				if (Array.isArray(output) && output.length) {
					console.log("Testing apps:");
					console.log(output);
					testPackages(output as FullPackageName[], args);
				} else {
					console.log("No apps found in workspace.");
				}
				break;
			case "packages":
				if (Array.isArray(output) && output.length) {
					console.log("Testing packages:");
					console.log(output);
					testPackages(output as FullPackageName[], args);
				} else {
					console.log("No packages found in workspace.");
				}
				break;
			default:
				if (isValidPackage(command)) {
					testPackage(getFullPackageName(command) as FullPackageName, args);
				} else {
					exitWithError(`Unknown test command: ${command}`);
				}
		}
	} catch (error) {
		exitWithError("Test failed:", error);
	}
};
main().catch((e) => unknownError(e));
