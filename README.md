# Job Memo

Personal tool to track job applications end-to-end. Backend is Spring Boot + JWT; frontend is React + Vite + TypeScript.

## Repo Layout
- job-memo-api/: Spring Boot API
- job-memo-frontend/: React web app

## Environment Variables

### Backend (job-memo-api/.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobmemo
DB_USERNAME=postgres
DB_PASSWORD=postgres

APP_PORT=8080
BASE_URL=http://localhost:8080

JWT_SECRET=example-very-long-random-secret-key
JWT_EXPIRATION_MS=86400000
```

### Frontend (job-memo-frontend/.env)
```
VITE_API_BASE_URL=http://localhost:8080
```
