import { AiInformationProps } from '@instructure/ui';
import { DataPermissionLevelsProps } from '@instructure/ui';
import { NutritionFactsProps } from '@instructure/ui';

declare const AiInfo: AiInfoProps;
export { AiInfo }
export default AiInfo;

export declare type AiInfoAiInformationProps = {
    [uid: string]: AiInformationProps;
};

export declare type AiInfoDataPermissionLevelsProps = {
    [uid: string]: DataPermissionLevelsProps;
};

export declare type AiInfoFeatureProps = {
    nutritionFacts: NutritionFactsProps;
    dataPermissionLevels: DataPermissionLevelsProps;
    aiInformation: AiInformationProps;
    uid: string;
    revision: string;
    group: string;
    name: string;
    description: string;
};

export declare type AiInfoNutritionFactsProps = {
    [uid: string]: NutritionFactsProps;
};

export declare type AiInfoProps = {
    [uid: string]: AiInfoFeatureProps;
};

export declare const aiInformation: AiInfoAiInformationProps;

export declare const askyourdata: AiInfoFeatureProps;

export declare const bcealttext: AiInfoFeatureProps;

export declare const canvascoursetranslation: AiInfoFeatureProps;

export declare const canvasdiscussionsummaries: AiInfoFeatureProps;

export declare const canvasgradingassistance: AiInfoFeatureProps;

export declare const canvasinboxtranslation: AiInfoFeatureProps;

export declare const dataPermissionLevels: AiInfoDataPermissionLevelsProps;

export declare const discussioninsights: AiInfoFeatureProps;

export declare const igniteagent: AiInfoFeatureProps;

export declare const nutritionFacts: AiInfoNutritionFactsProps;

export declare const portfolios: AiInfoFeatureProps;

export declare const rubricgenerator: AiInfoFeatureProps;

export declare const smartsearch: AiInfoFeatureProps;

export { }
