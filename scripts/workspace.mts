import { renameSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { name } from "../package.json" with { type: "json" };
import type {
  CommandInfo,
  FullPackageName,
  PackageJson,
  PackageName,
  WorkspaceCommand,
  WorkspaceInfo,
  WorkspaceName,
  WorkspaceObj,
  WorkspaceType,
} from "@instructure.ai/shared-configs/types";

/**
 * Move or rename a file from src to dest.
 * Throws if the operation fails.
 */
function moveFile(src: string, dest: string): void {
  try {
    renameSync(src, dest);
  } catch (error) {
    exitWithError(`Error moving file from '${src}' to '${dest}':`, error);
  }
}

// Regex to match valid NPM unscoped package names and scoped workspace names.
const pn = /^[a-z0-9\-~][a-z0-9\-._~]*$/;
const wn = /^@([a-z0-9\-~][a-z0-9\-._~]*)$/;
const fn = new RegExp(`^${wn.source.slice(1, -1)}/${pn.source.slice(1, -1)}$`);

const isValidFullPackageName = (pkg: string): pkg is FullPackageName => {
  return fn.test(pkg);
};

const isValidPackageName = (pkg: string): pkg is PackageName => {
  return pn.test(pkg);
};

const isValidWorkspaceName = (ws: string): ws is WorkspaceName => {
  return wn.test(ws);
};

function getPackagePath(pkg: PackageName): string;
function getPackagePath(pkg: FullPackageName): string;
function getPackagePath(pkg: string): string {
  if (!isValidPackageName(pkg) && !isValidFullPackageName(pkg)) {
    exitWithError("Error: Invalid package name.");
  }
  const packageName = isValidFullPackageName(pkg) ? getPackageName(pkg) : pkg;
  if (
    pkg === getRootPackage() ||
    packageName === getPackageName(getRootPackage())
  ) {
    return resolve(__dirname, "../");
  } else {
    const packagesPath = join(__dirname, "../packages", packageName);
    const appsPath = join(__dirname, "../apps", packageName);
    if (existsSync(packagesPath)) {
      return packagesPath;
    } else if (existsSync(appsPath)) {
      return appsPath;
    } else {
      exitWithError(
        `Error: Could not find package directory for '${packageName}' in either packages or apps.`,
      );
      return "";
    }
  }
}

function getPackageJson(pkg: PackageName): {
  content: PackageJson;
  path: string;
};
function getPackageJson(pkg: FullPackageName): {
  content: PackageJson;
  path: string;
};
function getPackageJson(pkg: string): { content: PackageJson; path: string } {
  if (!isValidPackageName(pkg) && !isValidFullPackageName(pkg)) {
    exitWithError("Error: Invalid package name.");
  }
  const packageName = isValidFullPackageName(pkg) ? getPackageName(pkg) : pkg;
  let pkgJsonPath: string;
  if (
    pkg === getRootPackage() ||
    packageName === getPackageName(getRootPackage())
  ) {
    pkgJsonPath = join(__dirname, "../package.json");
  } else {
    const packageDir = getPackagePath(packageName);
    pkgJsonPath = join(packageDir, "package.json");
  }
  try {
    return { content: require(pkgJsonPath), path: pkgJsonPath };
  } catch (error) {
    exitWithError(
      `Error: Could not read package.json for package '${packageName}'.`,
      error,
    );
  }
  return { content: {} as PackageJson, path: "" };
}

const getRootPackage = (): FullPackageName => {
  if (!isValidFullPackageName(name)) {
    exitWithError(
      `Error: Package ${name} is not defined or not in the expected format '@scope/name' in package.json`,
    );
  }
  const RootPackage: FullPackageName = name as FullPackageName;

  return RootPackage;
};

const getWorkspace = (name: FullPackageName): WorkspaceName => {
  if (!isValidFullPackageName(name)) {
    exitWithError(
      "Error: package name is not defined or not in the expected format '@scope/name' in package.json",
    );
  }
  const Workspace: WorkspaceName = name.split("/")[0] as WorkspaceName;
  if (!isValidWorkspaceName(Workspace)) {
    exitWithError("Error: Invalid workspace name.");
  }

  return Workspace;
};

const getPackageName = (name: FullPackageName): PackageName => {
  if (!isValidFullPackageName(name)) {
    exitWithError(
      "Error: package name is not defined or not in the expected format '@scope/name' in package.json",
    );
  }
  return name.split("/")[1] as PackageName;
};

const getFullPackageName = (name: PackageName): FullPackageName => {
  if (!isValidPackageName(name)) {
    exitWithError("Error: Invalid package name.");
  }
  return `${getWorkspace(getRootPackage())}/${name}` as FullPackageName;
};

const getPackages = (type?: WorkspaceType): PackageName[] => {
  const appsDir = join(process.cwd(), "apps");
  const pkgsDir = join(process.cwd(), "packages");

  const packagesDirs =
    type === "app"
      ? [appsDir]
      : (type === "package"
        ? [pkgsDir]
        : [appsDir, pkgsDir]);
  const workspaceName = getWorkspace(getRootPackage() as FullPackageName);
  let allDirs: string[] = [];
  for (const dirPath of packagesDirs) {
    try {
      const dirs = readdirSync(dirPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => ({ base: dirPath, name: dirent.name }));
      allDirs = allDirs.concat(dirs.map((d) => JSON.stringify(d)));
    } catch {
      // Ignore missing folders
    }
  }

  const packageNames = allDirs
    .map((dirStr) => {
      const dir = JSON.parse(dirStr);
      try {
        const pkgJsonPath = join(dir.base, dir.name, "package.json");
        const pkgJson = require(pkgJsonPath);
        if (
          isValidFullPackageName(pkgJson.name) &&
          pkgJson.name.startsWith(workspaceName)
        ) {
          return pkgJson.name.split("/")[1] as PackageName;
        } else {
          console.warn(
            `Warning: Invalid package name '${pkgJson.name}' in ${dir.base}/${dir.name}/package.json`,
          );
          return;
        }
      } catch {
        console.warn(
          `Warning: Could not read package.json for ${dir.base}/${dir.name}`,
        );
        return;
      }
    })
    .filter((name): name is PackageName => !!name);

  return [getPackageName(getRootPackage()), ...packageNames];
};

const exitWithError = (message: string, error?: unknown): never => {
  console.error(message);
  if (error instanceof Error) {
    console.error(error.stack ?? error.message);
  } else if (typeof error === "string") {
    console.error(error);
  } else if (error !== undefined) {
    console.error(error);
  }
  process.exit(1);
};

const unknownError = (error?: unknown) =>
  exitWithError("An unknown error occurred.", error);

class WorkspaceClass implements WorkspaceInfo {
  private workspaceName: WorkspaceName;
  private workspacePackages: PackageName[];
  private workspaceApps: PackageName[];
  private workspaceAll: PackageName[];

  constructor(
    workspaceName?: WorkspaceName,
    workspacePackages?: PackageName[],
    workspaceApps?: PackageName[],
    workspaceAll?: PackageName[],
  ) {
    this.workspaceName =
      workspaceName ?? getWorkspace(getRootPackage() as FullPackageName);
    this.workspacePackages = workspacePackages ?? getPackages("package");
    this.workspaceApps =
      workspaceApps ??
      getPackages("app").filter(
        (app) => app !== getPackageName(getRootPackage()),
      );
    this.workspaceAll = workspaceAll ?? getPackages();
  }

  name(): WorkspaceName {
    return this.workspaceName;
  }

  fullPackageName(index: number): FullPackageName {
    const fullName: FullPackageName = `${this.workspaceName}/${this.workspaceAll[index]}`;
    if (!isValidFullPackageName(fullName)) {
      exitWithError("Error: Invalid full package name.");
    }
    return fullName;
  }

  rootPackage(): FullPackageName {
    return this.fullPackageName(0);
  }

  allPackages(): FullPackageName[] {
    return this.workspaceAll.map((_pkg, index) => this.fullPackageName(index));
  }

  all(): FullPackageName[] {
    return this.workspaceAll.map((_pkg, index) => this.fullPackageName(index));
  }

  packages(): FullPackageName[] {
    return this.workspacePackages.map((app) => getFullPackageName(app));
  }

  apps(): FullPackageName[] {
    return this.workspaceApps.map((app) => getFullPackageName(app));
  }

  info(): WorkspaceObj {
    // oxc-ignore assist/source/useSortedKeys: manual order for console output
    return {
      apps: this.workspaceApps,
      name: this.workspaceName,
      packages: this.workspacePackages,
    };
  }
}

class CommandClass implements CommandInfo {
  args: string[];
  constructor(args: string[]) {
    this.args = args || process.argv;
  }
  get command() {
    return this.args[0] as WorkspaceCommand["command"];
  }
  // Return raw second arg (un-normalized) to avoid unreachable narrowing later.
  get packageRaw(): string | undefined {
    const arg = this.args[1];
    return typeof arg === "string" ? arg : undefined;
  }
  // Keep normalized full name when needed elsewhere.
  get package(): FullPackageName | undefined {
    const raw = this.packageRaw;
    if (!raw) {
      return undefined;
    }
    if (isValidFullPackageName(raw)) {
      return raw;
    }
    if (isValidPackageName(raw)) {
      return getFullPackageName(raw);
    }
    return undefined;
  }
  help(script?: WorkspaceCommand["script"]) {
    console.log(`
Usage: ${script ? script : "Workspace"} <command> [options]

Commands:
  all                   Execute all packages in the workspace, including root
  package <name>        Execute package <name> or <scope>/<name>
  packages              Execute all packages
  app <name>            Execute app <name> or <scope>/<name>
  apps                  Execute all apps
  root                  Execute against the root package
  help                  Show this help message
  name                  Show the workspace name
`);
  }
}

const Workspace = (
  args: WorkspaceCommand["args"] = process.argv.slice(2) ?? [],
  script: WorkspaceCommand["script"] = process.env.SCRIPT,
): WorkspaceCommand => {
  const workspace = new WorkspaceClass();
  const command = new CommandClass(args);

  const exportObj: WorkspaceCommand = {
    args: command.args,
    command: command.command,
    script: script,
  };

  // Define static commands first
  const staticCommands = [
    "help",
    "name",
    "workspace",
    "all",
    "packages",
    "apps",
    "root",
    "package",
    "app",
  ] as const;

  // Check static commands BEFORE dynamic package names
  const isStaticCommand = staticCommands.includes(
    command.command as (typeof staticCommands)[number],
  );

  // Only check for dynamic package/app names if not a static command
  if (!isStaticCommand) {
    if (isValidFullPackageName(command.command)) {
      exportObj.output = command.command;
      return exportObj;
    }
    if (isValidPackageName(command.command)) {
      exportObj.output = getFullPackageName(command.command);
      return exportObj;
    }
  }

  switch (command.command) {
    case "help": {
      command.help(script);
      return exportObj;
    }
    case "name": {
      exportObj.output = workspace.name();
      break;
    }
    case "workspace": {
      exportObj.output = workspace.info();
      break;
    }
    case "all": {
      exportObj.output = workspace.all();
      break;
    }
    case "packages": {
      exportObj.output = workspace.packages();
      break;
    }
    case "apps": {
      exportObj.output = workspace.apps();
      break;
    }
    case "root": {
      exportObj.output = workspace.rootPackage();
      break;
    }
    case "package": {
      const raw = command.packageRaw;
      if (!raw) {
        exitWithError("Error: Package name is required.");
        return exportObj;
      }
      const fullCandidate = isValidFullPackageName(raw)
        ? raw
        : isValidPackageName(raw)
          ? getFullPackageName(raw)
          : undefined;

      const found = fullCandidate
        ? workspace.packages().find((p) => p === fullCandidate)
        : undefined;

      if (!found) {
        const displayName = fullCandidate ?? raw;
        exitWithError(`Error: ${displayName} is not in the workspace.`);
        return exportObj;
      }
      exportObj.output = found;
      break;
    }
    case "app": {
      const raw = command.packageRaw;
      if (!raw) {
        exitWithError("Error: App name is required.");
        return exportObj;
      }
      const fullCandidate = isValidFullPackageName(raw)
        ? raw
        : isValidPackageName(raw)
          ? getFullPackageName(raw)
          : undefined;

      const found = fullCandidate
        ? workspace.apps().find((a) => a === fullCandidate)
        : undefined;

      if (!found) {
        const displayName = fullCandidate ?? raw;
        exitWithError(`Error: ${displayName} is not in the workspace.`);
        return exportObj;
      }
      exportObj.output = found;
      break;
    }
    default: {
      exportObj.output = undefined;
      exitWithError(`Unknown command: ${String(command.command)}`);
      break;
    }
  }

  return exportObj;
};

// Simplified: only validates static commands (dynamic handled earlier)
const isValidCommand = (
  cmd: WorkspaceCommand["command"],
  cmds: readonly WorkspaceCommand["command"][] = [],
): boolean => {
  return cmds.includes(cmd);
};

// Overloads remove redundant union (PackageName | FullPackageName).
function isValidPackage(
  pkg: PackageName,
  pkgs?: PackageName[],
): pkg is PackageName;
function isValidPackage(
  pkg: FullPackageName,
  pkgs?: PackageName[],
): pkg is FullPackageName;
function isValidPackage(
  pkg: string,
  pkgs: PackageName[] = getPackages(),
): boolean {
  const packageName = isValidFullPackageName(pkg)
    ? getPackageName(pkg as FullPackageName)
    : pkg;
  return (
    pkgs.includes(packageName as PackageName) && isValidPackageName(packageName)
  );
}

const isAvailablePackage = (
  pkg: PackageName,
  pkgs: PackageName[] = getPackages(),
): boolean => {
  return !pkgs.includes(pkg) && isValidPackageName(pkg);
};

const exec = (
  cmd: string | ((...args: unknown[]) => unknown),
  options: Record<string, unknown> = { args: [] },
) => {
  try {
    if (typeof cmd === "function") {
      (cmd as (...args: unknown[]) => unknown)(
        ...((options.args as unknown[]) ?? []),
      );
    } else {
      const { args, ...restOptions } = options as { args?: unknown[] };
      const extraArgs =
        args && Array.isArray(args) && args.length > 0
          ? args.map((a) => shellEscape(String(a)))
          : [];
      const fullCmd = [cmd, ...extraArgs].join(" ");
      execFileSync(fullCmd, [], {
        ...restOptions,
        shell: true,
        stdio: "inherit",
      });
    }
  } catch (error) {
    exitWithError(`Error executing command: ${error}`);
  }
};

function shellEscape(arg: string): string {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}

export {
  Workspace,
  isValidCommand,
  isValidPackage,
  isValidFullPackageName,
  isValidPackageName,
  exec,
  isAvailablePackage,
  exitWithError,
  unknownError,
  getPackageName,
  getPackagePath,
  getPackages,
  getFullPackageName,
  getRootPackage,
  getPackageJson,
  moveFile,
};
