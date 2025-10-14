# Changelog

## 2025-10-14T20:42:35.095Z

### CSV

**SHA:** d781584823e37c17452687527d2fa3fb57d11f4f22c8af74b1825ebf8c927bc1

### canvasinboxtranslation

#### SHA

**Old:** `(none)`

**New:** `83554f0eb098ac592eedf73cdccf04e3e570ca670682e6e96719239075b3a545`

#### uid

Old: `(none)`

#### New:

```JSON
"canvasinboxtranslation"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.09.10"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Inbox Translation","description":"Translation of inbox messages (\"Inbox AI Translation\" feature flag) across 10 languages."}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"AWS Translate","description":"Anthropic Claude models are provided via Instructure's in-house AI Platform.","trained":"No","data":"Other","dataDescription":"Inbox messages"}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"Data is not stored or reused by the model.","logging":"Does not log data","loggingDescription":"","regions":"Global","regionsDescription":"","pii":"Not Exposed","piiDescription":"PII in inbox messages may be sent to the model but no PII is intentionally sent to the model."}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"Yes","human":"Yes","humanDescription":"Users are displayed the translated copy of their message and can edit or remove it before they send the message.","guardrails":"","risks":"Machine translation may not fully capture the meaning of the original message.","outcomes":"Enable better multi-lingual communication in learning environments."}
```

#### group

Old: `(none)`

#### New:

```JSON
"Canvas"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

### canvascoursetranslation

#### SHA

**Old:** `(none)`

**New:** `493b6f3ce5a8650cd5c760b7aa1136de6fc88897e81c353f5be19de2c917e9e1`

#### uid

Old: `(none)`

#### New:

```JSON
"canvascoursetranslation"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.09.10"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Discussions Translation","description":"Translation of Discussion threads (\"Course AI Translation\" feature flag) across 10 languages."}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"Haiku 3","description":"Anthropic Claude models are provided via Instructure's in-house AI Platform.","trained":"No","data":"Course","dataDescription":"Discussion prompts and replies"}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"Data is not stored or reused by the model.","logging":"Does not log data","loggingDescription":"","regions":"Global","regionsDescription":"","pii":"Not Exposed","piiDescription":"PII in discussion replies may be sent to the model, but no PII is intentionally sent to the model."}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"Yes","human":"Yes","humanDescription":"Untranslated content is available to review translations against","guardrails":"","risks":"Machine translation may not fully capture the meaning of the original message.","outcomes":"Improve participation for students who do not natively speak the language of instruction or other replies."}
```

#### group

Old: `(none)`

#### New:

```JSON
"Canvas"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

### igniteagent

#### SHA

**Old:** `(none)`

**New:** `422effb260b4e53ba74b387832f7d1d835824de58645c1c28ee39620f6c5334e`

#### uid

Old: `(none)`

#### New:

```JSON
"igniteagent"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.09.10"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Agent","description":"Ignite Agent is a faculty chat assistant capable of translating natural language requests into complex Canvas workflows."}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"Haiku 3.5, Sonnet 3.5","description":"Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs).","trained":"No","data":"Other","dataDescription":"The model uses chat transcripts and information requested from the Canvas API to execute its actions."}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"Chat logs are retained indefinitely for troubleshooting and debugging.","logging":"Logs data","loggingDescription":"Chat logs are retained for troubleshooting and debugging purposes.","regions":"Virginia, Oregon","regionsDescription":"","pii":"Exposed","piiDescription":"If requested during the the chat, user, course, and student identifiers or metadata may be shared with the model."}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"Yes","human":"Yes","humanDescription":"The agent only takes action based on human requests, and all write actions must be confirmed by the user.","guardrails":"Access to the agent is limited to users with an Admin- or Teacher-based role. Data access and functions are scoped to the permissions available to the chat user.","risks":"The model may misinterpret user requests and require additional prompting.","outcomes":"Users are able to save time by relying on the Agent to execute complex workflows, batch actions, and other time-consuming Canvas tasks."}
```

#### group

Old: `(none)`

#### New:

```JSON
"IgniteAI"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

### rubricgenerator

#### SHA

**Old:** `(none)`

**New:** `c462f99c082872bcdbd49d5f5ccf25dc97134e30d1bd90b43ff8e056e2d22640`

#### uid

Old: `(none)`

#### New:

```JSON
"rubricgenerator"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.10.09"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Rubric Creator","description":"AI-generated rubric recommendations for Canvas assignments."}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"Haiku 3","description":"Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs).","trained":"No","data":"Course","dataDescription":"The Canvas assignment description field is used in generating rubric criteria."}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"Model responses are stored for debugging purposes.","logging":"Logs data","loggingDescription":"Request, response, and feedback data is logged to assist in troubleshooting.","regions":"Global","regionsDescription":"","pii":"Not Exposed","piiDescription":""}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"Yes","human":"Yes","humanDescription":"All created rubrics are reviewable and editable by the instructor.","guardrails":"The instructor may edit criteria before accepting the rubric.","risks":"The created rubric may not align with the assignment's intended learning outcomes.","outcomes":"A rubric aligned to learning outcomes is created for the instructor to use during grading."}
```

#### group

Old: `(none)`

#### New:

```JSON
"Canvas"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

### canvasgradingassistance

#### SHA

**Old:** `(none)`

**New:** `edb6de555dfc2e53ad80cba3f893dd929af293de53642c9a57a8f94f4374cffb`

#### uid

Old: `(none)`

#### New:

```JSON
"canvasgradingassistance"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.10.14"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Grading Assistance","description":"AI powered automatic grading and feedback suggestions to enable more consistent, fair, and efficient grading workflows."}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"Haiku 3.5","description":"Anthropic Claude models are provided via Instructure's in-house AI Platform.","trained":"No","data":"Course, Student","dataDescription":"Assignment information, rubric, and student submissions."}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"Transactional data is retained for the life of the request","logging":"Logs data","loggingDescription":"Complete response from the LLM is retained in the Canvas database for auditing purposes.","regions":"Global","regionsDescription":"","pii":"Not Exposed","piiDescription":"No PII is intentionally sent to the model. If there is incidental PII in any of the shared data, such as in the submission body, it will be sent to the model."}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"Yes","human":"Yes","humanDescription":"Grade suggestion is displayed and selected by default, but the instructor much make the final decision to edit or accept the suggestions.","guardrails":"The Claude Sonnet model has inherent guardrails built in.","risks":"Model may work better with certain kinds of assignment types or disciplines. The grader must remain alert to incorrect assumptions from the model.","outcomes":"Reduced bias in grading, fairness, and consistency. Grading efficiency, saving teachers time."}
```

#### group

Old: `(none)`

#### New:

```JSON
"Canvas"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

### discussioninsights

#### SHA

**Old:** `(none)`

**New:** `bf8f800481a6a884bf573692903d4ffdcb2842d33da5d4ee4f3c4d349f53dc11`

#### uid

Old: `(none)`

#### New:

```JSON
"discussioninsights"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.10.02"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Discussion Insights","description":"Discussion Insights uses AI to evaluate student discussion replies, highlight relevant contributions, and flag those that may need instructor review."}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"Haiku 3","description":"Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs).","trained":"No","data":"Course","dataDescription":"Discussion topic, prompt, and student replies are used."}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"No user data is stored or reused by the model.","logging":"Logs data","loggingDescription":"Model evaluations and reply labels are logged for debugging and troubleshooting purposes.","regions":"Global","regionsDescription":"","pii":"Exposed","piiDescription":"Known PII is masked before being sent to the model, though any PII present in the discussion reply is not and may be shared with the model."}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"Yes","human":"Yes","humanDescription":"Instructors may review AI-generated evaluations or review posts directly.","guardrails":"Model responses are logged for quality assurance, and responses with low confidence are flagged \"Needs Review\" to encourage human intervention.","risks":"The model may misclassify some nuanced replies.","outcomes":"Instructors are able to quickly assess the quality of student replies, identify low-effort or off-topic contributions, and focus their attention to where it is needed most."}
```

#### group

Old: `(none)`

#### New:

```JSON
"Canvas"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

### smartsearch

#### SHA

**Old:** `(none)`

**New:** `4b5c8873fcb95dc7dcff194f499c84ade3b1e3ed4e37d717172834ef43338c79`

#### uid

Old: `(none)`

#### New:

```JSON
"smartsearch"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.10.02"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Smart Search","description":"Natural language search of course content for students and instructors."}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"Cohere Embed Multilingual","description":"Cohere models are provided via Amazon Bedrock Foundation Models (FMs).","trained":"No","data":"Course","dataDescription":"Course content is indexed by the model and then stored in the Canvas database."}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"Data is not stored or reused by the model. Indexed course content is stored in the Canvas database.","logging":"Does not log data","loggingDescription":"","regions":"Global","regionsDescription":"","pii":"Not Exposed","piiDescription":"PII in course content may be indexed, but no PII is intentionally sent to the model."}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"Yes","human":"Yes","humanDescription":"Users are presented with a list of results related to their search query and can act or not act on them.","guardrails":"","risks":"Search results may be incorrectly sorted or may not be relevant to the search term.","outcomes":"Students are able to quickly find answers to questions, and instructors are able to quickly navigate their courses."}
```

#### group

Old: `(none)`

#### New:

```JSON
"Canvas"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

### askyourdata

#### SHA

**Old:** `(none)`

**New:** `8de9e2815ff3aec88e14be9ae042be0b9b40319ad6e9be5985c918fc8b5a63b5`

### canvasdiscussionsummaries

#### SHA

**Old:** `(none)`

**New:** `8dea644532ad2b211f6c5bca6bfeebe3a79f0286b2f0a8ba2f44fda2903d32e0`

#### uid

Old: `(none)`

#### New:

```JSON
"canvasdiscussionsummaries"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.09.12"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Discussion Summaries","description":"Discussion summaries of key points, questions, and insights."}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"Haiku 3","description":"Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs).","trained":"No","data":"Course","dataDescription":"Discussion prompt and replies."}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"Data is not stored or reused by the model.","logging":"Logs data","loggingDescription":"Summaries are logged in the Canvas database for review and reuse.","regions":"Global","regionsDescription":"","pii":"Not Exposed","piiDescription":"Pii in discussion replies may be sent to the model, but no PII is intentionally sent to the model."}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"Yes","human":"Yes","humanDescription":"Instructors may regenerate summaries or fine-tune them with additional instructions.","guardrails":"","risks":"Summaries may not capture all desired information.","outcomes":"Summaries allow discussion topics to be used in large-format courses and other environments where discussions were previously infeasible."}
```

#### group

Old: `(none)`

#### New:

```JSON
"Canvas"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

### bcealttext

#### SHA

**Old:** `(none)`

**New:** `757060c8e6a7fad9d79489ac69de4ae0c484e4b82d5e362ad243e1b10ba29572`

#### uid

Old: `(none)`

#### New:

```JSON
"bcealttext"
```

#### revision

Old: `(none)`

#### New:

```JSON
"2025.10.01"
```

#### feature

Old: `(none)`

#### New:

```JSON
{"name":"Block Content Editor Alt Text Generator","description":""}
```

#### model

Old: `(none)`

#### New:

```JSON
{"name":"Haiku 3","description":"Anthropic Claude models are provided via Amazon Bedrock Foundation Models (FMs).","trained":"No","data":"Course","dataDescription":"Content Editor Images."}
```

#### compliance

Old: `(none)`

#### New:

```JSON
{"retention":"Model responses are stored for debugging purposes.","logging":"Logs data","loggingDescription":"Request, response, and feedback data is logged to assist in troubleshooting.","regions":"Global","regionsDescription":"","pii":"Not Exposed","piiDescription":""}
```

#### outputs

Old: `(none)`

#### New:

```JSON
{"settings":"No","human":"Yes","humanDescription":"User initiated, User must confirm output.","guardrails":"","risks":"Alt text might not always be accurate. ","outcomes":"An accessible Alt Text description of the image is generated."}
```

#### group

Old: `(none)`

#### New:

```JSON
"Canvas"
```

#### permissions

Old: `(none)`

#### New:

```JSON
"2"
```

