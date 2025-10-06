import type { AiInfoFeature } from "../types.js";

const entryToNutritionFacts = (
	entry: Entry,
): AiInfoFeature["NutritionFacts"] => {
	return {} as AiInfoFeature["NutritionFacts"];
};

export { entryToNutritionFacts };
