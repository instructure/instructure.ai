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
	const SRC_DIR = resolve(process.cwd(), opts.srcDir ?? "src");
	const OUT_FILE = join(SRC_DIR, opts.outFileName ?? "index.ts");

	const isDir = (p: string) => {
		try {
			return statSync(p).isDirectory();
		} catch (_err) {
			return false;
		}
	};
	const hasIndexTsx = (dir: string) => existsSync(join(dir, "index.tsx"));
	const isValidIdentifier = (s: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s);

	let uids: string[];
	try {
		uids = readdirSync(SRC_DIR).filter(
			(name) => isDir(join(SRC_DIR, name)) && hasIndexTsx(join(SRC_DIR, name)),
		);
	} catch (err) {
		throw new Error(
			`Failed to read directory '${SRC_DIR}': ${err instanceof Error ? err.message : String(err)}`,
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

	const header = `
import type {
  AiInfoAiInformationProps,
  AiInfoDataPermissionLevelsProps,
  AiInfoFeatureProps,
  AiInfoNutritionFactsProps,
  AiInfoProps,
} from "./types";
`.trim();

	const imports = uids.map((u) => `import { ${u} } from "./${u}";`).join("\n");

	const AiInfo = `const AiInfo: AiInfoProps = {\n${uids
		.map((u) => `\t${u}: ${u},`)
		.join("\n")}\n};`;

	const nutritionFacts = `const nutritionFacts: AiInfoNutritionFactsProps = {\n${uids
		.map((u) => `\t${u}: ${u}.nutritionFacts,`)
		.join("\n")}\n};`;

	const dataPermissionLevels = `const dataPermissionLevels: AiInfoDataPermissionLevelsProps = {\n${uids
		.map((u) => `\t${u}: ${u}.dataPermissionLevels,`)
		.join("\n")}\n};`;

	const aiInformation = `const aiInformation: AiInfoAiInformationProps = {\n${uids
		.map((u) => `\t${u}: ${u}.aiInformation,`)
		.join("\n")}\n};`;

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

	let formatted: string;
	try {
		formatted = formatTs(code, "index.ts");
	} catch (err) {
		throw new Error(
			`Failed to format TypeScript code: ${err instanceof Error ? err.message : String(err)}`,
		);
	}

	try {
		writeFileSync(OUT_FILE, formatted, "utf8");
	} catch (err) {
		throw new Error(
			`Failed to write barrel file '${OUT_FILE}': ${err instanceof Error ? err.message : String(err)}`,
		);
	}
};

export { writeBarrel };
