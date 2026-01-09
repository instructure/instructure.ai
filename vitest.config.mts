import baseConfig from "@instructure.ai/shared-configs/vitest";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vitest/config";
import path from "node:path";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const __cdir = path.resolve(__dir, "coverage");

export default mergeConfig(baseConfig, {
  test: {
    coverage: {
      include: ["{src,scripts,utils,plugins}/**/*.{ts,tsx,js,cjs,mjs,mts}"],
      reportsDirectory: __cdir,
    },
    include: ["{src,scripts,utils,plugins,tests}/**/*.{test,spec}.{ts,tsx,js,cjs,mjs,mts}"],
  },
});
