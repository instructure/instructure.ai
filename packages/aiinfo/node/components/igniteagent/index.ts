import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
} from "@instructure/ui-instructure";
import type { AiInfoFeatureProps } from "../../types";

const FEATURE_NAME = "Agent";
const UID = "igniteagent";
const DATA_PERMISSION_LEVELS: DataPermissionLevelsProps["data"] = [
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
];
const NUTRITION_FACTS_DATA: NutritionFactsProps["data"] = [
	{
		blockTitle: "Model & Data",
		segmentData: [
			{
				description:
					"The foundational AI on which further training and customizations are built.",
				segmentTitle: "Base Model",
				value: "Haiku 3, Sonnet 3.7",
				valueDescription:
					"Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs).",
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
					"The model uses chat transcripts and information requested from the Canvas API to execute its actions.",
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
					"Chat logs are retained indefinitely for troubleshooting and debugging.",
			},
			{
				description:
					"Recording the AI's performance for auditing, analysis, and improvement.",
				segmentTitle: "Data Logging",
				value: "Logs data",
				valueDescription:
					"Chat logs are retained for troubleshooting and debugging purposes.",
			},
			{
				description:
					"The locations where the AI model is officially available and supported.",
				segmentTitle: "Regions Supported",
				value: "Virginia, Oregon",
				valueDescription: "",
			},
			{
				description:
					"Sensitive data that can be used to identify an individual.",
				segmentTitle: "PII",
				value: "Exposed",
				valueDescription:
					"If requested during the the chat, user, course, and student identifiers or metadata may be shared with the model.",
			},
		],
	},
	{
		blockTitle: "Outputs",
		segmentData: [
			{
				description: "The ability to turn the AI on or off within the product.",
				segmentTitle: "AI Settings Control",
				value: "Yes",
			},
			{
				description:
					"Indicates if a human is involved in the AI's process or output.",
				segmentTitle: "Human in the Loop",
				value: "Yes",
				valueDescription:
					"The agent only takes action based on human requests, and all write actions must be confirmed by the user.",
			},
			{
				description:
					"Preventative safety mechanisms or limitations built into the AI model.",
				segmentTitle: "Guardrails",
				value:
					"Access to the agent is limited to users with an Admin- or Teacher-based role. Data access and functions are scoped to the permissions available to the chat user.",
			},
			{
				description: "Any risks the model may pose to the user.",
				segmentTitle: "Expected Risks",
				value:
					"The model may misinterpret user requests and require additional prompting.",
			},
			{
				description: "The specific results the AI model is meant to achieve.",
				segmentTitle: "Intended Outcomes",
				value:
					"Users are able to save time by relying on the Agent to execute complex workflows, batch actions, and other time-consuming Canvas tasks.",
			},
		],
	},
];
const nutritionFacts: NutritionFactsProps = {
	
		closeButtonText: "Close", closeIconButtonScreenReaderLabel: "Close", data: undefined, data: NUTRITION_FACTS_DATA, featureName: "Agent", featureName: FEATURE_NAME, modalLabel: "This is a modal for AI facts", title: "AI Nutrition Facts", triggerText: "Nutrition Facts",
};
const dataPermissionLevels: DataPermissionLevelsProps = {
	
		closeButtonText: "Close", closeIconButtonScreenReaderLabel: "Close dialog", currentFeature: "Agent", currentFeature: FEATURE_NAME, currentFeatureText: "Current Feature:", data: undefined, data: DATA_PERMISSION_LEVELS, modalLabel: "Data Permission Levels modal", title: "Data Permission Levels", triggerText: "Data Permission Levels",
};
const aiInformation: AiInformationProps = {
	
		data: [
			{
				description:
					"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.", featureName: "Agent", modelName: "Haiku 3, Sonnet 3.7", modelNameText: "Base Model", nutritionFactsModalTriggerText: "AI Nutrition Facts", permissionLevel: "LEVEL 2", permissionLevelText: "Permission Level:", permissionLevelsModalTriggerText: "Data Permission Levels",
			},
		], dataPermissionLevelsCloseButtonText: "Close", dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog", dataPermissionLevelsCurrentFeature: "Agent", dataPermissionLevelsCurrentFeatureText: "Current Feature:", dataPermissionLevelsData: undefined, dataPermissionLevelsData: DATA_PERMISSION_LEVELS, dataPermissionLevelsModalLabel: "Data Permission Levels modal", dataPermissionLevelsTitle: "Data Permission Levels", nutritionFactsCloseButtonText: "Close", nutritionFactsCloseIconButtonScreenReaderLabel: "Close", nutritionFactsData: undefined, nutritionFactsData: NUTRITION_FACTS_DATA, nutritionFactsFeatureName: "Agent", nutritionFactsModalLabel: "This is a modal for AI facts", nutritionFactsTitle: "AI Nutrition Facts", title: "Features", trigger: undefined, trigger: undefined,
};
const igniteagent: AiInfoFeatureProps = {
	aiInformation,
	dataPermissionLevels,
	description:
		"Ignite Agent is a faculty chat assistant capable of translating natural language requests into complex Canvas workflows.",
	group: "IgniteAI",
	name: FEATURE_NAME,
	nutritionFacts,
	revision: "2025.09.10",
	uid: UID,
};
export { igniteagent, nutritionFacts, dataPermissionLevels, aiInformation };
export default igniteagent;
