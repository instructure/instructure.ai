import { Flex, View } from "@instructure/ui";
import type { FC } from "react";
import type {
	PageLayout,
	ProductNutritionFacts,
	StateProp,
} from "../../types.ts";
import {
	CodeControl,
	CopyControl,
	DownloadControl,
	EmbedControl,
	ImageControl,
	PreviewControl,
	PrintControl,
	TextControl,
} from "../Export";
import { Divider } from "./Divider.tsx";

type DarkState = StateProp<boolean, "isDark">;
type ProductState = StateProp<ProductNutritionFacts, "product">;
type ControlProps = DarkState &
	ProductState & {
		layout: PageLayout;
	};

const Control: FC<ControlProps> = ({ isDark, product, layout }) => {
	const controls = [
		<PreviewControl key="preview" product={product} />,
		<Divider key="divider" />,
		<PrintControl key="print" />,
		<ImageControl key="image" product={product} />,
		<TextControl key="text" product={product} />,
		<DownloadControl key="download" product={product} />,
		<CodeControl key="code" product={product} />,
		<EmbedControl key="embed" layout={layout} product={product} />,
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
