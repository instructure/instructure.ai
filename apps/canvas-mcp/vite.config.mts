import { defineConfig, mergeConfig } from "vite";
import { resolve } from "node:path";
import baseConfig from "@instructure.ai/shared-configs/vanilla";

export default mergeConfig(
	baseConfig,
	defineConfig({
		build: {
			emptyOutDir: true,
			rollupOptions: {
				input: {
					admin: resolve(import.meta.dirname, "admin/index.html"),
					main: resolve(import.meta.dirname, "index.html"),
				},
			},
		},
		css: {
			transformer: "postcss",
		},
	}),
);
