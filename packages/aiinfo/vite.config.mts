import baseConfig from "@instructure.ai/shared-configs/esm";
import { defineConfig, mergeConfig } from "vite";

export default mergeConfig(
	baseConfig,
	defineConfig({
		build: {
			lib: {
				entry: "src/index.mts",
				name: "AiInfo",
			},
			rollupOptions: {
				external: [/^react($|\/)/, /^react-dom($|\/)/, /^@instructure\/ui-/],
			},
		},
	}),
);
