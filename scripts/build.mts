import { execSync } from "node:child_process";
import {
	exitWithError,
	validCommand,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const { command, output } = Workspace();

const buildCommands = ["all", "packages", "root", "package"];

if (!validCommand(command, buildCommands))
	exitWithError("Invalid build command.");

const buildRoot = (pkg: string) => {
	console.log(`Building root package: ${pkg}`);
	execSync("pnpm build:root", { stdio: "inherit" });
};

const buildPackage = (pkg: string) => {
	console.log(`Building package: ${pkg}`);
	execSync(`pnpm -F ${pkg} build`, { stdio: "inherit" });
};

const buildPackages = (packages: string[]) => {
	packages.forEach((pkg) => {
		buildPackage(pkg);
	});
};

try {
	if (command === "root") buildRoot(output as string);
	else if (command === "package") buildPackage(output as string);
	else if (command === "packages") buildPackages(output as string[]);
	else if (command === "all") {
		buildRoot(output as string);
		buildPackages(output as string[]);
	}
} catch (error) {
	console.error("Build failed:", error);
	process.exit(1);
}
