import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  deps: {
    onlyAllowBundle: false,
  },
  dts: true,
  entry: "node/index.ts",
  format: ["esm", "cjs"],
  minify: true,
  outDir: "src",
  outputOptions: {
    exports: "named",
  },
  target: "node20",
  treeshake: {
    moduleSideEffects: false,
  },
  tsconfig: "./tsconfig.json",
});
