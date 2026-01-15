// Oxc-ignore-all assist/source/useSortedKeys: Required order for Strings

import { type NutritionFactsStrings } from "../types";

const strings: { en: NutritionFactsStrings } = {
  en: {
    closeButtonText: "Close",
    closeIconButtonScreenReaderLabel: "Close",
    data: [
      {
        blockTitle: "Model & Data",
        segmentData: [
          {
            description:
              "The foundational AI on which further training and customizations are built.",
            segmentTitle: "Base Model",
          },
          {
            description:
              "Indicates the AI model has been given customer data in order to improve its results.",
            segmentTitle: "Trained with User Data",
          },
          {
            description: "Indicates which training or operational content was given to the model.",
            segmentTitle: "Data Shared with Model",
          },
        ],
      },
      {
        blockTitle: "Privacy & Compliance",
        segmentData: [
          {
            description: "How long the model stores customer data.",
            segmentTitle: "Data Retention",
          },
          {
            description: "Recording the AI's performance for auditing, analysis, and improvement.",
            segmentTitle: "Data Logging",
          },
          {
            description: "The locations where the AI model is officially available and supported.",
            segmentTitle: "Regions Supported",
          },
          {
            description: "Sensitive data that can be used to identify an individual.",
            segmentTitle: "PII",
          },
        ],
      },
      {
        blockTitle: "Outputs",
        segmentData: [
          {
            description: "The ability to turn the AI on or off within the product.",
            segmentTitle: "AI Settings Control",
          },
          {
            description: "Indicates if a human is involved in the AI's process or output.",
            segmentTitle: "Human in the Loop",
          },
          {
            description: "Preventative safety mechanisms or limitations built into the AI model.",
            segmentTitle: "Guardrails",
          },
          {
            description: "Any risks the model may pose to the user.",
            segmentTitle: "Expected Risks",
          },
          {
            description: "The specific results the AI model is meant to achieve.",
            segmentTitle: "Intended Outcomes",
          },
        ],
      },
    ],
    modalLabel: "This is a modal for AI facts",
    title: "AI Nutrition Facts",
    triggerText: "Nutrition Facts",
  },
};

export { strings };
