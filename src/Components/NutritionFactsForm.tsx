import { Flex, Heading, InlineSVG, Link, Text, View } from "@instructure/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { Fragment } from "react";
import Logo from "../assets/Logo.svg?raw";
import type { PageLayout, ProductNutritionFacts } from "../types.ts";
import { EditableField } from "./EditableField";

const NutritionFactsForm: FC<{
	product: ProductNutritionFacts;
	layout: PageLayout;
	setProduct: Dispatch<SetStateAction<ProductNutritionFacts>>;
}> = ({ product, layout, setProduct }) => {
	return (
		<>
			<Flex alignItems="start" direction="row">
				<Flex.Item shouldGrow shouldShrink>
					<Heading aiVariant={layout.header} as="h1" data-print="no-background">
						Nutrition Facts
					</Heading>
				</Flex.Item>
				<Flex.Item>
					{layout.icon && (
						<InlineSVG
							height="2.875rem"
							inline={false}
							src={Logo}
							viewBox="0 0 53.42 53.42"
							width="100%"
						/>
					)}
				</Flex.Item>
			</Flex>
			<Flex alignItems="start" direction="row">
				<Flex.Item shouldGrow shouldShrink>
					<View
						as="div"
						borderWidth="0 0 large 0"
						padding={
							layout.header !== "horizontal" ? "0 0 small" : "0 0 small large"
						}
					>
						<EditableField
							dataPrint={product.name.length ? "" : "hidden"}
							fontStyle="italic"
							heading
							hint={product.nameHint}
							onChange={(val) =>
								setProduct({ ...product, name: val.toString() })
							}
							placeholder={product.nameHint}
							size="descriptionPage"
							themeOverride={{ primaryColor: "#2B7ABC" }}
							value={product.name}
						/>
					</View>
					<Heading as="h3" margin="medium 0 xx-small 0">
						Description
					</Heading>
					<EditableField
						color="brand"
						dataPrint={product.description?.length ? "" : "hidden"}
						fontStyle="italic"
						hint={product.descriptionHint}
						inputType="textarea"
						onChange={(val) =>
							setProduct({ ...product, description: val.toString() })
						}
						placeholder={product.descriptionHint}
						value={product.description}
					/>
					{product.data.map((block) => (
						<Fragment key={block.blockTitle}>
							<Heading as="h3" margin="medium 0 0">
								{block.blockTitle}
							</Heading>
							{block.segmentData.map((segment) => (
								<View
									as="div"
									borderWidth="0 0 medium"
									key={segment.segmentTitle}
									margin="small 0"
									padding="0 0 x-small 0"
								>
									<Flex direction="row">
										<Flex.Item shouldGrow shouldShrink>
											<Heading as="h4">{segment.segmentTitle}</Heading>
										</Flex.Item>
										{segment.valueHint && (
											<Flex.Item>
												<EditableField
													color="brand"
													hint={segment.valueHint}
													inputType={segment.inputType}
													onChange={(val) =>
														setProduct({
															...product,
															data: product.data.map((b) => {
																if (b.blockTitle === block.blockTitle) {
																	if (b.blockTitle === "Model & Data") {
																		return {
																			...b,
																			segmentData: b.segmentData.map((s) =>
																				s.segmentTitle === segment.segmentTitle
																					? { ...s, value: val.toString() }
																					: s,
																			) as typeof b.segmentData,
																		};
																	}
																	if (b.blockTitle === "Privacy & Compliance") {
																		return {
																			...b,
																			segmentData: b.segmentData.map((s) =>
																				s.segmentTitle === segment.segmentTitle
																					? { ...s, value: val.toString() }
																					: s,
																			) as typeof b.segmentData,
																		};
																	}
																	if (b.blockTitle === "Outputs") {
																		return {
																			...b,
																			segmentData: b.segmentData.map((s) =>
																				s.segmentTitle === segment.segmentTitle
																					? { ...s, value: val.toString() }
																					: s,
																			) as typeof b.segmentData,
																		};
																	}
																}
																return b;
															}),
														})
													}
													placeholder={segment.valueHint}
													selectOptions={
														segment.inputType === "select"
															? segment.inputOptions
															: undefined
													}
													value={segment.value}
												/>
											</Flex.Item>
										)}
									</Flex>
									<Text color="secondary" size="contentSmall">
										{segment.description}
									</Text>
									{segment.descriptionHint && (
										<View as="div" margin="x-small 0 0">
											<EditableField
												dataPrint={
													segment.valueDescription?.length ? "" : "hidden"
												}
												fontStyle="italic"
												hint={segment.descriptionHint}
												inputType="textarea"
												onChange={(val) =>
													setProduct({
														...product,
														data: product.data.map((b) => {
															if (b.blockTitle === block.blockTitle) {
																if (b.blockTitle === "Model & Data") {
																	return {
																		...b,
																		segmentData: b.segmentData.map((s) =>
																			s.segmentTitle === segment.segmentTitle
																				? {
																						...s,
																						valueDescription: val.toString(),
																					}
																				: s,
																		) as typeof b.segmentData,
																	};
																}
																if (b.blockTitle === "Privacy & Compliance") {
																	return {
																		...b,
																		segmentData: b.segmentData.map((s) =>
																			s.segmentTitle === segment.segmentTitle
																				? {
																						...s,
																						valueDescription: val.toString(),
																					}
																				: s,
																		) as typeof b.segmentData,
																	};
																}
																if (b.blockTitle === "Outputs") {
																	return {
																		...b,
																		segmentData: b.segmentData.map((s) =>
																			s.segmentTitle === segment.segmentTitle
																				? {
																						...s,
																						valueDescription: val.toString(),
																					}
																				: s,
																		) as typeof b.segmentData,
																	};
																}
															}
															return b;
														}),
													})
												}
												placeholder={segment.descriptionHint}
												selectOptions={segment.inputOptions}
												value={segment.valueDescription}
											/>
										</View>
									)}
								</View>
							))}
						</Fragment>
					))}
					<View
						as="div"
						margin="medium auto small"
						maxWidth="66%"
						textAlign="center"
					>
						{layout.disclaimer && (
							<Text as="p" color="secondary" variant="contentSmall">
								Instructure has developed nutrition fact labels for AI-enabled
								products to increase transparency and improve decision making.
							</Text>
						)}
						{layout.copyright && (
							<Text color="secondary" variant="contentSmall">
								©{new Date().getFullYear()}{" "}
								<Link href="https://www.instructure.com/">Instructure</Link> All
								rights reserved.
							</Text>
						)}
					</View>
				</Flex.Item>
			</Flex>
		</>
	);
};
export { NutritionFactsForm };
