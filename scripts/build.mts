import fs from "node:fs";
import path from "node:path";
import {
	exec,
	exitWithError,
	getPackageName,
	isValidCommand,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { command, output, args } = Workspace();

	const buildCommands = ["all", "packages", "package"];

	if (!isValidCommand(command, buildCommands))
		exitWithError("Invalid build command.");

	const buildPackage = (pkg: PackageName, args: CommandExtraArgs) => {
		console.log(`Building package: ${pkg}`);
		exec(`pnpm -F ${pkg} build`, { args: args.slice(2) });
		// copyPublicToDist(pkg as FullPackageName);
	};

	const buildPackages = (packages: PackageName[], args: CommandExtraArgs) => {
		packages.forEach((pkg) => {
			buildPackage(pkg, args);
		});
	};

	const copyPublicToDist = (pkg?: FullPackageName) => {
		const pack = pkg ? getPackageName(pkg) : null;

		const src = path.resolve(
			__dirname,
			`${pkg ? `../packages/${pack}/public` : "../public"}`,
		);
		const dest = path.resolve(
			__dirname,
			`${pkg ? `../dist/${pack}` : "../dist"}`,
		);

		if (!fs.existsSync(src)) {
			console.warn("Source directory does not exist", src);
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

		if (command === "package") buildPackage(output as PackageName, args);
		else if (command === "packages" || command === "all")
			buildPackages(output as PackageName[], args);
	} catch (error) {
		exitWithError("Build failed:", error);
	}
};

main().catch((e) => unknownError(e));
