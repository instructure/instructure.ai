
import { Flex, View, Text,Heading, IconCanvasLogoLine } from '@instructure/ui';
import type { FC } from 'react';


const TagList: FC<{entry: PendoAPIFeature}> = ({ entry }) => {
	const { feature, product } = entry;
	return (
		<View as="div" minWidth="10rem" padding="0 small 0 0">
			<Flex direction="column" gap="small" alignItems="start">
				<Flex.Item shouldGrow shouldShrink width="100%">
					<Heading variant="titleCardRegular" border="bottom">Product</Heading>
					<Text as="p" size="contentSmall"><IconCanvasLogoLine /> {product.name}</Text>
				</Flex.Item>
			</Flex>
		</View>
	);
};

export default TagList;
