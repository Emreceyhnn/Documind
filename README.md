# DocuMind

DocuMind is a microservices-based document management and Retrieval-Augmented Generation (RAG) platform. Users can upload documents, have them chunked and embedded automatically, and then ask natural-language questions answered by an LLM grounded in their own document content.

## Architecture

The system is composed of four backend services, a web client, and a reverse proxy, all orchestrated via Docker Compose:

| Service | Description | Tech |
|---|---|---|
| **Auth.Service** | User & company registration, login, JWT issuance/refresh | ASP.NET Core (.NET 10) |
| **Document.Service** | Document upload/storage, metadata management, talks to RAG service over gRPC | ASP.NET Core (.NET 10), MinIO |
| **RAG.service** | Chunking, embeddings, vector search, and answer generation via Gemini | ASP.NET Core (.NET 10), pgvector, gRPC |
| **documind-client** | Web frontend | Next.js |
| **nginx** | Reverse proxy in front of the client and APIs | Nginx |

Supporting infrastructure:
- **PostgreSQL** (`pgvector/pgvector`) — relational storage + vector similarity search
- **MinIO** — S3-compatible object storage for uploaded documents

```
Client (Next.js) ─┐
                   ├─▶ Nginx ─▶ Auth.Service
                   │            Document.Service ─▶ gRPC ─▶ RAG.service ─▶ Gemini API
                   │                                            │
                   └────────────────────────────────────────────┴─▶ Postgres (pgvector) / MinIO
```

## Prerequisites

- Docker & Docker Compose
- .NET 10 SDK (for local development outside Docker)
- Node.js (for running `documind-client` outside Docker)

## Getting Started

1. Clone the repository and copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Fill in `.env` with real values (database credentials, MinIO credentials, JWT secret, Gemini API key). See [Environment Variables](#environment-variables) below.

3. Start the full stack:

   ```bash
   docker compose up --build
   ```

4. Services will be available at:

   | Service | URL |
   |---|---|
   | Client (via Nginx) | http://localhost |
   | Auth.Service | http://localhost:5083 |
   | Document.Service | http://localhost:5025 |
   | RAG.service | http://localhost:5110 (REST), :5111 (gRPC) |
   | MinIO Console | http://localhost:9001 |
   | PostgreSQL | localhost:5432 |

## Environment Variables

All secrets and configuration are supplied via `.env` (never committed — see `.gitignore`). `.env.example` documents every required key with empty placeholder values:

| Variable | Purpose |
|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` / `POSTGRES_PORT` | PostgreSQL credentials & connection |
| `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` / `MINIO_PORT` / `MINIO_PORT_CONSOLE` / `MINIO_BUCKET_NAME` | MinIO object storage credentials |
| `JWT_SECRET_KEY` / `JWT_ISSUER` / `JWT_AUDIENCE` | JWT signing configuration shared by Auth.Service, Document.Service and RAG.service |
| `GEMINI_API_KEY` | Google Gemini API key used by RAG.service for embeddings/generation |
| `NGINX_PORT` | Port Nginx listens on |
| `ASPNETCORE_ENVIRONMENT` | ASP.NET Core environment (`Development` / `Production`) |

> **Note:** `docker-compose.yml` requires these variables to be set — there are no hardcoded fallback values, so services will fail to start correctly without a populated `.env`.

## Running Services Individually (Local Development)

Each .NET service can be run outside Docker for development:

```bash
cd Auth.Service
dotnet run
```

Repeat for `Document.Service` and `RAG.service`. Ensure Postgres and MinIO are reachable (either via `docker compose up postgres minio` or local installs), and that `appsettings.Development.json` / environment variables provide the necessary connection strings.

For the frontend:

```bash
cd documind-client
npm install
npm run dev
```

## Project Structure

```
DOCUMIND/
├── Auth.Service/          # Authentication & user/company management API
├── Auth.Service.Test/     # Unit tests for Auth.Service
├── Document.Service/      # Document upload/storage API, gRPC client to RAG.service
├── RAG.service/           # Chunking, embeddings, vector search, generation API + gRPC server
├── documind-client/       # Next.js frontend
├── nginx/                 # Reverse proxy configuration
└── docker-compose.yml     # Orchestration for all services + infrastructure
```

## Testing

```bash
cd Auth.Service.Test
dotnet test
```

## Security Notes

- Never commit `.env` — it is already excluded via `.gitignore`.
- Rotate the Postgres, MinIO, JWT, and Gemini credentials before deploying to any shared or production environment.
- `docker-compose.yml` intentionally has no default secret values; supply all credentials via `.env`.
