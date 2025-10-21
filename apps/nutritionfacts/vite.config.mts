import baseConfig from "@instructure.ai/shared-configs/react";
import { defineConfig, mergeConfig } from "vite";

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
