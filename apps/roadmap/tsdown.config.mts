import { defineConfig } from "tsdown";
import path from "node:path";

const scriptsEntry = path.resolve("src/assets/scripts/index.ts");
const outRoot = path.resolve("public");
const bundleBaseName = "themeEditor";

export default defineConfig({
  clean: true,
  dts: false,

  entry: {
    [bundleBaseName]: scriptsEntry,
  },

  format: "iife",
  minify: true,
  outDir: outRoot,
  tsconfig: "./tsconfig.json",
});
