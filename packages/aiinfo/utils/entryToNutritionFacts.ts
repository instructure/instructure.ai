import { nutritionFactsStrings } from "../strings/index.js";
import type { AiInfoFeature, Entry, NutritionFactsStrings } from "../types.js";

const setData = (
	data: NutritionFactsStrings["data"],
	entry: Entry,
): AiInfoFeature["nutritionFacts"]["data"] => {
	try {
		const { model, compliance, outputs } = entry;
		const valueMap = [
			[
				{ value: model.name, valueDescription: model.description },
				{ value: model.trained },
				{ value: model.dataDescription },
			],
			[
				{ value: compliance.retention },
				{
					value: compliance.logging,
					valueDescription: compliance.loggingDescription,
				},
				{
					value: compliance.regions,
					valueDescription: compliance.regionsDescription,
				},
				{ value: compliance.pii, valueDescription: compliance.piiDescription },
			],
			[
				{ value: outputs.settings },
				{ value: outputs.human, valueDescription: outputs.humanDescription },
				{ value: outputs.guardrails },
				{ value: outputs.risks },
				{ value: outputs.outcomes },
			],
		];

		return data.map((block, i) => {
			// Explicit length guard so tests can assert error on mismatch
			if (!valueMap[i] || block.segmentData.length !== valueMap[i].length) {
				throw new Error(
					`Segment length mismatch in block "${block.blockTitle}" (expected ${valueMap[i]?.length ?? 0}, got ${block.segmentData.length})`,
				);
			}
			return {
				blockTitle: block.blockTitle,
				segmentData: block.segmentData.map((seg, j) => ({
					...seg,
					...valueMap[i][j],
				})),
			};
		});
	} catch (error) {
		throw new Error(`Error in entryToNutritionFacts: ${String(error)}`, { cause: error });
	}
};

const entryToNutritionFacts = (
	entry: Entry,
): AiInfoFeature["nutritionFacts"] => {
	try {
		const { en: s } = nutritionFactsStrings as { en: NutritionFactsStrings };
		const { feature } = entry;
		return {
			closeButtonText: s.closeButtonText,
			closeIconButtonScreenReaderLabel: s.closeIconButtonScreenReaderLabel,
			data: setData(s.data, entry),
			featureName: feature.name,
			modalLabel: s.modalLabel,
			title: s.title,
			triggerText: s.triggerText,
		};
	} catch (error) {
		throw new Error(`Error in entryToNutritionFacts: ${String(error)}`, { cause: error });
	}
};

export { entryToNutritionFacts };
