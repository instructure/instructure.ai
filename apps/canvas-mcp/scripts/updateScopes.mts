import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const mapleRoot = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("Usage: node scripts/updateScopes.mts /path/to/maple");
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
	cwd: mapleRoot,
	encoding: "utf8",
}).trim();
const dirty = execFileSync(
	"git",
	[
		"status",
		"--porcelain",
		"--untracked-files=all",
		"--",
		"src/tools",
		"scripts/print-tool-scopes.sh",
	],
	{ cwd: mapleRoot, encoding: "utf8" },
);
if (dirty.trim())
	throw new Error(
		"Commit or discard Maple tool/generator changes before pinning a manifest revision",
	);
const output = execFileSync("sh", ["scripts/print-tool-scopes.sh"], {
	cwd: mapleRoot,
	encoding: "utf8",
});
const toolScopes = [
	...new Set([...output.matchAll(/"(url:[^"\n]+)"/gu)].map((match) => match[1])),
].sort();
if (
	!toolScopes.length ||
	toolScopes.some((scope) => !/^url:(GET|POST|PUT|PATCH|DELETE)\|\/\S+$/u.test(scope))
)
	throw new Error("Invalid Maple generator output");
const scopes = ["https://sso.canvaslms.com/all-client-scopes", ...toolScopes];
if (!scopes.includes("url:POST|/api/v1/oauth2/introspect"))
	scopes.push("url:POST|/api/v1/oauth2/introspect");
writeFileSync(
	fileURLToPath(new URL("../src/scopes.generated.json", import.meta.url)),
	JSON.stringify(
		{
			mapleRevision: revision,
			generatedAt: new Date().toISOString().slice(0, 10),
			status: "unreviewed",
			reviewedAt: null,
			scopes,
		},
		null,
		2,
	) + "\n",
);
process.stdout.write(
	`Generated ${scopes.length} scope lines from ${revision}; release review remains required.\n`,
);
