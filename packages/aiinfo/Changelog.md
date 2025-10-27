# Changelog
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
