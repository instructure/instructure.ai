import {
	exec,
	exitWithError,
	isValidCommand,
	unknownError,
	Workspace,
} from "./workspace.mts";

const main = async (): Promise<void> => {
	const { command, output, args }: WorkspaceCommand = Workspace();

	const previewCommands = ["all", "package", "packages"];

	if (!isValidCommand(command, previewCommands))
		exitWithError("Invalid preview command.");

	const previewPackage = (pkg: PackageName, args: CommandExtraArgs) => {
		exec(`pnpm -F ${pkg} preview`, { args: args.slice(2) });
	};

	const previewPackages = (args: CommandExtraArgs) => {
		exitWithError("Previewing all packages is not yet supported.", args);
		//exec(`pnpm preview:all`, { args: args.slice(1) });
	};

	try {
		if (command === "package") previewPackage(output as string, args);
		else if (command === "all" || command === "packages") previewPackages(args);
	} catch (error) {
		exitWithError("Preview failed:", error);
	}
};

main().catch((e) => unknownError(e));
