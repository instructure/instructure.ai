import { Flex, View } from "@instructure/ui";
import type { FC } from "react";
import type { ProductNutritionFacts, StateProp } from "../../types.ts";
import {
	CodeControl,
	CopyControl,
	DownloadControl,
	ImageControl,
	PreviewControl,
	PrintControl,
	TextControl,
} from "../Export";
import { Divider } from "./Divider.tsx";

type DarkState = StateProp<boolean, "isDark">;
type ProductState = StateProp<ProductNutritionFacts, "product">;

const Control: FC<DarkState & ProductState> = ({ isDark, product }) => {
	const controls = [
		<PreviewControl key="preview" product={product} />,
		<Divider key="divider" />,
		<PrintControl key="print" />,
		<ImageControl key="image" product={product} />,
		<TextControl key="text" product={product} />,
		<DownloadControl key="download" product={product} />,
		<CodeControl key="code" product={product} />,
		<CopyControl key="copy" product={product} />,
	];

	return (
		<View
			as="div"
			background={isDark ? "secondary" : "primary"}
			borderRadius="large"
			display="inline-block"
			margin="small auto"
			shadow="above"
		>
			<Flex
				alignItems="stretch"
				gap="small"
				justifyItems="center"
				padding="small"
			>
				{controls.map((control) => (
					<Flex.Item key={control.key}>{control}</Flex.Item>
				))}
			</Flex>
		</View>
	);
};
export { Control };
