# Job Memo

A personal tool to track job applications through their entire lifecycle — from "applied" to "offer" or "rejected". Built with Spring Boot + React.

## Tech Stack

### Backend
| Layer | Choice |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.x |
| Security | Spring Security + JWT (jjwt library) |
| ORM | Spring Data JPA + Hibernate |
| Database | PostgreSQL |
| Validation | Spring Validation (`@Valid`, `@NotBlank`, etc.) |
| Build tool | Maven |
| Container | Docker + Docker Compose |

### Frontend
| Layer | Choice |
|---|---|
| Language | TypeScript |
| Framework | React + Vite |
| Styling | Tailwind CSS |
| HTTP client | Axios |
| State | React Context or Zustand |
| Routing | React Router v6 |

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- Docker Desktop

### 1. Clone and configure

```bash
git clone https://github.com/himischa/job-memo.git
cd job-memo

# Backend environment
cp job-memo-api/.env.example job-memo-api/.env

# Frontend environment
cp job-memo-frontend/.env.example job-memo-frontend/.env
```

Edit `job-memo-api/.env` and set a `JWT_SECRET` value (any long random string).

### 2. Start the backend

**Option A — Docker Compose (PostgreSQL + API)**
```bash
cd job-memo-api
docker compose up -d
```

**Option B — Manual (run Postgres in Docker + API with Maven)**
```bash
cd job-memo-api

# Start only PostgreSQL
docker compose up -d postgres

# Run the API
mvn spring-boot:run
```

The API runs at http://localhost:8080.

### 3. Start the frontend

```bash
cd job-memo-frontend
npm install
npm run dev
```

The app runs at http://localhost:5173.

## API Documentation

Once the backend is running:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API docs (JSON)**: http://localhost:8080/v3/api-docs

## API Endpoints

### Auth (no token required)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login, returns JWT token |

### Applications (require `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/applications` | List all applications (with filters) |
| `POST` | `/api/applications` | Create a new application |
| `GET` | `/api/applications/{id}` | Get a single application |
| `PUT` | `/api/applications/{id}` | Update application |
| `DELETE` | `/api/applications/{id}` | Delete an application |
| `GET` | `/api/applications/summary` | Count by status for current user |

## Running Tests

### Backend
```bash
cd job-memo-api
mvn test
```

### Frontend
```bash
cd job-memo-frontend
npm run build    # TypeScript check + production build
```

## Project Structure

```
job-memo/
├── job-memo-api/          ← Spring Boot backend
│   ├── src/
│   │   ├── main/java/     ← Java source code
│   │   └── resources/     ← Application config
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── pom.xml
└── job-memo-frontend/     ← React + TypeScript frontend
    ├── src/
    │   ├── components/    ← Reusable UI components
    │   ├── pages/         ← Page components
    │   ├── lib/           ← API client
    │   ├── context/       ← Auth state
    │   └── types/         ← TypeScript interfaces
    └── package.json
```

## Environment Variables

### Backend `.env`
| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | Postgres host |
| `DB_PORT` | `5432` | Postgres port |
| `DB_NAME` | `jobmemodb` | Database name |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `APP_PORT` | `8080` | API server port |
| `JWT_SECRET` | (required) | HMAC-SHA256 key for JWT signing |
| `JWT_EXPIRATION_MS` | `86400000` | JWT token expiry in milliseconds |

### Frontend `.env`
| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API URL |

## License

MIT
