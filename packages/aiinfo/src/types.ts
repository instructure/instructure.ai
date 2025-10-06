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

type nutritionFactsData = {
	[uid: string]: NutritionFactsProps;
};

type dataPermissionLevelsData = {
	[uid: string]: DataPermissionLevelsProps;
};

type aiInformationData = {
	[uid: string]: AiInformationProps;
};

export type { AiInfo, nutritionFactsData, dataPermissionLevelsData, aiInformationData };
