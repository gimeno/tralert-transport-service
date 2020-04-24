#!/bin/bash

environment=${1}

# Log in to Docker Hub
echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USER}" --password-stdin

# Docker image name and tags
IMAGE="${DOCKER_USER}/tralert-transport-service"
GIT_VERSION=$(git describe --always --abbrev --tags --long)

# Build, tag and push image
docker build -t service .
docker tag service ${IMAGE}:${GIT_VERSION}
docker push ${IMAGE}:${GIT_VERSION}
docker tag service ${IMAGE}:${environment}
docker push ${IMAGE}:${environment}

exit 0