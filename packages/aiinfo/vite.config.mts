import { defineConfig, mergeConfig } from "vite-plus";
import tests from "@instructure.ai/shared-configs/vitest";

export default mergeConfig(
	tests,
	defineConfig({
		test: {
			coverage: {
				exclude: ["node/**", "src/**"],
				include: ["strings/**/*.{ts,tsx,js,cjs,mjs,mts}"],
				reportsDirectory: `${import.meta.dirname}/coverage`,
			},
			exclude: ["node/**", "src/**"],
			include: ["strings/**/*.{test,spec}.{ts,tsx,js,cjs,mjs,mts}"],
		},
		pack: {
			clean: true,
			deps: { onlyBundle: false },
			dts: true,
			entry: "node/index.ts",
			format: ["esm", "cjs"],
			minify: true,
			outDir: "src",
			outputOptions: { exports: "named" },
			target: "node20",
			treeshake: { moduleSideEffects: false },
			tsconfig: "./tsconfig.types.json",
		},
	}),
);
