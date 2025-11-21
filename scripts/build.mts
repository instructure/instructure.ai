import fs from "node:fs";
import path from "node:path";
import {
  Workspace,
  exec,
  exitWithError,
  getPackageName,
  isValidCommand,
  isValidPackage,
  unknownError,
} from "@instructure.ai/shared-configs/workspace";
import type {
  AllowedCommands,
  CommandExtraArgs,
  FullPackageName,
  PackageName,
} from "@instructure.ai/shared-configs/types";
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

  const isPackageName = (val: unknown): val is PackageName =>
    typeof val === "string" && isValidPackage(val);

  const isPackageNameArray = (val: unknown): val is PackageName[] =>
    Array.isArray(val) && val.every(isPackageName);

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
    const pack = pkg ? getPackageName(pkg) : undefined;

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

  if (isPackageName(command)) {
    buildPackage(command, args.slice(1));
    await updateIssues();
    return;
  }

  if (!isValidCommand(command, buildCommands)) {
    exitWithError("Invalid build command.");
  }

  try {
    switch (command) {
      case "all": {
        console.log("Building apps:");
        console.log(output);
        if (isPackageNameArray(output)) {
          buildPackages(output, args.slice(2));
        } else {
          console.log("No valid packages found.");
        }
        break;
      }
      case "app": {
        if (isPackageName(output)) {
          copyPublicToDist();
          buildPackage(output, args.slice(2));
        } else {
          console.log(
            "No app found in workspace. Did you mean `build package <name>`?",
          );
        }
        break;
      }
      case "apps": {
        if (isPackageNameArray(output) && output.length) {
          console.log("Building apps:");
          console.log(output);
          copyPublicToDist();
          buildPackages(output, args.slice(1));
        } else {
          console.log("No apps found in workspace.");
        }
        break;
      }
      case "package": {
        if (isPackageName(output)) {
          buildPackage(output, args.slice(2));
        } else {
          console.log(
            "No package found in workspace. Did you mean `build app <name>`?",
          );
        }
        break;
      }
      case "packages": {
        if (isPackageNameArray(output) && output.length) {
          console.log("Building packages:");
          console.log(output);
          buildPackages(output, args.slice(1));
        } else {
          console.log("No packages found in workspace.");
        }
        break;
      }
      default: {
        // Unreachable: dynamic package names handled earlier.
        exitWithError("Unknown build command.");
      }
    }
    await updateIssues();
  } catch (error) {
    exitWithError("Build failed:", error);
  }
};

main().catch((error) => unknownError(error));

export { main };
