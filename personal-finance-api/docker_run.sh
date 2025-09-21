#!/bin/bash
set -a  # automatically export all variables
source .env
set +a

docker build -t my-spring-api .

docker run -p 8080:8080 \
  -e DATASOURCE_URL="$DATASOURCE_URL" \
  -e DATABASE_USERNAME="$DATABASE_USERNAME" \
  -e DATABASE_PASSWORD="$DATABASE_PASSWORD" \
  -e OAUTH2_ISSUER_URI="$OAUTH2_ISSUER_URI" \
  -e OAUTH2_AUDIENCE="$OAUTH2_AUDIENCE" \
  my-spring-api
