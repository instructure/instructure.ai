import { mergeConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";
import baseConfig from "@instructure.ai/shared-configs/vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(baseConfig, {
  root: __dirname,
});
