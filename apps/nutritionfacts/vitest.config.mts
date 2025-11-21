import path from "node:path";
import { fileURLToPath } from "node:url";
import baseConfig from "@instructure.ai/shared-configs/vitest";
import { mergeConfig } from "vitest/config";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const __cdir = path.resolve(__dir, "coverage");

export default mergeConfig(baseConfig, {
  root: __dirname,
  test: {
    coverage: {
      reportsDirectory: __cdir,
    },
    environment: "jsdom",
    include: ["index.test.{ts,tsx}"],
  },
});
