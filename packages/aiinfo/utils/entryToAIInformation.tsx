import { aiInformationStrings, permissionLevelsStrings } from "../strings";
import type { AiInfoFeature, AiInformationStrings, Entry } from "../types";
import { entryToNutritionFacts, entryToPermissionLevels } from "./";
import { Button } from "@instructure/ui-buttons";

const setData = (
	data: AiInformationStrings["data"],
	entry: Entry,
): AiInfoFeature["AiInformation"]["data"] => [
	{
		description:
			permissionLevelsStrings.en.data[Number(entry.permissions) - 1]
				.description,
		featureName: entry.feature.name,
		modelName: entry.model.name,
		permissionLevel: `LEVEL ${entry.permissions}`,
		...data,
	},
];

const entryToAIInformation = (entry: Entry): AiInfoFeature["AiInformation"] => {
	const { en: s } = aiInformationStrings as { en: AiInformationStrings };

	const nutritionFacts = entryToNutritionFacts(entry);
	const permissionLevels = entryToPermissionLevels(entry);

	return {
		...s,
		data: setData(s.data, entry),
		dataPermissionLevelsCurrentFeature: permissionLevels.currentFeature,
		dataPermissionLevelsData: permissionLevels.data,
		nutritionFactsData: nutritionFacts.data,
		nutritionFactsFeatureName: nutritionFacts.featureName,
		trigger: s.trigger,
	};
};

export { entryToAIInformation };
