import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
	exitWithError,
	validCommand,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const { command, output } = Workspace();

const lintCommands = ["all", "packages", "root", "package"];

if (!validCommand(command, lintCommands))
	exitWithError("Invalid lint command.");

const lintRoot = (pkg: string) => {
	console.log(`Linting root package: ${pkg}`);
	execSync("pnpm lint:root", { stdio: "inherit" });
};

const lintPackage = (pkg: string) => {
	console.log(`Building package: ${pkg}`);
	execSync(`pnpm -F ${pkg} build`, { stdio: "inherit" });
};

const lintPackages = (packages: string[]) => {
	packages.forEach((pkg) => {
		lintPackage(pkg);
	});
};

try {
	if (command === "root") lintRoot(output as string);
	else if (command === "package") lintPackage(output as string);
	else if (command === "packages") lintPackages(output as string[]);
	else if (command === "all") {
		lintRoot(output as string);
		lintPackages(output as string[]);
	}
} catch (error) {
	console.error("Lint failed:", error);
	process.exit(1);
}
