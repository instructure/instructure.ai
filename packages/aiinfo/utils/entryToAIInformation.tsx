import { aiInformationStrings, permissionLevelsStrings } from "../strings";
import type { AiInfoFeature, AiInformationStrings, Entry } from "../types";
import { entryToNutritionFacts, entryToPermissionLevels } from "./";

const setData = (
	data: AiInformationStrings["data"],
	entry: Entry,
): AiInfoFeature["aiInformation"]["data"] => {
	try {
		return [
			{
				description:
					permissionLevelsStrings.en.data[Number(entry.permissions) - 1]
						?.description ?? "Unknown",
				featureName: entry.feature?.name ?? "Unknown",
				modelName: entry.model?.name ?? "Unknown",
				modelNameText: data.modelNameText ?? "Error",
				nutritionFactsModalTriggerText:
					data.nutritionFactsModalTriggerText ?? "Error",
				permissionLevel: `LEVEL ${entry.permissions ?? "Unknown"}`,
				permissionLevelsModalTriggerText:
					data.permissionLevelsModalTriggerText ?? "Error",
				permissionLevelText: data.permissionLevelText ?? "Error",
			},
		];
	} catch (err) {
		console.error("Error in setData:", err);
		return [
			{
				description: "Error",
				featureName: "Error",
				modelName: "Error",
				modelNameText: "Error",
				nutritionFactsModalTriggerText: "Error",
				permissionLevel: "Error",
				permissionLevelsModalTriggerText: "Error",
				permissionLevelText: "Error",
			},
		];
	}
};

const entryToAIInformation = (entry: Entry): AiInfoFeature["aiInformation"] => {
	try {
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
	} catch (err) {
		console.error("Error in entryToAIInformation:", err);
		return {
			data: [
				{
					description: "Error",
					featureName: "Error",
					modelName: "Error",
					modelNameText: "Error",
					nutritionFactsModalTriggerText: "Error",
					permissionLevel: "Error",
					permissionLevelsModalTriggerText: "Error",
					permissionLevelText: "Error",
				},
			],
			dataPermissionLevelsCloseButtonText: "Error",
			dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Error",
			dataPermissionLevelsCurrentFeature: "Error",
			dataPermissionLevelsCurrentFeatureText: "Error",
			dataPermissionLevelsData: [],
			dataPermissionLevelsModalLabel: "Error",
			dataPermissionLevelsTitle: "Error",
			nutritionFactsCloseButtonText: "Error",
			nutritionFactsCloseIconButtonScreenReaderLabel: "Error",
			nutritionFactsData: [],
			nutritionFactsFeatureName: "Error",
			nutritionFactsModalLabel: "Error",
			nutritionFactsTitle: "Error",
			title: "Error",
			trigger: "Error",
		};
	}
};

export { entryToAIInformation };
