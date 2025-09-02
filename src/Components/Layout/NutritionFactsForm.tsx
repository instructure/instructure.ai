import {
	Flex,
	Heading,
	IconButton,
	IconProgressLine,
	IconPublishLine,
	IconUnpublishedLine,
	InlineSVG,
	Link,
	Text,
	Tooltip,
	View,
} from "@instructure/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { Fragment } from "react";
import Logo from "../../assets/Logo.svg?raw";
import type { PageLayout, ProductNutritionFacts } from "../../types.ts";
import { EditableField } from "../EditableField";

const NutritionFactsForm: FC<{
	product: ProductNutritionFacts;
	layout: PageLayout;
	setLayout: Dispatch<SetStateAction<PageLayout>>;
	setProduct: Dispatch<SetStateAction<ProductNutritionFacts>>;
}> = ({ product, layout, setProduct, setLayout }) => {
	return (
		<>
			<Flex alignItems="start" direction="row">
				<Flex.Item shouldGrow shouldShrink>
					<Flex alignItems="start" direction="row" gap="medium">
						<Flex.Item>
							<Heading
								aiVariant={layout.header}
								as="h1"
								data-print="no-background"
							>
								Nutrition Facts
							</Heading>
						</Flex.Item>
						<Flex.Item align="center">
							<Tooltip
								className="screen-only"
								data-print="hidden"
								offsetY={5}
								renderTip={() => {
									const options: Array<"horizontal" | "iconOnly" | "stacked"> =
										["horizontal", "iconOnly", "stacked"];
									const currentHeader = layout.header ?? "horizontal";
									const currentIndex = options.indexOf(currentHeader);
									const nextIndex = (currentIndex + 1) % options.length;
									const nextTitle =
										options[nextIndex] === "horizontal"
											? "Horizontal"
											: options[nextIndex] === "iconOnly"
												? "Icon Only"
												: "Stacked";
									return `Change to ${nextTitle}`;
								}}
							>
								<IconButton
									color="primary"
									data-print="hidden"
									onClick={() => {
										const options: Array<
											"horizontal" | "iconOnly" | "stacked"
										> = ["horizontal", "iconOnly", "stacked"];
										const currentHeader = layout.header ?? "horizontal";
										const currentIndex = options.indexOf(currentHeader);
										const nextIndex = (currentIndex + 1) % options.length;
										setLayout({ ...layout, header: options[nextIndex] });
									}}
									screenReaderLabel="Change header layout"
									size="medium"
									withBackground={false}
									withBorder={false}
								>
									<IconProgressLine />
								</IconButton>
							</Tooltip>
						</Flex.Item>
					</Flex>
				</Flex.Item>
				<Flex.Item>
					<Flex gap="small">
						<Flex.Item>
							<Tooltip
								className="screen-only"
								data-print="hidden"
								offsetY={5}
								placement="top"
								renderTip={() => (layout.icon ? "Hide logo" : "Show logo")}
							>
								<IconButton
									color="primary"
									data-print="hidden"
									onClick={() => setLayout({ ...layout, icon: !layout.icon })}
									screenReaderLabel={layout.icon ? "Hide logo" : "Show logo"}
									size="small"
									withBackground={false}
									withBorder={false}
								>
									{layout.icon ? <IconUnpublishedLine /> : <IconPublishLine />}
								</IconButton>
							</Tooltip>
						</Flex.Item>
						<Flex.Item
							align="center"
							as="div"
							data-print={layout.icon ? "" : "hidden"}
						>
							<InlineSVG
								height="2.875rem"
								inline={false}
								src={Logo}
								style={{ opacity: layout.icon ? 1 : 0.25 }}
								viewBox="0 0 53.42 53.42"
								width="100%"
							/>
						</Flex.Item>
					</Flex>
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
														segment.inputType === "select" ||
														segment.inputType === "multi-select"
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
						<Flex>
							<Flex.Item>
								<Tooltip
									className="screen-only"
									data-print="hidden"
									offsetY={5}
									renderTip={() =>
										layout.disclaimer ? "Hide disclaimer" : "Show disclaimer"
									}
								>
									<IconButton
										color="primary"
										data-print="hidden"
										onClick={() =>
											setLayout({ ...layout, disclaimer: !layout.disclaimer })
										}
										screenReaderLabel={
											layout.disclaimer ? "Hide disclaimer" : "Show disclaimer"
										}
										size="small"
										withBackground={false}
										withBorder={false}
									>
										{layout.disclaimer ? (
											<IconUnpublishedLine />
										) : (
											<IconPublishLine />
										)}
									</IconButton>
								</Tooltip>
							</Flex.Item>
							<Flex.Item
								data-print={layout.disclaimer ? "" : "hidden"}
								shouldGrow
								shouldShrink
							>
								<Text as="p" color="secondary" variant="contentSmall">
									<span
										style={{
											opacity: layout.disclaimer ? "1" : "0.25",
										}}
									>
										Instructure has developed nutrition fact labels for
										AI-enabled products to increase transparency and improve
										decision making.
									</span>
								</Text>
							</Flex.Item>
						</Flex>
						<Flex>
							<Flex.Item>
								<Tooltip
									className="screen-only"
									data-print="hidden"
									offsetY={5}
									renderTip={() =>
										layout.copyright ? "Hide copyright" : "Show copyright"
									}
								>
									<IconButton
										color="primary"
										data-print="hidden"
										onClick={() =>
											setLayout({ ...layout, copyright: !layout.copyright })
										}
										screenReaderLabel={
											layout.copyright ? "Hide copyright" : "Show copyright"
										}
										size="small"
										withBackground={false}
										withBorder={false}
									>
										{layout.copyright ? (
											<IconUnpublishedLine />
										) : (
											<IconPublishLine />
										)}
									</IconButton>
								</Tooltip>
							</Flex.Item>
							<Flex.Item shouldGrow shouldShrink>
								<Text
									color="secondary"
									data-print={layout.copyright ? "" : "hidden"}
									variant="contentSmall"
								>
									<span
										style={{
											opacity: layout.copyright ? "1" : "0.25",
										}}
									>
										©{new Date().getFullYear()}{" "}
										<Link href="https://www.instructure.com/">Instructure</Link>{" "}
										All rights reserved.
									</span>
								</Text>
							</Flex.Item>
						</Flex>
					</View>
				</Flex.Item>
			</Flex>
		</>
	);
};
export { NutritionFactsForm };
