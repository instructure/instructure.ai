import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
} from "@instructure/ui-instructure";

type AiInfo = {
	[uid: string]: {
		nutritionFacts: NutritionFactsProps;
		aiInformation: AiInformationProps;
		dataPermissionLevels: DataPermissionLevelsProps;
	};
};

type nutritionFacts = {
	[uid: string]: NutritionFactsProps;
};

type dataPermissionLevels = {
	[uid: string]: DataPermissionLevelsProps;
};

type aiInformation = {
	[uid: string]: AiInformationProps;
};

export type { AiInfo, nutritionFacts, dataPermissionLevels, aiInformation };
