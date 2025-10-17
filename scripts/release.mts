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

	const releaseCommands: AllowedCommands = [
		"package",
		"root",
		"packages",
	] as const;

	if (!isValidCommand(command, releaseCommands))
		exitWithError("Invalid release command.");

	const getVersion = (pkgJson: PackageJson) => pkgJson.version;

	const getNewVersion = (args: WorkspaceCommand["args"]) => {
		for (const arg of args) {
			if (typeof arg === "string") {
				const vMatch = arg.match(/^(-v|--version)=(\d+\.\d+\.\d+)$/);
				if (vMatch) {
					return vMatch[2] as PackageJson["version"];
				}
			}
		}
		return undefined;
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

	const isVersionBigger = (
		oldVersion: PackageJson["version"],
		newVersion: PackageJson["version"],
	) => {
		const oldParts = oldVersion.split(".").map((part) => parseInt(part, 10));
		const newParts = newVersion.split(".").map((part) => parseInt(part, 10));

		for (let i = 0; i < 3; i++) {
			if (newParts[i] > oldParts[i]) return true;
			if (newParts[i] < oldParts[i]) return false;
		}
		return false;
	};

	const isValidVersion = ({
		newVersion,
		version,
	}: {
		newVersion?: PackageJson["version"];
		version: PackageJson["version"];
	}): boolean => {
		if (typeof newVersion === "undefined") return false;
		if (newVersion === version) return false;
		return isVersionBigger(version, newVersion);
	};
	const setVersion = ({
		newVersion,
		version,
		path,
	}: {
		version: PackageJson["version"];
		newVersion?: PackageJson["version"];
		path: string;
	}): PackageJson["version"] => {
		let writeVersion = newVersion;
		if (!writeVersion) {
			writeVersion = bumpVersion(version);
			console.warn(
				`No new version specified, auto-incrementing to ${writeVersion}\n`,
			);
		} else {
			console.log(`Setting new version to ${writeVersion}\n`);
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
		} catch (error) {
			exitWithError("Error setting new version.", error);
		}
		return writeVersion;
	};

	const releasePackage = ({
		pkg,
		args = [],
	}: {
		pkg: FullPackageName;
		args: WorkspaceCommand["args"];
		root?: boolean;
	}) => {
		const pkgJson = getPackageJson(pkg);
		if (!pkgJson) {
			exitWithError(`Could not find package.json for package: ${pkg}`);
		}

		const version = getVersion(pkgJson.content);
		const newVersion = getNewVersion(args);

		if (newVersion && !isValidVersion({ newVersion, version })) {
			exitWithError(
				`The new version (${newVersion}) must be greater than the current version (${version}) and follow semantic versioning.`,
			);
		}

		const writeVersion = setVersion({
			newVersion: newVersion,
			path: pkgJson.path,
			version: version,
		});

		commit({ pkg, pkgJsonPath: pkgJson.path, version: writeVersion });
	};

	const releasePackages = (
		packages: FullPackageName[],
		args: CommandExtraArgs,
	) => {
		packages.forEach((pkg) => {
			releasePackage({ args, pkg });
		});
	};
	const commit = ({
		pkg,
		version,
		pkgJsonPath,
	}: {
		pkg: FullPackageName;
		version: PackageJson["version"];
		pkgJsonPath: string;
	}) => {
		const tag = `${pkg}@${version}`;
		exec(`git add ${pkgJsonPath}`);
		exec(`git commit -m "${tag}"`);
	};
	try {
		switch (command) {
			case "package":
				if (!isValidPackage(output as FullPackageName)) {
					exitWithError(
						"A valid package name is required for the package command.",
					);
				}
				releasePackage({ args: args.slice(2), pkg: output as FullPackageName });
				break;
			case "packages":
				if (Array.isArray(output) && output.length) {
					console.log("Releasing packages:", output);
					releasePackages(output, args.slice(1));
				} else {
					console.log("No packages found in workspace.");
				}				break;
			case "root":
				releasePackage({ args: args.slice(1), pkg: output as FullPackageName });
				break;
			default:
				if (isValidPackage(command)) {
					releasePackage({
						args: args.slice(1),
						pkg: command as FullPackageName,
					});
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
