# School Management System (SMS)

## Architecture

- **sms-shared/** — Versioned TypeScript types package (error envelope, pagination, health check types). Both apps import from here.
- **sms-backend/** — Express 5 + Prisma 7 API. Sits at port 3000 (configurable).
- **sms-frontend/** — React 19 + Vite 8 SPA. Sits at port 5173 (configurable).
- **docker-compose.yaml** — Orchestrates PostgreSQL 18, backend, and frontend.

## Quick Start

```bash
cp .env.example .env   # edit ports/secrets as needed
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend health: http://localhost:3000/api/health
- PostgreSQL: localhost:5432

## Ports

Ports are configurable via environment variables (see `.env.example`). Note the host-side published ports (`BACKEND_PORT`, `FRONTEND_PORT`) are what you curl/open from the host; the backend's internal container listen port is fixed at `3000` and the frontend Vite proxy targets that internal port, so the `/api` proxy keeps working regardless of `BACKEND_PORT`.

| Service    | Default Host Port | Env Var         |
|------------|-------------------|-----------------|
| PostgreSQL | 5432              | `DB_PORT`       |
| Backend    | 3000              | `BACKEND_PORT`  |
| Frontend   | 5173              | `FRONTEND_PORT` |

## Development (without Docker)

Each repo can run standalone:

```bash
# sms-shared (build types first)
cd sms-shared && npm install && npm run build

# sms-backend
cd sms-backend && npm install
npx prisma migrate dev
npm run dev

# sms-frontend
cd sms-frontend && npm install
npm run dev
```

## Type Checking

```bash
cd sms-shared && npm run typecheck
cd sms-backend && npm run typecheck
cd sms-frontend && npm run typecheck
```

## Teardown

```bash
docker compose down -v   # removes containers and volumes
```
