## TVMazeShow scraper

Current application has two business features work:

1. scrap data of tvMaze shows and casts
1. provide rest api endpoint on /api/v0/showcast?page=0&size=250

Showcase endpoint consumes next query parameters:
- `page` is required parameter and can be omitted
- `size` is optional and has default value 250

Enpdoints:
- production: http://rtl-assignments.westeurope.cloudapp.azure.com/tvmaze-scraper/
- development: http://localhost:3005/

Scraper can be configured in two ways:

- Enable by config: `scraper -> runOnStart`. Later it can be moved to env variable.
- Setup a schedule with cron like string in configuration.
- In development mode: scrape process will be executed on start. On production: - will be executed by schedule only.

## Running

- `yarn install`
- `docker-compose up -d` # To run mongo on localhost
- `yarn run start`

## Create Docker image

`DOCKER_USERNAME=login DOCKER_PASSWORD="pass" DOCKER_BUILD_TAG=latest bash build.sh`

## Folder structure

```
/configuration - production and development configs are stored. nconf is used under the hood.
/src
    /boundaries - In this part of the application any 3rd party connection or state is bootstrapped. They have provide start/stop api. TODO: create Runnable to establish interface and contracts.
    /controllers - Here business logic is stored
    /helpers - small utilities that are used across the application
    /services - services that provide api to manipulate http requests, logging, requests pull.
```

## Require vs ES6 imports

Here is common.js modules are used because they don't require babel (additional compile step on build). @std/esm is a good alternative but it has some issues to enable for 3rd party libraries and can be considered as experimental, not production ready.
