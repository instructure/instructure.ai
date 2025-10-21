import type { AiInfoFeatureProps } from "@instructure.ai/aiinfo";

/**
 * Returns extended nutrition facts in the block/segment format.
 * Adds the permissions segment to the nutritionFacts.data array.
 */
const extendedNutritionFacts = (product: AiInfoFeatureProps) => {
	const firstData =
		Array.isArray(product.aiInformation?.data) &&
		product.aiInformation.data.length > 0
			? product.aiInformation.data[0]
			: { description: "", permissionLevel: "" };

	const permissionsSegment = {
		blockTitle: "Data Permissions Level",
		segmentData: [
			{
				description: "",
				segmentTitle: firstData.permissionLevel
					? firstData.permissionLevel.replace("LEVEL", "Level")
					: "",
				value: firstData.description ?? "",
				valueDescription: undefined,
			},
		],
	};

	const nutritionFacts = product.nutritionFacts ?? {};
	const dataArray = Array.isArray(nutritionFacts.data)
		? nutritionFacts.data
		: [];

	return {
		"description": product.description,
		...nutritionFacts,
		data: [...dataArray, permissionsSegment],
	};
};

export { extendedNutritionFacts };
