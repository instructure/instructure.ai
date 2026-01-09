import { type Dirent } from "node:fs";
import { defineConfig } from "tsdown";
import fs from "node:fs/promises";
import path from "node:path";
import pkg from "./package.json" with { type: "json" };
import { transform } from "lightningcss";

const scriptsEntry = path.resolve("src/assets/scripts/index.ts");
const stylesRoot = path.resolve("src/assets/styles");
const fontsRoot = path.resolve("src/assets/fonts");
const apisRoot = path.resolve("src/assets/apis");

const outRoot = path.resolve("public");

const bundleBaseName = "themeEditor";
const outJsFinal = path.join(outRoot, `${bundleBaseName}.js`);
const outJsFromTsdown = path.join(outRoot, `${bundleBaseName}.iife.js`);

const outCss = path.join(outRoot, `${bundleBaseName}.css`);
const outFonts = path.join(outRoot, "fonts");
const outApis = path.join(outRoot, "apis");
const { homepage } = pkg;

if (!homepage) {
  throw new Error(`package.json is missing "homepage" (needed for CSS URL rewriting).`);
}
const publicBase = homepage.replace(/\/+$/, "");

const getEntryPaths = (entries: Dirent[], dir: string) => {
  const files: string[] = [];
  const dirs: string[] = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      dirs.push(full);
    } else if (ent.isFile()) {
      files.push(full);
    }
  }
  return { dirs, files };
};

const walk = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const { files, dirs } = getEntryPaths(entries, dir);

  const nestedResults = await Promise.all(dirs.map(walk));
  for (const nested of nestedResults) {
    files.push(...nested);
  }
  return files;
};

const copyFont = async (srcAbs: string) => {
  const rel = path.relative(fontsRoot, srcAbs);
  const dest = path.join(outFonts, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(srcAbs, dest);
};

const copyAndMinifyJsonFlat = async (srcAbs: string, usedNames: Set<string>) => {
  const fileName = path.basename(srcAbs);
  if (usedNames.has(fileName)) {
    throw new Error(
      `Duplicate API definition filename "${fileName}". Flattening to ${outApis} would overwrite. Source: ${srcAbs}`,
    );
  }
  usedNames.add(fileName);

  const dest = path.join(outApis, fileName);
  const raw = await fs.readFile(srcAbs, "utf8");
  const minified = JSON.stringify(JSON.parse(raw));

  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, minified, "utf8");
};

const isImportsOnlyCss = (css: string) => {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const lines = withoutComments
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.every((line) => line.startsWith("@import "));
};

const rewriteRelativeUrlsToHomepage = (css: string) => {
  const base = `${publicBase.replace(/\/+$/, "")}/`;

  return css.replace(/url\(\s*["']?(\.{1,2}\/[^"')]+)["']?\s*\)/g, (_match, relPath: string) => {
    const normalized = relPath.replace(/\\/g, "/");
    const resolved = new URL(normalized, base).toString();
    return `url("${resolved}")`;
  });
};

const bundleCss = async () => {
  const cssEntry = path.join(stylesRoot, "index.css");
  const IMPORT_PATH_INDEX = 1;

  const getCssImports = async (filePath: string): Promise<string[]> => {
    const cssContent = await fs.readFile(filePath, "utf8");
    const cssDir = path.dirname(filePath);
    return [...cssContent.matchAll(/@import\s+["'](.+?)["'];/g)].map((match) =>
      path.resolve(cssDir, match[IMPORT_PATH_INDEX]),
    );
  };

  const walkCss = async (filePath: string, seenFiles = new Set<string>()): Promise<string[]> => {
    if (seenFiles.has(filePath)) {
      return [];
    }
    seenFiles.add(filePath);

    const imports = await getCssImports(filePath);
    const importedFilesArrays = await Promise.all(
      imports.map((importPath) => walkCss(importPath, seenFiles)),
    );

    return [filePath, ...importedFilesArrays.flat()];
  };

  const cssFiles = await walkCss(cssEntry);

  const combinedCss = await Promise.all(
    cssFiles.map(async (cssFilePath) => {
      let text = await fs.readFile(cssFilePath, "utf8");

      if (cssFilePath === cssEntry && isImportsOnlyCss(text)) {
        return "";
      }

      text = rewriteRelativeUrlsToHomepage(text);
      return text;
    }),
  );

  const result = transform({
    code: Buffer.from(combinedCss.join("\n")),
    filename: cssEntry,
    minify: true,
  });

  await fs.mkdir(path.dirname(outCss), { recursive: true });
  await fs.writeFile(outCss, result.code);
};

const renameIfExists = async (from: string, to: string) => {
  try {
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.rename(from, to);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return;
    }
    throw error;
  }
};

export default defineConfig({
  clean: true,
  dts: false,

  entry: {
    [bundleBaseName]: scriptsEntry,
  },

  format: "iife",
  minify: true,
  onSuccess: async () => {
    await renameIfExists(outJsFromTsdown, outJsFinal);
    await Promise.all([
      bundleCss(),
      (async () => {
        const fontFiles = await walk(fontsRoot);
        const woff2 = fontFiles.filter((file) => file.endsWith(".woff2"));
        await Promise.all(woff2.map(copyFont));
      })(),
      (async () => {
        const apiFiles = await walk(apisRoot);
        const jsonFiles = apiFiles.filter((file) => file.endsWith(".json"));

        const usedNames = new Set<string>();
        await Promise.all(jsonFiles.map((jsonFile) => copyAndMinifyJsonFlat(jsonFile, usedNames)));
      })(),
    ]);
  },
  outDir: outRoot,
  tsconfig: "./tsconfig.json",
});
