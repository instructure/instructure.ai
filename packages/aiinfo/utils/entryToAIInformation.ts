import type { AiInfoFeature, CSV } from "../types";

const entryToAIInformation = (
	entry: CSV[number],
): AiInfoFeature["AiInformation"] => {
	return {} as AiInfoFeature["AiInformation"];
};

export { entryToAIInformation };
