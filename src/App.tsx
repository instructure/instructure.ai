import "./App.css";
import { Flex, InstUISettingsProvider, View } from "@instructure/ui";
import { type FC, useEffect, useState } from "react";
import { DefaultLayout } from "./assets/Layout.ts";
import { Product } from "./assets/Products.ts";
import Control from "./Components/Control.tsx";
import { NutritionFactsForm } from "./Components/NutritionFactsForm.tsx";
import type { ProductNutritionFacts } from "./types.ts";

const App: FC = () => {
	const [product, setProduct] = useState<ProductNutritionFacts>(Product);
	const [layout, setLayout] = useState(DefaultLayout);
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
								style={{ scrollbarColor: "#2B7ABC #2B7ABC" }}
								withFocusOutline={false}
							>
								<NutritionFactsForm
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
							product={product}
							setIsDark={setIsDark}
							setProduct={setProduct}
						/>
					</Flex.Item>
				</Flex>
			</View>
		</InstUISettingsProvider>
	);
};
export default App;
