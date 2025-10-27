import baseConfig from "@instructure.ai/shared-configs/esm";
import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";

export default mergeConfig(
	baseConfig,
	defineConfig({
		build: {
			lib: {
				entry: "node/index.ts",
				fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs"),
				formats: ["es", "cjs"],
				name: "AiInfo",
			},
			rollupOptions: {
				external: [/^react($|\/)/, /^react-dom($|\/)/, /^@instructure\/ui/],
			},
		},
		plugins: [
			dts({
				entryRoot: "node",
				exclude: [
					"**/*.test.*",
					"**/__tests__/**",
					"scripts/**",
					"utils/**",
					"src/**",
					"**/*.config.*",
					"vite.config.*",
				],
				insertTypesEntry: true,
				outDir: "src",
				rollupTypes: true,
				tsconfigPath: "./tsconfig.types.json",
			}),
		],
	}),
);
