import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";
import { mangleCustomProps, pruneCustomProps } from "@pantoken/plugin-props-minify";

const assetDirectory = path.resolve(import.meta.dirname, "../../../dist/canvas-mcp/assets");
const cssFiles = (await readdir(assetDirectory)).filter((file) => file.endsWith(".css"));

if (cssFiles.length === 0) {
	throw new Error(`No CSS assets found in ${assetDirectory}`);
}

for (const file of cssFiles) {
	const filePath = path.join(assetDirectory, file);
	const css = await readFile(filePath, "utf8");
	const optimized = await postcss([pruneCustomProps(), mangleCustomProps()]).process(css, {
		from: filePath,
		to: filePath,
	});
	await writeFile(filePath, optimized.css);
	console.log(`${file}: ${Buffer.byteLength(css)} -> ${Buffer.byteLength(optimized.css)} bytes`);
}
