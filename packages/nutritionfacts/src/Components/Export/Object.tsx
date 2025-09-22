import type {
	StrictNutritionFacts,
	ProductNutritionFacts,
	SegmentBase,
} from "../../types.ts";

const ExportJSON = (nf: ProductNutritionFacts): StrictNutritionFacts => {
	// biome-ignore lint/correctness/noUnusedVariables: Destructuring to omit keys
	const {
		revision,
		id,
		permissions,
		group,
		nameHint,
		descriptionHint,
		...rest
	} = nf;

	function stripSegment<
		T extends {
			valueHint?: SegmentBase["valueHint"];
			descriptionHint?: SegmentBase["descriptionHint"];
		},
	>(seg: T): Omit<T, "valueHint" | "descriptionHint"> {
		// biome-ignore lint/correctness/noUnusedVariables: Destructuring to omit keys
		const { valueHint, descriptionHint, ...s } = seg;
		return s;
	}

	// Map over blocks and segments to remove hints
	const strictData = nf.data.map((block) => {
		switch (block.blockTitle) {
			case "Model & Data":
				return {
					blockTitle: block.blockTitle,
					segmentData: block.segmentData.map(stripSegment),
				};
			case "Privacy & Compliance":
				return {
					blockTitle: block.blockTitle,
					segmentData: block.segmentData.map(stripSegment),
				};
			case "Outputs":
				return {
					blockTitle: block.blockTitle,
					segmentData: block.segmentData.map(stripSegment),
				};
			default:
				return block;
		}
	});

	return {
		...rest,
		data: strictData,
	};
};

export default ExportJSON;
