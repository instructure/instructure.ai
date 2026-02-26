import "@instructure.ai/shared-configs/types";
import browsersList from "@instructure/browserslist-config-instui";
import { browserslistToTargets } from "lightningcss";
import { defineConfig } from "vite";

const pkgName = process.env.npm_package_name?.split("/").pop() ?? "";
const pkgVersion = process.env.npm_package_version ?? "";
const isSite = pkgName === "site";

let basePath = "/";
let outDir = "../../dist";
if (!isSite) {
  basePath = `/${pkgName}`;
  outDir = `../../dist/${pkgName}`;
}

export default defineConfig({
  base: basePath,
  build: {
    cssMinify: "lightningcss",
    outDir,
    sourcemap: true,
    target: "esnext",
  },
  css: {
    lightningcss: {
      targets: browserslistToTargets(browsersList),
    },
    transformer: "lightningcss",
  },
  define: {
    "import.meta.env.VITE_PACKAGE_NAME": JSON.stringify(pkgName),
    "import.meta.env.VITE_PACKAGE_VERSION": JSON.stringify(pkgVersion),
  },
});
