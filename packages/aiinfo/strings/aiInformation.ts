// oxc-ignore-all assist/source/useSortedKeys: Required order for Strings
import type { AiInformationStrings } from "../types";
import { strings as nutritionFactsStrings } from "./nutritionFacts";
import { strings as permissionLevelsStrings } from "./permissionLevels";

const strings: { en: AiInformationStrings } = {
  en: {
    data: {
      modelNameText:
        nutritionFactsStrings.en.data[0].segmentData[0].segmentTitle,
      nutritionFactsModalTriggerText: nutritionFactsStrings.en.title,
      permissionLevelText: "Permission Level:",
      permissionLevelsModalTriggerText: permissionLevelsStrings.en.title,
    },
    dataPermissionLevelsCloseButtonText:
      permissionLevelsStrings.en.closeButtonText,
    dataPermissionLevelsCloseIconButtonScreenReaderLabel:
      permissionLevelsStrings.en.closeIconButtonScreenReaderLabel,
    dataPermissionLevelsCurrentFeatureText: "Current Feature:",
    dataPermissionLevelsModalLabel: permissionLevelsStrings.en.modalLabel,
    dataPermissionLevelsTitle: permissionLevelsStrings.en.title,
    nutritionFactsCloseButtonText: nutritionFactsStrings.en.closeButtonText,
    nutritionFactsCloseIconButtonScreenReaderLabel:
      nutritionFactsStrings.en.closeIconButtonScreenReaderLabel,
    nutritionFactsModalLabel: nutritionFactsStrings.en.modalLabel,
    nutritionFactsTitle: nutritionFactsStrings.en.title,
    title: "Features",
  } as AiInformationStrings,
};

export { strings };
