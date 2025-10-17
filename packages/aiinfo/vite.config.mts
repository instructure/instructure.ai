import baseConfig from "@instructure.ai/shared-configs/esm";
import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default mergeConfig(
	baseConfig,
	defineConfig({
		build: {
			emptyOutDir: true,
			lib: {
				entry: "src/index.ts",
				fileName: () => "index.mjs",
				formats: ["es"],
				name: "AiInfo",
			},
			outDir: "dist",
			rollupOptions: {
				external: [/^react($|\/)/, /^react-dom($|\/)/, /^@instructure\/ui-/],
				output: { exports: "named" },
			},
			sourcemap: false,
			target: "esnext",
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
					ecma: 2020,
					module: true,
					passes: 2,
					pure_getters: true,
					toplevel: true,
					unsafe_arrows: true,
					unsafe_methods: true,
				},
				format: {
					comments: false,
				},
				mangle: {
					toplevel: true,
				},
			},
		},
		plugins: [
			tsconfigPaths(),
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
