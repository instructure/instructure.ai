import { Button } from "@instructure/ui-buttons";
import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
} from "@instructure/ui-instructure";
import type { AiInfoFeatureProps } from "../../types";

const FEATURE_NAME = "Ask Your Data";
const UID = "askyourdata";
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
				value: "Doowii (multiple)",
				valueDescription:
					"Doowii is a third-party sub-processor for Intelligent Insights. Doowii's tools use OpenAI GPT-4o, GPT-3.5 Turbo, and Claude Sonnet 3.5",
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
					"Doowii is trained on the Canvas LMS database schema, and receives no data from Canvas. The user's prompt and heuristics (such as summary statistics) are shared with the model to generate a response.",
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
					"Data is retained through the life of your contract with Instructure.",
			},
			{
				description:
					"Recording the AI's performance for auditing, analysis, and improvement.",
				segmentTitle: "Data Logging",
				value: "Logs data",
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
				value: "Exposed",
				valueDescription: "Prompt, summary statistics.",
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
					"Ask your data returns a methodology description along with a generated query. Users have the ability to edit the generated SQL directly.",
			},
			{
				description:
					"Preventative safety mechanisms or limitations built into the AI model.",
				segmentTitle: "Guardrails",
				value:
					"Questions are scoped to the domain only, highly ambiguous terms ask for clarification.",
			},
			{
				description: "Any risks the model may pose to the user.",
				segmentTitle: "Expected Risks",
				value:
					"Incorrect interpretation of the question. Inaccurate SQL may be generated. Suggested questions or methodologies may not be relevant.",
			},
			{
				description: "The specific results the AI model is meant to achieve.",
				segmentTitle: "Intended Outcomes",
				value:
					"Provide accurate data retrieval and analysis through natural language prompting.",
			},
		],
	},
];
const nutritionFacts: NutritionFactsProps = {
	...{
		closeButtonText: "Close",
		closeIconButtonScreenReaderLabel: "Close",
		data: undefined,
		featureName: "Ask Your Data",
		modalLabel: "This is a modal for AI facts",
		title: "AI Nutrition Facts",
		triggerText: "Nutrition Facts",
	},
	data: NUTRITION_FACTS_DATA,
	featureName: FEATURE_NAME,
};
const dataPermissionLevels: DataPermissionLevelsProps = {
	...{
		closeButtonText: "Close",
		closeIconButtonScreenReaderLabel: "Close dialog",
		currentFeature: "Ask Your Data",
		currentFeatureText: "Current Feature:",
		data: undefined,
		modalLabel: "Data Permission Levels modal",
		title: "Data Permission Levels",
		triggerText: "Data Permission Levels",
	},
	currentFeature: FEATURE_NAME,
	data: DATA_PERMISSION_LEVELS,
};
const aiInformation: AiInformationProps = {
	...{
		data: [
			{
				description:
					"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
				featureName: "Ask Your Data",
				modelName: "Doowii (multiple)",
				modelNameText: "Base Model",
				nutritionFactsModalTriggerText: "AI Nutrition Facts",
				permissionLevel: "LEVEL 2",
				permissionLevelsModalTriggerText: "Data Permission Levels",
				permissionLevelText: "Permission Level:",
			},
		],
		dataPermissionLevelsCloseButtonText: "Close",
		dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
		dataPermissionLevelsCurrentFeature: "Ask Your Data",
		dataPermissionLevelsCurrentFeatureText: "Current Feature:",
		dataPermissionLevelsData: undefined,
		dataPermissionLevelsModalLabel: "Data Permission Levels modal",
		dataPermissionLevelsTitle: "Data Permission Levels",
		nutritionFactsCloseButtonText: "Close",
		nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
		nutritionFactsData: undefined,
		nutritionFactsFeatureName: "Ask Your Data",
		nutritionFactsModalLabel: "This is a modal for AI facts",
		nutritionFactsTitle: "AI Nutrition Facts",
		title: "Features",
		trigger: undefined,
	},
	dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
	nutritionFactsData: NUTRITION_FACTS_DATA,
	trigger: <Button>AI Information</Button>,
};
const askyourdata: AiInfoFeatureProps = {
	aiInformation,
	dataPermissionLevels,
	group: "Intelligent Insights",
	nutritionFacts,
	revision: "2025.09.12",
	uid: UID,
};
export { askyourdata, nutritionFacts, dataPermissionLevels, aiInformation };
export default askyourdata;
