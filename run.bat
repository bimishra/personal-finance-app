@echo off
setlocal enabledelayedexpansion

if not exist .env (
  echo .env file not found!
  exit /b 1
)

docker compose --env-file .env up --build -d
echo Containers are up and running!