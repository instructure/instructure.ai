/// <reference types="vitest/config" />

import browsersList from "@instructure/browserslist-config-instui";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

const PACKAGE_NAME = process.env.npm_package_name?.split("/").pop();
const PACKAGE_VERSION = String(process.env.npm_package_version);

export default defineConfig({
	base: `/${PACKAGE_NAME === "site" ? "" : PACKAGE_NAME}`,
	publicDir: "public",
	build: {
		cssMinify: "lightningcss",
		minify: "terser",
		outDir: `../../dist/${PACKAGE_NAME === "site" ? "" : PACKAGE_NAME}`,
		target: "esnext",
	},
	css: {
		lightningcss: {
			targets: browserslistToTargets(browsersList),
		},
		transformer: "lightningcss",
	},
	define: {
		"import.meta.env.VITE_PACKAGE_NAME": JSON.stringify(PACKAGE_NAME),
		"import.meta.env.VITE_PACKAGE_VERSION": JSON.stringify(PACKAGE_VERSION),
	},
});
