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

## Environment Variables

### Backend `.env`
| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | Postgres host |
| `DB_PORT` | `5432` | Postgres port |
| `DB_NAME` | `jobmemo` | Database name |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `APP_PORT` | `8080` | API server port |
| `JWT_SECRET` | (required) | HMAC-SHA256 key for JWT signing |
| `JWT_EXPIRATION_MS` | `86400000` | JWT token expiry in milliseconds |

### Frontend `.env`
| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API URL |

## API Documentation (Swagger)

Once the backend is running, browse to:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API docs (JSON)**: http://localhost:8080/v3/api-docs

## Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- Docker Desktop

### Backend

```bash
# 1. Clone the repo
git clone https://github.com/himischa/job-memo.git
cd job-memo

# 2. Copy env file and fill in your values
cp job-memo-api/.env.example job-memo-api/.env

# 3. Start PostgreSQL and the API via Docker
cd job-memo-api
docker compose up -d

# API runs at http://localhost:8080
```

### Frontend

```bash
# From the project root
cd job-memo-frontend

# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start dev server
npm run dev

# App runs at http://localhost:5173
```

## Project Structure

```
job-memo/
├── job-memo-api/          ← Spring Boot backend
└── job-memo-frontend/     ← React + TypeScript frontend
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login, returns JWT token |

### Applications (require JWT in `Authorization: Bearer <token>` header)
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
> The `net.bytebuddy.experimental` flag is already configured in the build for Java 25+ compatibility.

### Frontend
```bash
cd job-memo-frontend
npm run build    # TypeScript check + production build
```

## License

MIT
