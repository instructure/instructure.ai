import "./App.css";
import { Flex, InstUISettingsProvider, View } from "@instructure/ui";
import { type FC, useEffect, useState } from "react";
import { DefaultLayout } from "./assets/Layout.ts";
import { Product } from "./assets/Products.ts";
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

	const { layout: initialLayout, isPreview: initialPreview } =
		getLayoutFromParams(DefaultLayout);

	const [isPreview, setIsPreview] = useState(initialPreview);
	const [layout, setLayout] = useState(initialLayout);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDark(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
		mediaQuery.addEventListener("change", handler);

		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	return (
		<InstUISettingsProvider>
			{isPreview ? (
				<View
					as="div"
					background="primary"
					data-print="no-margin, no-border, no-padding, max-height"
					id="embed"
					margin="0 auto"
					maxWidth="670px"
					overflowX="hidden"
					overflowY="auto"
					padding="large"
					withFocusOutline={false}
				>
					<NutritionFactsForm
						isPreview={isPreview}
						layout={layout}
						product={product}
						setLayout={setLayout}
						setProduct={setProduct}
					/>
				</View>
			) : (
				<View
					as="div"
					background={isDark ? "primary-inverse" : "secondary"}
					data-print="no-background, max-height"
					height="100vh"
					margin="0"
					overflowX="hidden"
					padding="0"
				>
					<Flex direction="column" gap="small" justifyItems="center">
						<Flex.Item as="main" shouldGrow shouldShrink>
							<View
								as="div"
								borderRadius="large"
								data-print="no-margin, no-border, no-padding, max-height"
								margin="large auto small"
								maxWidth="56rem"
								minWidth="36rem"
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
										isPreview={isPreview}
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
								isDark={isDark}
								isPreview={isPreview}
								layout={layout}
								product={product}
								setIsDark={setIsDark}
								setIsPreview={setIsPreview}
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
