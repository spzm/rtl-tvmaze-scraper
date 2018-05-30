## TVMazeShow scraper

Current application has two busines features work:

1. scrap data of tvMaze shows and casts
1. provide rest api endpoint on /api/v0/showcast?page=0&size=250

Rest endpoint consumes next query parameters:
- `page` is required parameter and can be omitted
- `size` is optional and has default value 250

Enpdoints:
- production: http://rtl-assignments.westeurope.cloudapp.azure.com/tvmaze-scraper/
- development: http://localhost:3005/

Scraper can be configured in two ways:

- Enable by config scraper -> runOnStart. Later can be moved to env variable
- Setup a scedule with cron like string in config
- Development mode by default bootstraps scrapping on start. Producion is setup on schedule only.

## Running

- `yarn install`
- `docker-compose up -d` # To run mongo on localhost
- `yarn run start`

## Create Docker image

`DOCKER_USERNAME=login DOCKER_PASSWORD="pass" DOCKER_BUILD_TAG=latest bash build.sh`

## Folder strucure

```
/configuration - here production and development configs are stored and managed by nconf
/src
    /boundaries - In this part of application any 3-rd party connectoin, state and etc are bootstrapped. They have start / stop. TODO: create Runnable to establish interface and contracts.
    /controllers - Here main application buisness logic is stored
    /helpers - small utilities that are used across the application
    /services - usefull services that provide api to manipulate of http requests, logging, requests pull.
```

## Require vs ES6 imports

Here is common.js modules are used because they don't require usage of babel. @std/esm is a good alternative but it still has some issues to enable for 3rd party libraries and can be considered as experimental, not production ready.
