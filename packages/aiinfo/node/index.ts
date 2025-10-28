import { askyourdata } from "./components/askyourdata";
import { bcealttext } from "./components/bcealttext";
import { canvascoursetranslation } from "./components/canvascoursetranslation";
import { canvasdiscussionsummaries } from "./components/canvasdiscussionsummaries";
import { canvasgradingassistance } from "./components/canvasgradingassistance";
import { canvasinboxtranslation } from "./components/canvasinboxtranslation";
import { conversionalignment } from "./components/conversionalignment";
import { discussioninsights } from "./components/discussioninsights";
import { igniteagent } from "./components/igniteagent";
import { portfolios } from "./components/portfolios";
import { quickreassess } from "./components/quickreassess";
import { rubricgenerator } from "./components/rubricgenerator";
import { smartsearch } from "./components/smartsearch";
import type {
	AiInfoAiInformationProps,
	AiInfoDataPermissionLevelsProps,
	AiInfoNutritionFactsProps,
	AiInfoProps,
} from "./types";

const pluck = <
	TRecord extends Record<string, object>,
	K extends keyof TRecord[keyof TRecord],
>(
	obj: TRecord,
	key: K,
): {
	[P in keyof TRecord]: TRecord[P][K];
} => {
	const out = {} as {
		[P in keyof TRecord]: TRecord[P][K];
	};
	for (const k in obj) {
		out[k] = obj[k][key];
	}
	return out;
};
const AiInfo: AiInfoProps = {
	askyourdata,
	bcealttext,
	canvascoursetranslation,
	canvasdiscussionsummaries,
	canvasgradingassistance,
	canvasinboxtranslation,
	conversionalignment,
	discussioninsights,
	igniteagent,
	portfolios,
	quickreassess,
	rubricgenerator,
	smartsearch,
};
const nutritionFacts: AiInfoNutritionFactsProps = pluck(
	AiInfo,
	"nutritionFacts",
);
const dataPermissionLevels: AiInfoDataPermissionLevelsProps = pluck(
	AiInfo,
	"dataPermissionLevels",
);
const aiInformation: AiInfoAiInformationProps = pluck(AiInfo, "aiInformation");
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
	conversionalignment,
	discussioninsights,
	igniteagent,
	portfolios,
	quickreassess,
	rubricgenerator,
	smartsearch,
};
export type * from "./types";
export default AiInfo;
