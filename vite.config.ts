import browsersList from "@instructure/browserslist-config-instui";
import react from "@vitejs/plugin-react";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/nf-generator/",
	build: {
		chunkSizeWarningLimit: 1024,
		cssMinify: "lightningcss",
		minify: "terser",
		target: "esnext",
	},
	css: {
		lightningcss: {
			targets: browserslistToTargets(browsersList as string[]),
		},
		transformer: "lightningcss",
	},
	plugins: [react()],
});
