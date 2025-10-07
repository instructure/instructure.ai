import { Button } from "@instructure/ui-buttons";
import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
} from "@instructure/ui-instructure";
import type { AiInfoFeatureProps } from "../types";

const smartsearch: AiInfoFeatureProps = {
	AiInformation: {
		data: [
			{
				description:
					"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
				featureName: "Smart Search",
				modelName: "Cohere Embed Multilingual",
				modelNameText: "Base Model",
				nutritionFactsModalTriggerText: "AI Nutrition Facts",
				permissionLevel: "LEVEL 2",
				permissionLevelsModalTriggerText: "Data Permission Levels",
				permissionLevelText: "Permission Level:",
			},
		],
		dataPermissionLevelsCloseButtonText: "Close",
		dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
		dataPermissionLevelsCurrentFeature: "Smart Search",
		dataPermissionLevelsCurrentFeatureText: "Current Feature:",
		dataPermissionLevelsData: [
			{
				description:
					"We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
				highlighted: false,
				level: "LEVEL 1",
				title: "Descriptive Analytics and Research",
			},
			{
				description:
					"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
				highlighted: true,
				level: "LEVEL 2",
				title: "AI-Powered Features Without Data Training",
			},
			{
				description:
					"We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
				highlighted: false,
				level: "LEVEL 3",
				title: "AI Customization for Individual Institutions",
			},
			{
				description:
					"We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
				highlighted: false,
				level: "LEVEL 4",
				title: "Collaborative AI Consortium",
			},
		],
		dataPermissionLevelsModalLabel: "Data Permission Levels modal",
		dataPermissionLevelsTitle: "Data Permission Levels",
		nutritionFactsCloseButtonText: "Close",
		nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
		nutritionFactsData: [
			{
				blockTitle: "Model & Data",
				segmentData: [
					{
						description:
							"The foundational AI on which further training and customizations are built.",
						segmentTitle: "Base Model",
						value: "Cohere Embed Multilingual",
						valueDescription:
							"Cohere models are provided via Amazon Bedrock Foundation Models (FMs).",
					},
					{
						description:
							"Indicates the AI model has been given customer data in order to improve its results.",
						segmentTitle: "Trained with User Data",
						value: "No",
					},
					{
						description:
							"Indicates which training or operational content was given to the model.",
						segmentTitle: "Data Shared with Model",
						value:
							"Course content is indexed by the model and then stored in the Canvas database.",
					},
				],
			},
			{
				blockTitle: "Privacy & Compliance",
				segmentData: [
					{
						description: "How long the model stores customer data.",
						segmentTitle: "Data Retention",
						value:
							"Data is not stored or reused by the model. Indexed course content is stored in the Canvas database.",
					},
					{
						description:
							"Recording the AI's performance for auditing, analysis, and improvement.",
						segmentTitle: "Data Logging",
						value: "Does not log data",
						valueDescription: "",
					},
					{
						description:
							"The locations where the AI model is officially available and supported.",
						segmentTitle: "Regions Supported",
						value: "Global",
						valueDescription: "",
					},
					{
						description:
							"Sensitive data that can be used to identify an individual.",
						segmentTitle: "PII",
						value: "Not Exposed",
						valueDescription:
							"PII in course content may be indexed, but no PII is intentionally sent to the model.",
					},
				],
			},
			{
				blockTitle: "Outputs",
				segmentData: [
					{
						description:
							"The ability to turn the AI on or off within the product.",
						segmentTitle: "AI Settings Control",
						value: "Yes",
					},
					{
						description:
							"Indicates if a human is involved in the AI's process or output.",
						segmentTitle: "Human in the Loop",
						value: "Yes",
						valueDescription:
							"Users are presented with a list of results related to their search query and can act or not act on them.",
					},
					{
						description:
							"Preventative safety mechanisms or limitations built into the AI model.",
						segmentTitle: "Guardrails",
						value: "",
					},
					{
						description: "Any risks the model may pose to the user.",
						segmentTitle: "Expected Risks",
						value:
							"Search results may be incorrectly sorted or may not be relevant to the search term.",
					},
					{
						description:
							"The specific results the AI model is meant to achieve.",
						segmentTitle: "Intended Outcomes",
						value:
							"Student are able to quicly find answers to questions, and instructors are able to quickly navigate their courses.",
					},
				],
			},
		],
		nutritionFactsFeatureName: "Smart Search",
		nutritionFactsModalLabel: "This is a modal for AI facts",
		nutritionFactsTitle: "AI Nutrition Facts",
		title: "Features",
		trigger: <Button>AI Information</Button>,
	},
	DataPermissionLevels: {
		closeButtonText: "Close",
		closeIconButtonScreenReaderLabel: "Close dialog",
		currentFeature: "Smart Search",
		currentFeatureText: "Current Feature:",
		data: [
			{
				description:
					"We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
				highlighted: false,
				level: "LEVEL 1",
				title: "Descriptive Analytics and Research",
			},
			{
				description:
					"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
				highlighted: true,
				level: "LEVEL 2",
				title: "AI-Powered Features Without Data Training",
			},
			{
				description:
					"We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
				highlighted: false,
				level: "LEVEL 3",
				title: "AI Customization for Individual Institutions",
			},
			{
				description:
					"We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
				highlighted: false,
				level: "LEVEL 4",
				title: "Collaborative AI Consortium",
			},
		],
		modalLabel: "Data Permission Levels modal",
		title: "Data Permission Levels",
		triggerText: "Data Permission Levels",
	},
	NutritionFacts: {
		closeButtonText: "Close",
		closeIconButtonScreenReaderLabel: "Close",
		data: [
			{
				blockTitle: "Model & Data",
				segmentData: [
					{
						description:
							"The foundational AI on which further training and customizations are built.",
						segmentTitle: "Base Model",
						value: "Cohere Embed Multilingual",
						valueDescription:
							"Cohere models are provided via Amazon Bedrock Foundation Models (FMs).",
					},
					{
						description:
							"Indicates the AI model has been given customer data in order to improve its results.",
						segmentTitle: "Trained with User Data",
						value: "No",
					},
					{
						description:
							"Indicates which training or operational content was given to the model.",
						segmentTitle: "Data Shared with Model",
						value:
							"Course content is indexed by the model and then stored in the Canvas database.",
					},
				],
			},
			{
				blockTitle: "Privacy & Compliance",
				segmentData: [
					{
						description: "How long the model stores customer data.",
						segmentTitle: "Data Retention",
						value:
							"Data is not stored or reused by the model. Indexed course content is stored in the Canvas database.",
					},
					{
						description:
							"Recording the AI's performance for auditing, analysis, and improvement.",
						segmentTitle: "Data Logging",
						value: "Does not log data",
						valueDescription: "",
					},
					{
						description:
							"The locations where the AI model is officially available and supported.",
						segmentTitle: "Regions Supported",
						value: "Global",
						valueDescription: "",
					},
					{
						description:
							"Sensitive data that can be used to identify an individual.",
						segmentTitle: "PII",
						value: "Not Exposed",
						valueDescription:
							"PII in course content may be indexed, but no PII is intentionally sent to the model.",
					},
				],
			},
			{
				blockTitle: "Outputs",
				segmentData: [
					{
						description:
							"The ability to turn the AI on or off within the product.",
						segmentTitle: "AI Settings Control",
						value: "Yes",
					},
					{
						description:
							"Indicates if a human is involved in the AI's process or output.",
						segmentTitle: "Human in the Loop",
						value: "Yes",
						valueDescription:
							"Users are presented with a list of results related to their search query and can act or not act on them.",
					},
					{
						description:
							"Preventative safety mechanisms or limitations built into the AI model.",
						segmentTitle: "Guardrails",
						value: "",
					},
					{
						description: "Any risks the model may pose to the user.",
						segmentTitle: "Expected Risks",
						value:
							"Search results may be incorrectly sorted or may not be relevant to the search term.",
					},
					{
						description:
							"The specific results the AI model is meant to achieve.",
						segmentTitle: "Intended Outcomes",
						value:
							"Student are able to quicly find answers to questions, and instructors are able to quickly navigate their courses.",
					},
				],
			},
		],
		featureName: "Smart Search",
		modalLabel: "This is a modal for AI facts",
		title: "AI Nutrition Facts",
		triggerText: "Nutrition Facts",
	},
	revision: "2025.09.12",
	uid: "smartsearch",
};
const nutritionFacts: NutritionFactsProps = {
	closeButtonText: "Close",
	closeIconButtonScreenReaderLabel: "Close",
	data: [
		{
			blockTitle: "Model & Data",
			segmentData: [
				{
					description:
						"The foundational AI on which further training and customizations are built.",
					segmentTitle: "Base Model",
					value: "Cohere Embed Multilingual",
					valueDescription:
						"Cohere models are provided via Amazon Bedrock Foundation Models (FMs).",
				},
				{
					description:
						"Indicates the AI model has been given customer data in order to improve its results.",
					segmentTitle: "Trained with User Data",
					value: "No",
				},
				{
					description:
						"Indicates which training or operational content was given to the model.",
					segmentTitle: "Data Shared with Model",
					value:
						"Course content is indexed by the model and then stored in the Canvas database.",
				},
			],
		},
		{
			blockTitle: "Privacy & Compliance",
			segmentData: [
				{
					description: "How long the model stores customer data.",
					segmentTitle: "Data Retention",
					value:
						"Data is not stored or reused by the model. Indexed course content is stored in the Canvas database.",
				},
				{
					description:
						"Recording the AI's performance for auditing, analysis, and improvement.",
					segmentTitle: "Data Logging",
					value: "Does not log data",
					valueDescription: "",
				},
				{
					description:
						"The locations where the AI model is officially available and supported.",
					segmentTitle: "Regions Supported",
					value: "Global",
					valueDescription: "",
				},
				{
					description:
						"Sensitive data that can be used to identify an individual.",
					segmentTitle: "PII",
					value: "Not Exposed",
					valueDescription:
						"PII in course content may be indexed, but no PII is intentionally sent to the model.",
				},
			],
		},
		{
			blockTitle: "Outputs",
			segmentData: [
				{
					description:
						"The ability to turn the AI on or off within the product.",
					segmentTitle: "AI Settings Control",
					value: "Yes",
				},
				{
					description:
						"Indicates if a human is involved in the AI's process or output.",
					segmentTitle: "Human in the Loop",
					value: "Yes",
					valueDescription:
						"Users are presented with a list of results related to their search query and can act or not act on them.",
				},
				{
					description:
						"Preventative safety mechanisms or limitations built into the AI model.",
					segmentTitle: "Guardrails",
					value: "",
				},
				{
					description: "Any risks the model may pose to the user.",
					segmentTitle: "Expected Risks",
					value:
						"Search results may be incorrectly sorted or may not be relevant to the search term.",
				},
				{
					description: "The specific results the AI model is meant to achieve.",
					segmentTitle: "Intended Outcomes",
					value:
						"Student are able to quicly find answers to questions, and instructors are able to quickly navigate their courses.",
				},
			],
		},
	],
	featureName: "Smart Search",
	modalLabel: "This is a modal for AI facts",
	title: "AI Nutrition Facts",
	triggerText: "Nutrition Facts",
};
const dataPermissionLevels: DataPermissionLevelsProps = {
	closeButtonText: "Close",
	closeIconButtonScreenReaderLabel: "Close dialog",
	currentFeature: "Smart Search",
	currentFeatureText: "Current Feature:",
	data: [
		{
			description:
				"We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
			highlighted: false,
			level: "LEVEL 1",
			title: "Descriptive Analytics and Research",
		},
		{
			description:
				"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
			highlighted: true,
			level: "LEVEL 2",
			title: "AI-Powered Features Without Data Training",
		},
		{
			description:
				"We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
			highlighted: false,
			level: "LEVEL 3",
			title: "AI Customization for Individual Institutions",
		},
		{
			description:
				"We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
			highlighted: false,
			level: "LEVEL 4",
			title: "Collaborative AI Consortium",
		},
	],
	modalLabel: "Data Permission Levels modal",
	title: "Data Permission Levels",
	triggerText: "Data Permission Levels",
};
const aiInformation: AiInformationProps = {
	data: [
		{
			description:
				"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
			featureName: "Smart Search",
			modelName: "Cohere Embed Multilingual",
			modelNameText: "Base Model",
			nutritionFactsModalTriggerText: "AI Nutrition Facts",
			permissionLevel: "LEVEL 2",
			permissionLevelsModalTriggerText: "Data Permission Levels",
			permissionLevelText: "Permission Level:",
		},
	],
	dataPermissionLevelsCloseButtonText: "Close",
	dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
	dataPermissionLevelsCurrentFeature: "Smart Search",
	dataPermissionLevelsCurrentFeatureText: "Current Feature:",
	dataPermissionLevelsData: [
		{
			description:
				"We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
			highlighted: false,
			level: "LEVEL 1",
			title: "Descriptive Analytics and Research",
		},
		{
			description:
				"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
			highlighted: true,
			level: "LEVEL 2",
			title: "AI-Powered Features Without Data Training",
		},
		{
			description:
				"We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
			highlighted: false,
			level: "LEVEL 3",
			title: "AI Customization for Individual Institutions",
		},
		{
			description:
				"We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
			highlighted: false,
			level: "LEVEL 4",
			title: "Collaborative AI Consortium",
		},
	],
	dataPermissionLevelsModalLabel: "Data Permission Levels modal",
	dataPermissionLevelsTitle: "Data Permission Levels",
	nutritionFactsCloseButtonText: "Close",
	nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
	nutritionFactsData: [
		{
			blockTitle: "Model & Data",
			segmentData: [
				{
					description:
						"The foundational AI on which further training and customizations are built.",
					segmentTitle: "Base Model",
					value: "Cohere Embed Multilingual",
					valueDescription:
						"Cohere models are provided via Amazon Bedrock Foundation Models (FMs).",
				},
				{
					description:
						"Indicates the AI model has been given customer data in order to improve its results.",
					segmentTitle: "Trained with User Data",
					value: "No",
				},
				{
					description:
						"Indicates which training or operational content was given to the model.",
					segmentTitle: "Data Shared with Model",
					value:
						"Course content is indexed by the model and then stored in the Canvas database.",
				},
			],
		},
		{
			blockTitle: "Privacy & Compliance",
			segmentData: [
				{
					description: "How long the model stores customer data.",
					segmentTitle: "Data Retention",
					value:
						"Data is not stored or reused by the model. Indexed course content is stored in the Canvas database.",
				},
				{
					description:
						"Recording the AI's performance for auditing, analysis, and improvement.",
					segmentTitle: "Data Logging",
					value: "Does not log data",
					valueDescription: "",
				},
				{
					description:
						"The locations where the AI model is officially available and supported.",
					segmentTitle: "Regions Supported",
					value: "Global",
					valueDescription: "",
				},
				{
					description:
						"Sensitive data that can be used to identify an individual.",
					segmentTitle: "PII",
					value: "Not Exposed",
					valueDescription:
						"PII in course content may be indexed, but no PII is intentionally sent to the model.",
				},
			],
		},
		{
			blockTitle: "Outputs",
			segmentData: [
				{
					description:
						"The ability to turn the AI on or off within the product.",
					segmentTitle: "AI Settings Control",
					value: "Yes",
				},
				{
					description:
						"Indicates if a human is involved in the AI's process or output.",
					segmentTitle: "Human in the Loop",
					value: "Yes",
					valueDescription:
						"Users are presented with a list of results related to their search query and can act or not act on them.",
				},
				{
					description:
						"Preventative safety mechanisms or limitations built into the AI model.",
					segmentTitle: "Guardrails",
					value: "",
				},
				{
					description: "Any risks the model may pose to the user.",
					segmentTitle: "Expected Risks",
					value:
						"Search results may be incorrectly sorted or may not be relevant to the search term.",
				},
				{
					description: "The specific results the AI model is meant to achieve.",
					segmentTitle: "Intended Outcomes",
					value:
						"Student are able to quicly find answers to questions, and instructors are able to quickly navigate their courses.",
				},
			],
		},
	],
	nutritionFactsFeatureName: "Smart Search",
	nutritionFactsModalLabel: "This is a modal for AI facts",
	nutritionFactsTitle: "AI Nutrition Facts",
	title: "Features",
	trigger: <Button>AI Information</Button>,
};
export { smartsearch, nutritionFacts, dataPermissionLevels, aiInformation };
export default smartsearch;
