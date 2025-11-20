type WorkspaceName = `@${string}`;
type FullPackageName = `${WorkspaceName}/${string}`;
type PackageName = string;
interface WorkspaceObj {
  name: WorkspaceName;
  packages: PackageName[];
  apps: PackageName[];
}

interface PackageJson {
  version: `${number}.${number}.${number}`;
  name: `@instructure.ai/${string}`;
  [key: string]: unknown;
}

interface WorkspaceInfo {
  name(): void;
  fullPackageName(index: number): void;
  rootPackage(): void;
  allPackages(): void;
  packages(): void;
  info(): void;
}

interface CommandInfo {
  package?: PackageName | FullPackageName;
  help(): void;
  readonly command: string | undefined;
}

type WorkspaceFn = (
  args?: string[],
  script?: string | undefined,
) => WorkspaceCommand;

const COMMANDS = [
  "app",
  "apps",
  "package",
  "packages",
  "root",
  "help",
  "name",
  "all",
  "workspace",
] as const;
type Command = (typeof COMMANDS)[number];

type AllowedCommands = readonly WorkspaceCommand["command"][];

type AllowedCommand = AllowedCommands[number];

interface WorkspaceCommand {
  command: Command;
  args: string[];
  script?: string;
  output?: WorkspaceName | WorkspaceObj | FullPackageName | FullPackageName[];
}

type CommandExtraArgs = string[];

type WorkspaceTemplate = "vanilla" | "react" | "instui" | "esm";

type WorkspaceType = "app" | "package";
