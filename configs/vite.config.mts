/// <reference types="vitest/config" />

import browsersList from "@instructure/browserslist-config-instui";
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
});
