const axios = require('axios');

module.exports = {
    getQuestionData(questionServerId){
        //const url = 'http://localhost:5000/' + questionServerId
        const url = 'http://alexjas.eu.pythonanywhere.com/questions/' + questionServerId
        console.log(url)
        
        var config = {
            timeout: 6500, // timeout api call before we reach Alexa's 8 sec timeout, or set globally via axios.defaults.timeout
            headers: {'Accept': 'application/sparql-results+json'}
        };

        async function getJsonResponse(url, config){
            const res = await axios.get(url, config);
            return res.data;
        }

        return getJsonResponse(url, config).then((result) => {
            return result;
        }).catch((error) => {
            return null;
        });
    },
    getCurrentQuestionData(){
        //const url = 'http://localhost:5000/' + questionServerId
        //const url = 'http://alexjas.eu.pythonanywhere.com/questionsAlexa'
        var currentDatetime = new Date();
        var currentTime = currentDatetime.getHours() + ":" + currentDatetime.getMinutes() + ":" + currentDatetime.getMilliseconds();
        const url = 'http://alexjas.eu.pythonanywhere.com/questionsalexa/' + currentTime;
        console.log(url)
        
        var config = {
            timeout: 6500, // timeout api call before we reach Alexa's 8 sec timeout, or set globally via axios.defaults.timeout
            headers: {'Accept': 'application/sparql-results+json'}
        };

        async function getJsonResponse(url, config){
            const res = await axios.get(url, config);
            return res.data;
        }

        return getJsonResponse(url, config).then((result) => {
            return result;
        }).catch((error) => {
            return null;
        });
    },
    sendAnswerData(question_id, selected_answer, responseTime){
        //const url = 'http://alexjas.eu.pythonanywhere.com/answerquestion'
        //('/answerquestionalexa/<selected_answer>/<question_id>/<alexaresponsetime>'
        const url = 'http://alexjas.eu.pythonanywhere.com/answerquestionalexa/' + selected_answer + '/' + question_id + '/' + responseTime + '/' + responseTime
        console.log(url)
        
        var config = {
            timeout: 6500, // timeout api call before we reach Alexa's 8 sec timeout, or set globally via axios.defaults.timeout
            headers: {'Accept': 'application/sparql-results+json'}
        };

        /*var answer_data = {
            "question_id": question_id,
            "device_id": 0,
            "selected_answer": selected_answer
        }*/
        //answer_data = 0;
        //const answer_obj = JSON.parse(answer_data);
        //const answer_str = JSON.stringify(answer_data);

        /*async function putJsonResponse(url, answer_data, config){
            const res = await axios.put(url, answer_data, config);
            return res.data;
        }*/
        
        async function getJsonResponse(url, config){
            const res = await axios.get(url, config);
            return res.data;
        }
        
        return getJsonResponse(url, config).then((result) => {
            return result;
        }).catch((error) => {
            return null;
        });
        
        /*return putJsonResponse(url, answer_str, config).then((result) => {
            return "send answer data was called without error";
            //return result;
        }).catch((error) => {
            //return null;
            return "there was an error" + error.message;
        });*/
    },
    convertBirthdaysResponse(handlerInput, response, withAge, timezone){
        let speechResponse = '';
        // if the API call failed we just don't append today's birthdays to the response
        if (!response || !response.results || !response.results.bindings || !Object.keys(response.results.bindings).length > 0)
            return speechResponse;
        const results = response.results.bindings;
        speechResponse += handlerInput.t('ALSO_TODAY_MSG');
        results.forEach((person, index) => {
            console.log(person);
            speechResponse += person.humanLabel.value;
            if (withAge && timezone && person.date_of_birth.value) {
                const age = module.exports.convertBirthdateToYearsOld(person, timezone);
                speechResponse += handlerInput.t('TURNING_YO_MSG', {count: age});
            }
            if (index === Object.keys(results).length - 2)
                speechResponse += handlerInput.t('CONJUNCTION_MSG');
            else
                speechResponse += '. ';
        });

        return speechResponse;
    }
}