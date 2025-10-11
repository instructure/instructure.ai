/// <reference path="../types/index.d.ts" />

import {
	exitWithError,
	isValidCommand,
	isValidPackage,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { command, args, output } = Workspace();


	const releaseCommands: AllowedCommands = ["package", "root"] as const;

	if (!isValidCommand(command, releaseCommands))
		exitWithError("Invalid release command.");

	const getArgs = (args: WorkspaceCommand["args"]) => args.slice(2);

	const pack = (
		command: AllowedCommand,
		args: WorkspaceCommand["args"] = [],
		output?: WorkspaceCommand["output"]
	) => {
		console.log("you are in pack()")
		console.log("command:", command);
		console.log("args:", args);
		console.log("output:", output);
		const extraArgs: CommandExtraArgs = getArgs(args);
		console.log("extraArgs:", extraArgs);
		// do stuff here
	};

	try {
		switch (command) {
			case "package":
				pack(command, args, output);
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
