import { defineConfig, mergeConfig } from "vite-plus";
import app from "@instructure.ai/shared-configs/vanilla";
import tests from "@instructure.ai/shared-configs/vitest";

export default mergeConfig(
	mergeConfig(app(import.meta.dirname), tests),
	defineConfig({
		root: import.meta.dirname,
		build: { emptyOutDir: true },
		css: { transformer: "postcss" },
		test: {
			coverage: { reportsDirectory: `${import.meta.dirname}/coverage` },
		},

		run: {
			tasks: {
				build: {
					command: "vp build && vpx scripts/optimizeStyles.mts",
					dependsOn: ["@instructure.ai/site#build"],
					cache: false,
				},
			},
		},
	}),
);
