import {
  Workspace,
  exec,
  exitWithError,
  getPackageName,
  isValidCommand,
  isValidFullPackageName,
  isValidPackage,
  unknownError,
} from "./workspace.mts";
import type {
  AllowedCommands,
  CommandExtraArgs,
  FullPackageName,
  PackageName,
  WorkspaceCommand,
} from "@instructure.ai/shared-configs/types";

const main = async (): Promise<void> => {
  const { command, output, args }: WorkspaceCommand = Workspace();

  const previewCommands: AllowedCommands = ["all", "app", "apps"] as const;

  const isPkgName = (val: unknown): val is PackageName =>
    typeof val === "string" && isValidPackage(val);

  const isFullPkgName = (val: unknown): val is FullPackageName =>
    typeof val === "string" && isValidFullPackageName(val);

  // Overloads remove redundant union (FullPackageName | PackageName) triggering no-redundant-type-constituents.
  function previewPackage(pkg: FullPackageName, extra: CommandExtraArgs): void;
  function previewPackage(pkg: PackageName, extra: CommandExtraArgs): void;
  function previewPackage(pkg: string, extra: CommandExtraArgs): void {
    const app = isFullPkgName(pkg) ? getPackageName(pkg) : pkg;
    exec(`pnpm preview`, {
      args: extra,
      cwd: `apps/${app}`,
    });
  }

  const previewAll = (extra: CommandExtraArgs) => {
    exitWithError("Previewing all packages is not yet supported.", extra);
  };

  // Dynamic package name: run before static command validation.
  if (isPkgName(command)) {
    previewPackage(command, args.slice(1));
    return;
  }

  if (!isValidCommand(command, previewCommands)) {
    exitWithError("Invalid preview command.");
  }

  try {
    switch (command) {
      case "app": {
        if (isFullPkgName(output) || isPkgName(output)) {
          previewPackage(output as string, args.slice(2));
        } else {
          exitWithError("Invalid app name.");
        }
        break;
      }
      case "apps":
      case "all": {
        previewAll(args.slice(1));
        break;
      }
      default: {
        // Unreachable; dynamic names handled earlier.
        exitWithError("Unknown preview command.");
      }
    }
  } catch (error) {
    exitWithError("Preview failed:", error);
  }
};

main().catch((error) => unknownError(error));

export { main };
