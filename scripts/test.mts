import {
  Workspace,
  exec,
  exitWithError,
  getFullPackageName,
  getRootPackage,
  isValidCommand,
  isValidPackage,
  unknownError,
} from "@instructure.ai/shared-configs/workspace";
import type { AllowedCommands, CommandExtraArgs, FullPackageName, WorkspaceCommand } from "@instructure.ai/shared-configs/types";

const main = async () => {
  const { command, output, args } = Workspace();
  const testCommands: AllowedCommands = [
    "all",
    "package",
    "packages",
    "app",
    "apps",
    "root",
  ] as const;

  if (!isValidCommand(command, testCommands))
    {exitWithError("Invalid test command.");}

  const testPackage = (pkg: FullPackageName, args: CommandExtraArgs) => {
    if (pkg === getRootPackage()) {
      exec(`pnpm test:root`, {
        args,
      });
    } else {
      exec(`pnpm -F ${pkg} test`, {
        args,
      });
    }
  };

  const testPackages = (
    packages: FullPackageName[],
    args: CommandExtraArgs,
  ) => {
    packages.forEach((pkg) => {
      testPackage(pkg, args);
    });
  };

  try {
    switch (command) {
      case "all": {
        if (Array.isArray(output) && output.length) {
          console.log("Testing all:", output);
          testPackages(output, args.slice(1));
        } else {
          console.log("No apps or packages found in workspace.");
        }
        break;
      }
      case "app": {
        if (output) {
          testPackage(output as FullPackageName, args.slice(2));
        } else {
          console.log(
            "No app found in workspace. Did you mean `test package <name>`?",
          );
        }
        break;
      }
      case "apps": {
        if (Array.isArray(output) && output.length) {
          console.log("Testing apps:", output);
          testPackages(output, args.slice(1));
        } else {
          console.log("No apps found in workspace.");
        }
        break;
      }
      case "package": {
        if (output) {
          testPackage(output as FullPackageName, args.slice(2));
        } else {
          console.log(
            "No package found in workspace. Did you mean `test app <name>`?",
          );
        }
        break;
      }
      case "packages": {
        if (Array.isArray(output) && output.length) {
          console.log("Testing packages:", output);
          testPackages(output, args.slice(1));
        } else {
          console.log("No packages found in workspace.");
        }
        break;
      }
      case "root": {
        testPackage(getRootPackage(), args.slice(1));
        break;
      }
      default: {
        if (isValidPackage(command)) {
          testPackage(
            getFullPackageName(command) as FullPackageName,
            args.slice(1),
          );
        } else {
          exitWithError(`Unknown test command: ${command}`);
        }
      }
    }
  } catch (error) {
    exitWithError("Test failed:", error);
  }
};
main().catch((error) => unknownError(error));

export { main };
