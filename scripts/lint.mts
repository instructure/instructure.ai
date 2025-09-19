import {
	exec,
	exitWithError,
	isValidCommand,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async (): Promise<void> => {
	const { command, output, args }: WorkspaceCommand = Workspace();

	const lintCommands = ["all", "packages", "root", "package"];

	if (!isValidCommand(command, lintCommands))
		exitWithError("Invalid lint command.");

	const lintRoot = (pkg: PackageName, args: CommandExtraArgs) => {
		console.log(`Linting root package: ${pkg}`);
		exec("pnpm biome check", { args: args.slice(1) });
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
		if (command === "root") lintRoot(output as string, args);
		else if (command === "package") lintPackage(output as string, args);
		else if (command === "packages") lintPackages(output as string[], args);
		else if (command === "all") {
			lintRoot(output as string, args);
			lintPackages(output as string[], args);
		}
	} catch (error) {
		exitWithError("Lint failed:", error);
	}
};

main().catch((e) => unknownError(e));
