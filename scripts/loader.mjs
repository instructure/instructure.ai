import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithEsbuild } from "vite";

const mtsExtensions = new Set([".ts", ".mts", ".cts", ".tsx"]);

export async function resolve(specifier, context, defaultResolve) {
	const resolved = await defaultResolve(specifier, context, defaultResolve);
	return resolved;
}

export async function load(url, context, defaultLoad) {
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

	return defaultLoad(url, context, defaultLoad);
}
