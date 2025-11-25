# Changelog
## 2025-11-25T17:08:58.760Z
### CSV
#### SHA
```diff
f0f0627c5c8ea28f0528f8ee09ce51e66e0c9501e3d98ec403bda6257d4a58d4
```
### aiexperiences
#### compliance
```diff
+ {
  "logging": "Logs data",
  "loggingDescription": "Prompt data, LLM responses, and student responses are logged.",
  "pii": "Not Exposed",
  "piiDescription": "",
  "regions": "Global",
  "regionsDescription": "",
  "retention": "All conversation data and the activity context created by the instructor is saved."
}
```
#### feature
```diff
+ {
  "description": "AI Experiences is a new activity type, allowing instructors to design and assess interactive chat experiences with AI.",
  "name": "AI Experiences"
}
```
#### group
```diff
+ "Canvas"
```
#### model
```diff
+ {
  "data": "Course, Student",
  "dataDescription": "The custom prompts that instructors provide to create the AI experience and student conversation with the AI Experience tool.",
  "description": "Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs).",
  "name": "Haiku 3",
  "trained": "No"
}
```
#### outputs
```diff
+ {
  "guardrails": "Model responses are logged for quality assurance, and responses with low confidence are flagged \"Needs Review\" to encourage human intervention.",
  "human": "Yes",
  "humanDescription": "Instructors set the parameters for each conversation, and students are informed they are interacting with AI. The AI’s output is delivered as-is, without post-editing. Instructors have full access to the conversation transcript.",
  "outcomes": "New type of learning activity that incorporates conversational AI in the process of learning, allowing students to demonstrate understanding of a topic and engage in a new learning modality within the LMS.",
  "risks": "The LLM might not ask the right questions or assess the conversation correctly. ",
  "settings": "Yes"
}
```
#### permissions
```diff
+ "2"
```
#### revision
```diff
+ "2025.11.25"
```
#### uid
```diff
+ "aiexperiences"
```
## 2025-11-19T13:51:04.973Z
### CSV
#### SHA
```diff
f62ad53ab4a0b498c59aa7a032648e344e0aa12cacd958c9a1f3594a0625d3bc
```
### conversionalignment
#### compliance.retention
```diff
- "Standard execution, infrastructure, and other operational logs are retained for a reasonable period\nto enable monitoring and troubleshooting of underlying services."
+ "Standard execution, infrastructure, and other operational logs are retained for a reasonable period to enable monitoring and troubleshooting of underlying services."
```
#### outputs.outcomes
```diff
- "The intended outcomes are to streamline the process of aligning assessments with learning standards, save educators time, and\nensure consistency in assessment alignment."
+ "The intended outcomes are to streamline the process of aligning assessments with learning standards, save educators time, and ensure consistency in assessment alignment."
```
## 2025-11-19T13:49:14.970Z
### CSV
#### SHA
```diff
02634d347b308c424937d4ed2e0621e548f9984ef3c860dedee9e79896af26c2
```
### quickreassess
#### revision
```diff
- "2025.10.27"
+ "2025.11.19"
```
#### model.name
```diff
- "Claude Family Models"
+ "Haiku 3"
```
#### model.description
```diff
- ""
+ "Anthropic Claude models are provided via Instructure's in-house AI Platform."
```

### conversionalignment
#### uid
```diff
+ "conversionalignment"
```
#### revision
```diff
+ "2025.11.19"
```
#### feature
```diff
+ {
  "name": "Standards Alignment for Quiz Conversion",
  "description": "When importing Canvas Quizzes to Mastery Connect, AI can be used to suggest aligned standards."
}
```
#### model
```diff
+ {
  "name": "Claude Family Models",
  "description": "Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs).",
  "trained": "No",
  "data": "Course",
  "dataDescription": "The Canvas Quiz content and Mastery Tracker metadata (Subject, Objectives) is shared with the\nmodel."
}
```
#### compliance
```diff
+ {
  "retention": "Standard execution, infrastructure, and other operational logs are retained for a reasonable period\nto enable monitoring and troubleshooting of underlying services.",
  "logging": "Does not log data",
  "loggingDescription": "No user data is logged at any time.",
  "regions": "Virginia, Oregon",
  "regionsDescription": "",
  "pii": "Not Exposed",
  "piiDescription": ""
}
```
#### outputs
```diff
+ {
  "settings": "Yes",
  "human": "Yes",
  "humanDescription": "The aligned standards can be reviewed and adjusted by educators prior to publishing the content.",
  "guardrails": "AI suggestions are limited to the standards present in the linked tracker’s standard set. This ensures that only the intended audience (educators) can use the tool and only relevant standards are suggested.",
  "risks": "Expected risks include possible misalignment if AI suggestions are not carefully reviewed, reliance on the accuracy of the tracker’s standard set, and the need for educator oversight to ensure quality.",
  "outcomes": "The intended outcomes are to streamline the process of aligning assessments with learning standards, save educators time, and\nensure consistency in assessment alignment."
}
```
#### group
```diff
+ "Mastery"
```
#### permissions
```diff
+ "2"
```
## 2025-11-18T20:25:05.839Z
### CSV
#### SHA
```diff
858e96391530102331964186a144034150fc6d61c0e84d916bd083975d3f99f4
```
### itemauthoringassistance
#### uid
```diff
+ "itemauthoringassistance"
```
#### revision
```diff
+ "2025.11.18"
```
#### feature
```diff
+ {
  "name": "Question Authoring",
  "description": "Question Authoring Assistance for Quizzes streamlines quiz creation by generating questions based on your course materials. \n"
}
```
#### model
```diff
+ {
  "name": "Haiku 3",
  "description": "Anthropic Claude models are provided via Instructure's in-house AI Platform.",
  "trained": "No",
  "data": "Course",
  "dataDescription": "Source material provided by the user (e.g., Custom standards, course content, text input, file input) for question/item generation."
}
```
#### compliance
```diff
+ {
  "retention": "Data is not stored or reused by the model.",
  "logging": "Logs data",
  "loggingDescription": "Usage data is logged to improve the product.",
  "regions": "Global",
  "regionsDescription": "",
  "pii": "Not Exposed",
  "piiDescription": "PII in source material may be sent to the model if included by the user, but no PII is intentionally sent to the model."
}
```
#### outputs
```diff
+ {
  "settings": "Yes",
  "human": "Yes",
  "humanDescription": "Instructors can review, edit, regenerate, or provide additional instructions to refine generated items.",
  "guardrails": "",
  "risks": "Generated items may not perfectly capture all desired information, require refinement, or occasionally contain inaccuracies.\n",
  "outcomes": "Improved instructor efficiency and productivity"
}
```
#### group
```diff
+ "Canvas"
```
#### permissions
```diff
+ "2"
```

### assessmentauthoringassistance
#### uid
```diff
+ "assessmentauthoringassistance"
```
#### revision
```diff
+ "2025.11.18"
```
#### feature
```diff
+ {
  "name": "Item Authoring",
  "description": "Item Authoring for Assessments streamlines assessment creation by generating questions based on your course materials. \n"
}
```
#### model
```diff
+ {
  "name": "Haiku 3",
  "description": "Anthropic Claude models are provided via Instructure's in-house AI Platform.",
  "trained": "No",
  "data": "Course",
  "dataDescription": "Source material provided by the user (e.g., Custom standards, course content, text input, file input) for question/item generation."
}
```
#### compliance
```diff
+ {
  "retention": "Data is not stored or reused by the model.",
  "logging": "Logs data",
  "loggingDescription": "Usage data is logged to improve the product.",
  "regions": "Global",
  "regionsDescription": "",
  "pii": "Not Exposed",
  "piiDescription": "PII in source material may be sent to the model if included by the user, but no PII is intentionally sent to the model."
}
```
#### outputs
```diff
+ {
  "settings": "Yes",
  "human": "Yes",
  "humanDescription": "Instructors can review, edit, regenerate, or provide additional instructions to refine generated items.",
  "guardrails": "",
  "risks": "Generated items may not perfectly capture all desired information, require refinement, or occasionally contain inaccuracies.\n",
  "outcomes": "Improved instructor efficiency and productivity"
}
```
#### group
```diff
+ "Mastery"
```
#### permissions
```diff
+ "2"
```
## 2025-11-18T19:52:02.235Z
### CSV
#### SHA
```diff
6e5d47862429c5073e26beebe10100fbaa28615f7d76f7eaa4f7c94a36b7aaeb
```
### canvasinboxtranslation
#### feature.name
```diff
- "Inbox Translation"
+ "Translations for Inbox"
```

### canvascoursetranslation
#### feature.name
```diff
- "Discussions Translation"
+ "Translations for Discussions & Announcements"
```

### rubricgenerator
#### feature.name
```diff
- "Rubric Creator"
+ "Generator for Rubrics"
```

### discussioninsights
#### feature.name
```diff
- "Discussion Insights"
+ "Insights for Discussions"
```

### smartsearch
#### feature.name
```diff
- "Smart Search"
+ "Search"
```

### canvasdiscussionsummaries
#### feature.name
```diff
- "Discussion Summaries"
+ "Summaries for Discussions"
```
## 2025-11-04T17:07:14.773Z
### CSV
#### SHA
```diff
7ca7919d381e049839aef8eebac865f13e60b71d8191fcd47d41db2e0be45d59
```
### igniteagent
#### model.name
```diff
- "Haiku 3.5, Sonnet 3.5"
+ "Haiku 3, Sonnet 3.7"
```
## 2025-10-28T20:56:32.209Z
### CSV
#### SHA
```diff
cb94462a64ddfdf50e03c51f9d7956ebfb09699f9cf426027e06888920f5d9c5
```
### canvasgradingassistance
#### outputs.humanDescription
```diff
- "Grade suggestion is displayed and selected by default, but the instructor much make the final decision to edit or accept the suggestions."
+ "Grade suggestion is displayed and selected by default, but the instructor must make the final decision to edit or accept the suggestions."
```
### quickreassess
#### uid
```diff
+ "quickreassess"
```
#### revision
```diff
+ "2025.10.27"
```
#### feature
```diff
+ {
+   "name": "Suggestions for Quick Reassess",
+   "description": "Allows the use of AI to generate a question derived from the original. These questions can be re-generated, edited, and rejected or approved before they are published to students."
+ }
```
#### model
```diff
+ {
+   "name": "Claude Family Models",
+   "description": "",
+   "trained": "No",
+   "data": "Other",
+   "dataDescription": "The original question stem used to generate derivatives"
+ }
```
#### compliance
```diff
+ {
+   "retention": "Standard execution, infrastructure, and other operational logs are retained for a reasonable period to enable monitoring and troubleshooting of underlying services.",
+   "logging": "Does not log data",
+   "loggingDescription": "",
+   "regions": "Virginia",
+   "regionsDescription": "",
+   "pii": "Not Exposed",
+   "piiDescription": ""
+ }
```
#### outputs
```diff
+ {
+   "settings": "Yes",
+   "human": "Yes",
+   "humanDescription": "Educators have access to tools that allow them to preview, regenerate, edit, or replace AI generated questions before they are published in an assessment.",
+   "guardrails": "Only educators can generate items and all AI generated items are in draft status until reviewed and approved.",
+   "risks": "AI generated questions may require additional review and editing to ensure accuracy, relevance, and alignment with intended learning objectives.",
+   "outcomes": "Educators can generate new standards-aligned questions based on existing items in order to quickly create diverse, tailored assessments that expand beyond the current Mastery Item Bank content, enhancing instructional flexibility and efficiency."
+ }
```
#### group
```diff
+ "Mastery"
```
#### permissions
```diff
+ "2"
```
## 2025-10-27T17:53:08.481Z
### CSV
#### SHA
```diff
fbcefd273d8991abc9dbeef49b025502650f7decce5fcaced0657ef46983fd7a
```
### portfolios
#### revision
```diff
- "2025.10.21"
+ "2025.10.27"
```
#### outputs.guardrails
```diff
- "Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection built in for extra security. "
+ "Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection built in for extra security."
```
## 2025-10-27T16:47:22.334Z
### CSV
#### SHA
```diff
764a870a31eaef555d1956b203241631476ac610403d1db3ecca305c7a947000
```
### canvasGradingAssistance
#### revision
```diff
- "2025.10.14"
+ "2025.10.22"
```
#### model.name
```diff
- "Haiku 3.5"
+ "Haiku 3"
```
#### outputs.guardrails
```diff
- "The Claude Sonnet model has inherent guardrails built in."
+ "The Claude Haiku model has inherent guardrails built in."
```
## 2025-10-21T20:13:52.750Z
### CSV
#### SHA
```
fb0b079f1550d1302447434d4ccf7d126afa237f42e44946334365b4784e5741
```
### portfolios
#### outputs.guardrails:
```diff
- "Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection build in for extra security. "
+ "Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection built in for extra security. "
```
## 2025-10-21T18:03:42.385Z
### CSV
#### SHA
```diff
e4fde48757a6d375a20a822aecb74e7ac9f7d2bb43204243b5f3a6240882fb45
```
### portfolios
#### revision:
```diff
- "2025.10.17"
+ "2025.10.21"
```
#### feature.description:
Old:
```diff
- "AI Assitant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation."
+ "AI Assistant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation."
```
#### outputs.guardrails:
```diff
- "Teachers acces to the model is limited, it's only through the intructions of the portfolio/ evidence. There is suspicious prompt detection build in for extra security."
+ "Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection build in for extra security."
```
## 2025-10-21T17:35:42.207Z
### CSV
#### SHA 
```
4c97aaba0cddade6535f715cd3800d838ce62e2f6971babf3dc84f5329a00bc5
```
### canvasinboxtranslation
#### model.description:
```diff
- "Anthropic Claude models are provided via Instructure's in-house AI Platform."
+ "AWS Translate model is provided via Instructure's in-house AI Platform."

```
## 2025-10-21T17:08:20.332Z
### CSV
#### SHA
```
86553f2cc37930e62ff8c3af69c3c384a4d93320d855018058144f27d05d5fb5
```
### canvascoursetranslation
#### uid
```diff
+ "canvascoursetranslation"
```
#### revision
```diff
+ "2025.09.10"
```
#### feature
```diff
+ {
+   "name": "Discussions Translation",
+   "description": "Translation of Discussion threads (\"Course AI Translation\" feature flag) across 10 languages."
+ }
```
#### model
```diff
+ {
+   "name": "Haiku 3",
+   "description": "Anthropic Claude models are provided via Instructure's in-house AI Platform.",
+   "trained": "No",
+   "data": "Course",
+   "dataDescription": "Announcement and Discussion prompts and replies"
+ }
```
#### compliance
```diff
+ {
+   "retention": "Data is not stored or reused by the model.",
+   "logging": "Does not log data",
+   "loggingDescription": "",
+   "regions": "Global",
+   "regionsDescription": "",
+   "pii": "Not Exposed",
+   "piiDescription": "PII in discussion replies may be sent to the model, but no PII is intentionally sent to the model."
+ }
```
#### outputs
```diff
+ {
+   "settings": "Yes",
+   "human": "Yes",
+   "humanDescription": "Untranslated content is available to review translations against",
+   "guardrails": "",
+   "risks": "Machine translation may not fully capture the meaning of the original message.",
+   "outcomes": "Improve participation for students who do not natively speak the language of instruction or other replies."
+ + }
```
#### group
```diff
+ "Canvas"
```
#### permissions
```diff
+ "2"
```
### portfolios
#### uid
```diff
+ "portfolios"
```
#### revision
```diff
+ "2025.10.17"
```
#### feature
```diff
{
+   "name": "Portfolios",
+   "description": "AI Assitant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation."
+ }
```
#### model
```diff
+ {
+   "name": "Haiku 3",
+   "description": "Anthropic Claude models are provided via Instructure's in-house AI Platform.",
+   "trained": "No",
+   "data": "Other",
+   "dataDescription": "Custom instructions that teachers provide in their Evaluation portfolios for students."
+ }
```
#### compliance
```diff
+ {
+   "retention": "Data is not stored or re-used by the model",
+   "logging": "Logs data",
+   "loggingDescription": "Model evaluations and reply labels are logged for debugging and troubleshooting purposes.",
+   "regions": "Global",
+   "regionsDescription": "",
+   "pii": "Not Exposed",
+   "piiDescription": ""
+ }
```
#### outputs
```diff
+ {
+   "settings": "Yes",
+   "human": "Yes",
+   "humanDescription": "Teachers provide the input of the model (content) and the response by the model is not auto accepted. Teachers have the chance to modify the result every occasion.",
+   "guardrails": "Teachers acces to the model is limited, it's only through the intructions of the portfolio/ evidence. There is suspicious prompt detection build in for extra security. ",
+   "risks": "LLM might suggest not the right questions or skills, or not an improved instruction to the user's liking.",
+   "outcomes": "A user-friendly tool for a safe writing assistant, and features to speed up administrative work, and provide more reliable portfolios for students to work with."
+ }
```
#### group
```diff
+ "Canvas"
```
#### permissions
```diff
+ "2"
```
