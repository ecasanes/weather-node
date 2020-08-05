const request = require('postman-request');
const {getConfig} = require('./../config');

const {weather_stack:weatherStackConfig} = getConfig();

const API_URL = weatherStackConfig.BASE_URL;
const API_KEY = weatherStackConfig.API_KEY;

const weatherStack = {};

weatherStack.getInfo = ({latitude, longitude, key}, callback) => {

    const valid = weatherStack.validateConfig();
    const validKey = weatherStack.validKey(key);
    
    if(valid === false && validKey === false){
        return callback({
            code: 405,
            message: "Invalid BASE_URL or API_KEY from yaml or weather_stack_key provided"
        });
    }

    if(!validKey && valid){
        key = API_KEY;
    }

    if(typeof latitude === 'undefined' || typeof latitude !== 'number'){
        return callback({
            code: 405,
            message: "Please input latitude"
        });
    }

    if(typeof longitude === 'undefined' || typeof longitude !== 'number'){
        return callback({
            code: 405,
            message: "Please input longitude"
        })
    }

    key = encodeURIComponent(key);
    longitude = encodeURIComponent(longitude);
    latitude = encodeURIComponent(latitude);

    const API_QUERY = `${API_URL}/current?access_key=${key}&query=${latitude},${longitude}`;

    console.log('API QUERY: ', API_QUERY);

    request({
        url: API_QUERY,
        json: true
    }, (error, response, body) => {

        console.log('error: ', error);

        if(error){
            return callback({
                code: 500,
                message: "weather stack error occured: unable to proceed to service"
            });
        }
    
        const data = response.body;
        const currentWeatherData = data.current;

        return callback(null, currentWeatherData);
    
        // const precipitationChance = currentWeatherData.precip;
        // const precipPercentChance = precipitationChance * 100;
        // const temp = currentWeatherData.temperature;
    
    });

}

weatherStack.validKey = (key) => {

    if(typeof key !== "string"){
        return false;
    }

    if(key.trim().length <= 0){
        return false;
    }

    return true;
    
}

weatherStack.validateConfig = () => {

    if(typeof API_URL !== "string"){
        return false;
    }

    if(typeof API_KEY !== "string"){
        return false;
    }

    if(API_URL.trim().length <= 0){
        return false;
    }

    if(API_KEY.trim().length <= 0){
        return false;
    }

    return true;
}

module.exports = weatherStack;



