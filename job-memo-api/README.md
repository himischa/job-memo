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

The API runs at http://localhost:8080.

## API Documentation (Swagger)

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API docs (JSON)**: http://localhost:8080/v3/api-docs

## Run Tests

```bash
mvn test
```

## Docker

Build and run everything (PostgreSQL + API):

```bash
docker compose up -d
```
