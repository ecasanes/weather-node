const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const ABS_PATH = path.join(__dirname, '../');
const configYamlSample = path.join(ABS_PATH, '/config.yaml.sample');
const configYaml = path.join(ABS_PATH, '/config.yaml');

const config = {};

config.port = process.env.PORT || 3000;

config.initConfig = () => {

    console.log('init config...');
    
    try{
        const fileContent = fs.readFileSync(configYaml, 'utf8');
    }catch(error){
        
        console.log('file not found: ', error);
        fs.copyFileSync(configYamlSample, configYaml);
    }

    console.log('end init config');


}

config.getConfig = () => {

    config.initConfig();

    const contents = fs.readFileSync(configYaml, 'utf8');
    const data = yaml.safeLoad(contents);
    let currentEnv = config.getCurrentEnv();
    const configVariables = data[currentEnv];

    return configVariables;
    
}

config.getCurrentEnv = () => {
    
    let currentEnv = process.env.NODE_ENV;

    if(typeof currentEnv !== 'string'){
        currentEnv = 'staging';
        return currentEnv;
    }

    currentEnv = currentEnv.toLowerCase();

    if(currentEnv.trim().length <= 0){
        currentEnv = 'staging';
        return currentEnv;
    }

    return currentEnv;
}

module.exports = config;