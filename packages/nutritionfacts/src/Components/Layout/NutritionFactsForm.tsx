import {
	Flex,
	Heading,
	IconButton,
	IconPublishLine,
	IconUnpublishedLine,
	Text,
	Tooltip,
	View,
} from "@instructure/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { copyright, disclaimer } from "../../assets";
import type { PageLayout, ProductNutritionFacts } from "../../types.ts";
import { EditableField } from "../EditableField";
import { Presets } from "./Presets";

const NutritionFactsForm: FC<{
	product: ProductNutritionFacts;
	layout: PageLayout;
	setLayout: Dispatch<SetStateAction<PageLayout>>;
	setProduct: Dispatch<SetStateAction<ProductNutritionFacts>>;
	isEditing: boolean;
}> = ({ product, layout, setProduct, setLayout, isEditing }) => {
	const isPreview = !isEditing;
	const getRevisionDate = () => {
		const d = new Date();
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}.${mm}.${dd}`;
	};
	const params = new URLSearchParams(window.location.search);
	const noParams = params.size === 0;

	return (
		<>
			<Flex alignItems="start" direction="row">
				<Flex.Item shouldGrow shouldShrink>
					<Heading
						aiVariant="stacked"
						as="h1"
						data-print="no-background"
						margin="0 0 small"
					>
						Nutrition Facts
					</Heading>
				</Flex.Item>
			</Flex>
			<Flex alignItems="start" direction="row">
				<Flex.Item shouldGrow shouldShrink>
					<View as="div" borderWidth="medium 0 0 0" padding="medium 0 0">
						{isPreview ? (
							noParams ? (
								<Presets setProduct={setProduct} />
							) : (
								<Heading as="h2">{product.name}</Heading>
							)
						) : (
							<EditableField
								dataPrint={product.name.length ? "" : "hidden"}
								fontStyle="italic"
								heading
								hint={product.nameHint}
								onChange={(val) =>
									setProduct({ ...product, name: val.toString() })
								}
								placeholder={product.nameHint}
								themeOverride={{ primaryColor: "#2B7ABC" }}
								value={product.name}
							/>
						)}
					</View>
					<Heading as="h3" margin="medium 0 xx-small 0">
						Description
					</Heading>
					{isPreview ? (
						<Text size="small">{product.description}</Text>
					) : (
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
					)}
					{product.data.map((block) => (
						<View as="div" key={block.blockTitle}>
							<Heading as="h3" margin="medium 0 0">
								{block.blockTitle}
							</Heading>
							{block.segmentData.map((segment) => (
								<View
									as="div"
									borderRadius="medium"
									borderWidth="small"
									data-print="no-break"
									key={segment.segmentTitle}
									margin="small 0"
									padding="small"
								>
									<Heading as="h4">{segment.segmentTitle}</Heading>
									<View as="div" margin="0 0 x-small">
										<Text color="secondary" size="contentSmall">
											{segment.description}
										</Text>
									</View>
									<View as="div">
										{segment.valueHint &&
											(isPreview ? (
												<Text>{segment.value}</Text>
											) : (
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
											))}
									</View>
									<View as="div">
										{segment.descriptionHint && (
											<Flex.Item shouldGrow shouldShrink>
												{isPreview ? (
													<Text size="small">{segment.valueDescription}</Text>
												) : (
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
																					s.segmentTitle ===
																					segment.segmentTitle
																						? {
																								...s,
																								valueDescription:
																									val.toString(),
																							}
																						: s,
																				) as typeof b.segmentData,
																			};
																		}
																		if (
																			b.blockTitle === "Privacy & Compliance"
																		) {
																			return {
																				...b,
																				segmentData: b.segmentData.map((s) =>
																					s.segmentTitle ===
																					segment.segmentTitle
																						? {
																								...s,
																								valueDescription:
																									val.toString(),
																							}
																						: s,
																				) as typeof b.segmentData,
																			};
																		}
																		if (b.blockTitle === "Outputs") {
																			return {
																				...b,
																				segmentData: b.segmentData.map((s) =>
																					s.segmentTitle ===
																					segment.segmentTitle
																						? {
																								...s,
																								valueDescription:
																									val.toString(),
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
												)}
											</Flex.Item>
										)}
									</View>
								</View>
							))}
						</View>
					))}
					<View
						as="div"
						margin="0 auto"
						maxWidth={isPreview ? "100%" : "66%"}
						textAlign="center"
					>
						{layout.revision && (
							<Text
								data-print={layout.disclaimer ? "" : "hidden"}
								variant="contentSmall"
								color="secondary"
							>
								Revision:{" "}
								{product.revision ? product.revision : getRevisionDate()}
							</Text>
						)}
					</View>
				</Flex.Item>
			</Flex>
		</>
	);
};

export { NutritionFactsForm };
