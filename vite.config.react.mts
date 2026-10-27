import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vite.config.app.mts";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default function reactConfig(directory: string) {
	return mergeConfig(
		baseConfig(directory),
		defineConfig({
			plugins: [react(), babel({ presets: [reactCompilerPreset({ target: "19" })] })],
		}),
	);
}
