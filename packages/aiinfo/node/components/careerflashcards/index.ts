import {
  type AiInfoFeatureProps,
  type AiInformationProps,
  type DataPermissionLevelsProps,
  type NutritionFactsProps,
} from "../../types";
const FEATURE_NAME = "Flashcards";
const UID = "careerflashcards";
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
        value: "Haiku 4.5",
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
        value: "The page body or file the learner is viewing.",
      },
    ],
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "",
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription:
          "Logs request metadata only: account, user ID, feature, and duration. Journey doesn't log prompts or responses.",
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
          "The model doesn't get names or emails. Pseudonymous IDs go to the AI gateway only.",
      },
    ],
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "No",
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription:
          "Learners flip through the cards and can regenerate them. Nothing is saved.",
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value:
          "Fixed prompt. Output must be valid JSON, capped at 20 cards. Canvas permissions limit what content the model sees. Rate limits apply.",
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "Cards may be inaccurate or miss key points. Verify before studying.",
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Help learners review course material.",
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
      featureName: "Flashcards",
      modelName: "Haiku 4.5",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelText: "Permission Level:",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      privacyNoticeText: "",
      privacyNoticeUrl: "",
    },
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Flashcards",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: NUTRITION_FACTS_DATA,
  nutritionFactsFeatureName: "Flashcards",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: undefined,
};
const careerflashcards: AiInfoFeatureProps = {
  aiInformation,
  dataPermissionLevels,
  description:
    "Creates up to 20 question-and-answer flashcards from the page or file a learner is viewing.",
  group: "Canvas Career",
  name: FEATURE_NAME,
  nutritionFacts,
  revision: "2026.09.30",
  uid: UID,
};
export default careerflashcards;
