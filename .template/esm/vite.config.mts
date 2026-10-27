import { defineConfig, mergeConfig } from "vite-plus";
import tests from "@instructure.ai/shared-configs/vitest";

export default mergeConfig(
	tests,
	defineConfig({
		pack: {
			clean: true,
			dts: true,
			entry: "node/index.mts",
			format: ["esm", "cjs"],
			minify: true,
			outDir: "src",
			target: "node26",
			tsconfig: "./tsconfig.json",
		},
	}),
);
