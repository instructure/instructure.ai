import path from "node:path";
import { fileURLToPath } from "node:url";
import baseConfig from "@instructure.ai/shared-configs/vitest";
import { mergeConfig } from "vitest/config";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const __cdir = path.resolve(__dir, "coverage");

export default mergeConfig(baseConfig, {
  test: {
    coverage: {
      exclude: ["node/**", "src/**"],
      include: ["strings/**/*.{ts,tsx,js,cjs,mjs,mts}"],
      reportsDirectory: __cdir,
    },
    exclude: ["/node/**", "src/**"],
    include: ["strings/**/*.{test,spec}.{ts,tsx,js,cjs,mjs,mts}"],
  },
});
