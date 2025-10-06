import { nutritionFactsStrings } from "../strings/index.js";
import type { AiInfoFeature, Entry, NutritionFactsStrings } from "../types.js";

const setData = (
	data: NutritionFactsStrings["data"],
	entry: Entry,
): AiInfoFeature["NutritionFacts"]["data"] => {
	const { model, compliance, outputs } = entry;
	return [
		{
			blockTitle: data[0].blockTitle,
			segmentData: [
				{
					value: model.name,
					valueDescription: model.description,
					...data[0].segmentData[0],
				},
				{
					value: model.trained,
					...data[0].segmentData[1],
				},
				{
					value: model.dataDescription,
					...data[0].segmentData[2],
				},
			],
		},
		{
			blockTitle: data[1].blockTitle,
			segmentData: [
				{
					value: compliance.retention,
					...data[1].segmentData[0],
				},
				{
					value: compliance.logging,
					valueDescription: compliance.loggingDescription,
					...data[1].segmentData[1],
				},
				{
					value: compliance.regions,
					valueDescription: compliance.regionsDescription,
					...data[1].segmentData[2],
				},
				{
					value: compliance.pii,
					valueDescription: compliance.piiDescription,
					...data[1].segmentData[3],
				},
			],
		},
		{
			blockTitle: data[2].blockTitle,
			segmentData: [
				{
					value: outputs.settings,
					...data[2].segmentData[0],
				},
				{
					value: outputs.human,
					valueDescription: outputs.humanDescription,
					...data[2].segmentData[1],
				},
				{
					value: outputs.guardrails,
					...data[2].segmentData[2],
				},
				{
					value: outputs.risks,
					...data[2].segmentData[3],
				},
				{
					value: outputs.outcomes,
					...data[2].segmentData[4],
				},
			],
		},
	];
};

const entryToNutritionFacts = (
	entry: Entry,
): AiInfoFeature["NutritionFacts"] => {
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
};

export { entryToNutritionFacts };
