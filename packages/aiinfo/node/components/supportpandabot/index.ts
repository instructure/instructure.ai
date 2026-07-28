import type {
  AiInformationProps,
  DataPermissionLevelsProps,
  NutritionFactsProps,
  AiInfoFeatureProps,
} from "../../types";
const FEATURE_NAME = "Panda Bot";
const UID = "supportpandabot";
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
        value: "Ada CX Unified Reasoning Engine",
        valueDescription:
          "Orchestrates models from multiple providers — OpenAI (incl. GPT-4o) as primary, plus Anthropic, Microsoft Azure OpenAI Service, and Amazon Bedrock",
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
          "User's name, email, institution uuid, and Canvas role, plus up to 8 institution-specific KB articles",
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
          "Conversations remain in the conversations library for 6 months before becoming archived",
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription:
          "Conversations are logged; a select few individuals on the Panda Bot team have access. Transcripts are shared with a human agent if a conversation escalates",
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
        value: "Exposed",
        valueDescription: "Name, email, institution, and Canvas role",
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
          "Panda Bot cannot take action and instead provides guidance to user questions. Conversations that a user wishes to go to a human or that Panda Bot cannot solve can escalate to a human agent, who receives transcript as part of case details.",
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value:
          "Will not answer questions outside Instructure topics; will not assist with coursework (e.g., completing assignments or submissions)",
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value:
          "No access to the user's actual session or Site Admin data, cannot confirm/deny specific Canvas setup, relies on what the user reports",
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value:
          "Users get fast, accurate first-line support without needing to open a case, using Community Guides and institution-specific KB content",
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
      featureName: "Panda Bot",
      modelName: "Ada CX Unified Reasoning Engine",
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
  dataPermissionLevelsCurrentFeature: "Panda Bot",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: NUTRITION_FACTS_DATA,
  nutritionFactsFeatureName: "Panda Bot",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: undefined,
};
const supportpandabot: AiInfoFeatureProps = {
  aiInformation,
  dataPermissionLevels,
  description:
    "First-stop virtual assistant that helps support users, primarily using Community Guides and Tier 1 institution-specific KB articles",
  group: "Canvas",
  name: FEATURE_NAME,
  nutritionFacts,
  revision: "2026.07.08",
  uid: UID,
};
export default supportpandabot;
