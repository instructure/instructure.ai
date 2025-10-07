import { permissionLevelsStrings } from "../strings";
import type {
	AiInfoFeature,
	DataPermissionLevelsStrings,
	Entry,
} from "../types.js";

const setHighlighted = (
	data: DataPermissionLevelsStrings["data"],
	level: Entry["permissions"],
): AiInfoFeature["DataPermissionLevels"]["data"] => {
	try {
		return data.map((entry, idx) => ({
			...entry,
			highlighted: idx === Number(level) - 1,
		}));
	} catch (err) {
		console.error("Error in setHighlighted:", err);
		return [
			{
				description: "Error",
				highlighted: false,
				level: "Error",
				title: "Error",
			},
		];
	}
};

const entryToPermissionLevels = (
	entry: Entry,
): AiInfoFeature["DataPermissionLevels"] => {
	try {
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
	} catch (err) {
		console.error("Error in entryToPermissionLevels:", err);
		return {
			closeButtonText: "Error",
			closeIconButtonScreenReaderLabel: "Error",
			currentFeature: "Error",
			currentFeatureText: "Error",
			data: [
				{
					description: "Error",
					highlighted: false,
					level: "Error",
					title: "Error",
				},
			],
			modalLabel: "Error",
			title: "Error",
			triggerText: "Error",
		};
	}
};

export { entryToPermissionLevels };
