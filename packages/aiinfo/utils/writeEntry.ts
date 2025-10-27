import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Entry } from "../types";
import {
	entryToAIInformation,
	entryToNutritionFacts,
	entryToPermissionLevels,
	formatTs,
	toTsObjectLiteral,
} from "../utils";

/**
 * Writes a TypeScript entry file for the given Entry object.
 * The file is created at node/components/{entry.uid}/index.tsx and contains
 * all relevant data objects for the feature.
 *
 * @param entry - The Entry object to serialize and write.
 */
export async function writeEntry(entry: Entry) {
	const file = resolve(
		process.cwd(),
		"node",
		"components",
		entry.uid,
		"index.tsx",
	);

	const UID = entry.uid;
	const FEATURE_NAME = entry.feature.name;
	const REVISION = entry.revision;
	const DESCRIPTION = entry.feature.description;

	const nutritionFacts = entryToNutritionFacts(entry);
	const aiInformation = entryToAIInformation(entry);
	const dataPermissionLevels = entryToPermissionLevels(entry);

	const DPL = dataPermissionLevels.data;
	const NF = nutritionFacts.data;

	const code = `import { Button } from "@instructure/ui-buttons";
import type {
  AiInformationProps,
  DataPermissionLevelsProps,
  NutritionFactsProps,
} from "@instructure/ui-instructure";
import type { AiInfoFeatureProps } from "../../types";

const FEATURE_NAME = ${JSON.stringify(FEATURE_NAME)};
const UID = ${JSON.stringify(UID)};

const DATA_PERMISSION_LEVELS: DataPermissionLevelsProps["data"] = ${toTsObjectLiteral(DPL)};
const NUTRITION_FACTS_DATA: NutritionFactsProps["data"] = ${toTsObjectLiteral(NF)};

const nutritionFacts: NutritionFactsProps = {
  ...${toTsObjectLiteral({ ...nutritionFacts, data: undefined })},
  data: NUTRITION_FACTS_DATA,
  featureName: FEATURE_NAME,
};

const dataPermissionLevels: DataPermissionLevelsProps = {
  ...${toTsObjectLiteral({ ...dataPermissionLevels, data: undefined })},
  data: DATA_PERMISSION_LEVELS,
  currentFeature: FEATURE_NAME,
};

const aiInformation: AiInformationProps = {
  ...${toTsObjectLiteral({ ...aiInformation, dataPermissionLevelsData: undefined, nutritionFactsData: undefined, trigger: undefined })},
  dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
  nutritionFactsData: NUTRITION_FACTS_DATA,
  trigger: "${aiInformation.trigger}",
};

const ${UID}: AiInfoFeatureProps = {
  aiInformation,
  dataPermissionLevels,
  nutritionFacts,
  revision: ${JSON.stringify(REVISION)},
  uid: UID,
  group: ${JSON.stringify(entry.group)},
	name: FEATURE_NAME,
	description: ${JSON.stringify(DESCRIPTION)},
}

export {
  ${UID},
  nutritionFacts,
  dataPermissionLevels,
  aiInformation,
};

export default ${UID};
`;

	const pretty = formatTs(code, "index.tsx").replace(
		/"<Button>AI Information<\/Button>"/g,
		"<Button>AI Information</Button>",
	);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, pretty, "utf8");
}
