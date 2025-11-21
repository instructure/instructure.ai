import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true, dts: true, entry: "node/index.ts", format: ["esm", "cjs"], minify: true, outDir: "src", target: "node20", tsconfig: "./tsconfig.json",
});