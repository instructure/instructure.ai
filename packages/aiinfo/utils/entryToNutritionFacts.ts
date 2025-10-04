import type { AiInfoFeature, CSV } from "../types.js";

const entryToNutritionFacts = (
	entry: CSV[number],
): AiInfoFeature["NutritionFacts"] => {
	return {} as AiInfoFeature["NutritionFacts"];
};

export { entryToNutritionFacts };
