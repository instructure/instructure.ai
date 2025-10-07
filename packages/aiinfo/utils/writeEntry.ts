import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { AiInfoFeature } from "../types";
import { formatTs } from "../utils/formatTs";
import { toTsObjectLiteral } from "../utils/toTsObjectLiteral";
import { TEMPLATE_PACKAGE } from "./";

const writeEntry = (entry: AiInfoFeature) => {
	const srcDir = join(__dirname, "../src");
	const entryDir = join(srcDir, entry.uid);

	if (!existsSync(entryDir)) {
		try {
			mkdirSync(entryDir, { recursive: true });
		} catch (err) {
			throw new Error(
				`Failed to create directory '${entryDir}': ${err instanceof Error ? err.message : String(err)}`,
			);
		}
	}

	const indexPath = join(entryDir, "index.tsx");

	let content: string;
	try {
		content = TEMPLATE_PACKAGE.replace(/<<uid>>/g, entry.uid)
			.replace(/<<data>>/g, toTsObjectLiteral(entry))
			.replace(/<<nutritionFacts>>/g, toTsObjectLiteral(entry.NutritionFacts))
			.replace(
				/<<dataPermissionLevels>>/g,
				toTsObjectLiteral(entry.DataPermissionLevels),
			)
			.replace(/<<aiInformation>>/g, toTsObjectLiteral(entry.AiInformation));
	} catch (err) {
		throw new Error(
			`Failed to generate entry content: ${err instanceof Error ? err.message : String(err)}`,
		);
	}

	let formatted: string;
	try {
		formatted = formatTs(content).replace(
			/"<Button>AI Information<\/Button>"/g,
			"<Button>AI Information</Button>",
		);
	} catch (err) {
		throw new Error(
			`Failed to format TypeScript code: ${err instanceof Error ? err.message : String(err)}`,
		);
	}

	try {
		writeFileSync(indexPath, formatted, "utf8");
	} catch (err) {
		throw new Error(
			`Failed to write entry file '${indexPath}': ${err instanceof Error ? err.message : String(err)}`,
		);
	}
};

export { writeEntry };
