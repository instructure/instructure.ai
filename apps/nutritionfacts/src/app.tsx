import "./app.css";
import { Card, Flex, InlineSVG, Link, Text, View, useComputedTheme } from "@instructure/ui/latest";
import AiInfo from "@instructure.ai/aiinfo";
import { type AiInfoFeatureProps } from "@instructure.ai/aiinfo";
import { useEffect, useState } from "react";
import { type FC } from "react";
import { DefaultLayout, Logo, LogoDark, copyright, disclaimer } from "./assets";
import { ColorSchemeToggle, useColorSchemeContext } from "./components/colorScheme";
import { EmbedControl, LinkControl } from "./components/export";
import { NutritionFactsForm, getLayoutFromParams } from "./components/layout";

const App: FC = () => {
	const searchParams = new URLSearchParams(globalThis.location.search);
	const id = searchParams.get("id")?.toLowerCase();

	const [product, setProduct] = useState<AiInfoFeatureProps | undefined>(() =>
		id && id in AiInfo ? AiInfo[id] : undefined,
	);
	const [width, setWidth] = useState(() => window.innerWidth);
	const isInIframe = globalThis.self !== window.top;
	const isDark = useColorSchemeContext().resolved === "dark";
	const { background } = useComputedTheme();

	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const isNarrow = width <= 448; // (56rem / 2)

	useEffect(() => {
		if (product?.uid) {
			document.title = `IgniteAI Nutrition Facts | ${product.name}`;
		}
	}, [product?.uid, product?.name]);

	const { layout } = getLayoutFromParams(DefaultLayout);

	const exportControls = product?.uid ? (
		<>
			<View margin="0 x-small 0 0">
				<EmbedControl
					layout={layout}
					product={product}
				/>
			</View>
			<View margin="0 x-small 0 0">
				<LinkControl product={product} />
			</View>
		</>
	) : undefined;

	return (
		<View
			as="div"
			background={isInIframe ? "transparent" : "secondary"}
			data-print="no-padding, no-background"
			minHeight="100vh"
			padding={isInIframe ? "0" : isNarrow ? "medium" : "large"}
			themeOverride={{ backgroundSecondary: background.pageColor }}
		>
			{!isInIframe && (
				<View
					as="div"
					data-print="no-background, max-height, no padding"
					margin="0 auto"
					maxWidth="56rem"
					padding={isNarrow ? "0 0 small" : "0 0 medium"}
				>
					<Flex
						alignItems="center"
						data-print="hidden"
						gap="x-small"
						wrap="wrap"
					>
						<Flex.Item
							shouldGrow
							shouldShrink
						>
							<View
								as="div"
								display="inline-block"
							>
								<Link href="/nutritionfacts">
									<InlineSVG
										height={isNarrow ? "2rem" : "2.5rem"}
										inline={false}
										src={isDark ? LogoDark : Logo}
										title="Instructure"
										width="auto"
									/>
								</Link>
							</View>
						</Flex.Item>
						{exportControls && !isNarrow && <Flex.Item>{exportControls}</Flex.Item>}
						<Flex.Item>
							<ColorSchemeToggle />
						</Flex.Item>
						{exportControls && isNarrow && <Flex.Item size="100%">{exportControls}</Flex.Item>}
					</Flex>
				</View>
			)}
			<View
				as="div"
				data-print="no-margin, max-height, max-width"
				id="embed"
				margin={isInIframe ? "0" : "0 auto"}
				maxWidth={isInIframe ? "670px" : "56rem"}
			>
				<Card
					data-card={isInIframe ? "flat" : undefined}
					data-print="card-flat"
				>
					<NutritionFactsForm
						isNarrow={isNarrow}
						layout={layout}
						product={product}
						setProduct={setProduct}
						isInIframe={isInIframe}
					/>
				</Card>
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
							{layout.disclaimer && disclaimer()}
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
	);
};
export default App;
