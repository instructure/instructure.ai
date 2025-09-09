import baseConfig from "@instructure.ai/shared-configs/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";

export default mergeConfig(
	baseConfig,
	defineConfig({
		plugins: [
			react({
				babel: {
					plugins: [["babel-plugin-react-compiler", { target: "18" }]],
				},
			}),
		],
	}),
);
