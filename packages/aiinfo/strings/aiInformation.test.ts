import { describe, it, expect } from "vitest";
import { strings as aiInformationStrings } from "./aiInformation";
import { strings as nutritionFactsStrings } from "./nutritionFacts";
import { strings as permissionLevelsStrings } from "./permissionLevels";

describe("aiInformation strings", () => {
    it("exposes 'en' locale", () => {
        expect(aiInformationStrings).toHaveProperty("en");
    });

    it("has correct static literals", () => {
        const ai = aiInformationStrings.en;
        expect(ai.title).toBe("Features");
        expect(ai.trigger).toBe("<Button>AI Information</Button>");
        expect(String(ai.trigger)).toContain("<Button>");
    });

    it("maps data object fields correctly", () => {
        const ai = aiInformationStrings.en;
        const perm = permissionLevelsStrings.en;
        const nutrition = nutritionFactsStrings.en;
        expect(ai.data.permissionLevelText).toBe("Permission Level:");
        expect(ai.data.permissionLevelsModalTriggerText).toBe(perm.title);
        expect(ai.data.modelNameText).toBe(
            nutrition.data[0].segmentData[0].segmentTitle,
        );
        expect(ai.data.nutritionFactsModalTriggerText).toBe(nutrition.title);
    });

    it("maps permission level modal related fields", () => {
        const ai = aiInformationStrings.en;
        const perm = permissionLevelsStrings.en;
        expect(ai.dataPermissionLevelsTitle).toBe(perm.title);
        expect(ai.dataPermissionLevelsCurrentFeatureText).toBe("Current Feature:");
        expect(ai.dataPermissionLevelsCloseIconButtonScreenReaderLabel).toBe(
            perm.closeIconButtonScreenReaderLabel,
        );
        expect(ai.dataPermissionLevelsCloseButtonText).toBe(perm.closeButtonText);
        expect(ai.dataPermissionLevelsModalLabel).toBe(perm.modalLabel);
    });

    it("maps nutrition facts modal related fields", () => {
        const ai = aiInformationStrings.en;
        const nutrition = nutritionFactsStrings.en;
        expect(ai.nutritionFactsModalLabel).toBe(nutrition.modalLabel);
        expect(ai.nutritionFactsTitle).toBe(nutrition.title);
        expect(ai.nutritionFactsCloseButtonText).toBe(nutrition.closeButtonText);
        expect(ai.nutritionFactsCloseIconButtonScreenReaderLabel).toBe(
            nutrition.closeIconButtonScreenReaderLabel,
        );
    });

    it("all accessed fields are non-empty strings", () => {
        const ai = aiInformationStrings.en;
        const check = (val: unknown) =>
            expect(typeof val === "string" && val.length).toBeGreaterThan(0);

        check(ai.title);
        check(ai.trigger);
        check(ai.data.permissionLevelText);
        check(ai.data.permissionLevelsModalTriggerText);
        check(ai.data.modelNameText);
        check(ai.data.nutritionFactsModalTriggerText);
        check(ai.dataPermissionLevelsTitle);
        check(ai.dataPermissionLevelsCurrentFeatureText);
        check(ai.dataPermissionLevelsCloseIconButtonScreenReaderLabel);
        check(ai.dataPermissionLevelsCloseButtonText);
        check(ai.dataPermissionLevelsModalLabel);
        check(ai.nutritionFactsModalLabel);
        check(ai.nutritionFactsTitle);
        check(ai.nutritionFactsCloseButtonText);
        check(ai.nutritionFactsCloseIconButtonScreenReaderLabel);
    });

    it("has no undefined properties at top level of 'en'", () => {
        const ai = aiInformationStrings.en as Record<string, unknown>;
        for (const [k, v] of Object.entries(ai)) {
            expect(v).not.toBeUndefined();
        }
    });

    it("snapshot of english strings", () => {
        expect(aiInformationStrings.en).toMatchSnapshot();
    });
});