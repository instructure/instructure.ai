// biome-ignore-all assist/source/useSortedKeys: Required order for Strings

import type { Strings } from "../types";

const strings: Strings = {
	en: {
		modalLabel: "This is a modal for AI facts",
		title: "Nutrition Facts",
		data: [
			{
				blockTitle: "Model & Data",
				segmentData: [
					{
						segmentTitle: "Base Model",
						description:
							"The foundational AI on which further training and customizations are built.",
					},
					{
						segmentTitle: "Trained with User Data",
						description:
							"Indicates the AI model has been given customer data in order to improve its results.",
					},
					{
						segmentTitle: "Data Shared with Model",
						description:
							"Indicates which training or operational content was given to the model.",
					},
				],
			},
			{
				blockTitle: "Privacy & Compliance",
				segmentData: [
					{
						segmentTitle: "Data Retention",
						description: "How long the model stores customer data.",
					},
					{
						segmentTitle: "Data Logging",
						description:
							"Recording the AI's performance for auditing, analysis, and improvement.",
					},
					{
						segmentTitle: "Regions Supported",
						description:
							"The locations where the AI model is officially available and supported.",
					},
					{
						segmentTitle: "PII",
						description:
							"Sensitive data that can be used to identify an individual.",
					},
				],
			},
			{
				blockTitle: "Outputs",
				segmentData: [
					{
						segmentTitle: "AI Settings Control",
						description:
							"The ability to turn the AI on or off within the product.",
					},
					{
						segmentTitle: "Human in the Loop",
						description:
							"Indicates if a human is involved in the AI's process or output.",
					},
					{
						segmentTitle: "Guardrails",
						description:
							"Preventative safety mechanisms or limitations built into the AI model.",
					},
					{
						segmentTitle: "Expected Risks",
						description: "Any risks the model may pose to the user.",
					},
					{
						segmentTitle: "Intended Outcomes",
						description:
							"The specific results the AI model is meant to achieve.",
					},
				],
			},
		],
		closeButtonText: "Close",
		closeIconButtonScreenReaderLabel: "Close",
		triggerText: "Nutrition Facts",
	},
};

export { strings };
