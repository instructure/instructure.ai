export type WorkspaceName = `@${string}`;

export type FullPackageName = `${WorkspaceName}/${string}`;

export type PackageName = string;

export interface WorkspaceObj {
  name: WorkspaceName;
  packages: PackageName[];
  apps: PackageName[];
}

export interface PackageJson {
  version: `${number}.${number}.${number}`;
  name: `@instructure.ai/${string}`;
  [key: string]: unknown;
}

export interface WorkspaceInfo {
  name(): void;
  fullPackageName(index: number): void;
  rootPackage(): void;
  allPackages(): void;
  packages(): void;
  info(): void;
}

export interface CommandInfo {
  package?: FullPackageName;
  help(): void;
  readonly command: string | undefined;
}

export type WorkspaceFn = (args?: string[], script?: string) => WorkspaceCommand;

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

export type Command = (typeof COMMANDS)[number];

export type AllowedCommands = readonly WorkspaceCommand["command"][];

export type AllowedCommand = AllowedCommands[number];

export interface WorkspaceCommand {
  command: Command;
  args: string[];
  script?: string;
  output?: WorkspaceName | WorkspaceObj | FullPackageName | FullPackageName[];
}

export type CommandExtraArgs = string[];

export type WorkspaceTemplate = "vanilla" | "react" | "instui" | "esm";

export type WorkspaceType = "app" | "package";
