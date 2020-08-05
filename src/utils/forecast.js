const {getInfo} = require('./mapbox');
const {getInfo: getWeatherInfo} = require('./weather-stack');

const forecast = {};

forecast.get = ({address, weatherStackKey, mapBoxKey}, callback) => {

    getInfo({location:address, key:mapBoxKey}, (error, result) => {

        console.log('mapbox error: ', error);
    
        if(error){
            return callback(error);
        }
        
        if(!result){
            return callback(null, null);
        }
    
        const longitude = result.geometry.coordinates[0];
        const latitude = result.geometry.coordinates[1];
    
        console.log('latitude: ', latitude);
        console.log('longitude: ', longitude);
    
        getWeatherInfo({longitude, latitude, key:weatherStackKey}, (error, result) => {
    
            console.log('weather stack error: ', error);
    
            if(error){
                return callback(error);
            }
    
            console.log('weather result: ', result);
            return callback(null, result);

        });
    
    });

}

module.exports = forecast;