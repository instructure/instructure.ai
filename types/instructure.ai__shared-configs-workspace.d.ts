type WorkspaceName = `@${string}`;
type FullPackageName = `${WorkspaceName}/${string}`;
type PackageName = string;
type WorkspaceObj = {
	name: WorkspaceName;
	packages: PackageName[];
	apps: PackageName[];
};

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

const COMMANDS = [
	"app",
	"apps",
	"package",
	"packages",
	"root",
	"help",
	"name",
	"all",
	"workspace"
] as const;
type Command = typeof COMMANDS[number];

type AllowedCommands = ReadonlyArray<
		WorkspaceCommand["command"]
	>

type AllowedCommand = AllowedCommands[number];

type WorkspaceCommand = {
	command: Command;
	args: string[];
	script?: string;
	output?: WorkspaceName | WorkspaceObj | FullPackageName | FullPackageName[];
};

type CommandExtraArgs = string[];

type WorkspaceTemplate = "vanilla" | "react" | "instui";

type WorkspaceType = "app" | "package";
