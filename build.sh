#!/bin/bash

set -e

DOCKERFILE=${1:-"Dockerfile"}

docker build -f "$DOCKERFILE" -t rtl-tvmaze-scraper .
docker tag rtl-tvmaze-scraper:latest uladzimir/rtl-tvmaze-scraper:"$DOCKER_BUILD_TAG"
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker push uladzimir/rtl-tvmaze-scraper:"$DOCKER_BUILD_TAG"
