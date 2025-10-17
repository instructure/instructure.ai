import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    include: ["{src,scripts,utils,tests}/**/*.{test,spec}.{ts,tsx,js,cjs,mjs,mts}"],
    coverage: {
      provider: "istanbul",
      reporter: [
        "text",
        [
          path.resolve(
            process.cwd(),
            "plugins/vitest.plugin.coverageReporter.cjs"
          ),
          { file: path.resolve(__dirname, "coverage.yml" ) }
        ],
      ],
      all: true,
        include: [
          "{src,scripts,utils}/**/*.{ts,js,mts,mjs}",
        ],
				exclude: [
					"**/node_modules/**",
					"**/dist/**",
					"**/build/**",
					"**/coverage/**",
          ".github/*/**",
					".template/*/**",
					".vscode/*/**",
          "**/*.test.{ts,tsx,js,cjs,mjs,mts}",
          "tests/**"
				]
    }
	}
});
