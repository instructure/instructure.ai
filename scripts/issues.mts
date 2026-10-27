import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse, stringify } from "yaml";

export function updateIssues() {
	const root = resolve(import.meta.dirname, "..");
	const packages: { name: string }[] = JSON.parse(
		execFileSync("pnpm", ["list", "-r", "--depth", "-1", "--json"], {
			cwd: root,
			encoding: "utf8",
		}),
	);
	const names = packages
		.map(({ name }) => name.split("/").pop()!)
		.toSorted((a, b) =>
			a === "shared-configs" ? -1 : b === "shared-configs" ? 1 : a.localeCompare(b),
		);
	const file = resolve(root, ".github/ISSUE_TEMPLATE/1-bug.yml");
	const document = parse(readFileSync(file, "utf8"));
	const dropdown = document.body.find((item: { id: string }) => item.id === "package");
	if (!dropdown?.attributes || names.length === 0)
		throw new Error("Cannot update package dropdown");
	if (JSON.stringify(dropdown.attributes.options) !== JSON.stringify(names)) {
		dropdown.attributes.options = names;
		writeFileSync(file, stringify(document));
	}
}

if (import.meta.main) updateIssues();
