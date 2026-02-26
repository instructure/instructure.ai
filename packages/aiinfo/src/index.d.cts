//#region node/types.d.ts
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
//#endregion
//#region node/components/aiexperiences/index.d.ts
declare const aiexperiences: AiInfoFeatureProps;
//#endregion
//#region node/components/askyourdata/index.d.ts
declare const askyourdata: AiInfoFeatureProps;
//#endregion
//#region node/components/assessmentauthoringassistance/index.d.ts
declare const assessmentauthoringassistance: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasa11ycheckeralttextgenerator/index.d.ts
declare const canvasa11ycheckeralttextgenerator: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasa11ycheckertablecaptions/index.d.ts
declare const canvasa11ycheckertablecaptions: AiInfoFeatureProps;
//#endregion
//#region node/components/canvascoursetranslation/index.d.ts
declare const canvascoursetranslation: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasdiscussionsummaries/index.d.ts
declare const canvasdiscussionsummaries: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasgradingassistance/index.d.ts
declare const canvasgradingassistance: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasinboxtranslation/index.d.ts
declare const canvasinboxtranslation: AiInfoFeatureProps;
//#endregion
//#region node/components/careerassistant/index.d.ts
declare const careerassistant: AiInfoFeatureProps;
//#endregion
//#region node/components/conversionalignment/index.d.ts
declare const conversionalignment: AiInfoFeatureProps;
//#endregion
//#region node/components/discussioninsights/index.d.ts
declare const discussioninsights: AiInfoFeatureProps;
//#endregion
//#region node/components/igniteagent/index.d.ts
declare const igniteagent: AiInfoFeatureProps;
//#endregion
//#region node/components/itemauthoringassistance/index.d.ts
declare const itemauthoringassistance: AiInfoFeatureProps;
//#endregion
//#region node/components/portfolios/index.d.ts
declare const portfolios: AiInfoFeatureProps;
//#endregion
//#region node/components/quickreassess/index.d.ts
declare const quickreassess: AiInfoFeatureProps;
//#endregion
//#region node/components/rubricgenerator/index.d.ts
declare const rubricgenerator: AiInfoFeatureProps;
//#endregion
//#region node/components/smartsearch/index.d.ts
declare const smartsearch: AiInfoFeatureProps;
//#endregion
//#region node/index.d.ts
declare const AiInfo: AiInfoProps;
declare const nutritionFacts: AiInfoNutritionFactsProps;
declare const dataPermissionLevels: AiInfoDataPermissionLevelsProps;
declare const aiInformation: AiInfoAiInformationProps;
//#endregion
export {
  AiInfo,
  AiInfo as default,
  type AiInfoAiInformationProps,
  type AiInfoDataPermissionLevelsProps,
  type AiInfoFeatureProps,
  type AiInfoNutritionFactsProps,
  type AiInfoProps,
  type AiInformationProps,
  type DataPermissionLevelsProps,
  type NutritionFactsProps,
  aiInformation,
  aiexperiences,
  askyourdata,
  assessmentauthoringassistance,
  canvasa11ycheckeralttextgenerator,
  canvasa11ycheckertablecaptions,
  canvascoursetranslation,
  canvasdiscussionsummaries,
  canvasgradingassistance,
  canvasinboxtranslation,
  careerassistant,
  conversionalignment,
  dataPermissionLevels,
  discussioninsights,
  igniteagent,
  itemauthoringassistance,
  nutritionFacts,
  portfolios,
  quickreassess,
  rubricgenerator,
  smartsearch,
};
