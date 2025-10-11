/// <reference path="../types/index.d.ts" />

import {
	exec,
	exitWithError,
	isValidCommand,
	isValidPackage,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { command, args, output } = Workspace();

	const releaseCommands: AllowedCommands = ["package", "root", "all"] as const;

	if (!isValidCommand(command, releaseCommands))
		exitWithError("Invalid release command.");

	const getArgs = (args: WorkspaceCommand["args"]) => args.slice(2);

	const pack = (
		pkg: FullPackageName,
		args: WorkspaceCommand["args"] = [],
	) => {
		const hasPackDestination = args.some(arg => typeof arg === "string" && arg.startsWith("--pack-destination"));
		if (!hasPackDestination) {
			args.push("--pack-destination=./pub");
		}
		exec(`pnpm -F ${pkg} pack ${getArgs(args).join(" ")}`);
	};

	try {
		switch (command) {
			case "package":
				if (!isValidPackage(output as FullPackageName)) {
					exitWithError(
						"A valid package name is required for the package command.",
					);
				}
				pack(output as FullPackageName, args);
				break;
			case "root":
				console.log("Packaging root is not supported yet.");
				break;
			case "all":
				console.log("Packaging all is not supported yet.");
				break;
			default:
				if (isValidPackage(command)) {
					pack(command as FullPackageName, args);
				} else {
					exitWithError(`Unknown build command: ${command}
Valid commands are: ${releaseCommands.join(", ")}`);
				}
		}
	} catch (error) {
		unknownError(error);
	}
};

main().catch((e) => unknownError(e));
