import { defineConfig, mergeConfig } from "vite";
import baseConfig from "@instructure.ai/shared-configs/vanilla";

export default mergeConfig(baseConfig, defineConfig({}));
