import baseConfig from "@instructure.ai/shared-configs/esm";
import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";

export default mergeConfig(
	baseConfig,
	defineConfig({
		build: {
			lib: {
				entry: "src/index.ts",
				name: "AiInfo",
			},
			rollupOptions: {
				external: [/^react($|\/)/, /^react-dom($|\/)/, /^@instructure\/ui-/],
			},
		},
		plugins: [
			dts({
				entryRoot: "src",
				exclude: [
					"**/*.test.*",
					"**/__tests__/**",
					"scripts/**",
					"utils/**",
					"dist/**",
					"**/*.config.*",
					"vite.config.*",
				],
				insertTypesEntry: true,
				outDir: "dist",
				rollupTypes: true,
				tsconfigPath: "./tsconfig.types.json",
			}),
		],
	}),
);
