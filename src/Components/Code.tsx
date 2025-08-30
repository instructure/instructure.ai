import { IconCodeLine, type SVGIconProps } from "@instructure/ui";
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

const generateCode = (product: ProductNutritionFacts): string => {
	const data = product.data.map(toBlockType);
	const code = `import { NutritionFacts } from "@instructure/ui";

const RenderNutritionFacts = () => {
	const data = ${JSON.stringify(data, null, 2)};

	return (
		<NutritionFacts
			closeButtonText="Close"
			closeIconButtonScreenReaderLabel="Close"
			data={data}
			featureName="${product.name}"
			modalLabel="This is a modal for AI facts"
			title="Nutrition Facts"
			triggerText="Preview"
		/>
	);
};

export default RenderNutritionFacts;

`;

	return code;
};

const Code = (product: ProductNutritionFacts) => {
	const code = generateCode(product);
	const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${product.name}-nutrition-facts.jsx`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

const CodeControl: React.FC<{ product: ProductNutritionFacts }> = ({
	product,
}) => (
	<ControlButton
		Icon={IconCodeLine as React.ElementType<SVGIconProps>}
		label="Save as JSX"
		onClick={() => Code(product)}
	/>
);

export { CodeControl };
