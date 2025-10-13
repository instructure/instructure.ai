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

	const devCommands: AllowedCommands = ["package", "app"] as const;

	if (!isValidCommand(command, devCommands))
		exitWithError("Invalid dev command.");

	const devPackage = (pkg: PackageName, args: CommandExtraArgs) =>
		exec(`pnpm -F ${pkg} dev`, { args: args.slice(2) });

	try {
		if (command === "package" || command === "app") {
			if (output) {
				devPackage(output as PackageName, args);
			} else {
				console.log("No package found in workspace.");
			}
		} else {
			if (isValidPackage(command)) {
				devPackage(command as PackageName, args);
			} else {
				exitWithError(`Unknown dev command: ${command}
 Valid commands are: ${devCommands.join(", ")}`);
			}
		}
	} catch (e) {
		exitWithError("Dev failed:", e);
	}
};

main().catch((e) => unknownError(e));
