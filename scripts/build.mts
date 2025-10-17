/// <reference path="../types/index.d.ts" />

import fs from "node:fs";
import path from "node:path";
import {
	exec,
	exitWithError,
	getPackageName,
	isValidCommand,
	isValidPackage,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";
import { updateIssues } from "./issues.mts";

const main = async () => {
	const { command, output, args } = Workspace();
	const buildCommands: AllowedCommands = [
		"all",
		"packages",
		"package",
		"apps",
		"app",
	] as const;

	if (!isValidCommand(command, buildCommands))
		exitWithError("Invalid build command.");

	const buildPackage = (pkg: PackageName, args: CommandExtraArgs) => {
		console.log(`Building ${pkg}`);
		exec(`pnpm -F ${pkg} build`, { args });
	};

	const buildPackages = (packages: PackageName[], args: CommandExtraArgs) => {
		packages.forEach((pkg) => {
			buildPackage(pkg, args);
		});
	};

	const copyPublicToDist = (pkg?: FullPackageName) => {
		const pack = pkg ? getPackageName(pkg) : null;

		let dir: string;
		if (
			pack &&
			fs.existsSync(path.resolve(__dirname, `../apps/${pack}/public`))
		) {
			dir = path.resolve(__dirname, `../apps/${pack}/public`);
		} else if (
			pack &&
			fs.existsSync(path.resolve(__dirname, `../packages/${pack}/public`))
		) {
			dir = path.resolve(__dirname, `../packages/${pack}/public`);
		} else {
			dir = path.resolve(__dirname, `../public`);
		}

		const src = path.resolve(__dirname, dir);
		const dest = path.resolve(
			__dirname,
			`${pack ? `../dist/${pack}` : "../dist"}`,
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
		switch (command) {
			case "all":
				console.log("Building apps:");
				console.log(output);
				buildPackages(output as PackageName[], args.slice(2));
				break;
			case "app":
				if (output) {
					copyPublicToDist();
					buildPackage(output as PackageName, args.slice(2));
				} else {
					console.log(
						"No app found in workspace. Did you mean `build package <name>`?",
					);
				}
				break;
			case "apps":
				if (Array.isArray(output) && output.length) {
					console.log("Building apps:");
					console.log(output);
					copyPublicToDist();
					buildPackages(output as PackageName[], args.slice(1));
				} else {
					console.log("No apps found in workspace.");
				}
				break;
			case "package":
				if (output) {
					buildPackage(output as PackageName, args.slice(2));
				} else {
					console.log(
						"No package found in workspace. Did you mean `build app <name>`?",
					);
				}
				break;
			case "packages":
				if (Array.isArray(output) && output.length) {
					console.log("Building packages:");
					console.log(output);
					buildPackages(output as PackageName[], args.slice(1));
				} else {
					console.log("No packages found in workspace.");
				}
				break;
			default:
				if (isValidPackage(command)) {
					buildPackage(command as PackageName, args.slice(1));
				} else {
					exitWithError(`Unknown build command: ${command}
Valid commands are: ${buildCommands.join(", ")}`);
				}
		}
		await updateIssues();
	} catch (error) {
		exitWithError("Build failed:", error);
	}
};

main().catch((e) => unknownError(e));

export { main };
