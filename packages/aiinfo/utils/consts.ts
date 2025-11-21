const CSVURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_lbR3ZmU9adfQOgaOUvzET_tVR4AERgU_OEXGVFndVB6zNoArNZr-aQCs4HHAlGvX0QSjVor6nUvA/pub?gid=2000446087&single=true&output=csv";

const SCHEMAURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_lbR3ZmU9adfQOgaOUvzET_tVR4AERgU_OEXGVFndVB6zNoArNZr-aQCs4HHAlGvX0QSjVor6nUvA/pub?gid=716417708&single=true&output=csv";

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

export { CSVURL, SCHEMAURL, TEMPLATE_PACKAGE };
