import type {
	AiInformationProps,
	DataPermissionLevelsProps,
	NutritionFactsProps,
	AiInfoFeatureProps,
} from "../../types";

const FEATURE_NAME = "Skill Recommendation for Badges";
const UID = "pdbsmartskillextractor";

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
				description: "The foundational AI on which further training and customizations are built.",
				segmentTitle: "Base Model",
				value: "Cohere Embed Multilingual",
				valueDescription: "Cohere models are provided via Instructure's in-house AI Platform.",
			},
			{
				description:
					"Indicates the AI model has been given customer data in order to improve its results.",
				segmentTitle: "Trained with User Data",
				value: "No",
			},
			{
				description: "Indicates which training or operational content was given to the model.",
				segmentTitle: "Data Shared with Model",
				value: "Badge name, Badge description, Earning Criteria text.",
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
					"Data is not stored in or reused by the model. Badge name, Badge description, Earning Criteria text used, and the skill selection and rejection of the user and any feedback the user gave are stored for quality assurance purposes until the next Talent Neuron Refresh, typically 3 months, no more than 6 months.",
			},
			{
				description: "Recording the AI's performance for auditing, analysis, and improvement.",
				segmentTitle: "Data Logging",
				value: "Logs data",
				valueDescription:
					"Logs request metadata: user ID, organization, client IP, user agent, URL, status, feature, and duration. Plus the first 100 characters of the badge metadata (name, description, earning criteria).",
			},
			{
				description: "The locations where the AI model is officially available and supported.",
				segmentTitle: "Regions Supported",
				value: "Global",
				valueDescription: "",
			},
			{
				description: "Sensitive data that can be used to identify an individual.",
				segmentTitle: "PII",
				value: "Not Exposed",
				valueDescription:
					"Badge text fields normally doesn't contain PII. If a staff user mistakenly enters PII in the Badge text fields, then PII is sent to the model.",
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
				description: "Indicates if a human is involved in the AI's process or output.",
				segmentTitle: "Human in the Loop",
				value: "Yes",
				valueDescription:
					"Recommended Skills are not automatically added, the user can decide to add any of them or ignore them.",
			},
			{
				description: "Preventative safety mechanisms or limitations built into the AI model.",
				segmentTitle: "Guardrails",
				value:
					"This is an embedding model, not an LLM, there is no conversation, the sole output of the model is a search vector that is then used to be compared to search vectors of the Talent Neuron skills by software, not the AI. The user only see a selection of skills from the closed set of available Talent Neuron Skills. ",
			},
			{
				description: "Any risks the model may pose to the user.",
				segmentTitle: "Expected Risks",
				value:
					"The skills recommended are not matching very well to the badge. Risk is high if the badge text entered by the user is not accurate or very short.",
			},
			{
				description: "The specific results the AI model is meant to achieve.",
				segmentTitle: "Intended Outcomes",
				value:
					"Users get help to find the right skills for their new Badges faster with this semantic search, than when they search only by skill name or category.",
			},
		],
	},
];

const nutritionFacts: NutritionFactsProps = {
	closeButtonText: "Close",
	closeIconButtonScreenReaderLabel: "Close",
	data: NUTRITION_FACTS_DATA,
	featureName: FEATURE_NAME,
	modalLabel: "This is a modal for AI facts",
	title: "AI Nutrition Facts",
	triggerText: "Nutrition Facts",
};

const dataPermissionLevels: DataPermissionLevelsProps = {
	closeButtonText: "Close",
	closeIconButtonScreenReaderLabel: "Close dialog",
	currentFeature: FEATURE_NAME,
	currentFeatureText: "Current Feature:",
	data: DATA_PERMISSION_LEVELS,
	modalLabel: "Data Permission Levels modal",
	title: "Data Permission Levels",
	triggerText: "Data Permission Levels",
};

const aiInformation: AiInformationProps = {
	data: [
		{
			description:
				"We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
			featureName: "Skill Recommendation for Badges",
			modelName: "Cohere Embed Multilingual",
			modelNameText: "Base Model",
			nutritionFactsModalTriggerText: "AI Nutrition Facts",
			permissionLevel: "LEVEL 2",
			permissionLevelsModalTriggerText: "Data Permission Levels",
			permissionLevelText: "Permission Level:",
			privacyNoticeText: "",
			privacyNoticeUrl: "",
		},
	],
	dataPermissionLevelsCloseButtonText: "Close",
	dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
	dataPermissionLevelsCurrentFeature: "Skill Recommendation for Badges",
	dataPermissionLevelsCurrentFeatureText: "Current Feature:",
	dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
	dataPermissionLevelsModalLabel: "Data Permission Levels modal",
	dataPermissionLevelsTitle: "Data Permission Levels",
	nutritionFactsCloseButtonText: "Close",
	nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
	nutritionFactsData: NUTRITION_FACTS_DATA,
	nutritionFactsFeatureName: "Skill Recommendation for Badges",
	nutritionFactsModalLabel: "This is a modal for AI facts",
	nutritionFactsTitle: "AI Nutrition Facts",
	title: "Features",
	trigger: undefined,
};

const pdbsmartskillextractor: AiInfoFeatureProps = {
	aiInformation,
	dataPermissionLevels,
	description:
		"During Badge Creation in PDB, users can request AI to recommend skills that match the Badge text entered by the user. Recommended skills are chosen from the Talent Neuron skill set.",
	group: "Parchment",
	name: FEATURE_NAME,
	nutritionFacts,
	revision: "2026.10.27",
	uid: UID,
};

export default pdbsmartskillextractor;
