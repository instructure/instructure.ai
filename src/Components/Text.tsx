import { IconTextLine, type SVGIconProps } from "@instructure/ui";
import type { ProductNutritionFacts } from "../types.ts";
import { ControlButton } from "./ControlButton.tsx";

const productToMarkdown = (product: ProductNutritionFacts): string => {
	const { data } = product;
	const markdown = `# Ignite AI Nutrition Facts

## ${product.name}
    
### Description
${product.description}

${data
	.map(
		(block) => `### ${block.blockTitle}

${block.segmentData
	.map(
		(segment) => `#### ${segment.segmentTitle}
_${segment.description}_

${
	segment.value && segment.valueDescription
		? `**${segment.value}**
(${segment.valueDescription})`
		: segment.value
			? `**${segment.value}**`
			: segment.valueDescription
				? `${segment.valueDescription}`
				: ""
}
`,
	)
	.join("\n")}

`,
	)
	.join("")}`;
	return markdown;
};

const downloadText = (product: ProductNutritionFacts): void => {
	const markdown = productToMarkdown(product);
	const blob = new Blob([markdown], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${product.name}-nutrition-facts.md`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

const TextControl: React.FC<{ product: ProductNutritionFacts }> = ({
	product,
}) => (
	<ControlButton
		Icon={IconTextLine as React.ElementType<SVGIconProps>}
		label="Save as markdown"
		onClick={() => downloadText(product)}
	/>
);

export { TextControl };
