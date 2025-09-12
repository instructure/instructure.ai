import baseConfig from "@instructure.ai/shared-configs/vanilla";
import { defineConfig, mergeConfig } from "vite";

export default mergeConfig(baseConfig, defineConfig({}));
