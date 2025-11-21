const CSVURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTUoO92jyiHlJq36oKbtCdL57J7bdOKJbhxRahR2YTR6lTyfhQyo5kidHRwk45jagV9C9DXf80SgfS/pub?gid=2000446087&single=true&output=csv";

const TEMPLATE_PACKAGE = `import { Button } from "@instructure/ui";
import type { AiInfoFeatureProps } from "../types";
import type { AiInformationProps, DataPermissionLevelsProps, NutritionFactsProps } from "@instructure/ui";

const <<uid>>: AiInfoFeatureProps = <<data>>;

const nutritionFacts: NutritionFactsProps = <<nutritionFacts>>;

const dataPermissionLevels: DataPermissionLevelsProps = <<dataPermissionLevels>>;

const aiInformation: AiInformationProps = <<aiInformation>>;

export { <<uid>>, nutritionFacts, dataPermissionLevels, aiInformation };
export default <<uid>>;
`;

export { CSVURL, TEMPLATE_PACKAGE };
