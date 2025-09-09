import baseConfig from "@instructure.ai/shared-configs/react";
import { defineConfig, mergeConfig } from "vite";

export default mergeConfig(baseConfig, defineConfig({}));
