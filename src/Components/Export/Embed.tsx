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
	const safeProduct = JSON.stringify({
		...rest,
		data: product.data.map(toBlockType),
	});

	const base = "https://instructure.github.io/nf-generator/";
	const query = encodeURIComponent(safeProduct);
	const copyright = layout.copyright ? layout.copyright.toString() : "";
	const disclaimer = layout.disclaimer ? layout.disclaimer.toString() : "";
	const revision = layout.revision ? layout.revision.toString() : "";

	const embedCode = `<iframe width="100%" height="1800px" allowfullscreen src="${base}?embed&q=${query}&copyright=${copyright}${disclaimer ? `&disclaimer=${disclaimer}` : ""}&revision=${revision}"></iframe>`;
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
