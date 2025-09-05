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
	LinkControl,
	PreviewControl,
	PrintControl,
	TableControl,
	TextControl,
} from "../Export";
import { Divider } from "./Divider.tsx";

type DarkState = StateProp<boolean, "isDark">;
type ProductState = StateProp<ProductNutritionFacts, "product">;
type EditingState = StateProp<boolean, "isEditing">;
type ControlProps = EditingState &
	DarkState &
	ProductState & {
		layout: PageLayout;
		id?: string;
	};

const Control: FC<ControlProps> = ({
	isDark,
	product,
	layout,
	setIsEditing,
	id,
}) => {
	const controls = [
		<PreviewControl key="preview" product={product} />,
		<Divider key="dividerSave" />,
		<PrintControl key="print" />,
		<ImageControl key="image" product={product} />,
		<TextControl key="text" product={product} />,
		<DownloadControl key="download" product={product} />,
		<CodeControl key="code" product={product} />,
		<Divider key="dividerCopy" />,
		<LinkControl id={id} key="link" />,
		<EmbedControl
			id={id}
			key="embed"
			layout={layout}
			product={product}
			setIsEditing={setIsEditing}
		/>,
		<CopyControl key="copy" product={product} />,
		<TableControl id={id} key="table" product={product} />,
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
