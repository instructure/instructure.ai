import { defineConfig, mergeConfig } from "vite-plus";
import app from "@instructure.ai/shared-configs/react";
import tests from "@instructure.ai/shared-configs/vitest";

export default mergeConfig(
	mergeConfig(app(import.meta.dirname), tests),
	defineConfig({
		root: import.meta.dirname,

		test: {
			coverage: { reportsDirectory: `${import.meta.dirname}/coverage` },
		},

		pack: {
			clean: true,
			dts: false,
			entry: { themeEditor: "src/assets/scripts/index.ts" },
			format: "iife",
			minify: true,
			outDir: "public",
			tsconfig: "./tsconfig.json",
		},
		run: {
			tasks: {
				build: {
					command: "pnpm build:assets && vp build",
					dependsOn: ["@instructure.ai/site#build"],
					cache: false,
				},
			},
		},
	}),
);
