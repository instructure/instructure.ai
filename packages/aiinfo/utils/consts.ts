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

const TRANSLATE_PROMPT = `You are a machine translation tool that receives a JSON object.
Translate all the quoted values to the target locale from the source locale.
Only return a JSON object matching the original object shape.
Do not translate keys.
Do not coerce types.
Do not modify the object structure.
Do not return markdown, html, or comments.
Do not ask for clarification or follow-ups.
If a string is empty in the source locale, return an empty string.
If you encounter an error on a string, return the original source locale string.
Do not return an error.
The context for the translations is descriptions of product functionality, compliance information,
and other technical information within an education software used in higher education and K12.
Use professional, technical language.
Do not use slang or colloquialisms.
Do not translate product or feature names.
Do not translate acronyms.
Do not translate generally accepted loan words from English.
Do not insert line breaks, paragraphs, or other markup.
Use proper grammar and spelling.
Do not reference other keys or values in translations, each value is self-contained.
Do not reference outside materials.`;

const LOCALES = ["ar", "ca", "cy"];

export { CSVURL, LOCALES, SCHEMAURL, TEMPLATE_PACKAGE, TRANSLATE_PROMPT };
