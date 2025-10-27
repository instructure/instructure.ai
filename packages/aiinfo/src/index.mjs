import { jsxDEV as e } from "react/jsx-dev-runtime";
import { Button as t } from "@instructure/ui";
const i = "Ask Your Data", U = "askyourdata", I = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], T = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Doowii (multiple)",
        valueDescription: "Doowii is a third-party sub-processor for Intelligent Insights. Doowii's tools use OpenAI GPT-4o, GPT-3.5 Turbo, and Claude Sonnet 3.5"
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Doowii is trained on the Canvas LMS database schema, and receives no data from Canvas. The user's prompt and heuristics (such as summary statistics) are shared with the model to generate a response."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Data is retained through the life of your contract with Instructure."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: ""
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Exposed",
        valueDescription: "Prompt, summary statistics."
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "Ask your data returns a methodology description along with a generated query. Users have the ability to edit the generated SQL directly."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "Questions are scoped to the domain only, highly ambiguous terms ask for clarification."
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "Incorrect interpretation of the question. Inaccurate SQL may be generated. Suggested questions or methodologies may not be relevant."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Provide accurate data retrieval and analysis through natural language prompting."
      }
    ]
  }
], _ = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Ask Your Data",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: T,
  featureName: i
}, O = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Ask Your Data",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: i,
  data: I
}, H = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Ask Your Data",
      modelName: "Doowii (multiple)",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Ask Your Data",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Ask Your Data",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: I,
  nutritionFactsData: T,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/askyourdata/index.tsx",
    lineNumber: 198,
    columnNumber: 11
  }, void 0)
}, Y = {
  aiInformation: H,
  dataPermissionLevels: O,
  description: "AI-powered query tool enables users to ask natural language questions and receive textual or visual responses with detailed explanations of the methodology.",
  group: "Intelligent Insights",
  name: i,
  nutritionFacts: _,
  revision: "2025.09.12",
  uid: U
}, a = "Block Content Editor Alt Text Generator", G = "bcealttext", L = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], A = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3",
        valueDescription: "Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs)."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Content Editor Images."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Model responses are stored for debugging purposes."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: "Request, response, and feedback data is logged to assist in troubleshooting."
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Not Exposed",
        valueDescription: ""
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "No"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "User initiated, User must confirm output."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: ""
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "Alt text might not always be accurate. "
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "An accessible Alt Text description of the image is generated."
      }
    ]
  }
], q = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Block Content Editor Alt Text Generator",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: A,
  featureName: a
}, Q = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Block Content Editor Alt Text Generator",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: a,
  data: L
}, K = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Block Content Editor Alt Text Generator",
      modelName: "Haiku 3",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Block Content Editor Alt Text Generator",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Block Content Editor Alt Text Generator",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: L,
  nutritionFactsData: A,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/bcealttext/index.tsx",
    lineNumber: 194,
    columnNumber: 11
  }, void 0)
}, j = {
  aiInformation: K,
  dataPermissionLevels: Q,
  description: "",
  group: "Canvas",
  name: a,
  nutritionFacts: q,
  revision: "2025.10.01",
  uid: G
}, s = "Discussions Translation", J = "canvascoursetranslation", b = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], D = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3",
        valueDescription: "Anthropic Claude models are provided via Instructure's in-house AI Platform."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Announcement and Discussion prompts and replies"
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Data is not stored or reused by the model."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Does not log data",
        valueDescription: ""
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Not Exposed",
        valueDescription: "PII in discussion replies may be sent to the model, but no PII is intentionally sent to the model."
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "Untranslated content is available to review translations against"
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: ""
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "Machine translation may not fully capture the meaning of the original message."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Improve participation for students who do not natively speak the language of instruction or other replies."
      }
    ]
  }
], X = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Discussions Translation",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: D,
  featureName: s
}, Z = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Discussions Translation",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: s,
  data: b
}, ee = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Discussions Translation",
      modelName: "Haiku 3",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Discussions Translation",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Discussions Translation",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: b,
  nutritionFactsData: D,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/canvascoursetranslation/index.tsx",
    lineNumber: 196,
    columnNumber: 11
  }, void 0)
}, te = {
  aiInformation: ee,
  dataPermissionLevels: Z,
  description: 'Translation of Discussion threads ("Course AI Translation" feature flag) across 10 languages.',
  group: "Canvas",
  name: s,
  nutritionFacts: X,
  revision: "2025.09.10",
  uid: J
}, o = "Discussion Summaries", ie = "canvasdiscussionsummaries", F = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], C = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3",
        valueDescription: "Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs)."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Discussion prompt and replies."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Data is not stored or reused by the model."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: "Summaries are logged in the Canvas database for review and reuse."
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Not Exposed",
        valueDescription: "Pii in discussion replies may be sent to the model, but no PII is intentionally sent to the model."
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "Instructors may regenerate summaries or fine-tune them with additional instructions."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: ""
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "Summaries may not capture all desired information."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Summaries allow discussion topics to be used in large-format courses and other environments where discussions were previously infeasible."
      }
    ]
  }
], ae = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Discussion Summaries",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: C,
  featureName: o
}, se = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Discussion Summaries",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: o,
  data: F
}, oe = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Discussion Summaries",
      modelName: "Haiku 3",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Discussion Summaries",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Discussion Summaries",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: F,
  nutritionFactsData: C,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/canvasdiscussionsummaries/index.tsx",
    lineNumber: 196,
    columnNumber: 11
  }, void 0)
}, ne = {
  aiInformation: oe,
  dataPermissionLevels: se,
  description: "Discussion summaries of key points, questions, and insights.",
  group: "Canvas",
  name: o,
  nutritionFacts: ae,
  revision: "2025.09.12",
  uid: ie
}, n = "Grading Assistance", re = "canvasgradingassistance", P = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], y = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3.5",
        valueDescription: "Anthropic Claude models are provided via Instructure's in-house AI Platform."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Assignment information, rubric, and student submissions."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Transactional data is retained for the life of the request"
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: "Complete response from the LLM is retained in the Canvas database for auditing purposes."
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Not Exposed",
        valueDescription: "No PII is intentionally sent to the model. If there is incidental PII in any of the shared data, such as in the submission body, it will be sent to the model."
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "Grade suggestion is displayed and selected by default, but the instructor much make the final decision to edit or accept the suggestions."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "The Claude Sonnet model has inherent guardrails built in."
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "Model may work better with certain kinds of assignment types or disciplines. The grader must remain alert to incorrect assumptions from the model."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Reduced bias in grading, fairness, and consistency. Grading efficiency, saving teachers time."
      }
    ]
  }
], le = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Grading Assistance",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: y,
  featureName: n
}, de = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Grading Assistance",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: n,
  data: P
}, ue = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Grading Assistance",
      modelName: "Haiku 3.5",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Grading Assistance",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Grading Assistance",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: P,
  nutritionFactsData: y,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/canvasgradingassistance/index.tsx",
    lineNumber: 197,
    columnNumber: 11
  }, void 0)
}, ce = {
  aiInformation: ue,
  dataPermissionLevels: de,
  description: "AI powered automatic grading and feedback suggestions to enable more consistent, fair, and efficient grading workflows.",
  group: "Canvas",
  name: n,
  nutritionFacts: le,
  revision: "2025.10.14",
  uid: re
}, r = "Inbox Translation", me = "canvasinboxtranslation", N = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], x = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "AWS Translate",
        valueDescription: "AWS Translate model is provided via Instructure's in-house AI Platform."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Inbox messages"
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Data is not stored or reused by the model."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Does not log data",
        valueDescription: ""
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Not Exposed",
        valueDescription: "PII in inbox messages may be sent to the model but no PII is intentionally sent to the model."
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "Users are displayed the translated copy of their message and can edit or remove it before they send the message."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: ""
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "Machine translation may not fully capture the meaning of the original message."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Enable better multi-lingual communication in learning environments."
      }
    ]
  }
], he = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Inbox Translation",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: x,
  featureName: r
}, ve = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Inbox Translation",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: r,
  data: N
}, ge = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Inbox Translation",
      modelName: "AWS Translate",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Inbox Translation",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Inbox Translation",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: N,
  nutritionFactsData: x,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/canvasinboxtranslation/index.tsx",
    lineNumber: 196,
    columnNumber: 11
  }, void 0)
}, pe = {
  aiInformation: ge,
  dataPermissionLevels: ve,
  description: 'Translation of inbox messages ("Inbox AI Translation" feature flag) across 10 languages.',
  group: "Canvas",
  name: r,
  nutritionFacts: he,
  revision: "2025.09.10",
  uid: me
}, l = "Discussion Insights", fe = "discussioninsights", E = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], w = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3",
        valueDescription: "Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs)."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Discussion topic, prompt, and student replies are used."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "No user data is stored or reused by the model."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: "Model evaluations and reply labels are logged for debugging and troubleshooting purposes."
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Exposed",
        valueDescription: "Known PII is masked before being sent to the model, though any PII present in the discussion reply is not and may be shared with the model."
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "Instructors may review AI-generated evaluations or review posts directly."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: 'Model responses are logged for quality assurance, and responses with low confidence are flagged "Needs Review" to encourage human intervention.'
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "The model may misclassify some nuanced replies."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Instructors are able to quickly assess the quality of student replies, identify low-effort or off-topic contributions, and focus their attention to where it is needed most."
      }
    ]
  }
], Ie = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Discussion Insights",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: w,
  featureName: l
}, Te = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Discussion Insights",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: l,
  data: E
}, Le = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Discussion Insights",
      modelName: "Haiku 3",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Discussion Insights",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Discussion Insights",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: E,
  nutritionFactsData: w,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/discussioninsights/index.tsx",
    lineNumber: 197,
    columnNumber: 11
  }, void 0)
}, Ae = {
  aiInformation: Le,
  dataPermissionLevels: Te,
  description: "Discussion Insights uses AI to evaluate student discussion replies, highlight relevant contributions, and flag those that may need instructor review.",
  group: "Canvas",
  name: l,
  nutritionFacts: Ie,
  revision: "2025.10.02",
  uid: fe
}, d = "Agent", be = "igniteagent", S = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], R = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3.5, Sonnet 3.5",
        valueDescription: "Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs)."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "The model uses chat transcripts and information requested from the Canvas API to execute its actions."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Chat logs are retained indefinitely for troubleshooting and debugging."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: "Chat logs are retained for troubleshooting and debugging purposes."
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Virginia, Oregon",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Exposed",
        valueDescription: "If requested during the the chat, user, course, and student identifiers or metadata may be shared with the model."
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "The agent only takes action based on human requests, and all write actions must be confirmed by the user."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "Access to the agent is limited to users with an Admin- or Teacher-based role. Data access and functions are scoped to the permissions available to the chat user."
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "The model may misinterpret user requests and require additional prompting."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Users are able to save time by relying on the Agent to execute complex workflows, batch actions, and other time-consuming Canvas tasks."
      }
    ]
  }
], De = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Agent",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: R,
  featureName: d
}, Fe = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Agent",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: d,
  data: S
}, Ce = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Agent",
      modelName: "Haiku 3.5, Sonnet 3.5",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Agent",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Agent",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: S,
  nutritionFactsData: R,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/igniteagent/index.tsx",
    lineNumber: 200,
    columnNumber: 11
  }, void 0)
}, Pe = {
  aiInformation: Ce,
  dataPermissionLevels: Fe,
  description: "Ignite Agent is a faculty chat assistant capable of translating natural language requests into complex Canvas workflows.",
  group: "IgniteAI",
  name: d,
  nutritionFacts: De,
  revision: "2025.09.10",
  uid: be
}, u = "Portfolios", ye = "portfolios", M = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], k = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3",
        valueDescription: "Anthropic Claude models are provided via Instructure's in-house AI Platform."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Custom instructions that teachers provide in their Evaluation portfolios for students."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Data is not stored or re-used by the model."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: "Model evaluations and reply labels are logged for debugging and troubleshooting purposes."
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Not Exposed",
        valueDescription: ""
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "Teachers provide the input of the model (content) and the response by the model is not auto accepted. Teachers have the chance to modify the result every occasion."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection built in for extra security. "
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "LLM might suggest not the right questions or skills, or not an improved instruction to the user's liking."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "A user-friendly tool for a safe writing assistant, and features to speed up administrative work, and provide more reliable portfolios for students to work with."
      }
    ]
  }
], Ne = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Portfolios",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: k,
  featureName: u
}, xe = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Portfolios",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: u,
  data: M
}, Ee = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Portfolios",
      modelName: "Haiku 3",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Portfolios",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Portfolios",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: M,
  nutritionFactsData: k,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/portfolios/index.tsx",
    lineNumber: 198,
    columnNumber: 11
  }, void 0)
}, we = {
  aiInformation: Ee,
  dataPermissionLevels: xe,
  description: "AI Assistant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation.",
  group: "Canvas",
  name: u,
  nutritionFacts: Ne,
  revision: "2025.10.21",
  uid: ye
}, c = "Rubric Creator", Se = "rubricgenerator", B = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], z = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3",
        valueDescription: "Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs)."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "The Canvas assignment description field is used in generating rubric criteria."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Model responses are stored for debugging purposes."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Logs data",
        valueDescription: "Request, response, and feedback data is logged to assist in troubleshooting."
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Not Exposed",
        valueDescription: ""
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "All created rubrics are reviewable and editable by the instructor."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "The instructor may edit criteria before accepting the rubric."
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "The created rubric may not align with the assignment's intended learning outcomes."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "A rubric aligned to learning outcomes is created for the instructor to use during grading."
      }
    ]
  }
], Re = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Rubric Creator",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: z,
  featureName: c
}, Me = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Rubric Creator",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: c,
  data: B
}, ke = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Rubric Creator",
      modelName: "Haiku 3",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Rubric Creator",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Rubric Creator",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: B,
  nutritionFactsData: z,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/rubricgenerator/index.tsx",
    lineNumber: 197,
    columnNumber: 11
  }, void 0)
}, Be = {
  aiInformation: ke,
  dataPermissionLevels: Me,
  description: "AI-generated rubric recommendations for Canvas assignments.",
  group: "Canvas",
  name: c,
  nutritionFacts: Re,
  revision: "2025.10.09",
  uid: Se
}, m = "Smart Search", ze = "smartsearch", W = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !0,
    level: "LEVEL 2",
    title: "AI-Powered Features Without Data Training"
  },
  {
    description: "We customize AI solutions tailored to the unique needs and resources of educational institutions. We use customer data to fine-tune data and train AI models that only serve your institution. Your institution's data only serves them through trained models.",
    highlighted: !1,
    level: "LEVEL 3",
    title: "AI Customization for Individual Institutions"
  },
  {
    description: "We established a consortium with educational institutions that shares anonymized data, best practices, and research findings. This fosters collaboration and accelerates the responsible development of AI in education. Specialized AI models are created for better outcomes in education, cost savings, and more.",
    highlighted: !1,
    level: "LEVEL 4",
    title: "Collaborative AI Consortium"
  }
], $ = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Cohere Embed Multilingual",
        valueDescription: "Cohere models are provided via Amazon Bedrock Foundation Models (FMs)."
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "Course content is indexed by the model and then stored in the Canvas database."
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Data is not stored or reused by the model. Indexed course content is stored in the Canvas database."
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "Does not log data",
        valueDescription: ""
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "Global",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "Not Exposed",
        valueDescription: "PII in course content may be indexed, but no PII is intentionally sent to the model."
      }
    ]
  },
  {
    blockTitle: "Outputs",
    segmentData: [
      {
        description: "The ability to turn the AI on or off within the product.",
        segmentTitle: "AI Settings Control",
        value: "Yes"
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "Yes",
        valueDescription: "Users are presented with a list of results related to their search query and can act or not act on them."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: ""
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "Search results may be incorrectly sorted or may not be relevant to the search term."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Students are able to quickly find answers to questions, and instructors are able to quickly navigate their courses."
      }
    ]
  }
], We = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Smart Search",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: $,
  featureName: m
}, $e = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Smart Search",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: m,
  data: W
}, Ve = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Smart Search",
      modelName: "Cohere Embed Multilingual",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Smart Search",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Smart Search",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: W,
  nutritionFactsData: $,
  trigger: /* @__PURE__ */ e(t, { children: "AI Information" }, void 0, !1, {
    fileName: "/Users/dwahl/Scripts/instructure.ai/packages/aiinfo/src/components/smartsearch/index.tsx",
    lineNumber: 198,
    columnNumber: 11
  }, void 0)
}, Ue = {
  aiInformation: Ve,
  dataPermissionLevels: $e,
  description: "Natural language search of course content for students and instructors.",
  group: "Canvas",
  name: m,
  nutritionFacts: We,
  revision: "2025.10.02",
  uid: ze
}, h = (g, V) => {
  const p = {};
  for (const f in g)
    p[f] = g[f][V];
  return p;
}, v = {
  askyourdata: Y,
  bcealttext: j,
  canvascoursetranslation: te,
  canvasdiscussionsummaries: ne,
  canvasgradingassistance: ce,
  canvasinboxtranslation: pe,
  discussioninsights: Ae,
  igniteagent: Pe,
  portfolios: we,
  rubricgenerator: Be,
  smartsearch: Ue
}, He = h(
  v,
  "nutritionFacts"
), Ye = h(
  v,
  "dataPermissionLevels"
), Ge = h(v, "aiInformation");
export {
  v as AiInfo,
  Ge as aiInformation,
  Y as askyourdata,
  j as bcealttext,
  te as canvascoursetranslation,
  ne as canvasdiscussionsummaries,
  ce as canvasgradingassistance,
  pe as canvasinboxtranslation,
  Ye as dataPermissionLevels,
  v as default,
  Ae as discussioninsights,
  Pe as igniteagent,
  He as nutritionFacts,
  we as portfolios,
  Be as rubricgenerator,
  Ue as smartsearch
};
