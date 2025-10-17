import { permissionLevelsStrings } from "../strings";
import type { Entry } from "../types";

type PermissionLevel = {
	id: string;
	description: string;
	highlighted?: boolean;
	title?: string;
	level?: string;
};

type Result = {
	closeButtonText: string;
	closeIconButtonScreenReaderLabel: string;
	currentFeatureText: string;
	modalLabel: string;
	title: string;
	triggerText: string;
	currentFeature: string;
	data: PermissionLevel[];
};

function entryToPermissionLevels(entry: Entry): Result {
	try {
		const strings = permissionLevelsStrings.en;
		const { permissions, feature } = entry;
		if (!strings.data || !Array.isArray(strings.data)) {
			throw new Error(
				"permissionLevelsStrings.en.data is undefined or not an array",
			);
		}
		const data = strings.data;
		let highlightId: string | undefined;

		const permStr = String(permissions);
		if (
			typeof permissions === "string" &&
			/^\d+$/.test(permissions) &&
			permStr !== "0"
		) {
			if (data.some((d) => d.level.endsWith(permStr))) {
				highlightId = `L${permStr}`;
			}
		}
		if (typeof permissions === "number") {
			highlightId = undefined;
		}
		const mapped = data.map((d) => ({
			...d,
			highlighted: !!(
				d.level.endsWith(permStr) &&
				highlightId === d.level.replace("LEVEL ", "L")
			),
			id: d.level.replace("LEVEL ", "L"),
		}));
		return {
			...strings,
			currentFeature: feature?.name ?? "",
			data: mapped,
		};
	} catch (err) {
		throw new Error(
			`Error in entryToPermissionLevels: ${(err as Error).message}`,
		);
	}
}

export { entryToPermissionLevels };
