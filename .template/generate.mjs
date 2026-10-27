import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export async function generate(
	template,
	name,
	root = fileURLToPath(new URL("..", import.meta.url)),
) {
	if (!/^[a-z0-9][a-z0-9._-]*$/.test(name ?? "")) {
		throw new Error("Provide an unscoped lowercase package name after --");
	}
	const type = template === "esm" ? "packages" : "apps";
	const directory = resolve(root, type, name);
	const templates = fileURLToPath(new URL(".", import.meta.url));
	const replacements = {
		"<<packagename>>": `@instructure.ai/${name}`,
		"<<cliname>>": name,
		"<<pkgtype>>": type,
	};
	if (template === "instui") {
		const response = await fetch("https://instructure.design/llms.txt");
		if (!response.ok) throw new Error(`InstUI guidelines: HTTP ${response.status}`);
		replacements["<<instui-guidelines>>"] = await response.text();
	}
	await mkdir(directory);
	if (template !== "esm") await cp(resolve(templates, "shared"), directory, { recursive: true });
	await cp(resolve(templates, template), directory, { recursive: true });
	async function render(path) {
		for (const entry of await readdir(path, { withFileTypes: true })) {
			const file = resolve(path, entry.name);
			if (entry.isDirectory()) await render(file);
			else {
				let content = await readFile(file, "utf8");
				for (const [search, replacement] of Object.entries(replacements)) {
					content = content.replaceAll(search, replacement);
				}
				await writeFile(file, content);
			}
		}
	}
	await render(directory);
	console.log(
		`Created ${type}/${name}. Run pnpm install, then pnpm exec vp run @instructure.ai/${name}#build.`,
	);
	return directory;
}
