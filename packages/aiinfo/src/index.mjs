const e = "Ask Your Data", G = "askyourdata", I = [
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
], H = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Ask Your Data",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: T,
  featureName: e
}, Y = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Ask Your Data",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: e,
  data: I
}, Q = {
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
  trigger: void 0
}, j = {
  aiInformation: Q,
  dataPermissionLevels: Y,
  description: "AI-powered query tool enables users to ask natural language questions and receive textual or visual responses with detailed explanations of the methodology.",
  group: "Intelligent Insights",
  name: e,
  nutritionFacts: H,
  revision: "2025.09.12",
  uid: G
}, t = "Block Content Editor Alt Text Generator", K = "bcealttext", L = [
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
], J = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Block Content Editor Alt Text Generator",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: A,
  featureName: t
}, X = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Block Content Editor Alt Text Generator",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: t,
  data: L
}, Z = {
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
  trigger: void 0
}, ee = {
  aiInformation: Z,
  dataPermissionLevels: X,
  description: "",
  group: "Canvas",
  name: t,
  nutritionFacts: J,
  revision: "2025.10.01",
  uid: K
}, i = "Translations for Discussions & Announcements", te = "canvascoursetranslation", b = [
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
], ie = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Translations for Discussions & Announcements",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: D,
  featureName: i
}, ae = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Translations for Discussions & Announcements",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: i,
  data: b
}, se = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Translations for Discussions & Announcements",
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
  dataPermissionLevelsCurrentFeature: "Translations for Discussions & Announcements",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Translations for Discussions & Announcements",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: b,
  nutritionFactsData: D,
  trigger: void 0
}, oe = {
  aiInformation: se,
  dataPermissionLevels: ae,
  description: 'Translation of Discussion threads ("Course AI Translation" feature flag) across 10 languages.',
  group: "Canvas",
  name: i,
  nutritionFacts: ie,
  revision: "2025.09.10",
  uid: te
}, a = "Summaries for Discussions", ne = "canvasdiscussionsummaries", F = [
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
], re = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Summaries for Discussions",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: C,
  featureName: a
}, le = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Summaries for Discussions",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: a,
  data: F
}, de = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Summaries for Discussions",
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
  dataPermissionLevelsCurrentFeature: "Summaries for Discussions",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Summaries for Discussions",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: F,
  nutritionFactsData: C,
  trigger: void 0
}, ue = {
  aiInformation: de,
  dataPermissionLevels: le,
  description: "Discussion summaries of key points, questions, and insights.",
  group: "Canvas",
  name: a,
  nutritionFacts: re,
  revision: "2025.09.12",
  uid: ne
}, s = "Grading Assistance", ce = "canvasgradingassistance", P = [
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
        valueDescription: "Grade suggestion is displayed and selected by default, but the instructor must make the final decision to edit or accept the suggestions."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "The Claude Haiku model has inherent guardrails built in."
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
], me = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Grading Assistance",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: y,
  featureName: s
}, he = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Grading Assistance",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: s,
  data: P
}, ve = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Grading Assistance",
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
  trigger: void 0
}, ge = {
  aiInformation: ve,
  dataPermissionLevels: he,
  description: "AI powered automatic grading and feedback suggestions to enable more consistent, fair, and efficient grading workflows.",
  group: "Canvas",
  name: s,
  nutritionFacts: me,
  revision: "2025.10.22",
  uid: ce
}, o = "Translations for Inbox", pe = "canvasinboxtranslation", E = [
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
], N = [
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
], fe = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Translations for Inbox",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: N,
  featureName: o
}, Ie = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Translations for Inbox",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: o,
  data: E
}, Te = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Translations for Inbox",
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
  dataPermissionLevelsCurrentFeature: "Translations for Inbox",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Translations for Inbox",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: E,
  nutritionFactsData: N,
  trigger: void 0
}, Le = {
  aiInformation: Te,
  dataPermissionLevels: Ie,
  description: 'Translation of inbox messages ("Inbox AI Translation" feature flag) across 10 languages.',
  group: "Canvas",
  name: o,
  nutritionFacts: fe,
  revision: "2025.09.10",
  uid: pe
}, n = "", Ae = "conversionalignment", x = [
  {
    description: "We leverage anonymized aggregate data for detailed analytics to inform model development and product improvements. No AI models are used at this level.",
    highlighted: !1,
    level: "LEVEL 1",
    title: "Descriptive Analytics and Research"
  },
  {
    description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
    highlighted: !1,
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
        value: "",
        valueDescription: ""
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: ""
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: ""
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: ""
      },
      {
        description: "Recording the AI's performance for auditing, analysis, and improvement.",
        segmentTitle: "Data Logging",
        value: "",
        valueDescription: ""
      },
      {
        description: "The locations where the AI model is officially available and supported.",
        segmentTitle: "Regions Supported",
        value: "",
        valueDescription: ""
      },
      {
        description: "Sensitive data that can be used to identify an individual.",
        segmentTitle: "PII",
        value: "",
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
        value: ""
      },
      {
        description: "Indicates if a human is involved in the AI's process or output.",
        segmentTitle: "Human in the Loop",
        value: "",
        valueDescription: ""
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: ""
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: ""
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: ""
      }
    ]
  }
], be = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: w,
  featureName: n
}, De = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: n,
  data: x
}, Fe = {
  data: [
    {
      description: "Unknown",
      featureName: "",
      modelName: "",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL ",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: x,
  nutritionFactsData: w,
  trigger: void 0
}, Ce = {
  aiInformation: Fe,
  dataPermissionLevels: De,
  description: "",
  group: "Mastery",
  name: n,
  nutritionFacts: be,
  revision: "2025.09.15",
  uid: Ae
}, r = "Insights for Discussions", Pe = "discussioninsights", S = [
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
], ye = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Insights for Discussions",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: R,
  featureName: r
}, Ee = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Insights for Discussions",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: r,
  data: S
}, Ne = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Insights for Discussions",
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
  dataPermissionLevelsCurrentFeature: "Insights for Discussions",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Insights for Discussions",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: S,
  nutritionFactsData: R,
  trigger: void 0
}, xe = {
  aiInformation: Ne,
  dataPermissionLevels: Ee,
  description: "Discussion Insights uses AI to evaluate student discussion replies, highlight relevant contributions, and flag those that may need instructor review.",
  group: "Canvas",
  name: r,
  nutritionFacts: ye,
  revision: "2025.10.02",
  uid: Pe
}, l = "Agent", we = "igniteagent", M = [
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
], B = [
  {
    blockTitle: "Model & Data",
    segmentData: [
      {
        description: "The foundational AI on which further training and customizations are built.",
        segmentTitle: "Base Model",
        value: "Haiku 3, Sonnet 3.7",
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
], Se = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Agent",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: B,
  featureName: l
}, Re = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Agent",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: l,
  data: M
}, Me = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Agent",
      modelName: "Haiku 3, Sonnet 3.7",
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
  dataPermissionLevelsData: M,
  nutritionFactsData: B,
  trigger: void 0
}, Be = {
  aiInformation: Me,
  dataPermissionLevels: Re,
  description: "Ignite Agent is a faculty chat assistant capable of translating natural language requests into complex Canvas workflows.",
  group: "IgniteAI",
  name: l,
  nutritionFacts: Se,
  revision: "2025.09.10",
  uid: we
}, d = "Portfolios", ke = "portfolios", k = [
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
        value: "Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection built in for extra security."
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
], ze = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Portfolios",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: z,
  featureName: d
}, We = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Portfolios",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: d,
  data: k
}, $e = {
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
  dataPermissionLevelsData: k,
  nutritionFactsData: z,
  trigger: void 0
}, Ve = {
  aiInformation: $e,
  dataPermissionLevels: We,
  description: "AI Assistant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation.",
  group: "Canvas",
  name: d,
  nutritionFacts: ze,
  revision: "2025.10.27",
  uid: ke
}, u = "Suggestions for Quick Reassess", _e = "quickreassess", W = [
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
        value: "Claude Family Models",
        valueDescription: ""
      },
      {
        description: "Indicates the AI model has been given customer data in order to improve its results.",
        segmentTitle: "Trained with User Data",
        value: "No"
      },
      {
        description: "Indicates which training or operational content was given to the model.",
        segmentTitle: "Data Shared with Model",
        value: "The original question stem used to generate derivatives"
      }
    ]
  },
  {
    blockTitle: "Privacy & Compliance",
    segmentData: [
      {
        description: "How long the model stores customer data.",
        segmentTitle: "Data Retention",
        value: "Standard execution, infrastructure, and other operational logs are retained for a reasonable period to enable monitoring and troubleshooting of underlying services."
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
        value: "Virginia",
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
        valueDescription: "Educators have access to tools that allow them to preview, regenerate, edit, or replace AI generated questions before they are published in an assessment."
      },
      {
        description: "Preventative safety mechanisms or limitations built into the AI model.",
        segmentTitle: "Guardrails",
        value: "Only educators can generate items and all AI generated items are in draft status until reviewed and approved."
      },
      {
        description: "Any risks the model may pose to the user.",
        segmentTitle: "Expected Risks",
        value: "AI generated questions may require additional review and editing to ensure accuracy, relevance, and alignment with intended learning objectives."
      },
      {
        description: "The specific results the AI model is meant to achieve.",
        segmentTitle: "Intended Outcomes",
        value: "Educators can generate new standards-aligned questions based on existing items in order to quickly create diverse, tailored assessments that expand beyond the current Mastery Item Bank content, enhancing instructional flexibility and efficiency."
      }
    ]
  }
], Ue = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Suggestions for Quick Reassess",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: $,
  featureName: u
}, Oe = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Suggestions for Quick Reassess",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: u,
  data: W
}, qe = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Suggestions for Quick Reassess",
      modelName: "Claude Family Models",
      modelNameText: "Base Model",
      nutritionFactsModalTriggerText: "AI Nutrition Facts",
      permissionLevel: "LEVEL 2",
      permissionLevelsModalTriggerText: "Data Permission Levels",
      permissionLevelText: "Permission Level:"
    }
  ],
  dataPermissionLevelsCloseButtonText: "Close",
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: "Close dialog",
  dataPermissionLevelsCurrentFeature: "Suggestions for Quick Reassess",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Suggestions for Quick Reassess",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: W,
  nutritionFactsData: $,
  trigger: void 0
}, Ge = {
  aiInformation: qe,
  dataPermissionLevels: Oe,
  description: "Allows the use of AI to generate a question derived from the original. These questions can be re-generated, edited, and rejected or approved before they are published to students.",
  group: "Mastery",
  name: u,
  nutritionFacts: Ue,
  revision: "2025.10.27",
  uid: _e
}, c = "Generator for Rubrics", He = "rubricgenerator", V = [
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
], _ = [
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
], Ye = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Generator for Rubrics",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: _,
  featureName: c
}, Qe = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Generator for Rubrics",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: c,
  data: V
}, je = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Generator for Rubrics",
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
  dataPermissionLevelsCurrentFeature: "Generator for Rubrics",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Generator for Rubrics",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: V,
  nutritionFactsData: _,
  trigger: void 0
}, Ke = {
  aiInformation: je,
  dataPermissionLevels: Qe,
  description: "AI-generated rubric recommendations for Canvas assignments.",
  group: "Canvas",
  name: c,
  nutritionFacts: Ye,
  revision: "2025.10.09",
  uid: He
}, m = "Search", Je = "smartsearch", U = [
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
], O = [
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
], Xe = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close",
  data: void 0,
  featureName: "Search",
  modalLabel: "This is a modal for AI facts",
  title: "AI Nutrition Facts",
  triggerText: "Nutrition Facts",
  data: O,
  featureName: m
}, Ze = {
  closeButtonText: "Close",
  closeIconButtonScreenReaderLabel: "Close dialog",
  currentFeature: "Search",
  currentFeatureText: "Current Feature:",
  data: void 0,
  modalLabel: "Data Permission Levels modal",
  title: "Data Permission Levels",
  triggerText: "Data Permission Levels",
  currentFeature: m,
  data: U
}, et = {
  data: [
    {
      description: "We utilize off-the-shelf AI models and customer data as input to provide AI-powered features. No data is used for training this model.",
      featureName: "Search",
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
  dataPermissionLevelsCurrentFeature: "Search",
  dataPermissionLevelsCurrentFeatureText: "Current Feature:",
  dataPermissionLevelsData: void 0,
  dataPermissionLevelsModalLabel: "Data Permission Levels modal",
  dataPermissionLevelsTitle: "Data Permission Levels",
  nutritionFactsCloseButtonText: "Close",
  nutritionFactsCloseIconButtonScreenReaderLabel: "Close",
  nutritionFactsData: void 0,
  nutritionFactsFeatureName: "Search",
  nutritionFactsModalLabel: "This is a modal for AI facts",
  nutritionFactsTitle: "AI Nutrition Facts",
  title: "Features",
  trigger: void 0,
  dataPermissionLevelsData: U,
  nutritionFactsData: O,
  trigger: void 0
}, tt = {
  aiInformation: et,
  dataPermissionLevels: Ze,
  description: "Natural language search of course content for students and instructors.",
  group: "Canvas",
  name: m,
  nutritionFacts: Xe,
  revision: "2025.10.02",
  uid: Je
}, h = (g, q) => {
  const p = {};
  for (const f in g)
    p[f] = g[f][q];
  return p;
}, v = {
  askyourdata: j,
  bcealttext: ee,
  canvascoursetranslation: oe,
  canvasdiscussionsummaries: ue,
  canvasgradingassistance: ge,
  canvasinboxtranslation: Le,
  conversionalignment: Ce,
  discussioninsights: xe,
  igniteagent: Be,
  portfolios: Ve,
  quickreassess: Ge,
  rubricgenerator: Ke,
  smartsearch: tt
}, it = h(
  v,
  "nutritionFacts"
), at = h(
  v,
  "dataPermissionLevels"
), st = h(v, "aiInformation");
export {
  v as AiInfo,
  st as aiInformation,
  j as askyourdata,
  ee as bcealttext,
  oe as canvascoursetranslation,
  ue as canvasdiscussionsummaries,
  ge as canvasgradingassistance,
  Le as canvasinboxtranslation,
  Ce as conversionalignment,
  at as dataPermissionLevels,
  v as default,
  xe as discussioninsights,
  Be as igniteagent,
  it as nutritionFacts,
  Ve as portfolios,
  Ge as quickreassess,
  Ke as rubricgenerator,
  tt as smartsearch
};
