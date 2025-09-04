import { IconExternalLinkLine, type SVGIconProps } from "@instructure/ui";
import type { Dispatch, SetStateAction } from "react";
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

const Embed = async (
	product: ProductNutritionFacts,
	layout: PageLayout,
	setIsPreview: Dispatch<SetStateAction<boolean>>,
) => {
	// biome-ignore lint: biomelint/correctness/noUnusedVariables- removing properties from object
	const { nameHint, descriptionHint, ...rest } = product;
	const safeProduct = JSON.stringify({
		...rest,
		data: product.data.map(toBlockType),
	});

	setIsPreview(true);

	// Wait for the preview to render before measuring
	setTimeout(async () => {
		const pageElement = document.getElementById("embed");
		console.log("Page Element:", pageElement);
		const height = pageElement ? pageElement.offsetHeight + 40 : 1800;

		const base = "https://instructure.github.io/nf-generator/";
		const query = encodeURIComponent(safeProduct);
		const embedCode = `<iframe width="100%" height="${height}px" allowfullscreen src="${base}?embed&q=${query}&copyright=${layout.copyright}&disclaimer=${layout.disclaimer}&revision=${layout.revision}"></iframe>`;
		try {
			await navigator.clipboard.writeText(embedCode);
			setIsPreview(false); // Turn preview off after success
		} catch (error) {
			setIsPreview(false); // Also turn preview off on error
			let msg: string = "Failed to copy data to clipboard";
			if (error instanceof Error) {
				msg = error.message;
			} else if (typeof error === "string") {
				msg = error;
			}
			console.error("oopsie!", msg);
		}
	}, 0);
};

const EmbedControl: React.FC<{
	product: ProductNutritionFacts;
	layout: PageLayout;
	setIsPreview: Dispatch<SetStateAction<boolean>>;
}> = ({ product, layout, setIsPreview }) => (
	<ControlButton
		Icon={IconExternalLinkLine as React.ElementType<SVGIconProps>}
		label="Copy embed code"
		onClick={() => Embed(product, layout, setIsPreview)}
	/>
);

export { EmbedControl };
