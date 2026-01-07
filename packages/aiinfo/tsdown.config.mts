import baseConfig from "@instructure.ai/shared-configs/tsdown";
import { mergeConfig } from "tsdown";

export default mergeConfig(baseConfig, {
  clean: true,
  dts: true,
  entry: "node/index.ts",
  format: ["esm", "cjs"],
  minify: true,
  outDir: "src",
  target: "node20",
  tsconfig: "./tsconfig.json",
});
