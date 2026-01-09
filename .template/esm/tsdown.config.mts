import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: "node/index.mts",
  format: ["esm", "cjs"],
  minify: true,
  outDir: "src",
  target: "node24",
  tsconfig: "./tsconfig.json",
});
