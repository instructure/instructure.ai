import { bundleAsync } from "lightningcss";
import fs from "node:fs";
import path from "node:path";

interface PackageJson {
  homepage?: string;
};

const projectRoot = process.cwd();
const ENTRY_CSS = path.join(projectRoot, "src/assets/styles/index.css");
const ASSETS_ROOT = path.join(projectRoot, "src/assets");
const OUT_CSS = path.join(projectRoot, "public/themeEditor.css");
const URL_RE = /url\(\s*(?:'([^']*)'|"([^"]*)"|([^)\s]*))\s*\)/g;

const readPackageJson = (): PackageJson => {
  const raw = fs.readFileSync(path.join(projectRoot, "package.json"), "utf8");
  const parsed = JSON.parse(raw);
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    (typeof parsed.homepage === "undefined" || typeof parsed.homepage === "string")
  ) {
    return { homepage: parsed.homepage };
  }
  throw new Error("Invalid package.json format");
};

const normalizeHomepageBase = (homepage: string): string => {
  const hp = homepage.trim();
  if (!hp) {
    throw new Error('package.json is missing a non-empty "homepage".');
  }
  if (hp.endsWith("/")) {
    return hp;
  } else {
    return `${hp}/`;
  }
};

const isRelativeUrl = (url: string): boolean => {
  const trimmedUrl = url.trim();
  return !(
    trimmedUrl.startsWith("/") || // Absolute path
    trimmedUrl.startsWith("#") || // Fragment
    trimmedUrl.startsWith("//") || // Protocol-relative
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmedUrl) // Scheme: http:, https:, data:, blob:, etc.
  );
};

const toPosix = (filePath: string): string => filePath.split(path.sep).join("/");

/**
 * Rewrite ANY relative url(...) inside CSS files to:
 *   {homepage}/<path-relative-to-src/assets>
 *
 * Example:
 * - src/assets/styles/fonts.css: url("../fonts/x.woff2") -> {homepage}/fonts/x.woff2
 * - src/assets/styles/a.css:     url("../images/bg.png") -> {homepage}/images/bg.png
 * - src/assets/styles/a.css:     url("./icons/x.svg")    -> {homepage}/styles/icons/x.svg
 */
const getRawUrl = (s1: string, s2: string, s3: string): string => String((s1 ?? s2 ?? s3 ?? "")).trim();

const getQuoteStyle = (s1: string | undefined, s2: string | undefined): string => {
  if (s1 !== undefined) {
    return "'";
  } else if (s2 !== undefined) {
    return '"';
  }
  return '"';
};

const makeCssUrlRewriter = function makeCssUrlRewriter(homepageBase: string) {

  const getRelToAssets = (cssFilePath: string, raw: string): string => {
    const resolvedFsPath = path.resolve(path.dirname(cssFilePath), raw);
    return path.relative(ASSETS_ROOT, resolvedFsPath);
  };

  const getRewrittenUrl = (relToAssets: string, homepageBase: string): string => {
    const webPath = toPosix(relToAssets);
    return new URL(webPath, homepageBase).toString();
  };

  const shouldRewriteUrl = (relToAssets: string): boolean => !(
      relToAssets === "" ||
      relToAssets.startsWith("..") ||
      path.isAbsolute(relToAssets)
    );

  const processUrl = ({
    match,
    s1,
    s2,
    s3,
    cssFilePath,
  }: {
    match: string;
    s1: string;
    s2: string;
    s3: string;
    cssFilePath: string;
  }): string => {
    const raw = getRawUrl(s1, s2, s3);
    if (!raw || !isRelativeUrl(raw)) {
      return match;
    }

    const relToAssets = getRelToAssets(cssFilePath, raw);

    if (!shouldRewriteUrl(relToAssets)) {
      return match;
    }

    const rewritten = getRewrittenUrl(relToAssets, homepageBase);
    const quote = getQuoteStyle(s1, s2);
    return `url(${quote}${rewritten}${quote})`;
  };

  return function rewriteUrlsInCss(cssText: string, cssFilePath: string): string {
    return cssText.replace(
      URL_RE,
      (...args: [string, string, string, string]) => {
        const [match, s1, s2, s3] = args;
        return processUrl({ cssFilePath, match, s1, s2, s3 });
      }
    );
  };
};

const main = async () => {
  const pkg = readPackageJson();
  const homepageBase = normalizeHomepageBase(pkg.homepage ?? "");
  const rewriteUrlsInCss = makeCssUrlRewriter(homepageBase);

  // Bundle + minify with LightningCSS; rewrite URLs per-file before bundling
  const { code } = await bundleAsync({
    filename: ENTRY_CSS,
    minify: true,
    resolver: {
      read(filePath: string) {
        const css = fs.readFileSync(filePath, "utf8");
        return rewriteUrlsInCss(css, filePath);
      },
      resolve(specifier: string, from: string) {
        // Resolve @import "./file.css" relative to importer
        return path.resolve(path.dirname(from), specifier);
      },
    },
  });

  fs.mkdirSync(path.dirname(OUT_CSS), { recursive: true });
  fs.writeFileSync(OUT_CSS, code);

  // eslint-disable-next-line no-console
  console.log(`✅ Built ${path.relative(projectRoot, OUT_CSS)}`);
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
