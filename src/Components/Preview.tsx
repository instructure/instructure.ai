import {
	IconEyeLine,
	NutritionFacts,
	ScreenReaderContent,
	type SVGIconProps,
	View,
} from "@instructure/ui";
import type { FC } from "react";
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
			valueDescription: segment.valueDescription,
		})),
	};
}

const handleClick = () => {
	const link = document.querySelector("#preview a");
	if (link) {
		(link as HTMLAnchorElement).click();
	}
};

const Preview: FC<{ product: ProductNutritionFacts }> = ({ product }) => {
	const data = product.data.map(toBlockType);
	return (
		<View id="preview">
			<ControlButton
				background
				Icon={IconEyeLine as React.ElementType<SVGIconProps>}
				label="Preview JSX"
				onClick={handleClick}
			/>
			<ScreenReaderContent>
				<NutritionFacts
					closeButtonText="Close"
					closeIconButtonScreenReaderLabel="Close"
					data={data}
					featureName={product.name}
					modalLabel="This is a modal for AI facts"
					title="Nutrition Facts"
					triggerText="Preview"
				/>
			</ScreenReaderContent>
		</View>
	);
};

export { Preview };
