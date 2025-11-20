import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "node/index.mts",
  format: ["esm", "cjs"],
  outDir: "src",
  clean: true,
  target: "node20",
  minify: true,
  dts: true,
  tsconfig: "./tsconfig.json",
});