import "./App.css";
import { Flex, InlineSVG, Link, Text, View } from "@instructure/ui";
import AiInfo from "@instructure.ai/aiinfo";
import type { AiInfoFeatureProps } from "@instructure.ai/aiinfo";
import { useEffect, useState } from "react";
import type { FC } from "react";
import {
  DefaultLayout,
  Logo,
  LogoDark,
  colors,
  copyright,
  disclaimer,
} from "./assets";
import { EmbedControl, LinkControl } from "./Components/Export";
import { NutritionFactsForm, getLayoutFromParams } from "./Components/Layout";

const App: FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id")?.toLowerCase();

  const [product, setProduct] = useState<AiInfoFeatureProps | undefined>(
    undefined,
  );
  const [width, setWidth] = useState(() => window.innerWidth);

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

  useEffect(() => {
    if (id && id.toLowerCase() in AiInfo) {
      setProduct(AiInfo[id.toLowerCase() as keyof typeof AiInfo]);
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
    <View
      as="div"
      background={isInIframe ? "primary" : isDark ? "brand" : "secondary"}
      data-print="no-padding, no-background"
      minHeight="100vh"
      padding={isInIframe ? "0" : isNarrow ? "medium" : "large"}
      themeOverride={{ backgroundBrand: colors.instructure }}
    >
      {!isInIframe && (
        <View
          as="div"
          data-print="no-background, max-height, no padding"
          margin="0 auto"
          maxWidth="56rem"
          padding={isNarrow ? "0 0 small" : "0 0 medium"}
        >
          <Flex data-print="hidden" direction={isNarrow ? "column" : "row"}>
            <Flex.Item shouldGrow shouldShrink>
              <View
                as="div"
                display="inline-block"
                margin={isNarrow ? "0 0 small" : "0"}
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
            {product?.uid && (
              <Flex.Item>
                <View margin={isNarrow ? "0" : "0 x-small 0"}>
                  <EmbedControl
                    color={isDark ? "primary-inverse" : "primary"}
                    layout={layout}
                    product={product}
                  />
                </View>
                <View margin="0 x-small 0">
                  <LinkControl
                    color={isDark ? "primary-inverse" : "primary"}
                    product={product}
                  />
                </View>
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
        padding={isNarrow ? "medium" : "large"}
        shadow={isInIframe ? "none" : "above"}
        withFocusOutline={false}
      >
        <NutritionFactsForm
          isNarrow={isNarrow}
          layout={layout}
          product={product}
          setProduct={setProduct}
          isInIframe={isInIframe}
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
  );
};
export default App;
