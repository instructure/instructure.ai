import { NutritionFacts } from "@instructure/ui";
import type { FC } from "react";
import type { NutritionFactBlock, ProductNutritionFacts } from "../types.ts";

type BlockType = {
	blockTitle: string;
	segmentData: {
		segmentTitle: string;
		description: string;
		value: string;
		valueDescription?: string;
	}[];
};

function toBlockType(block: NutritionFactBlock): BlockType {
	return {
		blockTitle: block.blockTitle,
		segmentData: block.segmentData.map((segment) => ({
			description: segment.description,
			segmentTitle: segment.segmentTitle,
			value: segment.value ?? "",
			valueDescription: segment.valueDescription,
		})),
	};
}

const Preview: FC<{ product: ProductNutritionFacts }> = ({ product }) => {
	const data = product.data.map(toBlockType);
	return (
		<NutritionFacts
			closeButtonText="Close"
			closeIconButtonScreenReaderLabel="Close"
			data={data}
			featureName={product.name}
			modalLabel="This is a modal for AI facts"
			title="Nutrition Facts"
			triggerText="Nutrition Facts"
		/>
	);
};

export { Preview };
