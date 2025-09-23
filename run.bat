@echo off
setlocal enabledelayedexpansion

:: Check if .env file exists
if not exist .env (
  echo .env file not found!
  exit /b 1
)

:: Check if a service name was passed as the first argument
if "%~1"=="" (
  echo No service specified. Starting all services...
  docker compose --env-file .env up --build -d
) else (
  echo Starting service: %~1
  docker compose --env-file .env up --build -d %~1
)

echo Containers are up and running!
