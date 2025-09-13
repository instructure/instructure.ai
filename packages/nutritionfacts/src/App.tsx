import "./App.css";
import {
	Flex,
	InlineSVG,
	InstUISettingsProvider,
	Text,
	View,
} from "@instructure/ui";
import { type FC, useEffect, useState } from "react";
import {
	colors,
	copyright,
	DefaultLayout,
	disclaimer,
	Logo,
	LogoDark,
	Product,
} from "./assets";
import { EmbedControl, LinkControl } from "./Components/Export";
import {
	getProductFromCSV,
	getProductFromObject,
	getProductFromParams,
} from "./Components/Import";
import { getLayoutFromParams, NutritionFactsForm } from "./Components/Layout";
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

	const { layout } = getLayoutFromParams(DefaultLayout);

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
			<View
				as="div"
				background={isDark && !isInIframe ? "brand" : "secondary"}
				padding={isInIframe ? "0" : "large"}
				themeOverride={{ backgroundBrand: colors.instructure }}
				data-print="no-padding, no-background"
			>
				{!isInIframe && (
					<View
						as="div"
						margin="0 auto"
						maxWidth="56rem"
						padding="0 0 medium"
						data-print="no-background, max-height, no padding"
					>
						<Flex data-print="hidden">
							<Flex.Item shouldGrow shouldShrink>
								<InlineSVG
									height="2.5rem"
									inline={false}
									src={isDark ? LogoDark : Logo}
									title="Instructure"
									width="auto"
								/>
							</Flex.Item>
							{product.id && product.id.length > 0 && (
								<Flex.Item>
									<View margin="0 x-small 0">
										<EmbedControl
											product={product}
											layout={layout}
											id={product.id}
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
					margin={isInIframe ? "0" : "0 auto"}
					maxWidth={isInIframe ? "670px" : "56rem"}
					overflowX="hidden"
					overflowY="auto"
					padding="large"
					shadow={isInIframe ? "none" : "above"}
					withFocusOutline={false}
				>
					<NutritionFactsForm
						layout={layout}
						product={product}
						setProduct={setProduct}
					/>
				</View>
				{!isInIframe && (
					<View
						as="div"
						maxWidth="56rem"
						data-print="no-background, max-height, no padding"
						textAlign="center"
						margin="0 auto"
					>
						<View
							as="div"
							margin="0 auto"
							maxWidth="66%"
							data-print="max-width, color-secondary"
						>
							<Text
								data-print={layout.disclaimer ? "" : "hidden"}
								as="p"
								variant="contentSmall"
							>
								{layout.disclaimer &&
									disclaimer(isDark ? "link-inverse" : "link")}
							</Text>
							<Text
								data-print={layout.copyright ? "" : "hidden"}
								as="p"
								variant="contentSmall"
							>
								{layout.copyright && copyright}
							</Text>
						</View>
					</View>
				)}
			</View>
		</InstUISettingsProvider>
	);
};
export default App;
