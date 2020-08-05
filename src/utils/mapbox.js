const request = require('postman-request');
const config = require('./../config');

const {mapbox:mapBoxConfig} = config.getConfig();

const API_URL = mapBoxConfig.BASE_URL;
const API_KEY = mapBoxConfig.API_KEY;

const mapBox = {};

mapBox.getInfo = ({location, key}, callback) => {

    const valid = mapBox.validateConfig();
    const validKey = mapBox.validKey(key);

    console.log('valid config: ', valid);
    console.log('valid key: ', validKey);
    
    if(valid === false && validKey === false){
        return callback({
            code: 405,
            message: "Invalid BASE_URL or API_KEY from yaml or map_box_key provided"
        });
    }

    if(!validKey && valid){
        key = API_KEY
    }

    if(typeof location === 'undefined' || typeof location !== 'string' || location.trim().length <= 0){
        return callback({
            code: 405,
            message: "Please input address"
        });
    }

    location = encodeURIComponent(location);
    key = encodeURIComponent(key);

    const API_QUERY = `${API_URL}/geocoding/v5/mapbox.places/${location}.json?access_token=${key}`;

    request({
        url: API_QUERY,
        json: true
    }, (error, response, body) => {

        if(error){
            return callback({
                code: 500,
                message: "mapbox error occured: unable to proceed with service"
            });
        }
    
        const data = response.body;

        const filteredData = data.features.filter((feature) => {
            return feature.place_type.includes('region');
        });
    
        if(filteredData.length > 0){
            return callback(null, filteredData[0]);
        }
    
        return callback({
            code: 200,
            message: "no results"
        }, null);
    });

}

mapBox.validKey = (key) => {

    if(typeof key !== "string"){
        return false;
    }

    if(key.trim().length <= 0){
        return false;
    }

    return true;
    
}

mapBox.validateConfig = () => {

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

module.exports = mapBox;

