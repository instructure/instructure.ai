import "./App.css";
import { Flex, InlineSVG, InstUISettingsProvider, View } from "@instructure/ui";
import { type FC, useEffect, useState } from "react";
import { colors, Logo, LogoDark } from "./assets";
import { DefaultLayout } from "./assets/Layout.ts";
import { Product } from "./assets/Products.ts";
import { EmbedControl, LinkControl } from "./Components/Export";
import {
	getProductFromCSV,
	getProductFromObject,
	getProductFromParams,
} from "./Components/Import";
import {
	Control,
	getLayoutFromParams,
	NutritionFactsForm,
} from "./Components/Layout";
import type { ProductNutritionFacts } from "./types.ts";

const App: FC = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const id = searchParams.get("id");

	const [product, setProduct] = useState<ProductNutritionFacts>(() =>
		getProductFromObject(getProductFromParams(Product)),
	);

	useEffect(() => {
		if (product.id) {
			document.title = `IgniteAI Nutrition Facts | ${product.name}`;
		}
	}, [product.id, product.name]);

	useEffect(() => {
		const fetchProduct = async () => {
			if (id) {
				const csvProduct = await getProductFromCSV(Product, DefaultLayout, id);
				if (csvProduct) {
					setProduct(csvProduct.product);
				}
			}
		};
		fetchProduct();
	}, [id]);

	const { layout: initialLayout, isEditing: initialEditing } =
		getLayoutFromParams(DefaultLayout);

	const [isEditing, setIsEditing] = useState(initialEditing);
	const [layout, setLayout] = useState(initialLayout);
	const [isDark, setIsDark] = useState(false);
	const [isInIframe, setIsInIframe] = useState(false);

	useEffect(() => {
		setIsInIframe(window.self !== window.top);
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDark(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
		mediaQuery.addEventListener("change", handler);

		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	return (
		<InstUISettingsProvider>
			{!isEditing ? (
				<View
					as="div"
					background={isDark ? "brand" : "secondary"}
					padding={isInIframe ? "0" : "large"}
					themeOverride={{ backgroundBrand: colors.instructure }}
				>
					{!isInIframe && (
						<View
							as="div"
							margin="0 auto"
							maxWidth={isInIframe ? "670px" : "56rem"}
							padding="0 0 medium"
						>
							<Flex>
								<Flex.Item shouldGrow shouldShrink >
									<View minHeight="2.5rem" display="inline-flex" as="div" style={{alignContent: "center"}}>
									<InlineSVG
										height="auto"
										src={isDark ? LogoDark : Logo}
										title="Instructure"
										width="100%"
									/>
									</View>
								</Flex.Item>
								{product.id && product.id.length > 0 && (
									<Flex.Item>
										<View margin="0 x-small 0">
											<EmbedControl
												product={product}
												layout={layout}
												setIsEditing={setIsEditing}
												id={product.id}
												isEditing={isEditing}
												background={false}
												border={false}
												color={isDark ? "primary-inverse" : "primary"}
											/>
										</View>
										<LinkControl
											product={product}
											background={false}
											border={false}
											color={isDark ? "primary-inverse" : "primary"}
										/>
									</Flex.Item>
								)}
							</Flex>
						</View>
					)}
					<View
						as="div"
						background="primary"
						borderRadius={isInIframe ? "0" : "large"}
						data-print="no-margin, no-border, no-padding, max-height"
						id="embed"
						margin="0 auto"
						maxWidth={isInIframe ? "670px" : "56rem"}
						overflowX="hidden"
						overflowY="auto"
						padding="large"
						shadow={isInIframe ? "none" : "above"}
						withFocusOutline={false}
					>
						<NutritionFactsForm
							isEditing={isEditing}
							layout={layout}
							product={product}
							setLayout={setLayout}
							setProduct={setProduct}
						/>
					</View>
				</View>
			) : (
				<View
					as="div"
					background={isDark ? "brand" : "secondary"}
					data-print="no-background, max-height"
					height="100vh"
					margin="0"
					overflowX="hidden"
					padding="0"
					themeOverride={{ backgroundBrand: colors.instructure }}
				>
					<Flex direction="column" gap="small" justifyItems="center">
						<Flex.Item as="main" shouldGrow shouldShrink>
							<View
								as="div"
								borderRadius="large"
								data-print="no-margin, no-border, no-padding, max-height"
								margin="large auto small"
								maxWidth="56rem"
								overflowX="hidden"
								overflowY="hidden"
								shadow="above"
							>
								<View
									as="div"
									background="primary"
									data-print="no-margin, no-border, no-padding, max-height"
									height="calc(98vh - 9rem)"
									id="page"
									overflowX="hidden"
									overflowY="auto"
									padding="large"
									withFocusOutline={false}
								>
									<NutritionFactsForm
										isEditing={isEditing}
										layout={layout}
										product={product}
										setLayout={setLayout}
										setProduct={setProduct}
									/>
								</View>
							</View>
						</Flex.Item>
						<Flex.Item data-print="hidden" id="control" textAlign="center">
							<Control
								id={id ?? undefined}
								isDark={isDark}
								isEditing={isEditing}
								layout={layout}
								product={product}
								setIsDark={setIsDark}
								setIsEditing={setIsEditing}
								setProduct={setProduct}
							/>
						</Flex.Item>
					</Flex>
				</View>
			)}
		</InstUISettingsProvider>
	);
};
export default App;
