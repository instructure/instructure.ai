import baseConfig from "@instructure.ai/shared-configs/react";
import { defineConfig, mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default mergeConfig(
	baseConfig,
	defineConfig({
		plugins: [tsconfigPaths()],
	}),
);
