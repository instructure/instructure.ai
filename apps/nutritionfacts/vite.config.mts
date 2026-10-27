import { defineConfig, mergeConfig } from "vite-plus";
import app from "@instructure.ai/shared-configs/react";
import tests from "@instructure.ai/shared-configs/vitest";

export default mergeConfig(
	mergeConfig(app(import.meta.dirname), tests),
	defineConfig({
		root: import.meta.dirname,

		test: {
			environment: "jsdom",
			include: ["index.test.{ts,tsx}"],
			coverage: { reportsDirectory: `${import.meta.dirname}/coverage` },
		},

		run: {
			tasks: {
				build: {
					command: "vp build",
					dependsOn: ["@instructure.ai/site#build", "@instructure.ai/aiinfo#build:lib"],
					cache: false,
				},
			},
		},
	}),
);
