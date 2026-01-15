import { type AiInfoFeature, type AiInformationStrings, type Entry } from "../types";
import { aiInformationStrings, permissionLevelsStrings } from "../strings";
import { entryToNutritionFacts, entryToPermissionLevels } from "./";

const setData = (
  data: AiInformationStrings["data"],
  entry: Entry,
): AiInfoFeature["aiInformation"]["data"] => {
  try {
    return [
      {
        description:
          permissionLevelsStrings.en.data[Number(entry.permissions) - 1]?.description ?? "Unknown",
        featureName: entry.feature?.name ?? "Unknown",
        modelName: entry.model?.name ?? "Unknown",
        modelNameText: data.modelNameText ?? "Error",
        nutritionFactsModalTriggerText: data.nutritionFactsModalTriggerText ?? "Error",
        permissionLevel: `LEVEL ${entry.permissions ?? "Unknown"}`,
        permissionLevelText: data.permissionLevelText ?? "Error",
        permissionLevelsModalTriggerText: data.permissionLevelsModalTriggerText ?? "Error",
        privacyNoticeText: entry.privacyNoticeText ?? "",
        privacyNoticeUrl: entry.privacyNoticeUrl ?? "",
      },
    ];
  } catch (error) {
    throw new Error(`Error in entryToAIInformation: ${String(error)}`, {
      cause: error,
    });
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
      dataPermissionLevelsData: permissionLevels.data.map((d) => ({
        description: d.description ?? "",
        highlighted: d.highlighted,
        level: d.level ?? "",
        title: d.title ?? "",
      })),
      nutritionFactsData: nutritionFacts.data,
      nutritionFactsFeatureName: nutritionFacts.featureName,
      trigger: undefined,
    };
  } catch (error) {
    throw new Error(`Error in entryToAIInformation: ${String(error)}`, {
      cause: error,
    });
  }
};

export { entryToAIInformation };
