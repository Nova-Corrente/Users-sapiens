#!/bin/bash

VERSION="1.0"

# nome do container
CONTAINER_NAME="app_users_sapiens"

# Inciar o build do container
echo "Building Docker image..."
docker build -t $CONTAINER_NAME:$VERSION .

# Verifica se o container já está rodando e se estiver para e remove
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Container $CONTAINER_NAME is already running. Stopping and removing it..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Inicia o container
echo "Starting container $CONTAINER_NAME..."
docker run -d \
    --name $CONTAINER_NAME \
    --network host \
    $CONTAINER_NAME:$VERSION

# Verifica se o container está rodando
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Container $CONTAINER_NAME is running."
else
    echo "Failed to start container $CONTAINER_NAME."
fi



