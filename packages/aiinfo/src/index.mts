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

type NutritionFactsType = {
	[K in keyof typeof AiInfo]: (typeof AiInfo)[K]["nutritionFacts"];
};
type DataPermissionLevelsType = {
	[K in keyof typeof AiInfo]: (typeof AiInfo)[K]["dataPermissionLevels"];
};
type AiInformationType = {
	[K in keyof typeof AiInfo]: (typeof AiInfo)[K]["aiInformation"];
};

function pluck(obj: typeof AiInfo, key: "nutritionFacts"): NutritionFactsType;
function pluck(
	obj: typeof AiInfo,
	key: "dataPermissionLevels",
): DataPermissionLevelsType;
function pluck(obj: typeof AiInfo, key: "aiInformation"): AiInformationType;
function pluck(
	obj: typeof AiInfo,
	key: "nutritionFacts" | "dataPermissionLevels" | "aiInformation",
) {
	const out: Record<string, unknown> = {};
	for (const k in obj) {
		out[k] = obj[k][key];
	}
	return out;
}
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
