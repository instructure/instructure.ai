import {
  Workspace,
  exec,
  exitWithError,
  isValidCommand,
  isValidPackage,
  unknownError,
} from "@instructure.ai/shared-configs/workspace";
import type {
  AllowedCommands,
  CommandExtraArgs,
  PackageName,
  WorkspaceCommand,
} from "@instructure.ai/shared-configs/types";

const main = async (): Promise<void> => {
  const { command, output, args }: WorkspaceCommand = Workspace();

  const lintCommands: AllowedCommands = [
    "all",
    "packages",
    "root",
    "package",
    "apps",
    "app",
  ] as const;

  const lintRoot = (pkg: PackageName, args: CommandExtraArgs) => {
    console.log(`Linting root package: ${pkg}`);
    exec("pnpm lint:root", { args });
  };

  const lintPackage = (pkg: PackageName, cmdArgs: CommandExtraArgs) => {
    console.log(`Linting package: ${pkg}`);
    exec(`pnpm -F ${pkg} lint`, { args: cmdArgs.slice(2) });
  };

  const lintPackages = (packages: string[], cmdArgs: CommandExtraArgs) => {
    packages.forEach((pkg) => {
      lintPackage(pkg, cmdArgs);
    });
  };

  if (isValidPackage(command)) {
    lintPackage(command as PackageName, args.slice(1));
    return;
  }

  if (!isValidCommand(command, lintCommands)) {
    exitWithError("Invalid lint command.");
  }

  try {
    switch (command) {
      case "all": {
        console.log("Linting apps:");
        console.log(output);
        lintPackages(output as PackageName[], args.slice(2));
        break;
      }
      case "app": {
        if (output) {
          lintPackage(output as PackageName, args.slice(2));
        } else {
          console.log("No app found in workspace. Did you mean `lint package <name>`?");
        }
        break;
      }
      case "apps": {
        if (Array.isArray(output) && output.length) {
          console.log("Linting apps:");
          console.log(output);
          lintPackages(output as PackageName[], args.slice(1));
        } else {
          console.log("No apps found in workspace.");
        }
        break;
      }
      case "package": {
        if (output) {
          lintPackage(output as PackageName, args.slice(2));
        } else {
          console.log("No package found in workspace. Did you mean `lint app <name>`?");
        }
        break;
      }
      case "packages": {
        if (Array.isArray(output) && output.length) {
          console.log("Linting packages:");
          console.log(output);
          lintPackages(output as PackageName[], args.slice(1));
        } else {
          console.log("No packages found in workspace.");
        }
        break;
      }
      case "root": {
        lintRoot(output as PackageName, args.slice(1));
        break;
      }
      default: {
        exitWithError("Invalid lint command.");
      }
    }
  } catch (error) {
    exitWithError("Lint failed:", error);
  }
};

main().catch((error) => unknownError(error));

export { main };
