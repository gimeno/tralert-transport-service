#!/bin/bash
set -e # Stop script from running if there are any errors
environment=${1}

# Log in to Docker Hub
echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin

# Docker image name and tags
IMAGE="${DOCKER_USER}/tralert-transport-service"
GIT_VERSION=$(git describe --always --abbrev --tags --long)

# Build, tag and push image
docker build -t ${IMAGE}:${GIT_VERSION} .
docker tag ${IMAGE}:${GIT_VERSION} ${IMAGE}:${environment}
docker push ${IMAGE}:${GIT_VERSION}