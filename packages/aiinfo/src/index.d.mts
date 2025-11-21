import {
  AiInformationProps,
  DataPermissionLevelsProps,
  NutritionFactsProps,
} from "@instructure/ui-instructure";

//#region node/types.d.ts
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
//#endregion
//#region node/components/askyourdata/index.d.ts
declare const askyourdata: AiInfoFeatureProps;
//#endregion
//#region node/components/assessmentauthoringassistance/index.d.ts
declare const assessmentauthoringassistance: AiInfoFeatureProps;
//#endregion
//#region node/components/bcealttext/index.d.ts
declare const bcealttext: AiInfoFeatureProps;
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
  aiInformation,
  askyourdata,
  assessmentauthoringassistance,
  bcealttext,
  canvascoursetranslation,
  canvasdiscussionsummaries,
  canvasgradingassistance,
  canvasinboxtranslation,
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
