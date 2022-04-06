# AUI_Notifications_Alexa_Skill
This Amazon Alexa Skill is one of the NotiLens Projects

## How to import this skill to the Alexa Developer Console
This tutorial explains how to import an Alexa Skill from a repository like this one https://developer.amazon.com/en-US/docs/alexa/hosted-skills/alexa-hosted-skills-git-import.html
This skill's backend resources are "Alexa-Hosted (Node.js)", it may be necessary to select this when importing. 

### Language Selection
Select German as the main language when importing, otherwise some of the custom intents will be missing. This is because the skill was not completed in English. The skill should work in English if you add the missing intents to the English (UK) or English (US) versions, although some text might be in German. The translations for each language can be found in the code tab in the file localisation.js.
The skill was created with English (UK) as the main language, and English (US) and German (DE) were added later. However the server only sends notifications in German, so if a notification is received, it will be read in German, unless the server is changed to send the notifications in English. 
When you import this skill, you can only select one language, and you can add more languages afterwards. The language you select will have the custom intents included, the languages you add will not have the custom intents and you will need to add the custom intents manually for each language.

### Intents
There should be 9 intents: 5 built-in intents and 4 custom intents. The custom intents are OpenNotificationIntent, AnswerQuestionIntent, GetQuestionFromServerIntent and RepeatQuestionIntent. Only AnswerQuestionIntent and RepeatQuestionIntent are still active. OpenNotificationIntent and GetQuestionFromServerIntent cannot be called anymore. Opening the skill gets a notification from the server if it is available, AnswerQuestionIntent is used to answer, and RepeatQuestionIntent is used to repeat the notification. 
You can select an invocation name to launch the skill. (for the user study the invocation name was "Öffne Test Mitteilung", but this was confused with "Öffne Testmitteilung" which was not ideal)

### How the Alexa Skill works
When launching the Alexa skill with the invocation name it asks the server for a notification. If there is no notification, it says there is no notification and closes the skill. If there is a notification, it reads the notification question and answers and waits for the user to respond with an answer. The user can answer one of the answer options from the notification (AnswerQuestionIntent), or can ask Alexa to repeat the question (RepeatQuestionIntent), or can close the skill without answering (CancelIntent and StopIntent). If the user answers the question, the skill will try to send the selected answer to the server. If it succeeds, it will read the server's response. If the skill is closed without answering the question, the skill will not send anything to the server. 
