import { Button } from "@instructure/ui";
import type { AiInformationProps, DataPermissionLevelsProps, NutritionFactsProps, } from "@instructure/ui";
import type { AiInfoFeatureProps } from "../../types";
const FEATURE_NAME = "Agent";
const UID = "igniteagent";
const DATA_PERMISSION_LEVELS: DataPermissionLevelsProps["data"] = [{ description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.", level: "LEVEL 1", title: "Descriptive Analytics and Research", highlighted: false }, { description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.", level: "LEVEL 2", title: "AI-Powered Features Without Data Training", highlighted: true }, { description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.", level: "LEVEL 3", title: "AI Customization for Individual Institutions", highlighted: false }, { description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.", level: "LEVEL 4", title: "Collaborative AI Consortium", highlighted: false }];
const NUTRITION_FACTS_DATA: NutritionFactsProps["data"] = [{ blockTitle: "Model & Data", segmentData: [{ segmentTitle: "Base Model", description: "The foundational AI on which further training and customizations are built.", value: "Haiku 3.5, Sonnet 3.5", valueDescription: "Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs)." }, { segmentTitle: "Trained with User Data", description: "Indicates the AI model has been given customer data in order to improve its results.", value: "No" }, { segmentTitle: "Data Shared with Model", description: "Indicates which training or operational content was given to the model.", value: "The model uses chat transcripts and information requested from the Canvas API to execute its actions." }] }, { blockTitle: "Privacy & Compliance", segmentData: [{ segmentTitle: "Data Retention", description: "How long the model stores customer data.", value: "Chat logs are retained indefinitely for troubleshooting and debugging." }, { segmentTitle: "Data Logging", description: "Recording the AI's performance for auditing, analysis, and improvement.", value: "Logs data", valueDescription: "Chat logs are retained for troubleshooting and debugging purposes." }, { segmentTitle: "Regions Supported", description: "The locations where the AI model is officially available and supported.", value: "Virginia, Oregon", valueDescription: "" }, { segmentTitle: "PII", description: "Sensitive data that can be used to identify an individual.", value: "Exposed", valueDescription: "If requested during the the chat, user, course, and student identifiers or metadata may be shared with the model." }] }, { blockTitle: "Outputs", segmentData: [{ segmentTitle: "AI Settings Control", description: "The ability to turn the AI on or off within the product.", value: "Yes" }, { segmentTitle: "Human in the Loop", description: "Indicates if a human is involved in the AI's process or output.", value: "Yes", valueDescription: "The agent only takes action based on human requests, and all write actions must be confirmed by the user." }, { segmentTitle: "Guardrails", description: "Preventative safety mechanisms or limitations built into the AI model.", value: "Access to the agent is limited to users with an Admin- or Teacher-based role. Data access and functions are scoped to the permissions available to the chat user." }, { segmentTitle: "Expected Risks", description: "Any risks the model may pose to the user.", value: "The model may misinterpret user requests and require additional prompting." }, { segmentTitle: "Intended Outcomes", description: "The specific results the AI model is meant to achieve.", value: "Users are able to save time by relying on the Agent to execute complex workflows, batch actions, and other time-consuming Canvas tasks." }] }];
const nutritionFacts: NutritionFactsProps = {
    ...{ closeButtonText: "Close", closeIconButtonScreenReaderLabel: "Close", data: undefined, featureName: "Agent", modalLabel: "This is a modal for AI facts", title: "AI Nutrition Facts", triggerText: "Nutrition Facts" },
    data: NUTRITION_FACTS_DATA,
    featureName: FEATURE_NAME,
};
const dataPermissionLevels: DataPermissionLevelsProps = {
    ...{ closeButtonText: "Close", closeIconButtonScreenReaderLabel: "Close dialog", currentFeatureText: "Current Feature:", data: undefined, modalLabel: "Data Permission Levels modal", title: "Data Permission Levels", triggerText: "Data Permission Levels", currentFeature: "Agent" },
    data: DATA_PERMISSION_LEVELS,
    currentFeature: FEATURE_NAME,
};
const aiInformation: AiInformationProps = {
    ...{ title: "Features", trigger: undefined, data: [{ description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.", featureName: "Agent", modelName: "Haiku 3.5, Sonnet 3.5", modelNameText: "Base Model", nutritionFactsModalTriggerText: "AI Nutrition Facts", permissionLevel: "LEVEL 2", permissionLevelsModalTriggerText: "Data Permission Levels", permissionLevelText: "Permission Level:" }], dataPermissionLevelsTitle: "Data Permission Levels", dataPermissionLevelsCurrentFeatureText: "Current Feature:", dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog", dataPermissionLevelsCloseButtonText: "Close", dataPermissionLevelsModalLabel: "Data Permission Levels modal", nutritionFactsModalLabel: "This is a modal for AI facts", nutritionFactsTitle: "AI Nutrition Facts", nutritionFactsCloseButtonText: "Close", nutritionFactsCloseIconButtonScreenReaderLabel: "Close", dataPermissionLevelsCurrentFeature: "Agent", dataPermissionLevelsData: undefined, nutritionFactsData: undefined, nutritionFactsFeatureName: "Agent" },
    dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
    nutritionFactsData: NUTRITION_FACTS_DATA,
    trigger: <Button>AI Information</Button>,
};
const igniteagent: AiInfoFeatureProps = {
    aiInformation,
    dataPermissionLevels,
    nutritionFacts,
    revision: "2025.09.10",
    uid: UID,
    group: "IgniteAI",
    name: FEATURE_NAME,
    description: "Ignite Agent is a faculty chat assistant capable of translating natural language requests into complex Canvas workflows.",
};
export { igniteagent, nutritionFacts, dataPermissionLevels, aiInformation, };
export default igniteagent;
