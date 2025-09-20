@echo off
REM Read .env file and set environment variables
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if not "%%a"=="" set %%a=%%b
)
REM Run Gradle build
gradlew.bat bootRun