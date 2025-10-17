/// <reference path="../types/index.d.ts" />

import {
	exec,
	exitWithError,
	getPackageName,
	isValidCommand,
	isValidFullPackageName,
	isValidPackage,
	unknownError,
	Workspace,
} from "./workspace.mts";

const main = async (): Promise<void> => {
	const { command, output, args }: WorkspaceCommand = Workspace();

	const previewCommands: AllowedCommands = ["all", "app", "apps"] as const;

	if (!isValidCommand(command, previewCommands))
		exitWithError("Invalid preview command.");

	const previewPackage = (
		pkg: FullPackageName | PackageName,
		args: CommandExtraArgs,
	) => {
		const app = isValidFullPackageName(pkg as FullPackageName)
			? getPackageName(pkg as FullPackageName)
			: (pkg as PackageName);
		exec(`pnpm preview`, {
			args,
			cwd: `apps/${app}`,
		});
	};

	const previewPackages = (args: CommandExtraArgs) => {
		exitWithError("Previewing all packages is not yet supported.", args);
		//exec(`pnpm preview:all`, { args: args.slice(1) });
	};

	try {
		if (command === "app") {
			previewPackage(output as FullPackageName, args.slice(2));
		} else if (command === "all" || command === "apps") {previewPackages(args.slice(1));}
		else {
			if (typeof output === "string" && isValidPackage(output)) {
				previewPackage(output as FullPackageName, args.slice(1));
			} else {
				if (isValidPackage(command as FullPackageName)) {
					previewPackage(command as FullPackageName, args.slice(1));
				} else {
					exitWithError(`Unknown preview command: ${command}
Valid commands are: ${previewCommands.join(", ")}`);
				}
			}
		}
	} catch (error) {
		exitWithError("Preview failed:", error);
	}
};

main().catch((e) => unknownError(e));
