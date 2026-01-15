import {
  type AiInformationProps,
  type DataPermissionLevelsProps,
  type NutritionFactsProps,
} from "@instructure/ui-instructure";
import { type AiInfoFeatureProps } from "../../types";
const FEATURE_NAME = "Portfolios";
const UID = "portfolios";
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
        value: "Haiku 3",
        valueDescription:
          "Anthropic Claude models are provided via Instructure's in-house AI Platform.",
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
        value:
          "Custom instructions that teachers provide in their Evaluation portfolios for students.",
      },
    ],
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Data is not stored or re-used by the model.",
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription:
          "Model evaluations and reply labels are logged for debugging and troubleshooting purposes.",
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
        valueDescription: "",
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
          "Teachers provide the input of the model (content) and the response by the model is not auto accepted. Teachers have the chance to modify the result every occasion.",
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value:
          "Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection built in for extra security.",
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value:
          "LLM might suggest not the right questions or skills, or not an improved instruction to the user's liking.",
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value:
          "A user-friendly tool for a safe writing assistant, and features to speed up administrative work, and provide more reliable portfolios for students to work with.",
      },
    ],
  },
];
const nutritionFacts: NutritionFactsProps = ({
	closeButtonText: 'Close',
	closeIconButtonScreenReaderLabel: 'Close',
	featureName: FEATURE_NAME,
	modalLabel: 'This is a modal for AI facts',
	title: 'AI Nutrition Facts',
	triggerText: 'Nutrition Facts',
	data: NUTRITION_FACTS_DATA
});
const dataPermissionLevels: DataPermissionLevelsProps = ({
	closeButtonText: 'Close',
	closeIconButtonScreenReaderLabel: 'Close dialog',
	currentFeature: FEATURE_NAME,
	currentFeatureText: 'Current Feature:',
	modalLabel: 'Data Permission Levels modal',
	title: 'Data Permission Levels',
	triggerText: 'Data Permission Levels',
	data: DATA_PERMISSION_LEVELS
});
const aiInformation: AiInformationProps = ({
	data: [{
		description: 'We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.',
		featureName: 'Portfolios',
		modelName: 'Haiku 3',
		modelNameText: 'Base Model',
		nutritionFactsModalTriggerText: 'AI Nutrition Facts',
		permissionLevel: 'LEVEL 2',
		permissionLevelsModalTriggerText: 'Data Permission Levels',
		permissionLevelText: 'Permission Level:',
		privacyNoticeText: '',
		privacyNoticeUrl: ''
	}],
	dataPermissionLevelsCloseButtonText: 'Close',
	dataPermissionLevelsCloseIconButtonScreenReaderLabel: 'Close dialog',
	dataPermissionLevelsCurrentFeature: 'Portfolios',
	dataPermissionLevelsCurrentFeatureText: 'Current Feature:',
	dataPermissionLevelsModalLabel: 'Data Permission Levels modal',
	dataPermissionLevelsTitle: 'Data Permission Levels',
	nutritionFactsCloseButtonText: 'Close',
	nutritionFactsCloseIconButtonScreenReaderLabel: 'Close',
	nutritionFactsFeatureName: 'Portfolios',
	nutritionFactsModalLabel: 'This is a modal for AI facts',
	nutritionFactsTitle: 'AI Nutrition Facts',
	title: 'Features',
	dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
	nutritionFactsData: NUTRITION_FACTS_DATA,
	trigger: undefined
});
const portfolios: AiInfoFeatureProps = {
  aiInformation,
  dataPermissionLevels,
  description:
    "AI Assistant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation.",
  group: "Canvas",
  name: FEATURE_NAME,
  nutritionFacts,
  revision: "2025.10.27",
  uid: UID,
};
export { portfolios, nutritionFacts, dataPermissionLevels, aiInformation };
export default portfolios;
