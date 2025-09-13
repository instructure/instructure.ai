import type { ProductNutritionFacts } from "../types.ts";

const Product: ProductNutritionFacts = {
	data: [
		{
			blockTitle: "Model & Data",
			segmentData: [
				{
					description:
						"The foundational AI on which further training and customizations are built.",
					descriptionHint: "Describe the base model",
					segmentTitle: "Base Model",
					value: "",
					valueDescription: "",
					valueHint: "Input base model",
				},
				{
					description:
						"Indicates the AI model has been given customer data in order to improve its results.",
					inputOptions: ["Yes", "No"],
					inputType: "select",
					segmentTitle: "Trained with User Data",
					value: "",
					valueHint: "Yes / No",
				},
				{
					description:
						"Indicates which training or operational content was given to the model.",
					descriptionHint: "Describe the data shared",
					inputOptions: ["None", "Course", "Faculty", "Student", "Other"],
					inputType: "multi-select",
					segmentTitle: "Data Shared with Model",
					value: "",
					valueDescription: "",
					valueHint: "Select shared data set",
				},
			],
		},
		{
			blockTitle: "Privacy & Compliance",
			segmentData: [
				{
					description: "How long the model stores customer data.",
					descriptionHint: "Describe the data retention period",
					segmentTitle: "Data Retention",
					valueDescription: "",
				},
				{
					description:
						"Recording the AI's performance for auditing, analysis, and improvement.",
					descriptionHint: "Describe the data logging practices",
					inputOptions: ["Logs data", "Does not log data"],
					inputType: "select",
					segmentTitle: "Data Logging",
					value: "",
					valueDescription: "",
					valueHint: "Logs data / Does not log data",
				},
				{
					description:
						"The locations where the AI model is officially available and supported.",
					descriptionHint: "Describe the supported regions",
					inputOptions: [
						"Global",
						"Virginia",
						"Oregon",
						"Montreal",
						"Dublin",
						"Frankfurt",
						"Singapore",
						"Sydney",
						"Other",
					],
					inputType: "multi-select",
					segmentTitle: "Regions Supported",
					value: "",
					valueDescription: "",
					valueHint: "Select region(s)",
				},
				{
					description:
						"Sensitive data that can be used to identify an individual.",
					descriptionHint: "Describe the handling of PII",
					inputOptions: ["Exposed", "Not Exposed"],
					inputType: "select",
					segmentTitle: "PII",
					value: "",
					valueDescription: "",
					valueHint: "Exposed / Not Exposed",
				},
			],
		},
		{
			blockTitle: "Outputs",
			segmentData: [
				{
					description:
						"The ability to turn the AI on or off within the product.",
					inputOptions: ["Yes", "No"],
					inputType: "select",
					segmentTitle: "AI Settings Control",
					value: "",
					valueHint: "Yes / No",
				},
				{
					description:
						"Indicates if a human is involved in the AI's process or output.",
					descriptionHint: "Describe the human involvement",
					inputOptions: ["Yes", "No"],
					inputType: "select",
					segmentTitle: "Human in the Loop",
					value: "",
					valueDescription: "",
					valueHint: "Yes / No",
				},
				{
					description:
						"Preventative safety mechanisms or limitations built into the AI model.",
					descriptionHint: "Describe the guardrails",
					segmentTitle: "Guardrails",
					valueDescription: "",
				},
				{
					description: "Any risks the model may pose to the user.",
					descriptionHint: "Describe the expected risks",
					segmentTitle: "Expected Risks",
					valueDescription: "",
				},
				{
					description: "The specific results the AI model is meant to achieve.",
					descriptionHint: "Describe the intended outcomes",
					segmentTitle: "Intended Outcomes",
					valueDescription: "",
				},
			],
		},
	],
	description: "",
	descriptionHint: "Describe your feature",
	id: "",
	name: "",
	nameHint: "Feature Name",
	revision: "",
	group: "other",
};

export { Product };
