import {
	exec,
	exitWithError,
	isValidCommand,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { command, output, args } = Workspace();

	const buildCommands = ["all", "packages", "package"];

	if (!isValidCommand(command, buildCommands))
		exitWithError("Invalid build command.");

	const buildRoot = (pkg: string, args: CommandExtraArgs) => {
		console.log(`Building root package: ${pkg}`);
		exec("pnpm build:root", { args: args.slice(1) });
	};

	const buildPackage = (pkg: string, args: CommandExtraArgs) => {
		console.log(`Building package: ${pkg}`);
		exec(`pnpm -F ${pkg} build`, { args: args.slice(2) });
	};

	const buildPackages = (packages: string[], args: CommandExtraArgs) => {
		packages.forEach((pkg) => {
			buildPackage(pkg, args);
		});
	};

	try {
		if (command === "root") buildRoot(output as string, args);
		else if (command === "package") buildPackage(output as string, args);
		else if (command === "packages" || command === "all")
			buildPackages(output as string[], args);
	} catch (error) {
		exitWithError("Build failed:", error);
	}
};

main().catch((e) => unknownError(e));
