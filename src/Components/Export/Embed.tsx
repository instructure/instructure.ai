import { IconExternalLinkLine, type SVGIconProps } from "@instructure/ui";
import type {
	NutritionFactBlock,
	PageLayout,
	ProductNutritionFacts,
} from "../../types.ts";
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

const Embed = async (product: ProductNutritionFacts, layout: PageLayout) => {
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
	const embedCode = `<iframe style="width: 100%; height: 100vh; border: none;" allowfullscreen src="https://instructure.github.io/nf-generator/?embed&q=${encodeURIComponent(
		safeProduct,
	)}&copyright=${layout.copyright.toString()}&disclaimer=${layout.disclaimer.toString()}&revision=${layout.revision.toString()}"></iframe>`;
	try {
		await navigator.clipboard.writeText(embedCode);
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

const EmbedControl: React.FC<{
	product: ProductNutritionFacts;
	layout: PageLayout;
}> = ({ product, layout }) => (
	<ControlButton
		Icon={IconExternalLinkLine as React.ElementType<SVGIconProps>}
		label="Copy embed code"
		onClick={() => Embed(product, layout)}
	/>
);

export { EmbedControl };
