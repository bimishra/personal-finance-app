# ---- Build stage ----
FROM gradle:8.7.0-jdk21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY build.gradle.kts settings.gradle.kts ./
RUN gradle dependencies --no-daemon

# Copy source and build
COPY src ./src
RUN gradle clean build --no-daemon -x test

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy jar from build
COPY --from=build /app/build/libs/*.jar app.jar

# App runs on port 8080
EXPOSE 8080

# Use exec form so env vars work properly
ENTRYPOINT ["java", "-jar", "app.jar"]
