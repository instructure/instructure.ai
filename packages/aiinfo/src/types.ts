import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
} from "@instructure/ui-instructure";

type AiInfoFeatureProps = {
	nutritionFacts: NutritionFactsProps;
	dataPermissionLevels: DataPermissionLevelsProps;
	aiInformation: AiInformationProps;
	uid: string;
	revision: string;
	group: string;
	name: string;
};

type AiInfoProps = {
	[uid: string]: AiInfoFeatureProps;
};

type AiInfoNutritionFactsProps = {
	[uid: string]: NutritionFactsProps;
};

type AiInfoDataPermissionLevelsProps = {
	[uid: string]: DataPermissionLevelsProps;
};

type AiInfoAiInformationProps = {
	[uid: string]: AiInformationProps;
};

export type {
	AiInfoProps,
	AiInfoFeatureProps,
	AiInfoNutritionFactsProps,
	AiInfoDataPermissionLevelsProps,
	AiInfoAiInformationProps,
};
