import { readFile } from "node:fs/promises";
import { register } from "node:module";
import { dirname, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformWithEsbuild } from "vite";

// Use the directory containing loader.mjs as the context
const loaderDir = dirname(fileURLToPath(import.meta.url));
register(new URL(import.meta.url).pathname, pathToFileURL(loaderDir));

const mtsExtensions = new Set([".ts", ".mts", ".cts", ".tsx"]);

export async function resolve(specifier, context, nextResolve) {
	const resolved = await nextResolve(specifier, context, nextResolve);
	return resolved;
}

export async function load(url, context, nextLoad) {
	const extension = extname(url);
	if (mtsExtensions.has(extension)) {
		const filename = fileURLToPath(url);
		const source = await readFile(filename, "utf8");
		const result = await transformWithEsbuild(source, filename, {
			format: "esm",
			loader: extension === ".tsx" ? "tsx" : "ts",
			sourcemap: "inline",
		});
		return {
			format: "module",
			shortCircuit: true,
			source: result.code,
		};
	}

	return nextLoad(url, context, nextLoad);
}
