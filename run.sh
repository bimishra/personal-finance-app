#!/bin/bash
set -e

# Load env vars
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found!"
  exit 1
fi

SERVICE_NAME="$1"

if [ -z "$SERVICE_NAME" ]; then
  echo "No service specified. Starting all services..."
  docker compose --env-file .env up --build -d
else
  echo "Starting service: $SERVICE_NAME"
  docker compose --env-file .env up --build -d "$SERVICE_NAME"
fi

echo "Containers are up and running!"
