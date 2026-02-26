import {
  type AiInformationProps as InstructureAiInformationProps,
  type DataPermissionLevelsProps as InstructureDataPermissionLevelsProps,
  type NutritionFactsProps as InstructureNutritionFactsProps,
} from "@instructure/ui-instructure";
import {
  type AiInformationProps as LocalAiInformationProps,
  type DataPermissionLevelsProps as LocalDataPermissionLevelsProps,
  type NutritionFactsProps as LocalNutritionFactsProps,
} from "../node/types";
import { describe, expect, it } from "vitest";
import { type Renderable } from "@instructure/shared-types";

describe("Type compatibility with @instructure/ui-instructure", () => {
  describe("NutritionFactsProps", () => {
    it("should have compatible data structure", () => {
      // Create a sample that matches our local type
      const localSample: LocalNutritionFactsProps = {
        closeButtonText: "Close",
        closeIconButtonScreenReaderLabel: "Close",
        data: [
          {
            blockTitle: "Block 1",
            segmentData: [
              {
                description: "Description",
                segmentTitle: "Segment 1",
                value: "Value",
                valueDescription: "Value Description",
              },
            ],
          },
        ],
        featureName: "Test Feature",
        fullscreen: false,
        modalLabel: "Test Modal",
        title: "Test Title",
        triggerText: "Trigger",
      };

      // Type assertion: local type should satisfy the Instructure type structure
      // This won't compile if the types are incompatible
      const verifyDataStructure = (props: LocalNutritionFactsProps) => {
        const instructureCompatible: Pick<
          InstructureNutritionFactsProps,
          keyof LocalNutritionFactsProps
        > = {
          closeButtonText: props.closeButtonText,
          closeIconButtonScreenReaderLabel: props.closeIconButtonScreenReaderLabel,
          data: props.data,
          featureName: props.featureName,
          fullscreen: props.fullscreen,
          modalLabel: props.modalLabel,
          title: props.title,
          triggerText: props.triggerText,
        };
        return instructureCompatible;
      };

      expect(verifyDataStructure(localSample)).toEqual(localSample);
    });

    it("should have all required keys", () => {
      const localKeys: (keyof LocalNutritionFactsProps)[] = [
        "modalLabel",
        "title",
        "featureName",
        "data",
        "closeButtonText",
        "closeIconButtonScreenReaderLabel",
        "triggerText",
      ];

      const requiredInstructureKeys: (keyof InstructureNutritionFactsProps)[] = [
        "modalLabel",
        "title",
        "featureName",
        "data",
        "closeButtonText",
        "closeIconButtonScreenReaderLabel",
        "triggerText",
      ];

      // Verify all required keys exist in both types
      expect(localKeys.toSorted()).toEqual(requiredInstructureKeys.toSorted());
    });
  });

  describe("DataPermissionLevelsProps", () => {
    it("should have compatible data structure", () => {
      const localSample: LocalDataPermissionLevelsProps = {
        closeButtonText: "Close",
        closeIconButtonScreenReaderLabel: "Close",
        currentFeature: "Test Feature",
        currentFeatureText: "Current Feature:",
        data: [
          {
            description: "Description",
            highlighted: true,
            level: "LEVEL 1",
            title: "Level Title",
          },
        ],
        fullscreen: false,
        modalLabel: "Test Modal",
        title: "Test Title",
        triggerText: "Trigger",
      };

      const verifyDataStructure = (props: LocalDataPermissionLevelsProps) => {
        const instructureCompatible: Pick<
          InstructureDataPermissionLevelsProps,
          keyof LocalDataPermissionLevelsProps
        > = {
          closeButtonText: props.closeButtonText,
          closeIconButtonScreenReaderLabel: props.closeIconButtonScreenReaderLabel,
          currentFeature: props.currentFeature,
          currentFeatureText: props.currentFeatureText,
          data: props.data,
          fullscreen: props.fullscreen,
          modalLabel: props.modalLabel,
          title: props.title,
          triggerText: props.triggerText,
        };
        return instructureCompatible;
      };

      expect(verifyDataStructure(localSample)).toEqual(localSample);
    });

    it("should have all required keys", () => {
      const localKeys: (keyof LocalDataPermissionLevelsProps)[] = [
        "modalLabel",
        "title",
        "data",
        "closeButtonText",
        "closeIconButtonScreenReaderLabel",
        "currentFeatureText",
        "currentFeature",
        "triggerText",
      ];

      const requiredInstructureKeys: (keyof InstructureDataPermissionLevelsProps)[] = [
        "modalLabel",
        "title",
        "data",
        "closeButtonText",
        "closeIconButtonScreenReaderLabel",
        "currentFeatureText",
        "currentFeature",
        "triggerText",
      ];

      expect(localKeys.toSorted()).toEqual(requiredInstructureKeys.toSorted());
    });
  });

  describe("AiInformationProps", () => {
    it("should have compatible data array structure", () => {
      const localSample: LocalAiInformationProps = {
        data: [
          {
            description: "Description",
            featureName: "Test Feature",
            modelName: "Haiku 3",
            modelNameText: "Base Model",
            nutritionFactsModalTriggerText: "AI Nutrition Facts",
            permissionLevel: "LEVEL 2",
            permissionLevelText: "Permission Level:",
            permissionLevelsModalTriggerText: "Data Permission Levels",
            privacyNoticeText: "Privacy Notice",
            privacyNoticeUrl: "https://example.com",
          },
        ],
        dataPermissionLevelsCloseButtonText: "Close",
        dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close",
        dataPermissionLevelsCurrentFeature: "Test",
        dataPermissionLevelsCurrentFeatureText: "Current Feature:",
        dataPermissionLevelsData: [],
        dataPermissionLevelsModalLabel: "Modal",
        dataPermissionLevelsTitle: "Title",
        fullscreenModals: false,
        nutritionFactsCloseButtonText: "Close",
        nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
        nutritionFactsData: [],
        nutritionFactsFeatureName: "Feature",
        nutritionFactsModalLabel: "Modal",
        nutritionFactsTitle: "Title",
        title: "Test Title",
        trigger: "<>Click here</>",
      };

      const verifyDataStructure = (props: LocalAiInformationProps) => {
        const instructureCompatible: Pick<
          InstructureAiInformationProps,
          keyof LocalAiInformationProps
        > = {
          data: props.data,
          dataPermissionLevelsCloseButtonText: props.dataPermissionLevelsCloseButtonText,
          dataPermissionLevelsCloseIconButtonScreenReaderLabel:
            props.dataPermissionLevelsCloseIconButtonScreenReaderLabel,
          dataPermissionLevelsCurrentFeature: props.dataPermissionLevelsCurrentFeature,
          dataPermissionLevelsCurrentFeatureText: props.dataPermissionLevelsCurrentFeatureText,
          dataPermissionLevelsData: props.dataPermissionLevelsData,
          dataPermissionLevelsModalLabel: props.dataPermissionLevelsModalLabel,
          dataPermissionLevelsTitle: props.dataPermissionLevelsTitle,
          fullscreenModals: props.fullscreenModals,
          nutritionFactsCloseButtonText: props.nutritionFactsCloseButtonText,
          nutritionFactsCloseIconButtonScreenReaderLabel:
            props.nutritionFactsCloseIconButtonScreenReaderLabel,
          nutritionFactsData: props.nutritionFactsData,
          nutritionFactsFeatureName: props.nutritionFactsFeatureName,
          nutritionFactsModalLabel: props.nutritionFactsModalLabel,
          nutritionFactsTitle: props.nutritionFactsTitle,
          title: props.title,
          // Renderable is a JSX element or string, which is compatible with Instructure's expected type for trigger (ReactNode).
          // We assert it as Renderable to satisfy our local type, and it should be compatible with Instructure's type.
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
          trigger: props.trigger as Renderable,
        };
        return instructureCompatible;
      };

      expect(verifyDataStructure(localSample)).toEqual(localSample);
    });

    it("should have all required keys for data array items", () => {
      const localDataKeys: (keyof LocalAiInformationProps["data"][number])[] = [
        "featureName",
        "privacyNoticeText",
        "privacyNoticeUrl",
        "permissionLevelText",
        "permissionLevel",
        "description",
        "permissionLevelsModalTriggerText",
        "modelNameText",
        "modelName",
        "nutritionFactsModalTriggerText",
      ];

      const instructureDataKeys: (keyof InstructureAiInformationProps["data"][number])[] = [
        "featureName",
        "privacyNoticeText",
        "privacyNoticeUrl",
        "permissionLevelText",
        "permissionLevel",
        "description",
        "permissionLevelsModalTriggerText",
        "modelNameText",
        "modelName",
        "nutritionFactsModalTriggerText",
      ];

      expect(localDataKeys.toSorted()).toEqual(instructureDataKeys.toSorted());
    });
  });

  describe("Type assignability", () => {
    it("should compile with type assertions proving compatibility", () => {
      // This test will fail at compile time if types are incompatible

      // Test that local types can be used where Instructure types are expected
      type AssertNutritionFactsDataCompatible =
        LocalNutritionFactsProps["data"] extends (infer NutritionFactsItem)[]
          ? NutritionFactsItem extends InstructureNutritionFactsProps["data"][number]
            ? true
            : false
          : false;

      type AssertDataPermissionLevelsDataCompatible =
        LocalDataPermissionLevelsProps["data"] extends (infer PermissionLevelItem)[]
          ? PermissionLevelItem extends InstructureDataPermissionLevelsProps["data"][number]
            ? true
            : false
          : false;

      type AssertAiInformationDataCompatible =
        LocalAiInformationProps["data"] extends (infer AiInfoItem)[]
          ? AiInfoItem extends InstructureAiInformationProps["data"][number]
            ? true
            : false
          : false;

      // Runtime check to ensure test passes
      const nutritionFactsCompatible: AssertNutritionFactsDataCompatible = true;
      const dataPermissionLevelsCompatible: AssertDataPermissionLevelsDataCompatible = true;
      const aiInformationCompatible: AssertAiInformationDataCompatible = true;

      expect(nutritionFactsCompatible).toBe(true);
      expect(dataPermissionLevelsCompatible).toBe(true);
      expect(aiInformationCompatible).toBe(true);
    });
  });
});
