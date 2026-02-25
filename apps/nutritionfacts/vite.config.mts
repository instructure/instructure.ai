import { defineConfig, mergeConfig } from "vite";
import baseConfig from "@instructure.ai/shared-configs/react";

export default mergeConfig(
  baseConfig,
  defineConfig({
    define: {
      "import.meta.env.VITE_PACKAGE_VERSION": JSON.stringify(
        String(process.env.npm_package_version),
      ),
    },
  }),
);
