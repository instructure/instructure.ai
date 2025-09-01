import { IconCopyLine, type SVGIconProps } from "@instructure/ui";
import type { NutritionFactBlock, ProductNutritionFacts } from "../types.ts";
import { ControlButton } from "./ControlButton.tsx";

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
			valueDescription: segment.valueDescription?.trim()
				? segment.valueDescription
				: undefined,
		})),
	};
}

const Copy = async (product: ProductNutritionFacts) => {
	// biome-ignore lint: biomelint/correctness/noUnusedVariables- removing properties from object
	const { nameHint, descriptionHint, ...rest } = product;
	const safeProduct = JSON.stringify(
		{
			...rest,
			data: product.data.map(toBlockType),
		},
		null,
		2,
	);
	try {
		await navigator.clipboard.writeText(safeProduct);
	} catch (error) {
		let msg: string = "Failed to copy data to clipboard";
		if (error instanceof Error) {
			msg = error.message;
		} else if (typeof error === "string") {
			msg = error;
		}
		console.error(msg);
	}
};

const CopyControl: React.FC<{ product: ProductNutritionFacts }> = ({
	product,
}) => (
	<ControlButton
		Icon={IconCopyLine as React.ElementType<SVGIconProps>}
		label="Copy data object"
		onClick={() => Copy(product)}
	/>
);

export { CopyControl };
