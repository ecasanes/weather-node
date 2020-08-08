## Overview

NodeJS Geolocation Weather API 

- weather stack
- mapbox

## Configuration

1. Duplicate remove ".sample" in the config.yaml.sample file
2. provide appropriate variables (e.g. API_KEY)

## Heroku Config

```bash
# add SSH key
heroku keys:add

#create heroku app
heroku create app-name

# add package.json start script
# use node process.env.port instead of static port number
# use absolute url '/'
```

## Heroku Push

```bash
heroku git:remote -a [heroku_app_name]

git push heroku master
```

## Heroku Debug

```bash
heroku logs -n 200
```

### Sample Config
```yaml

defaults: &DEFAULT
  weather_stack: &weather_stack
    API_KEY: ''
    BASE_URL: 'http://api.weatherstack.com'
  mapbox: &mapbox
    API_KEY: ''
    BASE_URL: 'https://api.mapbox.com'

staging: &STAGING
  <<: *DEFAULT
  weather_stack: &staging_weather_stack
    <<: *weather_stack
  mapbox: &staging_mapbox
    <<: *mapbox

prod: &PROD
  <<: *STAGING
  weather_stack:
    <<: *staging_weather_stack
  mapbox:
    <<: *staging_mapbox

```

## MongoDB

```bash

# mac os catalina mongodb restrictions
# right click open

bin/mongod --dbpath=path_to_mongodb_folder


# manage connections with GUI
# Robo 3T

# if having problem starting mongodb server
https://stackoverflow.com/questions/34555603/mongodb-failing-to-start-aborting-after-fassert-failure

#shell commands
db.version()

# npm
npm install mongodb
```


## Problems Encountered

So Another Reason why You might get this Error is if you use the same model in different files but your require path has a different case. For example in my situation I had:

require('./models/User') in one file and then in another file where I needed access to the User model I had require('./models/user').

I guess the look up for modules & mongoose is treating it as a different file. Once I made sure the case matched in both it was no longer an issue.

Reference: https://stackoverflow.com/questions/19051041/cannot-overwrite-model-once-compiled-mongoose