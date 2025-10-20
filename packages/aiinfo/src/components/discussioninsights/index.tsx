import { Button } from "@instructure/ui-buttons";
import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
} from "@instructure/ui-instructure";
import type { AiInfoFeatureProps } from "../types";

const FEATURE_NAME = "Discussion Insights";
const UID = "discussioninsights";
const DATA_PERMISSION_LEVELS: DataPermissionLevelsProps["data"] = [
	{
		description:
			"We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
		highlighted: false,
		id: "L1",
		level: "LEVEL 1",
		title: "Descriptive Analytics and Research",
	},
	{
		description:
			"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
		highlighted: true,
		id: "L2",
		level: "LEVEL 2",
		title: "AI-Powered Features Without Data Training",
	},
	{
		description:
			"We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
		highlighted: false,
		id: "L3",
		level: "LEVEL 3",
		title: "AI Customization for Individual Institutions",
	},
	{
		description:
			"We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
		highlighted: false,
		id: "L4",
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
				value: "Haiku 3",
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
				value: "Discussion topic, prompt, and student replies are used.",
			},
		],
	},
	{
		blockTitle: "Privacy & Compliance",
		segmentData: [
			{
				description: "How long the model stores customer data.",
				segmentTitle: "Data Retention",
				value: "No user data is stored or reused by the model.",
			},
			{
				description:
					"Recording the AI's performance for auditing, analysis, and improvement.",
				segmentTitle: "Data Logging",
				value: "Logs data",
				valueDescription:
					"Model evaluations and reply labels are logged for debugging and troubleshooting purposes.",
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
				valueDescription:
					"Known PII is masked before being sent to the model, though any PII present in the discussion reply is not and may be shared with the model.",
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
					"Instructors may review AI-generated evaluations or review posts directly.",
			},
			{
				description:
					"Preventative safety mechanisms or limitations built into the AI model.",
				segmentTitle: "Guardrails",
				value:
					'Model responses are logged for quality assurance, and responses with low confidence are flagged "Needs Review" to encourage human intervention.',
			},
			{
				description: "Any risks the model may pose to the user.",
				segmentTitle: "Expected Risks",
				value: "The model may misclassify some nuanced replies.",
			},
			{
				description: "The specific results the AI model is meant to achieve.",
				segmentTitle: "Intended Outcomes",
				value:
					"Instructors are able to quickly assess the quality of student replies, identify low-effort or off-topic contributions, and focus their attention to where it is needed most.",
			},
		],
	},
];
const nutritionFacts: NutritionFactsProps = {
	...{
		closeButtonText: "Close",
		closeIconButtonScreenReaderLabel: "Close",
		data: undefined,
		featureName: "Discussion Insights",
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
		currentFeature: "Discussion Insights",
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
				featureName: "Discussion Insights",
				modelName: "Haiku 3",
				modelNameText: "Base Model",
				nutritionFactsModalTriggerText: "AI Nutrition Facts",
				permissionLevel: "LEVEL 2",
				permissionLevelsModalTriggerText: "Data Permission Levels",
				permissionLevelText: "Permission Level:",
			},
		],
		dataPermissionLevelsCloseButtonText: "Close",
		dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
		dataPermissionLevelsCurrentFeature: "Discussion Insights",
		dataPermissionLevelsCurrentFeatureText: "Current Feature:",
		dataPermissionLevelsData: undefined,
		dataPermissionLevelsModalLabel: "Data Permission Levels modal",
		dataPermissionLevelsTitle: "Data Permission Levels",
		nutritionFactsCloseButtonText: "Close",
		nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
		nutritionFactsData: undefined,
		nutritionFactsFeatureName: "Discussion Insights",
		nutritionFactsModalLabel: "This is a modal for AI facts",
		nutritionFactsTitle: "AI Nutrition Facts",
		title: "Features",
		trigger: undefined,
	},
	dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
	nutritionFactsData: NUTRITION_FACTS_DATA,
	trigger: <Button>AI Information</Button>,
};
const discussioninsights: AiInfoFeatureProps = {
	aiInformation,
	dataPermissionLevels,
	group: "Canvas",
	nutritionFacts,
	revision: "2025.10.02",
	uid: UID,
};
export {
	discussioninsights,
	nutritionFacts,
	dataPermissionLevels,
	aiInformation,
};
export default discussioninsights;
