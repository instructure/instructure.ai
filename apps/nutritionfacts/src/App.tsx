import "./App.css";
import {
	Flex,
	InlineSVG,
	InstUISettingsProvider,
	Link,
	type NutritionFactsProps,
	Text,
	View,
} from "@instructure/ui";
import AiInfo from "@instructure.ai/aiinfo";
import { type FC, useEffect, useState } from "react";
import {
	colors,
	copyright,
	DefaultLayout,
	disclaimer,
	Logo,
	LogoDark,
} from "./assets";
import { EmbedControl, LinkControl, ObjectControl } from "./Components/Export";
import { getLayoutFromParams, NutritionFactsForm } from "./Components/Layout";

const App: FC = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const id = searchParams.get("id");

	const [product, setProduct] = useState<NutritionFactsProps>();

	useEffect(() => {
		if (product?.id) {
			document.title = `IgniteAI Nutrition Facts | ${product.name}`;
		}
	}, [product?.id, product?.name]);

	useEffect(() => {
		if (id && id in AiInfo) {
			setProduct(AiInfo[id as keyof typeof AiInfo]);
		}
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
				data-print="no-padding, no-background"
				padding={isInIframe ? "0" : "large"}
				themeOverride={{ backgroundBrand: colors.instructure }}
			>
				{!isInIframe && (
					<View
						as="div"
						data-print="no-background, max-height, no padding"
						margin="0 auto"
						maxWidth="56rem"
						padding="0 0 medium"
					>
						<Flex data-print="hidden">
							<Flex.Item shouldGrow shouldShrink>
								<Link href="./nutritionfacts">
									<InlineSVG
										height="2.5rem"
										inline={false}
										src={isDark ? LogoDark : Logo}
										title="Instructure"
										width="auto"
									/>
								</Link>
							</Flex.Item>
							{product?.id && product.id.length > 0 && (
								<Flex.Item>
									<View margin="0 x-small 0">
										<EmbedControl
											background={false}
											border={false}
											color={isDark ? "primary-inverse" : "primary"}
											id={product.id}
											layout={layout}
											product={product}
										/>
									</View>
									<View margin="0 x-small 0">
										<LinkControl
											background={false}
											border={false}
											color={isDark ? "primary-inverse" : "primary"}
											product={product}
										/>
									</View>
									<ObjectControl
										background={false}
										border={false}
										color={isDark ? "primary-inverse" : "primary"}
										product={product}
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
						data-print="no-background, max-height, no padding"
						margin="0 auto"
						maxWidth="56rem"
						textAlign="center"
					>
						<View
							as="div"
							data-print="max-width, color-secondary"
							margin="0 auto"
							maxWidth="66%"
						>
							<Text
								as="p"
								data-print={layout.disclaimer ? "" : "hidden"}
								variant="contentSmall"
							>
								{layout.disclaimer &&
									disclaimer(isDark ? "link-inverse" : "link")}
							</Text>
							<Text
								as="p"
								data-print={layout.copyright ? "" : "hidden"}
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
