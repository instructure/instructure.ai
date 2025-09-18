import { IconExternalLinkLine, type SVGIconProps } from "@instructure/ui";
import type { Dispatch, SetStateAction } from "react";
import { baseUrl } from "../../assets";
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
	const text = `<h2>${product.name}</h2><p>${product.description}</p>`;
	return text;
};

const Embed = async (
	product: ProductNutritionFacts,
	layout: PageLayout,
	id?: string,
) => {
	// biome-ignore lint: biomelint/correctness/noUnusedVariables- removing properties from object
	const { nameHint, descriptionHint, ...rest } = product;
	const safeProduct = JSON.stringify({
		...rest,
		data: product.data.map(toBlockType),
	});

	setTimeout(async () => {
		const pageElement = document.getElementById("embed");
		let height = 1800;
		let originalWidth: string | undefined;

		if (pageElement) {
			originalWidth = pageElement.style.width;
			pageElement.style.width = "670px";
			height = pageElement.offsetHeight;
		}

		const plainText = productToText(product);

		const paramKey = id && id.trim().length > 0 ? "id" : "q";
		const paramValue =
			paramKey === "id"
				? encodeURIComponent(id ?? "")
				: encodeURIComponent(safeProduct);

		const helperClasses = [
			"ui-helper-reset", // Removes iframe border in legacy Community platform.
			"border-none", // tailwind
			"outline-none", // tailwind
			"border-0", // bootstrap
		].join(" ");

		const separator = baseUrl.includes("?") ? "&" : "?";
		const embedCode = `<iframe id="ai-facts" width="670px" height="${height}px" class="${helperClasses}" style="width:670px; outline: none; border:0 none;" allowfullscreen src="${baseUrl}${separator}embed&${paramKey}=${paramValue}${layout.copyright ? "" : "&copyright=false"}${layout.disclaimer ? "" : "&disclaimer=false"}${layout.revision ? "" : "&revision=false"}"></iframe>
<div class="hidden" id="ai-facts-hidden" style="display:none;">
  ${plainText}
</div>`;
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

		if (pageElement && originalWidth !== undefined) {
			pageElement.style.width = originalWidth;
		}
	}, 0);
};

const EmbedControl: React.FC<{
	product: ProductNutritionFacts;
	layout: PageLayout;
	id?: string;
	background?: boolean;
	border?: boolean;
	color?: "primary" | "primary-inverse";
}> = ({ product, layout, id, background, border, color }) => (
	<ControlButton
		Icon={IconExternalLinkLine as React.ElementType<SVGIconProps>}
		label="Copy embed code"
		onClick={() => Embed(product, layout, id)}
		background={background}
		border={border}
		color={color}
	/>
);

export { EmbedControl };
