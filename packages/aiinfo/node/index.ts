import {
  type AiInfoAiInformationProps,
  type AiInfoDataPermissionLevelsProps,
  type AiInfoNutritionFactsProps,
  type AiInfoProps,
} from "./types";
import aiexperiences from "./components/aiexperiences";
import askyourdata from "./components/askyourdata";
import assessmentauthoringassistance from "./components/assessmentauthoringassistance";
import canvasa11ycheckeralttextgenerator from "./components/canvasa11ycheckeralttextgenerator";
import canvasa11ycheckertablecaptions from "./components/canvasa11ycheckertablecaptions";
import canvascoursetranslation from "./components/canvascoursetranslation";
import canvasdiscussionsummaries from "./components/canvasdiscussionsummaries";
import canvasgradingassistance from "./components/canvasgradingassistance";
import canvasinboxtranslation from "./components/canvasinboxtranslation";
import careeragent from "./components/careeragent";
import careerassistant from "./components/careerassistant";
import careercontentgeneration from "./components/careercontentgeneration";
import careerflashcards from "./components/careerflashcards";
import careerkeytakeaways from "./components/careerkeytakeaways";
import careerlearnerchat from "./components/careerlearnerchat";
import careerquizzes from "./components/careerquizzes";
import careerskillsextraction from "./components/careerskillsextraction";
import careersummarization from "./components/careersummarization";
import conversionalignment from "./components/conversionalignment";
import discussioninsights from "./components/discussioninsights";
import igniteagent from "./components/igniteagent";
import itemauthoringassistance from "./components/itemauthoringassistance";
import portfolios from "./components/portfolios";
import quickreassess from "./components/quickreassess";
import rubricgenerator from "./components/rubricgenerator";
import smartsearch from "./components/smartsearch";
import studytools from "./components/studytools";
import supportpandabot from "./components/supportpandabot";
const pluck = <TRecord extends Record<string, object>, K extends keyof TRecord[keyof TRecord]>(
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
  aiexperiences,
  askyourdata,
  assessmentauthoringassistance,
  canvasa11ycheckeralttextgenerator,
  canvasa11ycheckertablecaptions,
  canvascoursetranslation,
  canvasdiscussionsummaries,
  canvasgradingassistance,
  canvasinboxtranslation,
  careeragent,
  careerassistant,
  careercontentgeneration,
  careerflashcards,
  careerkeytakeaways,
  careerlearnerchat,
  careerquizzes,
  careerskillsextraction,
  careersummarization,
  conversionalignment,
  discussioninsights,
  igniteagent,
  itemauthoringassistance,
  portfolios,
  quickreassess,
  rubricgenerator,
  smartsearch,
  studytools,
  supportpandabot,
};
const nutritionFacts: AiInfoNutritionFactsProps = pluck(AiInfo, "nutritionFacts");
const dataPermissionLevels: AiInfoDataPermissionLevelsProps = pluck(AiInfo, "dataPermissionLevels");
const aiInformation: AiInfoAiInformationProps = pluck(AiInfo, "aiInformation");
export {
  AiInfo,
  nutritionFacts,
  dataPermissionLevels,
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
  careeragent,
  careerassistant,
  careercontentgeneration,
  careerflashcards,
  careerkeytakeaways,
  careerlearnerchat,
  careerquizzes,
  careerskillsextraction,
  careersummarization,
  conversionalignment,
  discussioninsights,
  igniteagent,
  itemauthoringassistance,
  portfolios,
  quickreassess,
  rubricgenerator,
  smartsearch,
  studytools,
  supportpandabot,
};
export type * from "./types";
export default AiInfo;
