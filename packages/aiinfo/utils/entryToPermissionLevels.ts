import type { AiInfoFeature } from "../types.js";

const entryToPermissionLevels = (
	entry: Entry,
): AiInfoFeature["DataPermissionLevels"] => {
	return {} as AiInfoFeature["DataPermissionLevels"];
};

export { entryToPermissionLevels };
