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
	askyourdata: askyourdata.NutritionFacts,
	bcealttext: bcealttext.NutritionFacts,
	canvascoursetranslation: canvascoursetranslation.NutritionFacts,
	canvasdiscussionsummaries: canvasdiscussionsummaries.NutritionFacts,
	canvasgradingassistance: canvasgradingassistance.NutritionFacts,
	canvasinboxtranslation: canvasinboxtranslation.NutritionFacts,
	discussioninsights: discussioninsights.NutritionFacts,
	igniteagent: igniteagent.NutritionFacts,
	rubricgenerator: rubricgenerator.NutritionFacts,
	smartsearch: smartsearch.NutritionFacts,
};
const dataPermissionLevels: AiInfoDataPermissionLevelsProps = {
	askyourdata: askyourdata.DataPermissionLevels,
	bcealttext: bcealttext.DataPermissionLevels,
	canvascoursetranslation: canvascoursetranslation.DataPermissionLevels,
	canvasdiscussionsummaries: canvasdiscussionsummaries.DataPermissionLevels,
	canvasgradingassistance: canvasgradingassistance.DataPermissionLevels,
	canvasinboxtranslation: canvasinboxtranslation.DataPermissionLevels,
	discussioninsights: discussioninsights.DataPermissionLevels,
	igniteagent: igniteagent.DataPermissionLevels,
	rubricgenerator: rubricgenerator.DataPermissionLevels,
	smartsearch: smartsearch.DataPermissionLevels,
};
const aiInformation: AiInfoAiInformationProps = {
	askyourdata: askyourdata.AiInformation,
	bcealttext: bcealttext.AiInformation,
	canvascoursetranslation: canvascoursetranslation.AiInformation,
	canvasdiscussionsummaries: canvasdiscussionsummaries.AiInformation,
	canvasgradingassistance: canvasgradingassistance.AiInformation,
	canvasinboxtranslation: canvasinboxtranslation.AiInformation,
	discussioninsights: discussioninsights.AiInformation,
	igniteagent: igniteagent.AiInformation,
	rubricgenerator: rubricgenerator.AiInformation,
	smartsearch: smartsearch.AiInformation,
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
