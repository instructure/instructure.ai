import type { AiInfoFeatureProps, AiInfoProps } from "@instructure.ai/aiinfo";
import type { ExtendedNutritionFactsProps } from "../../types";

const extendedNutritionFacts = (
  product: AiInfoFeatureProps,
): ExtendedNutritionFactsProps => {
  const firstData =
    Array.isArray(product.aiInformation?.data) &&
    product.aiInformation.data.length > 0
      ? product.aiInformation.data[0]
      : { description: "", permissionLevel: "" };

  const permissionsSegment = {
    blockTitle: "Data Permissions Level",
    segmentData: [
      {
        description: "",
        segmentTitle: firstData.permissionLevel
          ? firstData.permissionLevel.replace("LEVEL", "Level")
          : "",
        value: firstData.description ?? "",
        valueDescription: undefined,
      },
    ],
  };

  const nutritionFacts = product.nutritionFacts ?? {};
  const dataArray = Array.isArray(nutritionFacts.data)
    ? nutritionFacts.data
    : [];

  return {
    description: product.description as unknown as AiInfoProps["description"],
    ...nutritionFacts,
    data: [...dataArray, permissionsSegment],
  };
};

export { extendedNutritionFacts };
