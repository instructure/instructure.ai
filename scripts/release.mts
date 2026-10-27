import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function nextVersion(current: string, requested?: string): string {
	const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(current);
	if (!match) throw new Error(`Unsupported current version: ${current}`);
	const version = requested ?? `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
	if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Invalid release version: ${version}`);
	const previous = current.split(".").map(Number);
	const next = version.split(".").map(Number);
	const difference = next.findIndex((value, index) => value !== previous[index]);
	if (difference < 0 || next[difference]! < previous[difference]!) {
		throw new Error(`Release version must exceed ${current}`);
	}
	return version;
}

export function release(directory = process.cwd(), args = process.argv.slice(2)) {
	const unknown = args.filter((arg) => !/^(?:-v|--version)=/.test(arg));
	if (unknown.length || args.length > 1)
		throw new Error(`Invalid release arguments: ${args.join(" ")}`);
	const file = resolve(directory, "package.json");
	const manifest = JSON.parse(readFileSync(file, "utf8"));
	manifest.version = nextVersion(manifest.version, args[0]?.split("=")[1]);
	writeFileSync(file, `${JSON.stringify(manifest, null, "\t")}\n`);
	execFileSync("git", ["add", file], { cwd: directory, stdio: "inherit" });
	execFileSync(
		"git",
		[
			"commit",
			"-m",
			`${manifest.name}@${manifest.version}`,
			"-m",
			"Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
		],
		{ cwd: directory, stdio: "inherit" },
	);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) release();
