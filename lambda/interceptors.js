const Alexa = require('ask-sdk-core');
// i18n dependency
const i18n = require('i18next');
const languageStrings = require('./localisation');

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};

module.exports = {
    LocalisationRequestInterceptor
}