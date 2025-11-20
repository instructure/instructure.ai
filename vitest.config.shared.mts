import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coveragePlugin = path.resolve(
  __dirname,
  "plugins/vitest.plugin.coverageReporter.cjs",
); // changed

export default defineConfig({
  test: {
    coverage: {
      all: true, exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        ".github/*/**",
        ".template/*/**",
        ".vscode/*/**",
        "**/*.test.{ts,tsx,js,cjs,mjs,mts}",
        "tests/**",
      ], include: ["{src,scripts,utils}/**/*.{ts,tsx,js,cjs,mjs,mts}"], provider: "istanbul", reporter: [
        "text",
        [coveragePlugin, { file: path.resolve(__dirname, "coverage.yml") }],
      ],
    }, include: [
      "{src,scripts,utils,tests}/**/*.{test,spec}.{ts,tsx,js,cjs,mjs,mts}",
    ],
  },
});
