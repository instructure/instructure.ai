import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: "node/index.ts",
  format: ["esm", "cjs"],
  inlineOnly: false,
  minify: true,
  outDir: "src",
  outputOptions: {
    exports: "named",
  },
  target: "node20",
  tsconfig: "./tsconfig.json",
});
