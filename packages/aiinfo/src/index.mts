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
	discussioninsights,
	igniteagent,
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
	discussioninsights,
	igniteagent,
	rubricgenerator,
	smartsearch,
};
export type * from "./types";
export default AiInfo;
