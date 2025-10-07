import { nutritionFactsStrings } from "../strings/index.js";
import type { AiInfoFeature, Entry, NutritionFactsStrings } from "../types.js";

const setData = (
	data: NutritionFactsStrings["data"],
	entry: Entry,
	): AiInfoFeature["NutritionFacts"]["data"] => {
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
			return data.map((block, i) => ({
				blockTitle: block.blockTitle,
				segmentData: block.segmentData.map((seg, j) => ({
					...seg,
					...valueMap[i][j],
				})),
			}));
		} catch (err) {
			console.error("Error in setData (NutritionFacts):", err);
			return [{
				blockTitle: "Error",
				segmentData: [{
					segmentTitle: "Error",
					description: "Error",
					value: "Error",
					valueDescription: "Error"
				}]
			}];
		}
	};

const entryToNutritionFacts = (
	entry: Entry,
	): AiInfoFeature["NutritionFacts"] => {
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
		} catch (err) {
			console.error("Error in entryToNutritionFacts:", err);
			return {
				closeButtonText: "Error",
				closeIconButtonScreenReaderLabel: "Error",
				data: [{
					blockTitle: "Error",
					segmentData: [{
						segmentTitle: "Error",
						description: "Error",
						value: "Error",
						valueDescription: "Error"
					}]
				}],
				featureName: "Error",
				modalLabel: "Error",
				title: "Error",
				triggerText: "Error",
			};
		}
	};

export { entryToNutritionFacts };
