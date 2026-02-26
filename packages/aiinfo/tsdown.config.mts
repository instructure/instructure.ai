import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: ["@instructure/ui-instructure"],
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
  tsconfig: "./tsconfig.json",
});
