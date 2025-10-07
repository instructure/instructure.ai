import { aiInformationStrings, permissionLevelsStrings } from "../strings";
import type { AiInfoFeature, AiInformationStrings, Entry } from "../types";
import { entryToNutritionFacts, entryToPermissionLevels } from "./";

const setData = (
	data: AiInformationStrings["data"],
	entry: Entry,
	): AiInfoFeature["AiInformation"]["data"] => {
		try {
			return [
				{
					description:
						permissionLevelsStrings.en.data[Number(entry.permissions) - 1]?.description ?? "Unknown",
					featureName: entry.feature?.name ?? "Unknown",
					modelName: entry.model?.name ?? "Unknown",
					permissionLevel: `LEVEL ${entry.permissions ?? "Unknown"}`,
					permissionLevelText: data.permissionLevelText ?? "Error",
					permissionLevelsModalTriggerText: data.permissionLevelsModalTriggerText ?? "Error",
					modelNameText: data.modelNameText ?? "Error",
					nutritionFactsModalTriggerText: data.nutritionFactsModalTriggerText ?? "Error",
				},
			];
		} catch (err) {
			console.error("Error in setData:", err);
			return [{
				description: "Error",
				featureName: "Error",
				modelName: "Error",
				permissionLevel: "Error",
				permissionLevelText: "Error",
				permissionLevelsModalTriggerText: "Error",
				modelNameText: "Error",
				nutritionFactsModalTriggerText: "Error",
			}];
		}
	}

const entryToAIInformation = (entry: Entry): AiInfoFeature["AiInformation"] => {
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
			title: "Error",
			trigger: "Error",
			data: [{
				description: "Error",
				featureName: "Error",
				modelName: "Error",
				permissionLevel: "Error",
				permissionLevelText: "Error",
				permissionLevelsModalTriggerText: "Error",
				modelNameText: "Error",
				nutritionFactsModalTriggerText: "Error",
			}],
			dataPermissionLevelsTitle: "Error",
			dataPermissionLevelsCurrentFeatureText: "Error",
			dataPermissionLevelsCurrentFeature: "Error",
			dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Error",
			dataPermissionLevelsCloseButtonText: "Error",
			dataPermissionLevelsModalLabel: "Error",
			dataPermissionLevelsData: [],
			nutritionFactsModalLabel: "Error",
			nutritionFactsTitle: "Error",
			nutritionFactsCloseButtonText: "Error",
			nutritionFactsCloseIconButtonScreenReaderLabel: "Error",
			nutritionFactsData: [],
			nutritionFactsFeatureName: "Error",
		};
	}
}

export { entryToAIInformation };
