import type { AiInfoFeature, CSV } from "../types.js";

const entryToPermissionLevels = (
	entry: CSV[number],
): AiInfoFeature["DataPermissionLevels"] => {
	return {} as AiInfoFeature["DataPermissionLevels"];
};

export { entryToPermissionLevels };
