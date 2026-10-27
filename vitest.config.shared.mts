import { defineConfig } from "vite-plus";
import path from "node:path";

const coveragePlugin = path.resolve(
	import.meta.dirname,
	"plugins/vitest.plugin.coverageReporter.cjs",
);

export default defineConfig({
	test: {
		coverage: {
			exclude: [
				"**/node_modules/**",
				"**/dist/**",
				"**/build/**",
				"**/coverage/**",
				".github/*/**",
				".template/*/**",
				".vscode/*/**",
				"**/*.test.{ts,tsx,js,cjs,mjs,mts}",
				"tests/**",
			],
			include: ["{src,scripts,utils}/**/*.{ts,tsx,js,cjs,mjs,mts}"],
			provider: "istanbul",
			reporter: [
				"text",
				"json",
				[coveragePlugin, { file: path.resolve(import.meta.dirname, "coverage.yml") }],
			],
		},
		include: ["{src,scripts,utils,tests}/**/*.{test,spec}.{ts,tsx,js,cjs,mjs,mts}"],
	},
});
