/// <reference types="vitest/config" />
import browsersList from "@instructure/browserslist-config-instui";
import react from "@vitejs/plugin-react";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler", { target: "19" }]],
			},
		}),
	],
	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets: browserslistToTargets(browsersList),
		},
	},
	build: {
		target: "esnext",
		minify: "terser",
		cssMinify: "lightningcss",
	},
	test: {
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: ["default", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.d.ts"],
		},
	},
});
