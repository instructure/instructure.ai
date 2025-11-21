import type {
  AiInformationProps,
  DataPermissionLevelsProps,
  NutritionFactsProps,
} from "@instructure/ui-instructure";
import type { AiInfoFeatureProps } from "../../types";
const FEATURE_NAME = "Translations for Inbox";
const UID = "canvasinboxtranslation";
const DATA_PERMISSION_LEVELS: DataPermissionLevelsProps["data"] = [
  {
    description:
      "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research",
    highlighted: false,
  },
  {
    description:
      "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training",
    highlighted: true,
  },
  {
    description:
      "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions",
    highlighted: false,
  },
  {
    description:
      "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    level: "LEVEL 4",
    title: "Collaborative AI Consortium",
    highlighted: false,
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
        value: "AWS Translate",
        valueDescription:
          "AWS Translate model is provided via Instructure's in-house AI Platform.",
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
        value: "Inbox messages",
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
          "PII in inbox messages may be sent to the model but no PII is intentionally sent to the model.",
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
          "Users are displayed the translated copy of their message and can edit or remove it before they send the message.",
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
          "Machine translation may not fully capture the meaning of the original message.",
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value:
          "Enable better multi-lingual communication in learning environments.",
      },
    ],
  },
];
const nutritionFacts: NutritionFactsProps = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: NUTRITION_FACTS_DATA,
  featureName: FEATURE_NAME,
};
const dataPermissionLevels: DataPermissionLevelsProps = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeatureText: "Current Feature:",
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  data: DATA_PERMISSION_LEVELS,
  currentFeature: FEATURE_NAME,
};
const aiInformation: AiInformationProps = {
  data: [
    {
      description:
        "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Translations for Inbox",
      modelName: "AWS Translate",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelText: "Permission Level:",
      permissionLevelsModalTriggerText: "Data Permission Levels",
    },
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  dataPermissionLevelsCurrentFeature: "Translations for Inbox",
  nutritionFactsFeatureName: "Translations for Inbox",
  dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
  nutritionFactsData: NUTRITION_FACTS_DATA,
  trigger: undefined,
};
const canvasinboxtranslation: AiInfoFeatureProps = {
  aiInformation,
  dataPermissionLevels,
  nutritionFacts,
  revision: "2025.09.10",
  uid: UID,
  group: "Canvas",
  name: FEATURE_NAME,
  description:
    'Translation of inbox messages ("Inbox AI Translation" feature flag) across 10 languages.',
};
export {
  canvasinboxtranslation,
  nutritionFacts,
  dataPermissionLevels,
  aiInformation,
};
export default canvasinboxtranslation;
