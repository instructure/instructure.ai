import "@instructure.ai/shared-configs/types";
import browsersList from "@instructure/browserslist-config-instui";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite-plus";

export default function appConfig(directory: string) {
	const manifest = JSON.parse(readFileSync(resolve(directory, "package.json"), "utf8"));
	const name = manifest.name.split("/").pop();
	const isSite = name === "site";
	return defineConfig({
		base: isSite ? "/" : `/${name}`,
		build: {
			cssMinify: "lightningcss",
			outDir: isSite ? "../../dist" : `../../dist/${name}`,
			sourcemap: true,
			target: "esnext",
		},
		css: {
			lightningcss: { targets: browserslistToTargets(browsersList) },
			transformer: "lightningcss",
		},
		define: {
			"import.meta.env.VITE_PACKAGE_NAME": JSON.stringify(name),
			"import.meta.env.VITE_PACKAGE_VERSION": JSON.stringify(manifest.version),
		},
	});
}
