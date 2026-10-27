import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const destination = process.argv[2];
if (!destination) throw new Error("Provide an external consumer fixture directory");
const root = resolve(import.meta.dirname, "..");
mkdirSync(destination);
execFileSync("pnpm", ["pack", "--out", resolve(destination, "aiinfo.tgz")], {
	cwd: resolve(root, "packages/aiinfo"),
	stdio: "inherit",
});
writeFileSync(
	resolve(destination, "package.json"),
	JSON.stringify({
		private: true,
		type: "module",
		dependencies: { "@instructure.ai/aiinfo": "file:./aiinfo.tgz" },
	}),
);
copyFileSync(resolve(root, "tests/consumer.mjs"), resolve(destination, "consumer.mjs"));
// Compile fixture assets outside workspace linking to verify published export resolution.
for (const extension of ["mts", "cts"]) {
	copyFileSync(
		resolve(root, `tests/fixtures/consumer.${extension}.txt`),
		resolve(destination, `consumer.${extension}`),
	);
}
execFileSync("pnpm", ["install", "--ignore-workspace"], { cwd: destination, stdio: "inherit" });
execFileSync(
	"tsc",
	[
		"--noEmit",
		"--strict",
		"--skipLibCheck",
		"--target",
		"es2020",
		"--module",
		"nodenext",
		"--moduleResolution",
		"nodenext",
		"--ignoreConfig",
		"consumer.mts",
		"consumer.cts",
	],
	{ cwd: destination, stdio: "inherit" },
);
