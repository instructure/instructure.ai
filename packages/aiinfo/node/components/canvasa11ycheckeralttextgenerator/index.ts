import {
  type AiInformationProps,
  type DataPermissionLevelsProps,
  type NutritionFactsProps,
} from "@instructure/ui-instructure";
import { type AiInfoFeatureProps } from "../../types";
const FEATURE_NAME = "Course Accessibility Checker: Image alt text generation";
const UID = "canvasa11ycheckeralttextgenerator";
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
        value: "Images uploaded to Canvas via RCX",
      },
    ],
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Data is not stored or reused by the model.",
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: "Usage data is logged to improve the product.",
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
          "PII in source material may be sent to the model if included in the analyzed image, but no PII is intentionally sent to the model.",
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
          "Users can edit the generated alt text, and they have the option to save it or not.",
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "",
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value:
          "While the model can fairly accurately describe what's on a picture, it might not always convey what the picture is meant to convey in the given context. ",
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Reduce time spent on writing alt text. ",
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
		featureName: 'Course Accessibility Checker: Image alt text generation',
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
	dataPermissionLevelsCurrentFeature: 'Course Accessibility Checker: Image alt text generation',
	dataPermissionLevelsCurrentFeatureText: 'Current Feature:',
	dataPermissionLevelsModalLabel: 'Data Permission Levels modal',
	dataPermissionLevelsTitle: 'Data Permission Levels',
	nutritionFactsCloseButtonText: 'Close',
	nutritionFactsCloseIconButtonScreenReaderLabel: 'Close',
	nutritionFactsFeatureName: 'Course Accessibility Checker: Image alt text generation',
	nutritionFactsModalLabel: 'This is a modal for AI facts',
	nutritionFactsTitle: 'AI Nutrition Facts',
	title: 'Features',
	dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
	nutritionFactsData: NUTRITION_FACTS_DATA,
	trigger: undefined
});
const canvasa11ycheckeralttextgenerator: AiInfoFeatureProps = {
  aiInformation,
  dataPermissionLevels,
  description:
    "A button that generates alt text for images that don't have alt text, or there was a problem identified with it (it's too long or it's just the filename.)",
  group: "Canvas",
  name: FEATURE_NAME,
  nutritionFacts,
  revision: "2026.02.25",
  uid: UID,
};
export { canvasa11ycheckeralttextgenerator, nutritionFacts, dataPermissionLevels, aiInformation };
export default canvasa11ycheckeralttextgenerator;
