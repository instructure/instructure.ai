import { dirname, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import { register } from "node:module";
import { transformWithOxc } from "vite";

const loaderDir = dirname(fileURLToPath(import.meta.url));
register(new URL(import.meta.url).pathname, pathToFileURL(loaderDir));

const mtsExtensions = new Set([".ts", ".mts", ".cts", ".tsx"]);

const resolve = async function resolve(specifier, context, nextResolve) {
  const resolved = await nextResolve(specifier, context, nextResolve);
  return resolved;
};

const load = async function load(url, context, nextLoad) {
  const extension = extname(url);
  if (mtsExtensions.has(extension)) {
    const filename = fileURLToPath(url);
    const source = await readFile(filename, "utf8");
    let loader = "ts";
    if (extension === ".tsx") { loader = "tsx"; }
    const result = await transformWithOxc(source, filename, {
      format: "esm",
      loader,
      sourcemap: "inline",
    });
    return {
      format: "module",
      shortCircuit: true,
      source: result.code,
    };
  }
  return nextLoad(url, context, nextLoad);
};

const loader = { load, resolve };
export default loader;
