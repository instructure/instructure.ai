type WorkspaceName = `@${string}`;
type FullPackageName = `${WorkspaceName}/${string}`;
type PackageName = string;
type WorkspaceObj = {
	name: WorkspaceName;
	packages: PackageName[];
};

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

type WorkspaceCommand = {
	command: string;
	args: string[];
	script?: string;
	output?: WorkspaceName | WorkspaceObj | FullPackageName | FullPackageName[];
};

type CommandExtraArgs = string[];

type WorkspaceTemplate = "vanilla" | "react" | "instui";

type WorkspaceType = "app" | "package";
