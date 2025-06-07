/// <reference types="vitest/config" />
import browsersList from "@instructure/browserslist-config-instui";
import react from "@vitejs/plugin-react";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		cssMinify: "lightningcss",
		minify: "terser",
		target: "esnext",
	},
	css: {
		lightningcss: {
			targets: browserslistToTargets(browsersList),
		},
		transformer: "lightningcss",
	},
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler", { target: "19" }]],
			},
		}),
	],
	test: {
		coverage: {
			enabled: true,
			exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.d.ts"],
			include: ["src/**/*.{ts,tsx}"],
			provider: "v8",
			reporter: ["default", "html"],
		},
	},
});
