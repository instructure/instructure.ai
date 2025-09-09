import baseConfig from "@instructure.ai/shared-configs/vite";
import { defineConfig, mergeConfig } from "vite";

export default mergeConfig(baseConfig, defineConfig({
	build: {
		chunkSizeWarningLimit: 1024,
	}
}));
