// oxlint-disable no-named-export

// Local type definitions to avoid external dependency on @instructure/ui-instructure
interface NutritionFactsBlockType {
  blockTitle: string;
  segmentData: {
    segmentTitle: string;
    description: string;
    value: string;
    valueDescription?: string;
  }[];
}

interface NutritionFactsProps {
  modalLabel: string;
  title: string;
  featureName: string;
  data: NutritionFactsBlockType[];
  closeButtonText: string;
  closeIconButtonScreenReaderLabel: string;
  triggerText: string;
  fullscreen?: boolean;
}

interface DataPermissionLevelsProps {
  modalLabel: string;
  title: string;
  data: {
    level: string;
    title: string;
    description: string;
    highlighted?: boolean;
  }[];
  closeButtonText: string;
  closeIconButtonScreenReaderLabel: string;
  currentFeatureText: string;
  currentFeature: string;
  triggerText: string;
  fullscreen?: boolean;
}

interface AiInformationProps {
  title: string;
  data: {
    featureName: string;
    privacyNoticeText: string;
    privacyNoticeUrl: string;
    permissionLevelText: string;
    permissionLevel: string;
    description: string;
    permissionLevelsModalTriggerText: string;
    modelNameText: string;
    modelName: string;
    nutritionFactsModalTriggerText: string;
  }[];
  fullscreenModals?: boolean;
  trigger: unknown;
  dataPermissionLevelsModalLabel: DataPermissionLevelsProps["modalLabel"];
  dataPermissionLevelsTitle: DataPermissionLevelsProps["title"];
  dataPermissionLevelsData: DataPermissionLevelsProps["data"];
  dataPermissionLevelsCloseButtonText: DataPermissionLevelsProps["closeButtonText"];
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: DataPermissionLevelsProps["closeIconButtonScreenReaderLabel"];
  dataPermissionLevelsCurrentFeatureText: DataPermissionLevelsProps["currentFeatureText"];
  dataPermissionLevelsCurrentFeature: DataPermissionLevelsProps["currentFeature"];
  nutritionFactsModalLabel: NutritionFactsProps["modalLabel"];
  nutritionFactsTitle: NutritionFactsProps["title"];
  nutritionFactsFeatureName: NutritionFactsProps["featureName"];
  nutritionFactsData: NutritionFactsProps["data"];
  nutritionFactsCloseButtonText: NutritionFactsProps["closeButtonText"];
  nutritionFactsCloseIconButtonScreenReaderLabel: NutritionFactsProps["closeIconButtonScreenReaderLabel"];
}

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
  AiInformationProps,
  DataPermissionLevelsProps,
  NutritionFactsProps,
};
