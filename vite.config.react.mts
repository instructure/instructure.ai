import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vite.config.mts";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default mergeConfig(
	baseConfig,
	defineConfig({
		plugins: [react(), babel({ presets: [reactCompilerPreset({ target: "19" })] })],
	}),
);
