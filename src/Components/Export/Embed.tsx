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

const productToText = (product: ProductNutritionFacts): string => {
	const { data } = product;
	const text = `<h2>${product.name}</h2><p>${product.description}</p>${data.map((block) => `<h3>${block.blockTitle}</h3>${block.segmentData.map((segment) => `<h4>${segment.segmentTitle}</h4>${segment.value && segment.valueDescription ? `<p>${segment.value}</p><p>${segment.valueDescription}</p>` : segment.value ? `<p>${segment.value}</p>` : segment.valueDescription ? `<p>${segment.valueDescription}</p>` : ""}`).join("")}`).join("")}
`;
	return text;
};

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

	setTimeout(async () => {
		const pageElement = document.getElementById("embed");
		const height = pageElement ? pageElement.offsetHeight : 1800;
		const plainText = productToText(product);

		const base = "https://instructure.github.io/nf-generator/";
		const query = encodeURIComponent(safeProduct);
		const embedCode = `<iframe width="670px" height="${height}px" allowfullscreen src="${base}?embed&q=${query}&copyright=${layout.copyright}&disclaimer=${layout.disclaimer}&revision=${layout.revision}"></iframe>
<div class="hidden" id="ai-facts-hidden" style="display:none;">
  ${plainText}</div>`;
		try {
			await navigator.clipboard.writeText(embedCode);
			setIsPreview(false);
		} catch (error) {
			setIsPreview(false);
			let msg: string = "Failed to copy data to clipboard";
			if (error instanceof Error) {
				msg = error.message;
			} else if (typeof error === "string") {
				msg = error;
			}
			console.error(msg);
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
