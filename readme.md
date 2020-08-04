## Overview

NodeJS Geolocation Weather API 

- weather stack
- mapbox

## Configuration

1. Duplicate remove ".sample" in the config.yaml.sample file
2. provide appropriate variables (e.g. API_KEY)

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
