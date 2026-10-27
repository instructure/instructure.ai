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
declare const aiexperiences: AiInfoFeatureProps;
declare const askyourdata: AiInfoFeatureProps;
declare const assessmentauthoringassistance: AiInfoFeatureProps;
declare const canvasa11ycheckeralttextgenerator: AiInfoFeatureProps;
declare const canvasa11ycheckertablecaptions: AiInfoFeatureProps;
declare const canvascoursetranslation: AiInfoFeatureProps;
declare const canvasdiscussionsummaries: AiInfoFeatureProps;
declare const canvasgradingassistance: AiInfoFeatureProps;
declare const canvasinboxtranslation: AiInfoFeatureProps;
declare const careeragent: AiInfoFeatureProps;
declare const careerassistant: AiInfoFeatureProps;
declare const careercontentgeneration: AiInfoFeatureProps;
declare const careerflashcards: AiInfoFeatureProps;
declare const careerkeytakeaways: AiInfoFeatureProps;
declare const careerlearnerchat: AiInfoFeatureProps;
declare const careerquizzes: AiInfoFeatureProps;
declare const careerskillsextraction: AiInfoFeatureProps;
declare const careersummarization: AiInfoFeatureProps;
declare const conversionalignment: AiInfoFeatureProps;
declare const discussioninsights: AiInfoFeatureProps;
declare const igniteagent: AiInfoFeatureProps;
declare const itemauthoringassistance: AiInfoFeatureProps;
declare const pdbsmartskillextractor: AiInfoFeatureProps;
declare const portfolios: AiInfoFeatureProps;
declare const quickreassess: AiInfoFeatureProps;
declare const rubricgenerator: AiInfoFeatureProps;
declare const smartsearch: AiInfoFeatureProps;
declare const studytools: AiInfoFeatureProps;
declare const supportpandabot: AiInfoFeatureProps;
declare const AiInfo: AiInfoProps;
declare const nutritionFacts: AiInfoNutritionFactsProps;
declare const dataPermissionLevels: AiInfoDataPermissionLevelsProps;
declare const aiInformation: AiInfoAiInformationProps;
export { AiInfo, AiInfo as default, type AiInfoAiInformationProps, type AiInfoDataPermissionLevelsProps, type AiInfoFeatureProps, type AiInfoNutritionFactsProps, type AiInfoProps, type AiInformationProps, type DataPermissionLevelsProps, type NutritionFactsProps, aiInformation, aiexperiences, askyourdata, assessmentauthoringassistance, canvasa11ycheckeralttextgenerator, canvasa11ycheckertablecaptions, canvascoursetranslation, canvasdiscussionsummaries, canvasgradingassistance, canvasinboxtranslation, careeragent, careerassistant, careercontentgeneration, careerflashcards, careerkeytakeaways, careerlearnerchat, careerquizzes, careerskillsextraction, careersummarization, conversionalignment, dataPermissionLevels, discussioninsights, igniteagent, itemauthoringassistance, nutritionFacts, pdbsmartskillextractor, portfolios, quickreassess, rubricgenerator, smartsearch, studytools, supportpandabot };