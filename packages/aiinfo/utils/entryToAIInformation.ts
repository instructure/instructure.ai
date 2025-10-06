import { aiInformationStrings } from "../strings";
import type { AiInfoFeature, AiInformationStrings, Entry } from "../types";
import { entryToNutritionFacts, entryToPermissionLevels } from "./";

const entryToAIInformation = (entry: Entry): AiInfoFeature["AiInformation"] => {
	const { en: s } = aiInformationStrings as { en: AiInformationStrings };

	const nutritionFacts = entryToNutritionFacts(entry);
	const permissionLevels = entryToPermissionLevels(entry);

	return {};
};

export { entryToAIInformation };
