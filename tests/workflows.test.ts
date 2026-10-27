import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { parseDocument } from "yaml";

interface Step {
	uses?: string;
	with?: Record<string, unknown>;
}

interface Workflow {
	jobs: Record<string, { steps: Step[] }>;
}

const directory = new URL("../.github/workflows/", import.meta.url);
const filenames = readdirSync(directory).filter((filename) => /\.ya?ml$/.test(filename));
const actionVersions = new Map([
	["actions/checkout", "v7"],
	["actions/setup-node", "v7"],
	["pnpm/action-setup", "v6.1.0"],
	["actions/configure-pages", "v6"],
	["actions/upload-pages-artifact", "v5"],
	["actions/deploy-pages", "v5"],
]);
const root = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("GitHub workflows", () => {
	it.each(filenames)("%s uses current actions and the supported toolchain", (filename) => {
		const document = parseDocument(readFileSync(new URL(filename, directory), "utf8"), {
			uniqueKeys: true,
		});
		expect(document.errors).toEqual([]);
		const workflow: Workflow = document.toJS();
		const steps = Object.values(workflow.jobs).flatMap((job) => job.steps);

		for (const step of steps) {
			if (!step.uses) continue;

			const [action, version] = step.uses.split("@");
			expect(actionVersions.has(action), `Unreviewed action: ${step.uses}`).toBe(true);
			expect(version).toBe(actionVersions.get(action));

			if (action === "actions/setup-node") {
				const nodeVersion = step.with?.["node-version"];
				expect([root.engines.node.match(/^>=(\d+)\./)?.[1], "${{ matrix.node }}"]).toContain(
					nodeVersion,
				);
				expect(step.with?.["check-latest"]).toBe(true);
			}

			if (action === "pnpm/action-setup") {
				expect(root.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+$/);
				expect(step.with?.version).toBeUndefined();
			}

			if (action === "actions/upload-pages-artifact") {
				expect(step.with?.path).toBe("./dist");
				expect(step.with?.["include-hidden-files"]).toBe(true);
			}
		}
	});
});
