import fs from "node:fs";
import path from "node:path";
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

	const buildPackage = (pkg: string, args: CommandExtraArgs) => {
		console.log(`Building package: ${pkg}`);
		exec(`pnpm -F ${pkg} build`, { args: args.slice(2) });
	};

	const buildPackages = (packages: string[], args: CommandExtraArgs) => {
		packages.forEach((pkg) => {
			buildPackage(pkg, args);
		});
	};

	const copyPublicToDist = () => {
		const src = path.resolve(__dirname, "../public");
		const dest = path.resolve(__dirname, "../dist");

		if (!fs.existsSync(src)) {
			console.warn(`Source directory ${src} does not exist.`);
			return;
		}

		fs.rmSync(dest, { force: true, recursive: true });
		fs.mkdirSync(dest, { recursive: true });

		fs.readdirSync(src).forEach((file) => {
			const srcFile = path.join(src, file);
			const destFile = path.join(dest, file);

			if (fs.statSync(srcFile).isDirectory()) {
				fs.cpSync(srcFile, destFile, { recursive: true });
			} else {
				fs.copyFileSync(srcFile, destFile);
			}
		});
	};

	try {
		copyPublicToDist();

		if (command === "package") buildPackage(output as string, args);
		else if (command === "packages" || command === "all")
			buildPackages(output as string[], args);
	} catch (error) {
		exitWithError("Build failed:", error);
	}
};

main().catch((e) => unknownError(e));
