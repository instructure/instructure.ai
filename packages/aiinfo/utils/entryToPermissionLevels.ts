import { permissionLevelsStrings } from "../strings";
import type {
	AiInfoFeature,
	DataPermissionLevelsStrings,
	Entry,
} from "../types.js";

const setHighlighted = (
	data: DataPermissionLevelsStrings["data"],
	level: Entry["permissions"],
): DataPermissionLevelsStrings["data"] => {
	return data.map((entry, idx) => ({
		...entry,
		highlighted: idx === Number(level) - 1,
	}));
};

const entryToPermissionLevels = (
	entry: Entry,
): AiInfoFeature["DataPermissionLevels"] => {
	const {
		feature: { name },
		permissions,
	} = entry;
	const { en: s } = permissionLevelsStrings as {
		en: DataPermissionLevelsStrings;
	};

	const highlighted = setHighlighted(s.data, permissions);

	return {
		closeButtonText: s.closeButtonText,
		closeIconButtonScreenReaderLabel: s.closeIconButtonScreenReaderLabel,
		currentFeature: name,
		currentFeatureText: s.currentFeatureText,
		data: highlighted,
		modalLabel: s.modalLabel,
		title: s.title,
		triggerText: s.triggerText,
	};
};

export { entryToPermissionLevels };
