import { askyourdata } from "./askyourdata";
import { bcealttext } from "./bcealttext";
import { canvascoursetranslation } from "./canvascoursetranslation";
import { canvasdiscussionsummaries } from "./canvasdiscussionsummaries";
import { canvasgradingassistance } from "./canvasgradingassistance";
import { canvasinboxtranslation } from "./canvasinboxtranslation";
import { discussioninsights } from "./discussioninsights";
import { igniteagent } from "./igniteagent";
import { rubricgenerator } from "./rubricgenerator";
import { smartsearch } from "./smartsearch";
import type {
	AiInfoAiInformationProps,
	AiInfoDataPermissionLevelsProps,
	AiInfoFeatureProps,
	AiInfoNutritionFactsProps,
	AiInfoProps,
} from "./types";

const AiInfo: AiInfoProps = {
	askyourdata: askyourdata,
	bcealttext: bcealttext,
	canvascoursetranslation: canvascoursetranslation,
	canvasdiscussionsummaries: canvasdiscussionsummaries,
	canvasgradingassistance: canvasgradingassistance,
	canvasinboxtranslation: canvasinboxtranslation,
	discussioninsights: discussioninsights,
	igniteagent: igniteagent,
	rubricgenerator: rubricgenerator,
	smartsearch: smartsearch,
};
const nutritionFacts: AiInfoNutritionFactsProps = {
	askyourdata: askyourdata.nutritionFacts,
	bcealttext: bcealttext.nutritionFacts,
	canvascoursetranslation: canvascoursetranslation.nutritionFacts,
	canvasdiscussionsummaries: canvasdiscussionsummaries.nutritionFacts,
	canvasgradingassistance: canvasgradingassistance.nutritionFacts,
	canvasinboxtranslation: canvasinboxtranslation.nutritionFacts,
	discussioninsights: discussioninsights.nutritionFacts,
	igniteagent: igniteagent.nutritionFacts,
	rubricgenerator: rubricgenerator.nutritionFacts,
	smartsearch: smartsearch.nutritionFacts,
};
const dataPermissionLevels: AiInfoDataPermissionLevelsProps = {
	askyourdata: askyourdata.dataPermissionLevels,
	bcealttext: bcealttext.dataPermissionLevels,
	canvascoursetranslation: canvascoursetranslation.dataPermissionLevels,
	canvasdiscussionsummaries: canvasdiscussionsummaries.dataPermissionLevels,
	canvasgradingassistance: canvasgradingassistance.dataPermissionLevels,
	canvasinboxtranslation: canvasinboxtranslation.dataPermissionLevels,
	discussioninsights: discussioninsights.dataPermissionLevels,
	igniteagent: igniteagent.dataPermissionLevels,
	rubricgenerator: rubricgenerator.dataPermissionLevels,
	smartsearch: smartsearch.dataPermissionLevels,
};
const aiInformation: AiInfoAiInformationProps = {
	askyourdata: askyourdata.aiInformation,
	bcealttext: bcealttext.aiInformation,
	canvascoursetranslation: canvascoursetranslation.aiInformation,
	canvasdiscussionsummaries: canvasdiscussionsummaries.aiInformation,
	canvasgradingassistance: canvasgradingassistance.aiInformation,
	canvasinboxtranslation: canvasinboxtranslation.aiInformation,
	discussioninsights: discussioninsights.aiInformation,
	igniteagent: igniteagent.aiInformation,
	rubricgenerator: rubricgenerator.aiInformation,
	smartsearch: smartsearch.aiInformation,
};
export {
	AiInfo,
	nutritionFacts,
	dataPermissionLevels,
	aiInformation,
	askyourdata,
	bcealttext,
	canvascoursetranslation,
	canvasdiscussionsummaries,
	canvasgradingassistance,
	canvasinboxtranslation,
	discussioninsights,
	igniteagent,
	rubricgenerator,
	smartsearch,
};
export type {
	AiInfoProps,
	AiInfoFeatureProps,
	AiInfoNutritionFactsProps,
	AiInfoDataPermissionLevelsProps,
	AiInfoAiInformationProps,
};
export default AiInfo;
