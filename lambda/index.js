/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
//var persistenceAdapter = getPersistenceAdapter();
//const i18n = require('i18next');
//const languageStrings = require('./localisation');
const interceptors = require('./interceptors');
const qAndA = require('./questionAndAnswers');
const logic = require('./logic');
var currentQ = null;
//const currentQ = qAndA.questionAndAnswers(14, 1, 'b', "Tagore was born in", "a The United States of America.", "b India.", "c Europe.", "d England.");

const pause = ". . ";



/*function getPersistenceAdapter(tableName) {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET;
    }
    if (isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're using to run this lambda (via IAM policy)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({
            tableName: tableName || 'happy_birthday',
            createTable: true
        });
    }
}*/


var currentQuestionId = -1;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        /*const speakOutput = handlerInput.t('WELCOME_MSG');
        currentQ = new qAndA.constructor(14, 1, 'b', "Tagore was born in", "a The United States of America.", "b India.", "c Europe.", "d England.");

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();*/
        const {requestEnvelope, responseBuilder} = handlerInput;
        //const questionServerID = Alexa.getSlotValue(requestEnvelope, "questionServerID");
        //const questionServerID = 3;
        var response = await logic.getCurrentQuestionData();
 
        if(response === null || response.questionNr === -1){
            const speakOutput = handlerInput.t('YOU_DONT_HAVE_A_NOTIFICATION_MSG') 
            return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
        }
        console.log(JSON.stringify(response));
        
        currentQuestionId = response.notification_id;
        
        const speakOutput = handlerInput.t('YOU_HAVE_A_NOTIFICATION_MSG') 
                            + pause + handlerInput.t('HERE_IS_THE_QUESTION_MSG') 
                            + pause + response.question
                            + pause + handlerInput.t('HERE_ARE_THE_OPTIONS_MSG') 
                            //+ pause + response.a
                            + pause + "Option a"
                            + pause + response.b
                            + pause + handlerInput.t('OR_MSG') 
                            + pause + response.c;

        //const speechResponse = logic.convertBirthdaysResponse(handlerInput, response, false);
        //const responseStart = "Here is the question ";
        //const speakOutput = responseStart + speechResponse;
        //const speakOutput = responseStart + response2;
        //const speakOutput = handlerInput.t('WELCOME_MSG');
        //const speakOutput = "Ok test response";
        //return handlerInput.responseBuilder
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/*const OpenNotificationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OpenNotificationIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('YOU_HAVE_A_NOTIFICATION_MSG') + pause + handlerInput.t('NOTIFICATION_QUESTION_MSG')
                            + pause + handlerInput.t('ANSWER_A_MSG') 
                            + pause + handlerInput.t('ANSWER_B_MSG') 
                            + pause + handlerInput.t('ANSWER_C_MSG') 
                            + pause + " or " 
                            + handlerInput.t('ANSWER_D_MSG');
                            
        // TODO: save currentQ as session object
        //const speakOutput = handlerInput.t('YOU_HAVE_A_NOTIFICATION_MSG') + pause + currentQ.question
        //                    + pause + handlerInput.t('ANSWER_A_MSG') 
        //                    + pause + handlerInput.t('ANSWER_B_MSG') 
        //                    + pause + handlerInput.t('ANSWER_C_MSG') 
        //                    + pause + " or " 
        //                    + handlerInput.t('ANSWER_D_MSG');
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();
    }
}*/

// TODO: save answers
// TODO: determine which letter is associated with which answer
// TODO: say associated letter or text if only given letter or text
const AnswerQuestionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerQuestionIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope, responseBuilder} = handlerInput;
        const speakOutput = handlerInput.t('ANSWER_REGISTERED_MSG');
        
        //const givenLetterSlot = Alexa.getSlot(requestEnvelope, 'answerLetter');
        const givenAnswerSlot = Alexa.getSlot(requestEnvelope, 'answerText');
        
        //const givenLetterName = givenLetterSlot.value;
        const givenAnswerName = givenAnswerSlot.value;
        
        
        
        /*if (givenLetterName && givenAnswerName) {
            const givenAnswerID = givenAnswerSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; 
            
            const answerChar = givenAnswerID.slice(-1);
            const letterChar = givenLetterName.slice(0, 1);

            if(answerChar !== letterChar){
                const speakOutput = handlerInput.t('ANSWERS_DONT_MATCH_MSG') 
                            + pause + handlerInput.t('NOTIFICATION_QUESTION_MSG')
                            + pause + handlerInput.t('ANSWER_A_MSG') 
                            + pause + handlerInput.t('ANSWER_B_MSG') 
                            + pause + handlerInput.t('ANSWER_C_MSG') 
                            + pause + " or " 
                            + handlerInput.t('ANSWER_D_MSG');
                
                return handlerInput.responseBuilder
                .speak(speakOutput)// + handlerInput.t('NOTIFICATION_QUESTION_MSG'))
                .reprompt()
                .getResponse();
            }
            
            const response = await logic.sendAnswerData(currentQuestionId, givenAnswerName);
            currentQuestionId = -1;
            
            return handlerInput.responseBuilder
            .speak(response)
            .getResponse();

            //return handlerInput.responseBuilder
            //.speak(speakOutput + pause + givenLetterName + pause + givenAnswerName)
            //.getResponse();
        }*/
        //else{
            var currentDate = new Date();
            //var responseTimeTest =  currentDate.format("dd-MM-yyyy HH:mm:ss.fff");
            
            
            //const responseTime = "testtime"
            
        
            //var testdate = new Date().toISOString();
            var responseTime =new Date().toISOString().replace(/T/, ' ').replace(/Z/, '');
      
            //var currentDate = new Date();
            //var responseTimeTest =  currentDate.format("dd-MM-yyyy HH:mm:ss.fff");
            
            var response = await logic.sendAnswerData(currentQuestionId, givenAnswerName, responseTime);
            while(response === null){
               response = await logic.sendAnswerData(currentQuestionId, givenAnswerName, responseTime); 
            }
            /*if(response === null){
                response = await logic.sendAnswerData(currentQuestionId, givenAnswerName, responseTime);
            }
            if(response === null){
                response = await logic.sendAnswerData(currentQuestionId, givenAnswerName, responseTime);
            }
            if(response === null){
                response = await logic.sendAnswerData(currentQuestionId, givenAnswerName, responseTime);
            }
            if(response === null){
                response = await logic.sendAnswerData(currentQuestionId, givenAnswerName, responseTime);
            }*/
            
            currentQuestionId = -1;
            
            return handlerInput.responseBuilder
            .speak(response)
            .getResponse();
            
            //return handlerInput.responseBuilder
            //.speak(speakOutput)
            //.getResponse();
            
        //}
    }
}

// TODO Repeat question
const AlwaysCallIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AlwaysCallIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('NOTIFICATION_QUESTION_MSG')
                            + pause + handlerInput.t('ANSWER_A_MSG') 
                            + pause + handlerInput.t('ANSWER_B_MSG') 
                            + pause + handlerInput.t('ANSWER_C_MSG') 
                            + pause + " or " 
                            + pause + handlerInput.t('ANSWER_D_MSG');
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();
    }
}

// TODO Repeat question
const RepeatQuestionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatQuestionIntent';
    },
    async handle(handlerInput) {
        
        const {requestEnvelope, responseBuilder} = handlerInput;
        var response = await logic.getCurrentQuestionData();
 
        if(response === null || response.questionNr === -1){
            const speakOutput = "Sie haben keine Mitteilung mehr" 
            return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
        }
        console.log(JSON.stringify(response));
        
        currentQuestionId = response.notification_id;
        
        const speakOutput = handlerInput.t('YOU_HAVE_A_NOTIFICATION_MSG') 
                            + pause + handlerInput.t('HERE_IS_THE_QUESTION_MSG') 
                            + pause + response.question
                            + pause + handlerInput.t('HERE_ARE_THE_OPTIONS_MSG') 
                            + pause + response.a
                            + pause + response.b
                            + pause + handlerInput.t('OR_MSG') 
                            + pause + response.c;

        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/*const GetQuestionFromServerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetQuestionFromServerIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope, responseBuilder} = handlerInput;
        const questionServerID = Alexa.getSlotValue(requestEnvelope, "questionServerID");
        const response = await logic.getQuestionData(questionServerID);
        console.log(JSON.stringify(response));
        
        const response2 = handlerInput.t('YOU_HAVE_A_NOTIFICATION_MSG') + pause + response.question
                            + pause + "Here are the options: " 
                            + pause + response.a
                            + pause + response.b
                            + pause + " or " 
                            + pause + response.c;
               
        //const speechResponse = logic.convertBirthdaysResponse(handlerInput, response, false);
        const responseStart = "Here is the question ";
        //const speakOutput = responseStart + speechResponse;
        const speakOutput = responseStart + response2;
        //const speakOutput = "Ok test response";
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt()
        .getResponse();
    }
}*/

//----------------------------------------------------------------------------------------------------------------------
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Mitteilung geschlossen!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        //OpenNotificationIntentHandler,
        RepeatQuestionIntentHandler,
        AnswerQuestionIntentHandler,
        //GetQuestionFromServerIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
     .addRequestInterceptors(
        interceptors.LocalisationRequestInterceptor)
    //.withPersistenceAdapter(persistenceAdapter)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();