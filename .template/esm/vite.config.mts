import baseConfig from "@instructure.ai/shared-configs/esm";
import { defineConfig, mergeConfig } from "vite";

export default mergeConfig(baseConfig, defineConfig({}));
