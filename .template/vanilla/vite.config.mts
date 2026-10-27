import { defineConfig, mergeConfig } from "vite-plus";
import app from "@instructure.ai/shared-configs/vanilla";
import tests from "@instructure.ai/shared-configs/vitest";

export default mergeConfig(
	mergeConfig(app(import.meta.dirname), tests),
	defineConfig({
		root: import.meta.dirname,
	}),
);
