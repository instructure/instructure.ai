# Changelog

## 2025-10-21T20:13:52.750Z

### CSV

**SHA:** `fb0b079f1550d1302447434d4ccf7d126afa237f42e44946334365b4784e5741`

### portfolios

#### SHA

**Old:** `7754000b75ffd1f157bcca8bce6ce3454f7a3c718a5a1480ce29ffc310f8b2a8`

**New:** `a2f764be1f3aa37082a694f92498523720d8db02b35d3cbdab5db803a1432e20`

#### outputs.guardrails:

Old:

```JSON
"Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection build in for extra security. "
```
#### New:

```JSON
"Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection built in for extra security. "
```



## 2025-10-21T18:03:42.385Z



### CSV



**SHA:** `e4fde48757a6d375a20a822aecb74e7ac9f7d2bb43204243b5f3a6240882fb45`



### portfolios



#### SHA



**Old:** `3fa4d3977aa30f05a060e80d040c829feb5f60b6766c1c8348fc2cb14c916762`



**New:** `7754000b75ffd1f157bcca8bce6ce3454f7a3c718a5a1480ce29ffc310f8b2a8`



#### revision:



Old:



```JSON

"2025.10.17"

```

#### New:



```JSON

"2025.10.21"

```



#### feature.description:



Old:



```JSON

"AI Assitant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation."

```

#### New:



```JSON

"AI Assistant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation."

```



#### outputs.guardrails:



Old:



```JSON

"Teachers acces to the model is limited, it's only through the intructions of the portfolio/ evidence. There is suspicious prompt detection build in for extra security. "

```

#### New:



```JSON

"Teacher access to the model is limited, it's only through the instructions of the portfolio/evidence. There is suspicious prompt detection build in for extra security. "

```







## 2025-10-21T17:35:42.207Z







### CSV







**SHA:** `4c97aaba0cddade6535f715cd3800d838ce62e2f6971babf3dc84f5329a00bc5`







### canvasinboxtranslation







#### SHA







**Old:** `83554f0eb098ac592eedf73cdccf04e3e570ca670682e6e96719239075b3a545`







**New:** `a377ff102be001371a476b48e37052b78862a21aad46046086619b05f1a1616c`







#### model.description:







Old:







```JSON



"Anthropic Claude models are provided via Instructure's in-house AI Platform."



```



#### New:







```JSON



"AWS Translate model is provided via Instructure's in-house AI Platform."



```















## 2025-10-21T17:08:20.332Z















### CSV















**SHA:** `86553f2cc37930e62ff8c3af69c3c384a4d93320d855018058144f27d05d5fb5`















### canvascoursetranslation















#### SHA















**Old:** `493b6f3ce5a8650cd5c760b7aa1136de6fc88897e81c353f5be19de2c917e9e1`















**New:** `0869c157cb9ab0c007f088fcfc0a642404831158ff365395b6f6b69de5c179fb`















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







{







  "name": "Discussions Translation",







  "description": "Translation of Discussion threads (\"Course AI Translation\" feature flag) across 10 languages."







}







```















#### model















Old: `(none)`















#### New:















```JSON







{







  "name": "Haiku 3",







  "description": "Anthropic Claude models are provided via Instructure's in-house AI Platform.",







  "trained": "No",







  "data": "Course",







  "dataDescription": "Announcement and Discussion prompts and replies"







}







```















#### compliance















Old: `(none)`















#### New:















```JSON







{







  "retention": "Data is not stored or reused by the model.",







  "logging": "Does not log data",







  "loggingDescription": "",







  "regions": "Global",







  "regionsDescription": "",







  "pii": "Not Exposed",







  "piiDescription": "PII in discussion replies may be sent to the model, but no PII is intentionally sent to the model."







}







```















#### outputs















Old: `(none)`















#### New:















```JSON







{







  "settings": "Yes",







  "human": "Yes",







  "humanDescription": "Untranslated content is available to review translations against",







  "guardrails": "",







  "risks": "Machine translation may not fully capture the meaning of the original message.",







  "outcomes": "Improve participation for students who do not natively speak the language of instruction or other replies."







}







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















### portfolios















#### SHA















**Old:** `(none)`















**New:** `3fa4d3977aa30f05a060e80d040c829feb5f60b6766c1c8348fc2cb14c916762`















#### uid















Old: `(none)`















#### New:















```JSON







"portfolios"







```















#### revision















Old: `(none)`















#### New:















```JSON







"2025.10.17"







```















#### feature















Old: `(none)`















#### New:















```JSON







{







  "name": "Portfolios",







  "description": "AI Assitant for teachers to improve portfolio level and evidence level instructions improvement, skill extraction and reflection question generation."







}







```















#### model















Old: `(none)`















#### New:















```JSON







{







  "name": "Haiku 3",







  "description": "Anthropic Claude models are provided via Instructure's in-house AI Platform.",







  "trained": "No",







  "data": "Other",







  "dataDescription": "Custom instructions that teachers provide in their Evaluation portfolios for students."







}







```















#### compliance















Old: `(none)`















#### New:















```JSON







{







  "retention": "Data is not stored or re-used by the model.",







  "logging": "Logs data",







  "loggingDescription": "Model evaluations and reply labels are logged for debugging and troubleshooting purposes.",







  "regions": "Global",







  "regionsDescription": "",







  "pii": "Not Exposed",







  "piiDescription": ""







}







```















#### outputs















Old: `(none)`















#### New:















```JSON







{







  "settings": "Yes",







  "human": "Yes",







  "humanDescription": "Teachers provide the input of the model (content) and the response by the model is not auto accepted. Teachers have the chance to modify the result every occasion.",







  "guardrails": "Teachers acces to the model is limited, it's only through the intructions of the portfolio/ evidence. There is suspicious prompt detection build in for extra security. ",







  "risks": "LLM might suggest not the right questions or skills, or not an improved instruction to the user's liking.",







  "outcomes": "A user-friendly tool for a safe writing assistant, and features to speed up administrative work, and provide more reliable portfolios for students to work with."







}







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