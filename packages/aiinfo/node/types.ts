// oxlint-disable no-named-export
import {
  type AiInformationProps,
  type DataPermissionLevelsProps,
  type NutritionFactsProps,
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
  linkText?: string;
  linkUrl?: string;
}

type AiInfoProps = Record<string, AiInfoFeatureProps>;

type AiInfoNutritionFactsProps = Record<string, NutritionFactsProps>;

type AiInfoDataPermissionLevelsProps = Record<string, DataPermissionLevelsProps>;

type AiInfoAiInformationProps = Record<string, AiInformationProps>;

export type {
  AiInfoProps,
  AiInfoFeatureProps,
  AiInfoNutritionFactsProps,
  AiInfoDataPermissionLevelsProps,
  AiInfoAiInformationProps,
};
