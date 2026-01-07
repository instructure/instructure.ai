import { defineConfig, mergeConfig } from "vite";
import baseConfig from "@instructure.ai/shared-configs/react";

export default mergeConfig(baseConfig, defineConfig({}));
