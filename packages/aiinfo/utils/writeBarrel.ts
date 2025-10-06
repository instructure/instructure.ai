// utils/writeBarrel.ts
import { readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { formatTs } from "../utils/formatTs"; // your @typescript/native-preview printer

type Options = {
  /** Absolute or relative path to the `src` dir that contains feature folders. */
  srcDir?: string;
  /** Output file name inside src (default: index.ts). */
  outFileName?: string;
  /** Sort uids alphabetically for stable diffs (default: true). */
  sort?: boolean;
  /** If a uid is not a valid TS identifier, skip it instead of throwing (default: false). */
  skipInvalidIdentifiers?: boolean;
};

/** Generate `/src/index.ts` “barrel” that aggregates all feature packages. */
export function writeBarrel(opts: Options = {}) {
  const SRC_DIR = resolve(process.cwd(), opts.srcDir ?? "src");
  const OUT_FILE = join(SRC_DIR, opts.outFileName ?? "index.ts");

  const isDir = (p: string) => {
    try {
      return statSync(p).isDirectory();
    } catch {
      return false;
    }
  };
  const hasIndexTsx = (dir: string) => existsSync(join(dir, "index.tsx"));
  const isValidIdentifier = (s: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s);

  // Discover feature folders (each must contain src/<uid>/index.tsx)
  let uids = readdirSync(SRC_DIR).filter((name) =>
    isDir(join(SRC_DIR, name)) && hasIndexTsx(join(SRC_DIR, name))
  );

  if (opts.sort !== false) uids.sort();

  const invalid = uids.filter((u) => !isValidIdentifier(u));
  if (invalid.length) {
    if (opts.skipInvalidIdentifiers) {
      uids = uids.filter((u) => isValidIdentifier(u));
    } else {
      throw new Error(
        `These uids are not valid TS identifiers: ${invalid.join(", ")}`
      );
    }
  }

  // Header (types import)
  const header = `
import type {
  AiInfoAiInformationProps,
  AiInfoDataPermissionLevelsProps,
  AiInfoFeatureProps,
  AiInfoNutritionFactsProps,
  AiInfoProps,
} from "./types";
`.trim();

  // One named import per feature: `import { uid } from "./uid";`
  const imports = uids.map((u) => `import { ${u} } from "./${u}";`).join("\n");

  // Objects
  const AiInfo = `const AiInfo: AiInfoProps = {\n${uids
    .map((u) => `\t${u}: ${u},`)
    .join("\n")}\n};`;

  const nutritionFacts = `const nutritionFacts: AiInfoNutritionFactsProps = {\n${uids
    .map((u) => `\t${u}: ${u}.NutritionFacts,`)
    .join("\n")}\n};`;

  const dataPermissionLevels = `const dataPermissionLevels: AiInfoDataPermissionLevelsProps = {\n${uids
    .map((u) => `\t${u}: ${u}.DataPermissionLevels,`)
    .join("\n")}\n};`;

  const aiInformation = `const aiInformation: AiInfoAiInformationProps = {\n${uids
    .map((u) => `\t${u}: ${u}.AiInformation,`)
    .join("\n")}\n};`;

  // Exports
  const exportsBlock = `
export {
  AiInfo,
  nutritionFacts,
  dataPermissionLevels,
  aiInformation,
  ${uids.join(",\n  ")},
};
export type {
  AiInfoProps,
  AiInfoFeatureProps,
  AiInfoNutritionFactsProps,
  AiInfoDataPermissionLevelsProps,
  AiInfoAiInformationProps,
};
export default AiInfo;
`.trim();

  const code = [
    header,
    imports,
    AiInfo,
    nutritionFacts,
    dataPermissionLevels,
    aiInformation,
    exportsBlock,
  ]
    .filter(Boolean)
    .join("\n\n");

  const formatted = formatTs(code, "index.ts");
  writeFileSync(OUT_FILE, formatted, "utf8");
}
