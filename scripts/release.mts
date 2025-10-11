/// <reference path="../types/index.d.ts" />

import {
	exitWithError,
	isValidCommand,
	isValidPackage,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { command } = Workspace();
	const releaseCommands = ["package", "root"] as const;

	if (!isValidCommand(command, releaseCommands))
		exitWithError("Invalid release command.");

  const package = (command) => {}


	try {
		switch (command) {
			case "package":
				console.log(`Releasing package ${command}`);
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
