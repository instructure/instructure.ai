import { mergeConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";
import baseConfig from "@instructure.ai/shared-configs/vitest";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const __cdir = path.resolve(__dir, "coverage");

export default mergeConfig(baseConfig, {
  root: __dirname,
  test: {
    coverage: {
      reportsDirectory: __cdir,
    }
  }
});
