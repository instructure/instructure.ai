import { Flex, Heading, IconAiLine, Text, View } from "@instructure/ui";
import type { NutritionFactsProps } from "@instructure/ui";
import type { AiInfoFeatureProps } from "@instructure.ai/aiinfo";
import type { Dispatch, FC, SetStateAction } from "react";
import type { ExtendedNutritionFactsProps, PageLayout } from "../../types";
import { Divider } from "./";
import { extendedNutritionFacts } from "./extendedNutritionFacts";
import { Presets } from "./Presets";

const NutritionFactsForm: FC<{
  product: AiInfoFeatureProps | undefined;
  layout: PageLayout;
  setProduct: Dispatch<SetStateAction<AiInfoFeatureProps | undefined>>;
  isNarrow?: boolean;
  isInIframe?: boolean;
}> = ({ product, layout, setProduct, isNarrow, isInIframe }) => {
  function isNutritionFacts(obj: unknown): obj is NutritionFactsProps {
    return (
      typeof obj === "object" &&
      obj !== null &&
      typeof (obj as NutritionFactsProps).modalLabel === "string"
    );
  }

  let Feature: ExtendedNutritionFactsProps | undefined;
  if (product && isNutritionFacts(product?.nutritionFacts)) {
    Feature = extendedNutritionFacts(product);
  }

  return (
    <>
      <Flex alignItems="end" direction={isNarrow ? "column" : "row"}>
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
        {!isInIframe && (
          <Flex.Item size="50%">
            <View as="div" margin="0 0 small">
              <Presets product={product} setProduct={setProduct} />
            </View>
          </Flex.Item>
        )}
      </Flex>
      <Divider />
      <Flex alignItems="center" direction="column">
        {Feature ? (
          <>
            <Flex.Item>
              <Heading level="h2" variant="titleCardSection">
                {Feature.featureName}
              </Heading>
              {Feature.data.map(({ blockTitle, segmentData }) => {
                return (
                  <View as="div" key={blockTitle} margin="sectionElements 0">
                    <Heading level="h3" variant="titleModule">
                      {blockTitle}
                    </Heading>
                    <View as="div" margin="sectionElements 0 0">
                      {segmentData.map(
                        ({
                          segmentTitle,
                          description,
                          value,
                          valueDescription,
                        }) => {
                          return (
                            <View
                              as="div"
                              borderColor="primary"
                              borderRadius="medium"
                              borderWidth="small"
                              key={segmentTitle}
                              margin="0 0 modalElements"
                              padding="space12"
                            >
                              <View as="div" margin="0 0 space8">
                                <Heading level="h4" variant="label">
                                  {segmentTitle}
                                </Heading>
                                <Text color="secondary" variant="contentSmall">
                                  {description}
                                </Text>
                              </View>
                              <Text variant="content">{value}</Text>
                              {valueDescription && (
                                <>
                                  <br />
                                  <Text
                                    color="secondary"
                                    variant="contentSmall"
                                  >
                                    {valueDescription}
                                  </Text>
                                </>
                              )}
                            </View>
                          );
                        },
                      )}
                    </View>
                  </View>
                );
              })}
            </Flex.Item>
            {layout.revision && product?.revision && (
              <Flex.Item>
                <Text color="secondary" variant="contentSmall">
                  Revision: {product.revision}
                </Text>
              </Flex.Item>
            )}
          </>
        ) : (
          <Flex.Item shouldGrow shouldShrink>
            <View as="div" margin="0 0 medium" textAlign="center">
              <IconAiLine color="secondary" size="x-large" />
            </View>
            <Heading color="secondary" level="h2" variant="titleCardSection">
              Select a feature to view its Nutrition Facts
            </Heading>
          </Flex.Item>
        )}
      </Flex>
    </>
  );
};

export { NutritionFactsForm };
