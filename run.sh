#!/bin/bash
set -e

# Load env vars
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Build and start containers
docker compose --env-file .env up --build -d
echo "Containers are up and running!"