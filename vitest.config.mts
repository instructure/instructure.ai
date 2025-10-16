import baseConfig from "@instructure.ai/shared-configs/vitest";
import { mergeConfig, defineProject } from "vitest/config";

export default mergeConfig(baseConfig, {
	test: {
		projects: [
      defineProject({
        test: {
          name: "@instructure.ai/shared-configs",
          include: [
						"**/*.{test,spec}.{ts,tsx,js,cjs,mjs,mts}"
					],
					exclude: [
					"**/node_modules/**",
					"**/dist/**",
					"**/build/**",
					"**/coverage/**",
					"**/.*/**",
					"packages/*/**",
					"apps/*/**",
					".template/*/**",
					".vscode/*/**"
				]
        }
      })
    ],
			coverage: {
				include: [
					"scripts/**/*.{ts,tsx,js,cjs,mjs,mts}",
				],
				exclude: [
					"**/node_modules/**",
					"**/dist/**",
					"**/build/**",
					"**/coverage/**",
					"**/.*/**",
					"packages/*/**",
					"apps/*/**",
					".template/*/**",
					".vscode/*/**"
				]
			}
		}
});
