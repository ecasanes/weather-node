const yaml = require('js-yaml');
const fs = require('fs');

const config = {};

config.port = process.env.PORT || 3000;

config.getConfig = () => {
    const contents = fs.readFileSync('./config.yaml', 'utf8');
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