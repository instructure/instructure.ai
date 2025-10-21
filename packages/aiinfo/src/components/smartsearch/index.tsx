import { Button } from "@instructure/ui";
import type { AiInformationProps, DataPermissionLevelsProps, NutritionFactsProps, } from "@instructure/ui";
import type { AiInfoFeatureProps } from "../../types";
const FEATURE_NAME = "Smart Search";
const UID = "smartsearch";
const DATA_PERMISSION_LEVELS: DataPermissionLevelsProps["data"] = [{ description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.", level: "LEVEL 1", title: "Descriptive Analytics and Research", highlighted: false }, { description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.", level: "LEVEL 2", title: "AI-Powered Features Without Data Training", highlighted: true }, { description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.", level: "LEVEL 3", title: "AI Customization for Individual Institutions", highlighted: false }, { description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.", level: "LEVEL 4", title: "Collaborative AI Consortium", highlighted: false }];
const NUTRITION_FACTS_DATA: NutritionFactsProps["data"] = [{ blockTitle: "Model & Data", segmentData: [{ segmentTitle: "Base Model", description: "The foundational AI on which further training and customizations are built.", value: "Cohere Embed Multilingual", valueDescription: "Cohere models are provided via Amazon Bedrock Foundation Models (FMs)." }, { segmentTitle: "Trained with User Data", description: "Indicates the AI model has been given customer data in order to improve its results.", value: "No" }, { segmentTitle: "Data Shared with Model", description: "Indicates which training or operational content was given to the model.", value: "Course content is indexed by the model and then stored in the Canvas database." }] }, { blockTitle: "Privacy & Compliance", segmentData: [{ segmentTitle: "Data Retention", description: "How long the model stores customer data.", value: "Data is not stored or reused by the model. Indexed course content is stored in the Canvas database." }, { segmentTitle: "Data Logging", description: "Recording the AI's performance for auditing, analysis, and improvement.", value: "Does not log data", valueDescription: "" }, { segmentTitle: "Regions Supported", description: "The locations where the AI model is officially available and supported.", value: "Global", valueDescription: "" }, { segmentTitle: "PII", description: "Sensitive data that can be used to identify an individual.", value: "Not Exposed", valueDescription: "PII in course content may be indexed, but no PII is intentionally sent to the model." }] }, { blockTitle: "Outputs", segmentData: [{ segmentTitle: "AI Settings Control", description: "The ability to turn the AI on or off within the product.", value: "Yes" }, { segmentTitle: "Human in the Loop", description: "Indicates if a human is involved in the AI's process or output.", value: "Yes", valueDescription: "Users are presented with a list of results related to their search query and can act or not act on them." }, { segmentTitle: "Guardrails", description: "Preventative safety mechanisms or limitations built into the AI model.", value: "" }, { segmentTitle: "Expected Risks", description: "Any risks the model may pose to the user.", value: "Search results may be incorrectly sorted or may not be relevant to the search term." }, { segmentTitle: "Intended Outcomes", description: "The specific results the AI model is meant to achieve.", value: "Students are able to quickly find answers to questions, and instructors are able to quickly navigate their courses." }] }];
const nutritionFacts: NutritionFactsProps = {
    ...{ closeButtonText: "Close", closeIconButtonScreenReaderLabel: "Close", data: undefined, featureName: "Smart Search", modalLabel: "This is a modal for AI facts", title: "AI Nutrition Facts", triggerText: "Nutrition Facts" },
    data: NUTRITION_FACTS_DATA,
    featureName: FEATURE_NAME,
};
const dataPermissionLevels: DataPermissionLevelsProps = {
    ...{ closeButtonText: "Close", closeIconButtonScreenReaderLabel: "Close dialog", currentFeatureText: "Current Feature:", data: undefined, modalLabel: "Data Permission Levels modal", title: "Data Permission Levels", triggerText: "Data Permission Levels", currentFeature: "Smart Search" },
    data: DATA_PERMISSION_LEVELS,
    currentFeature: FEATURE_NAME,
};
const aiInformation: AiInformationProps = {
    ...{ title: "Features", trigger: undefined, data: [{ description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.", featureName: "Smart Search", modelName: "Cohere Embed Multilingual", modelNameText: "Base Model", nutritionFactsModalTriggerText: "AI Nutrition Facts", permissionLevel: "LEVEL 2", permissionLevelsModalTriggerText: "Data Permission Levels", permissionLevelText: "Permission Level:" }], dataPermissionLevelsTitle: "Data Permission Levels", dataPermissionLevelsCurrentFeatureText: "Current Feature:", dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog", dataPermissionLevelsCloseButtonText: "Close", dataPermissionLevelsModalLabel: "Data Permission Levels modal", nutritionFactsModalLabel: "This is a modal for AI facts", nutritionFactsTitle: "AI Nutrition Facts", nutritionFactsCloseButtonText: "Close", nutritionFactsCloseIconButtonScreenReaderLabel: "Close", dataPermissionLevelsCurrentFeature: "Smart Search", dataPermissionLevelsData: undefined, nutritionFactsData: undefined, nutritionFactsFeatureName: "Smart Search" },
    dataPermissionLevelsData: DATA_PERMISSION_LEVELS,
    nutritionFactsData: NUTRITION_FACTS_DATA,
    trigger: <Button>AI Information</Button>,
};
const smartsearch: AiInfoFeatureProps = {
    aiInformation,
    dataPermissionLevels,
    nutritionFacts,
    revision: "2025.10.02",
    uid: UID,
    group: "Canvas",
    name: FEATURE_NAME,
    description: "Natural language search of course content for students and instructors.",
};
export { smartsearch, nutritionFacts, dataPermissionLevels, aiInformation, };
export default smartsearch;
