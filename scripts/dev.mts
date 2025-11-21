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

  const devCommands: AllowedCommands = ["package", "app"] as const;

  const isPkgName = (val: unknown): val is PackageName =>
    typeof val === "string" && isValidPackage(val);

  if (isPkgName(command)) {
    exec(`pnpm -F ${command} dev`, { args: args.slice(1) });
    return;
  }

  if (!isValidCommand(command, devCommands)) {
    exitWithError("Invalid dev command.");
  }

  const devPackage = (pkg: PackageName, extra: CommandExtraArgs) =>
    exec(`pnpm -F ${pkg} dev`, { args: extra });

  try {
    if (command === "package" || command === "app") {
      if (isPkgName(output)) {
        // original arg slicing preserved
        devPackage(output, args.slice(2));
      } else {
        console.log("No package found in workspace.");
      }
    } else {
      exitWithError("Unknown dev command.");
    }
  } catch (error) {
    exitWithError("Dev failed:", error);
  }
};

main().catch((error) => unknownError(error));

export { main };
