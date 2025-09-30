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

	const buildCommands = ["all", "packages", "package", "apps", "app"];

	if (!isValidCommand(command, buildCommands))
		exitWithError("Invalid build command.");

	const buildPackage = (pkg: PackageName, args: CommandExtraArgs) => {
		console.log(`Building ${pkg}`);
		exec(`pnpm -F ${pkg} build`, { args: args.slice(2) });
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
			case "package":
				if (output) {
					buildPackage(output as PackageName, args);
				} else {
					console.log(
						"No package found in workspace. Did you mean `build app <name>`?",
					);
				}
				break;
			case "app":
				if (output) {
					copyPublicToDist();
					buildPackage(output as PackageName, args);
				} else {
					console.log(
						"No app found in workspace. Did you mean `build package <name>`?",
					);
				}
				break;
			case "packages":
				if (output.length) {
					console.log("Building packages:");
					console.log(output);
					buildPackages(output as PackageName[], args);
				} else {
					console.log("No packages found in workspace.");
				}
				break;
			case "apps":
				if (output.length) {
					console.log("Building apps:");
					console.log(output);
					copyPublicToDist();
					buildPackages(output as PackageName[], args);
				} else {
					console.log("No apps found in workspace.");
				}
				break;
			case "all":
				buildPackages(output as PackageName[], args);
				break;
			default:
				exitWithError(`Unknown build command: ${command}`);
		}
	} catch (error) {
		exitWithError("Build failed:", error);
	}
};

main().catch((e) => unknownError(e));
