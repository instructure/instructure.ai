/// <reference path="../types/index.d.ts" />

import {
	exec,
	exitWithError,
	isValidCommand,
	isValidPackage,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async (): Promise<void> => {
	const { command, output, args }: WorkspaceCommand = Workspace();

	const lintCommands: AllowedCommands = [
		"all",
		"packages",
		"root",
		"package",
		"apps",
		"app",
	] as const;

	if (!isValidCommand(command, lintCommands))
		exitWithError("Invalid lint command.");

	const lintRoot = (pkg: PackageName, args: CommandExtraArgs) => {
		console.log(`Linting root package: ${pkg}`);
		exec("pnpm biome check", { args });
	};

	const lintPackage = (pkg: PackageName, args: CommandExtraArgs) => {
		console.log(`Linting package: ${pkg}`);
		exec(`pnpm -F ${pkg} lint`, { args: args.slice(2) });
	};

	const lintPackages = (packages: string[], args: CommandExtraArgs) => {
		packages.forEach((pkg) => {
			lintPackage(pkg, args);
		});
	};

	try {
		switch (command) {
			case "all":
				console.log("Linting apps:");
				console.log(output);
				lintPackages(output as PackageName[], args.slice(2));
				break;
			case "app":
				console.log("output:", output);
				if (output) {
					lintPackage(output as PackageName, args.slice(2));
				} else {
					console.log(
						"No app found in workspace. Did you mean `lint package <name>`?",
					);
				}
				break;
			case "apps":
				if (Array.isArray(output) && output.length) {
					console.log("Linting apps:");
					console.log(output);
					lintPackages(output as PackageName[], args.slice(1));
				} else {
					console.log("No apps found in workspace.");
				}
				break;
			case "package":
				if (output) {
					lintPackage(output as PackageName, args.slice(2));
				} else {
					console.log(
						"No package found in workspace. Did you mean `lint app <name>`?",
					);
				}
				break;
			case "packages":
				if (Array.isArray(output) && output.length) {
					console.log("Linting packages:");
					console.log(output);
					lintPackages(output as PackageName[], args.slice(1));
				} else {
					console.log("No packages found in workspace.");
				}
				break;
			case "root":
				console.log(output);
				lintRoot(output as PackageName, args.slice(1));
				break;
			default:
				if (isValidPackage(command as PackageName)) {
					lintPackage(command as PackageName, args.slice(1));
				} else {
					exitWithError(`Unknown lint command: ${command}
Valid commands are: ${lintCommands.join(", ")}`);
				}
		}
	} catch (error) {
		exitWithError("Lint failed:", error);
	}
};

main().catch((e) => unknownError(e));
