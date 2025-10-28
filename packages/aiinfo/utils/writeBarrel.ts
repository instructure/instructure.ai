import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { formatTs } from "../utils/formatTs";

type Options = {
	srcDir?: string;
	outFileName?: string;
	sort?: boolean;
	skipInvalidIdentifiers?: boolean;
};

const writeBarrel = (opts: Options = {}) => {
	const SRC_DIR = resolve(process.cwd(), opts.srcDir ?? "node/components");
	const OUT_FILE = join(process.cwd(), "node", opts.outFileName ?? "index.ts");

	const isDir = (p: string) => {
		try {
			return statSync(p).isDirectory();
		} catch {
			return false;
		}
	};
		const hasIndexTsOrTsx = (dir: string) =>
			existsSync(join(dir, "index.ts")) || existsSync(join(dir, "index.tsx"));
	const isValidIdentifier = (s: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s);

		let uids: string[];
		try {
			uids = readdirSync(SRC_DIR).filter(
				(name) => isDir(join(SRC_DIR, name)) && hasIndexTsOrTsx(join(SRC_DIR, name)),
			);
		} catch (err) {
			throw new Error(
				`Failed to read directory '${SRC_DIR}': ${
					err instanceof Error ? err.message : String(err)
				}`,
			);
		}

	if (opts.sort !== false) uids.sort();

	const invalid = uids.filter((u) => !isValidIdentifier(u));
	if (invalid.length) {
		if (opts.skipInvalidIdentifiers) {
			uids = uids.filter((u) => isValidIdentifier(u));
		} else {
			throw new Error(
				`These uids are not valid TS identifiers: ${invalid.join(", ")}`,
			);
		}
	}

	const imports =
		uids.map((u) => `import { ${u} } from "./components/${u}";`).join("\n") ||
		"// no feature folders found";

	const typesImport = `import type {
  AiInfoProps,
  AiInfoNutritionFactsProps,
  AiInfoDataPermissionLevelsProps,
  AiInfoAiInformationProps
} from "./types";`;

	const pluckHelper = `const pluck = <
    TRecord extends Record<string, object>,
    K extends keyof TRecord[keyof TRecord]
  >(obj: TRecord, key: K): { [P in keyof TRecord]: TRecord[P][K] } => {
    const out = {} as { [P in keyof TRecord]: TRecord[P][K] };
    for (const k in obj) {
      out[k] = obj[k][key];
    }
    return out;
  };`;

	const AiInfo = `const AiInfo: AiInfoProps = {
${uids.map((u) => `  ${u},`).join("\n")}
};`;

	const nutritionFacts = `const nutritionFacts: AiInfoNutritionFactsProps = pluck(AiInfo, "nutritionFacts");`;

	const dataPermissionLevels = `const dataPermissionLevels: AiInfoDataPermissionLevelsProps = pluck(AiInfo, "dataPermissionLevels");`;

	const aiInformation = `const aiInformation: AiInfoAiInformationProps = pluck(AiInfo, "aiInformation");`;

	const exportsBlock = `
export {
  AiInfo,
  nutritionFacts,
  dataPermissionLevels,
  aiInformation,
  ${uids.join(",\n  ")}
};

export type * from "./types";
export default AiInfo;`.trim();

	const code = [
		imports,
		typesImport,
		pluckHelper,
		AiInfo,
		nutritionFacts,
		dataPermissionLevels,
		aiInformation,
		exportsBlock,
	]
		.filter(Boolean)
		.join("\n\n");

	let formatted: string;
	try {
		formatted = formatTs(code, "index.ts");
	} catch (err) {
		throw new Error(
			`Failed to format TypeScript code: ${
				err instanceof Error ? err.message : String(err)
			}`,
		);
	}

	try {
		writeFileSync(OUT_FILE, formatted, "utf8");
	} catch (err) {
		throw new Error(
			`Failed to write barrel file '${OUT_FILE}': ${
				err instanceof Error ? err.message : String(err)
			}`,
		);
	}
};

export { writeBarrel };
