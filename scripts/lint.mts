import { execSync } from "node:child_process";
import {
	exitWithError,
	validCommand,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const { command, output, args } = Workspace();

console.log("args:", args);

const lintCommands = ["all", "packages", "root", "package"];

if (!validCommand(command, lintCommands))
	exitWithError("Invalid lint command.");

const lintRoot = (pkg, args: string[]) => {
	console.log(`Linting root package: ${pkg}`);
	execSync("pnpm biome check .", { stdio: "inherit" });
};

const lintPackage = (pkg, args: string[]) => {
	console.log(`Linting package: ${pkg}`);
	execSync(`pnpm -F ${pkg} lint`, { stdio: "inherit" });
};

const lintPackages = (packages: string[], args: string[]) => {
	packages.forEach((pkg) => {
		lintPackage(pkg, args);
	});
};

try {
	if (command === "root") lintRoot(output, args);
	else if (command === "package") lintPackage(output, args);
	else if (command === "packages") lintPackages(output, args);
	else if (command === "all") {
		lintRoot(output, args);
		lintPackages(output, args);
	}
} catch (error) {
	console.error("Lint failed:", error);
	process.exit(1);
}
