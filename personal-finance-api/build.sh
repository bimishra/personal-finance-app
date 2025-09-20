#!/bin/bash
# Source the .env file (loads vars into the shell)
set -a
source .env
set +a
# Run the build
./gradlew clean build