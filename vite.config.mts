import { defineConfig } from "vite-plus";
import lint from "./.oxlintrc.ts";
import testConfig from "./vitest.config.shared.mts";

export default defineConfig({
	defaultPackage: "./apps/site",
	fmt: {
		ignorePatterns: [
			"**/node_modules/**",
			"**/dist/**",
			"**/coverage/**",
			"**/public/**",
			"packages/aiinfo/src/**",
			"packages/aiinfo/cache/*.{csv,json}",
		],
		useTabs: true,
		tabWidth: 2,
		singleQuote: false,
		jsxSingleQuote: false,
		semi: true,
		singleAttributePerLine: true,
	},
	lint: {
		...lint,
		options: { typeAware: true, typeCheck: true },
		jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
		rules: { ...lint.rules, "vite-plus/prefer-vite-plus-imports": "error" },
		overrides: [
			{
				files: ["apps/{roadmap,nutritionfacts}/**", ".template/{react,instui}/**"],
				plugins: ["react", "react-perf"],
			},
		],
	},
	test: {
		...testConfig.test,
		coverage: {
			...testConfig.test?.coverage,
			include: ["{scripts,plugins}/**/*.{ts,mts,js,cjs,mjs}"],
			reportsDirectory: "./coverage",
		},
		include: ["{scripts,plugins,tests}/**/*.{test,spec}.{ts,mts,js,cjs,mjs}"],
	},
	create: {
		templates: [
			{
				name: "vanilla",
				description: "Instructure vanilla starter",
				template: "./.template/generators/vanilla",
			},
			{
				name: "react",
				description: "Instructure React starter",
				template: "./.template/generators/react",
			},
			{
				name: "instui",
				description: "Instructure InstUI starter",
				template: "./.template/generators/instui",
			},
			{
				name: "esm",
				description: "Instructure ESM starter",
				template: "./.template/generators/esm",
			},
		],
	},
	run: {
		cache: false,
		tasks: {
			"build:apps": {
				command: "vpx scripts/issues.mts",
				dependsOn: [
					"@instructure.ai/canvas-mcp#build",
					"@instructure.ai/nutritionfacts#build",
					"@instructure.ai/roadmap#build",
				],
			},
			"prepare:site": { command: "vpx scripts/prepareSite.mts" },
			"test:all": {
				command: "vp run --filter './apps/*' --filter './packages/*' test",
				dependsOn: ["test:root"],
			},
			"test:root": { command: "vp test run --config vite.config.mts" },
			"typecheck:all": {
				command: "vp run --filter './apps/*' --filter './packages/*' typecheck",
				dependsOn: ["typecheck:root"],
			},
			"typecheck:root": { command: "tsc --noEmit -p tsconfig.json" },
			"update-issues": { command: "vpx scripts/issues.mts" },
			release: { command: "vpx scripts/release.mts" },
		},
	},
});
