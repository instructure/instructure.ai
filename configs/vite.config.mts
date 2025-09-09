/// <reference types="vitest/config" />

import browsersList from "@instructure/browserslist-config-instui";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

const PACKAGE_NAME = process.env.npm_package_name?.split("/").pop();
const PACKAGE_VERSION = process.env.npm_package_version;

export default defineConfig({
	define: {
		"import.meta.env.VITE_PACKAGE_NAME": PACKAGE_NAME,
		"import.meta.env.VITE_PACKAGE_VERSION": PACKAGE_VERSION,
	},
	base: `/${PACKAGE_NAME === "site" ? "" : PACKAGE_NAME}`,
	build: {
		cssMinify: "lightningcss",
		minify: "terser",
		target: "esnext",
		outDir: `../../dist/${PACKAGE_NAME === "site" ? "" : PACKAGE_NAME}`,
	},
	css: {
		lightningcss: {
			targets: browserslistToTargets(browsersList),
		},
		transformer: "lightningcss",
	},
});
