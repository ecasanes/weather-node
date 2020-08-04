const {getInfo} = require('./mapbox');
const {getInfo: getWeatherInfo} = require('./weather-stack');

const city = 'Manila';

getInfo(city, (error, result) => {

    console.log('mapbox error: ', error);

    if(error){
        return;
    }
    
    if(!result){
        return;
    }

    const longitude = result.geometry.coordinates[0];
    const latitude = result.geometry.coordinates[1];

    console.log('latitude: ', latitude);
    console.log('longitude: ', longitude);

    getWeatherInfo(longitude, latitude, (error, result) => {

        console.log('weather stack error: ', error);

        if(error){
            return;
        }

        console.log('weather result: ', result);
    });

});