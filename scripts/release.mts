/// <reference path="../types/index.d.ts" />

import fs from "node:fs";
import {
	exec,
	exitWithError,
	getPackageJson,
	isValidCommand,
	isValidPackage,
	unknownError,
	Workspace,
} from "@instructure.ai/shared-configs/workspace";

const main = async () => {
	const { command, args, output } = Workspace();

	const releaseCommands: AllowedCommands = ["package", "root", "all"] as const;

	if (!isValidCommand(command, releaseCommands))
		exitWithError("Invalid release command.");

	const getArgs = (args: WorkspaceCommand["args"]) => args.slice(2);

	const getVersion = (pkgJson: PackageJson) => pkgJson.version;

	const getNewVersion = (args: WorkspaceCommand["args"]) => {
		for (const arg of args) {
			let newVersion: PackageJson["version"] | undefined;
			if (typeof arg === "string") {
				const vMatch = arg.match(/^(-v|--version)=(\d+\.\d+\.\d+)$/);
				if (vMatch) {
					newVersion = vMatch[2] as PackageJson["version"];
					break;
				}
			}
			return newVersion;
		}
	};

	const bumpVersion = (
		version: PackageJson["version"],
	): PackageJson["version"] => {
		const workingVersion = version.split(".");
		const bumpedVersion = workingVersion.map((num, idx) => {
			if (idx === workingVersion.length - 1) {
				return (parseInt(num, 10) + 1).toString();
			}
			return num;
		});
		return bumpedVersion.join(".") as PackageJson["version"];
	};
	const setVersion = ({
		newVersion,
		version,
		path,
	}: {
		version: PackageJson["version"];
		newVersion?: PackageJson["version"];
		path: string;
	}) => {
		let writeVersion = newVersion;
		if (!writeVersion) {
			writeVersion = bumpVersion(version);
			console.warn(
				`New new version specified, auto-incrementing to ${writeVersion}`,
			);
		}
		try {
			if (!writeVersion) {
				throw new Error("Failed to determine new version.");
			}
			const pkgJson = require(path) as PackageJson;
			pkgJson.version = writeVersion;
			fs.writeFileSync(path, `${JSON.stringify(pkgJson, null, 2)}\n`, {
				encoding: "utf-8",
			});
			console.log(`Set new version to ${writeVersion} in ${path}`);
		} catch (error) {
			exitWithError("Error setting new version.", error);
		}
	};

	const pack = (pkg: FullPackageName, args: WorkspaceCommand["args"] = []) => {
		const hasPackDestination = args.some(
			(arg) => typeof arg === "string" && arg.startsWith("--pack-destination"),
		);
		if (!hasPackDestination) {
			args.push("--pack-destination=./pub");
		}
		const pkgJson = getPackageJson(pkg);
		if (!pkgJson) {
			exitWithError(`Could not find package.json for package: ${pkg}`);
		}

		const version = getVersion(pkgJson.content);
		const newVersion = getNewVersion(args);

		if (newVersion && newVersion === version) {
			exitWithError(
				`The new version (${newVersion}) must be different from the current version (${version}).`,
			);
		}

		setVersion({
			newVersion: newVersion,
			path: pkgJson.path,
			version: version,
		});

		exec(`pnpm -F ${pkg} pack ${getArgs(args).join(" ")}`);
	};

	try {
		switch (command) {
			case "package":
				if (!isValidPackage(output as FullPackageName)) {
					exitWithError(
						"A valid package name is required for the package command.",
					);
				}
				pack(output as FullPackageName, args);
				break;
			case "root":
				console.log("Packaging root is not supported yet.");
				break;
			case "all":
				console.log("Packaging all is not supported yet.");
				break;
			default:
				if (isValidPackage(command)) {
					pack(command as FullPackageName, args);
				} else {
					exitWithError(`Unknown build command: ${command}
Valid commands are: ${releaseCommands.join(", ")}`);
				}
		}
	} catch (error) {
		unknownError(error);
	}
};

main().catch((e) => unknownError(e));
