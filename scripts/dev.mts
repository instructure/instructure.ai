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

  if (!isValidCommand(command, devCommands)) {
    exitWithError("Invalid dev command.");
  }

  const devPackage = (pkg: PackageName, args: CommandExtraArgs) =>
    exec(`pnpm -F ${pkg} dev`, { args: args.slice(2) });

  try {
    if (command === "package" || command === "app") {
      if (output) {
        devPackage(output as PackageName, args.slice(2));
      } else {
        console.log("No package found in workspace.");
      }
    } else {
      if (isValidPackage(command)) {
        devPackage(command as PackageName, args.slice(1));
      } else {
        exitWithError(`Unknown dev command: ${command}
 Valid commands are: ${devCommands.join(", ")}`);
      }
    }
  } catch (error) {
    exitWithError("Dev failed:", error);
  }
};

main().catch((error) => unknownError(error));

export { main };
