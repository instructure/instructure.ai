import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
} from "@instructure/ui-instructure";

interface AiInfoFeatureProps {
	nutritionFacts: NutritionFactsProps;
	dataPermissionLevels: DataPermissionLevelsProps;
	aiInformation: AiInformationProps;
	uid: string;
	revision: string;
	group: string;
	name: string;
	description: string;
}

interface AiInfoProps {
	[uid: string]: AiInfoFeatureProps;
}

interface AiInfoNutritionFactsProps {
	[uid: string]: NutritionFactsProps;
}

interface AiInfoDataPermissionLevelsProps {
	[uid: string]: DataPermissionLevelsProps;
}

interface AiInfoAiInformationProps {
	[uid: string]: AiInformationProps;
}

export type {
	AiInfoProps,
	AiInfoFeatureProps,
	AiInfoNutritionFactsProps,
	AiInfoDataPermissionLevelsProps,
	AiInfoAiInformationProps,
};
