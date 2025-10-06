// biome-ignore-all assist/source/useSortedKeys: Required order for Strings

import type { Renderable } from "@instructure/shared-types";
import type { AiInformationStrings } from "../types";
import { strings as nutritionFactsStrings } from "./nutritionFacts";
import { strings as permissionLevelsStrings } from "./permissionLevels";

const strings: { en: AiInformationStrings } = {
	en: {
		title: "Features",
		trigger: "<Button>AI Information</Button>" as Renderable,
		data: {
			permissionLevelText: "Permission Level:",
			permissionLevelsModalTriggerText: permissionLevelsStrings.en.title,
			modelNameText:
				nutritionFactsStrings.en.data[0].segmentData[0].segmentTitle,
			nutritionFactsModalTriggerText: nutritionFactsStrings.en.title,
		},
		dataPermissionLevelsTitle: permissionLevelsStrings.en.title,
		dataPermissionLevelsCurrentFeatureText: "Current Feature:",
		dataPermissionLevelsCloseIconButtonScreenReaderLabel:
			permissionLevelsStrings.en.closeIconButtonScreenReaderLabel,
		dataPermissionLevelsCloseButtonText:
			permissionLevelsStrings.en.closeButtonText,
		dataPermissionLevelsModalLabel: permissionLevelsStrings.en.modalLabel,
		nutritionFactsModalLabel: nutritionFactsStrings.en.modalLabel,
		nutritionFactsTitle: nutritionFactsStrings.en.title,
		nutritionFactsCloseButtonText: nutritionFactsStrings.en.closeButtonText,
		nutritionFactsCloseIconButtonScreenReaderLabel:
			nutritionFactsStrings.en.closeIconButtonScreenReaderLabel,
	} as AiInformationStrings,
};

export { strings };
