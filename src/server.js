const express = require('express');
const path = require('path');
const hbs = require('hbs');
const config = require('./config');
// const handlers = require('./handlers');
const forecast = require('./utils/forecast');

const app = express();

// init config
config.initConfig();

// paths
const ABS_PATH = path.join(__dirname, '../');
const publicPath = path.join(ABS_PATH, '/public');
const viewsPath = path.join(ABS_PATH, '/templates/views');
const partialsPath = path.join(ABS_PATH, '/templates/partials');

// handlebars template engine for express
app.set('view engine', 'hbs'); 
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// static directory to serve
app.use(express.static(publicPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather API HBS var'
    });
});

app.get('/weather', (req, res) => {
    
    if(!req.query.address){
        res.send({
            error: "Please provide an address as query string"
        });
    }

    const address = req.query.address;
    const weatherStackKey = req.query.weather_stack_key;
    const mapBoxKey = req.query.map_box_key;

    forecast.get({
        address,
        weatherStackKey,
        mapBoxKey
    }, (error, result) => {

        if(error){
            return res.send(error);
        }

        return res.send(result);

    });


});

app.get('/json', (req, res) => {
    res.send({
        'hello':'world'
    })
});

app.get('/products', (req, res) => {

    if(!req.query.search){
        return res.send({
            error: "You must provide a search term"
        });
    }

    console.log('query: ', req.query);
    res.send({
        products: []
    })
});

app.get('/help/*', (req, res) => {
    res.send('Help article not found');
});

app.get('*', (req, res) => {
    res.render('404')
});

app.listen(config.port, () => {
    console.log('listening to port ' + config.port);
});