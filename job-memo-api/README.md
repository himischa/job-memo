# Job Memo API

Spring Boot REST API for Job Memo — a personal job application tracker.

## Setup

```bash
# 1. Copy env file and fill in your values
cp .env.example .env

# 2. Start PostgreSQL via Docker
docker compose up -d postgres

# 3. Run the app
mvn spring-boot:run
```

## API Documentation (Swagger)

Once the app is running:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API docs (JSON)**: http://localhost:8080/v3/api-docs

## Run Tests

```bash
mvn test
```
>(The `net.bytebuddy.experimental` flag is already configured in the build for Java 25+ compatibility.)
