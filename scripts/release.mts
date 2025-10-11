/// <reference path="../types/index.d.ts" />

import {
	exitWithError,
	isValidCommand,
	isValidPackage,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { command, output, args } = Workspace();

	const releaseCommands: AllowedCommands = ["package", "root"] as const;

	if (!isValidCommand(command, releaseCommands))
		exitWithError("Invalid release command.");

	const pack = (
		command: WorkspaceCommand["command"],
		output: WorkspaceCommand["output"],
		args: WorkspaceCommand["args"],
	) => {
		console.log(`command is: ${command}`);
		console.log(`args are: ${args}`);
		console.log(`Output is package: ${output}`);
	};

	try {
		switch (command) {
			case "package":
				pack(command, output, args);
				break;
			case "root":
				console.log("releasing root");
				break;
			default:
				if (isValidPackage(command)) {
					console.log(`Releasing package: ${command}`);
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
