import { execFileSync } from "node:child_process";
import { allIssueLabels } from "../src/help/labels";

const repo = process.env.GITHUB_REPOSITORY ?? "instructure/instructure.ai";
const color = "1f6feb";
const dryRun = process.argv.includes("--dry-run");

for (const { name, description } of allIssueLabels()) {
	if (dryRun) console.log(`${name}\t${description}`);
	else
		execFileSync(
			"gh",
			[
				"label",
				"create",
				name,
				"-R",
				repo,
				"--description",
				description.slice(0, 100),
				"--color",
				color,
				"--force",
			],
			{ stdio: "inherit" },
		);
}
