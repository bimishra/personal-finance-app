#!/bin/bash
set -a  # automatically export all variables
source .env
set +a

docker build -t my-spring-api .

docker run -p 8080:8080 \
  -e DATABASE_URL="$DATASDATABASE_URLOURCE_URL" \
  -e DB_USERNAME="$DB_USERNAME" \
  -e DB_PASSWORD="$DB_PASSWORD" \
  -e OAUTH2_ISSUER_URI="$OAUTH2_ISSUER_URI" \
  -e OAUTH2_AUDIENCE="$OAUTH2_AUDIENCE" \
  my-spring-api
