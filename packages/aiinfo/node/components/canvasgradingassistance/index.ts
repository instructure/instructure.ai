import type {
  AiInformationProps,
  DataPermissionLevelsProps,
  NutritionFactsProps,
} from "@instructure/ui-instructure";
import type { AiInfoFeatureProps } from "../../types";
const FEATURE_NAME = "Grading Assistance";
const UID = "canvasgradingassistance";
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
        value: "Assignment information, rubric, and student submissions.",
      },
    ],
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Transactional data is retained for the life of the requestCanvas",
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription:
          "Complete response from the LLM is retained in the Canvas database for auditing purposes.",
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
          "No PII is intentionally sent to the model. If there is incidental PII in any of the shared data, such as in the submission body, it will be sent to the model.",
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
          "Grade suggestion is displayed and selected by default, but the instructor must make the final decision to edit or accept the suggestions.",
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "The Claude Haiku model has inherent guardrails built in.",
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value:
          "Grading Assistance does not flag unsafe content, verify facts or sources, enforce formatting or quantitative requirements, or reliably grade objective or single-answer questions. Results are based only on rubric criteria.",
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value:
          "Reduced bias in grading, fairness, and consistency. Grading efficiency, saving teachers time.",
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
		featureName: 'Grading Assistance',
		modelName: 'Haiku 3',
		modelNameText: 'Base Model',
		nutritionFactsModalTriggerText: 'AI Nutrition Facts',
		permissionLevel: 'LEVEL 2',
		permissionLevelsModalTriggerText: 'Data Permission Levels',
		permissionLevelText: 'Permission Level:'
	}],
	dataPermissionLevelsCloseButtonText: 'Close',
	dataPermissionLevelsCloseIconButtonScreenReaderLabel: 'Close dialog',
	dataPermissionLevelsCurrentFeature: 'Grading Assistance',
	dataPermissionLevelsCurrentFeatureText: 'Current Feature:',
	dataPermissionLevelsModalLabel: 'Data Permission Levels modal',
	dataPermissionLevelsTitle: 'Data Permission Levels',
	nutritionFactsCloseButtonText: 'Close',
	nutritionFactsCloseIconButtonScreenReaderLabel: 'Close',
	nutritionFactsFeatureName: 'Grading Assistance',
	nutritionFactsModalLabel: 'This is a modal for AI facts',
	nutritionFactsTitle: 'AI Nutrition Facts',
	title: 'Features',
	dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
	nutritionFactsData: NUTRITION_FACTS_DATA,
	trigger: undefined
});
const canvasgradingassistance: AiInfoFeatureProps = {
  aiInformation,
  dataPermissionLevels,
  description:
    "AI powered automatic grading and feedback suggestions to enable more consistent, fair, and efficient grading workflows.",
  group: "Canvas",
  name: FEATURE_NAME,
  nutritionFacts,
  revision: "2025.10.22",
  uid: UID,
};
export { canvasgradingassistance, nutritionFacts, dataPermissionLevels, aiInformation };
export default canvasgradingassistance;
