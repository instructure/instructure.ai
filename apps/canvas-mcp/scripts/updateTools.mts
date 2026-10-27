import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseSync, types as t } from "@babel/core";

const mapleRoot = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("Usage: vpx scripts/updateTools.mts /path/to/maple");
const dirty = execFileSync(
	"git",
	["status", "--porcelain", "--untracked-files=all", "--", "src/tools", "tool-catalogs"],
	{ cwd: mapleRoot, encoding: "utf8" },
);
if (dirty.trim()) throw new Error("Maple tools and catalogs must be clean before updating");
const catalogFile = readdirSync(join(mapleRoot, "tool-catalogs"))
	.filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file))
	.sort()
	.at(-1);
if (!catalogFile) throw new Error("No released Maple catalog found");
interface PublishedTool {
	name: string;
	description: string;
	annotations: { readOnlyHint: boolean };
}
const catalog: { catalog: string; count: number; tools: PublishedTool[] } = JSON.parse(
	readFileSync(join(mapleRoot, "tool-catalogs", catalogFile), "utf8"),
);
if (catalog.catalog !== catalogFile.slice(0, -5) || catalog.count !== catalog.tools.length)
	throw new Error("Invalid released catalog");

function property(object: t.ObjectExpression, name: string): t.Node | undefined {
	return object.properties.find(
		(entry): entry is t.ObjectProperty =>
			t.isObjectProperty(entry) && t.isIdentifier(entry.key, { name }),
	)?.value;
}

function text(value: t.Node | undefined): string | undefined {
	return t.isStringLiteral(value) ? value.value : undefined;
}

function strings(value: t.Node | undefined): string[] {
	if (!value) return [];
	if (!t.isArrayExpression(value) || value.elements.some((item) => !t.isStringLiteral(item)))
		throw new Error("Expected literal metadata array");
	return value.elements.map((item) => {
		if (!t.isStringLiteral(item)) throw new Error("Expected metadata string");
		return item.value;
	});
}

const metadata = new Map<string, { title: string; roles: string[]; resource: string }>();
const customDir = join(mapleRoot, "src/tools/custom");
for (const file of readdirSync(customDir, { recursive: true, encoding: "utf8" }).filter((file) =>
	/\.tool(?:_\d{4}-\d{2}-\d{2})?\.ts$/u.test(file),
)) {
	const path = join(customDir, file);
	const source = parseSync(readFileSync(path, "utf8"), {
		filename: path,
		configFile: false,
		babelrc: false,
		parserOpts: { plugins: ["typescript"] },
	});
	if (!source) throw new Error(`Cannot parse tool: ${path}`);
	for (const statement of source.program.body) {
		if (!t.isExportNamedDeclaration(statement) || !t.isVariableDeclaration(statement.declaration))
			continue;
		for (const declaration of statement.declaration.declarations) {
			const call = declaration.init;
			if (!t.isCallExpression(call) || !t.isIdentifier(call.callee, { name: "defineTool" }))
				continue;
			const options = call.arguments[0];
			if (!t.isObjectExpression(options)) throw new Error(`Invalid tool: ${path}`);
			const name = text(property(options, "toolName"));
			const since = text(property(options, "since"));
			const until = text(property(options, "until"));
			if (!name || (since && since > catalog.catalog) || (until && until <= catalog.catalog))
				continue;
			const title = text(property(options, "title"));
			if (!title || metadata.has(name)) throw new Error(`Missing title or duplicate tool: ${name}`);
			const meta = property(options, "_meta");
			if (meta && !t.isObjectExpression(meta)) throw new Error(`Invalid metadata: ${name}`);
			const resource = meta
				? strings(property(meta, "resourceTypes"))[0]?.split("_")[0]
				: undefined;
			if (!resource) throw new Error(`Missing resource type: ${name}`);
			metadata.set(name, {
				title,
				roles: meta ? strings(property(meta, "roles")) : [],
				resource,
			});
		}
	}
}
const tools = catalog.tools.map((tool) => {
	const meta = metadata.get(tool.name);
	if (!meta) throw new Error(`No custom source metadata for ${tool.name}; verify its provenance`);
	if (!tool.description || typeof tool.annotations?.readOnlyHint !== "boolean")
		throw new Error(`Incomplete published metadata: ${tool.name}`);
	const description = tool.description.split("\n\n")[0]!;
	const example = tool.description
		.split("**Examples:**\n")[1]
		?.match(/^- User: "([\s\S]*?)" → `/u)?.[1];
	return {
		...meta,
		description,
		readOnly: tool.annotations.readOnlyHint,
		...(example ? { example } : {}),
	};
});
writeFileSync(
	new URL("../src/help/tools.generated.json", import.meta.url),
	JSON.stringify({ catalog: catalog.catalog, tools }, null, 2) + "\n",
);
process.stdout.write(`Updated ${tools.length} tools from catalog ${catalog.catalog}.\n`);
