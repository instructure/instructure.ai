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
		mkdirSync(entryDir, { recursive: true });
	}

	const indexPath = join(entryDir, "index.tsx");

	const content = TEMPLATE_PACKAGE.replace(/<<uid>>/g, entry.uid)
		.replace(/<<data>>/g, toTsObjectLiteral(entry))
		.replace(/<<nutritionFacts>>/g, toTsObjectLiteral(entry.NutritionFacts))
		.replace(
			/<<dataPermissionLevels>>/g,
			toTsObjectLiteral(entry.DataPermissionLevels),
		)
		.replace(/<<aiInformation>>/g, toTsObjectLiteral(entry.AiInformation));

	// toTsObjectLiteral only handles ES syntax, so we need to format the code to fix JSX
	const formatted = formatTs(content).replace(
		/"<Button>AI Information<\/Button>"/g,
		"<Button>AI Information</Button>",
	);
	writeFileSync(indexPath, formatted, "utf8");
};

export { writeEntry };
