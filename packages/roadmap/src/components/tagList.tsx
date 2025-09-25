
import { Flex, View, Heading, Text, List, Link } from '@instructure/ui';
import type { FC } from 'react';


const TagList: FC<{entry: PendoAPIFeature, isNarrow: boolean}> = ({ entry, isNarrow = false }) => {
	const { feature, product } = entry;
	return (
		<View as="div" minWidth="10rem">
			<Flex direction={isNarrow ? "row" : "column"} gap="small" alignItems="start">
				<Flex.Item shouldGrow shouldShrink width="100%">
						<Heading variant="titleCardRegular" border={isNarrow ? "none" : "bottom"} margin="0 0 small 0">Product</Heading>
						<List isUnstyled margin="0">
							<List.Item>
								<Text variant="contentImportant">Name:</Text> {product.name}
							</List.Item>
							{product.area && (
							<List.Item>
								<Text variant="contentImportant">Area:</Text> {product.area.split('-')[1] ?? product.area}
							</List.Item>
							)}
						</List>
				</Flex.Item>
				<Flex.Item shouldGrow shouldShrink width="100%">
						<Heading variant="titleCardRegular" border={isNarrow ? "none" : "bottom"} margin="0 0 small 0">Feature</Heading>
						<List isUnstyled  margin="0">
							{feature.stage &&<List.Item>
								<Text variant="contentImportant">Stage:</Text> {feature.stage}
							</List.Item>}
							{feature.links?.length && <><Text variant="contentImportant">Links:</Text><List>
								{feature.links
									.filter((link) => link.title !== "image")
									.map((link) => (
										<List.Item key={link.linkUrl}>
											<Link href={link.linkUrl} target="_blank" rel="noreferrer">
												<Text transform="capitalize">{link.title}</Text>
											</Link>
										</List.Item>
									))}
							</List></>}
						</List>
				</Flex.Item>
			</Flex>
		</View>
	);
};

export default TagList;
