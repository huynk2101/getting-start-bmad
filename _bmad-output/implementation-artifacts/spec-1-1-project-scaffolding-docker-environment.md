---
title: '1-1-project-scaffolding-docker-environment'
type: 'chore'
created: '2026-09-03'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
context:
  - '_bmad-output/implementation-artifacts/epic-1-context.md'
---

## Intent

**Problem:** The product has no runnable code yet. Developers need a working local environment (database + backend + frontend) from day one so all subsequent stories build and run.

**Approach:** Scaffold two separate repositories — `sms-frontend` (React SPA) and `sms-backend` (Express API) — each consuming the shared `sms-shared` types package versioned and available locally. Orchestrate everything with Docker Compose (PostgreSQL container + backend + frontend dev server) and wire `sms-shared` so both apps compile against the shared types without a registry publish.

## Boundaries & Constraints

**Always:**
- Use the pinned stack: Node 24 LTS, TypeScript 7, Express 5, Prisma 7, PostgreSQL 18, Vite 8, React 19, React Router 8.
- Two separate repositories `sms-frontend` and `sms-backend` (AD-11). No workspace-root spanning both.
- Keep `sms-shared` as the sole source of cross-repo data shapes (AD-16). Neither app defines a shared shape locally.
- `sms-shared` is versioned and linked into both apps via a local file/path reference (dev convenience); registry publish/versioning flow is handled later, not here.
- All services start under a single `docker compose up` on designated ports.
- Pin dependency versions and Docker image tags in committed lockfiles/config (no floating `latest`).

**Ask First:**
- None expected for scaffolding. If Docker availability or image tag choices block the agreed stack, HALT and confirm with the user before substituting.

**Never:**
- No application business logic or auth, and no business API endpoints in this story (all belong to later stories). The scaffold's `/health` readiness route is the only endpoint.
- No authoritative DB schema for real entities (User, Class, etc.) — those land in Story 1.4. Story 1.1 ships only a minimal `prisma/schema.prisma` + an initial migration so `migrate deploy` (AC #3) has something to apply.
- No cloud deployment scaffolding (deferred to v2 per AD-10).
- Do not define shared data models in-app; everything lives in `sms-shared`.
- Do not conflate repos: `sms-frontend` and `sms-backend` remain two separate repositories (AD-11), even though Story 1.1 runs them together via a single `docker compose up`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Fresh clone, `docker compose up` | PostgreSQL, backend, frontend all healthy on designated ports | N/A |
| SHARED_IMPORT | Export a type from `sms-shared`, import in both repos | Both repos typecheck/compile against it | Build fails if package not linked — fix the local file reference in the consuming `package.json` |
| DB_READY | Backend starts | `prisma migrate deploy` applies schema; backend accepts requests | Migration error surfaces in container logs, container exits non-zero |
| PORT_CONFLICT | Designated port already in use on host | Clear startup error identifies the port | Developer frees/re-maps the port |

## Code Map

- `sms-frontend/` -- React 19 + Vite 8 + TypeScript 7 SPA (its own repo; created here as minimal shell only)
- `sms-backend/` -- Express 5 + Prisma 7 + TypeScript 7 API (its own repo; created here as health route + Prisma bootstrap)
- `sms-shared/` -- versioned types package (AD-16), standalone; consumed by both repos via local path reference (initial DTO/type stubs)
- `docker-compose.yaml` -- orchestrates postgres, backend, frontend (sits at a shared tooling/scripts root, not inside either app repo)
- `sms-backend/package.json` + `sms-frontend/package.json` -- per-repo manifests; each declares `sms-shared` as a local/file dependency
- `.env.example` -- port/db env template; secrets never committed
- `README.md` -- local dev commands (`docker compose up`, ports, teardown, how the two repos + shared pkg fit together)

## Tasks & Acceptance

**Execution:**
- [x] `sms-shared/` -- scaffold versioned TypeScript types package with concrete initial DTOs (error envelope, pagination shape) -- establishes AD-16 contract; mark as stubs, authoritative defs land in later stories (e.g. 1.4)
- [x] `sms-backend/` -- scaffold Express 5 + TS 7 + Prisma 7 app as its own repo with a `/health` route that reports DB connectivity and a minimal `prisma/schema.prisma` + initial migration -- gives backend a runnable, DB-verifying entry point; reconciles AC #3 with the "no authoritative schema" constraint (only a stub schema here)
- [x] `sms-frontend/` -- scaffold React 19 + Vite 8 + TS 7 SPA as its own repo with a `vite.config.ts` (React plugin, dev port 5173, `/api` proxy to backend 3000) rendering a placeholder shell -- gives frontend a runnable dev server that can reach the backend in dev (avoids CORS)
- [x] Per-repo `package.json` + `tsconfig.json` + `Dockerfile` + `npm run typecheck` script -- each repo self-contained; `sms-shared` referenced as a local/file dependency in both; tsconfig enables `tsc --noEmit` -- satisfies AC #2 and the verification command
- [x] `docker-compose.yaml` + `.env.example` + `.dockerignore` + `.gitignore` -- wire postgres (PG 18), backend, frontend services on env-driven ports with pinned images/deps; Compose loads `.env` via `env_file`; excludes node_modules/dist/secrets from build and VCS -- meets Story AC #1 (single `up`)
- [x] `sms-backend` env guard -- read `DATABASE_URL` from env at startup; throw with a clear message if absent -- prevents unhelpful Prisma connection errors
- [x] `README.md` -- document `docker compose up`, env-driven ports, teardown, and the two-repo + shared-package layout -- meets developer day-one onboarding
- [x] Verification -- run `npm install`/`npm ci` (populate node_modules), `docker compose up --build`, and a compile/typecheck importing a sms-shared type in both repos -- confirms all three Story ACs

**Acceptance Criteria:**
- Given the developer clones the repository, when they run `docker compose up`, then PostgreSQL, the Express backend, and the Vite dev server all start without errors and are accessible on their designated ports.
- Given sms-shared is installed in both frontend and backend, when a type is exported from sms-shared, then both repos can import and compile against it without errors.
- Given the backend starts, when Prisma migrate runs inside the Docker container, then the database schema is applied and the server is ready to accept requests.

## Spec Change Log

- Created initial Prisma migration (`prisma/migrations/20260903000000_init/migration.sql` + `migration_lock.toml`) manually since no local PG was available for `prisma migrate dev --create-only`. Empty stub migration is valid for AC #3 (`migrate deploy` applies cleanly).
- (code review loopback) Port wiring: the Vite `/api` proxy must target the backend's actual internal listen port. Wire the backend container's `PORT` env var through `docker-compose.yaml` (from `BACKEND_PORT`), and the Vite proxy target must derive from the same source so customizing `BACKEND_PORT` doesn't break the frontend connection. Avoided known-bad state: proxy hardcodes `backend:3000` while backend listen port changes independently, breaking the health fetch. KEEP: env-driven ports pattern; Vite `/api` proxy approach (no backend CORS needed).
- (code review loopback) Backend readiness: add a backend healthcheck to `docker-compose.yaml` (e.g. curl/wget against `http://localhost:3000/api/health` or a Node probe) and set `frontend.depends_on.backend.condition: service_healthy`. Avoided known-bad state: frontend fetches `/api/health` before the backend finishes `prisma migrate deploy` + listen, showing a transient "Backend unreachable" false negative. KEEP: `db` already uses `service_healthy`; extend the same pattern to the backend.
- (code review loopback, applied) Port wiring rectified to the review's intended design: backend container internal `PORT` is fixed at `3000` (matches Dockerfile EXPOSE and proxy target); only the host-side published port is configurable via `BACKEND_PORT`. Vite proxy targets `http://backend:3000` fixed (container-internal). Documented in README. Avoided known-bad state from prior pass where internal PORT varied with BACKEND_PORT while the published mapping stayed pinned to container 3000.
- (code review loopback, applied) Backend healthcheck added to compose (Node `fetch` probe against `http://localhost:3000/api/health`, since node:24-slim may lack curl/wget) and `frontend.depends_on.backend.condition: service_healthy`.
- (applied) Upgraded to pinned majors per spec: Prisma 7.10.0 (requires prisma.config.ts + @prisma/adapter-pg + `prisma-client` generator with `output`), TypeScript 7.0.2, Vite 8.2.2 (+ @vitejs/plugin-react 6.1.1 for Vite 8 compatibility). Added `prisma.config.ts` (DATABASE_URL with generate-time fallback so image builds don't need a DB URL), generated client at `src/generated/prisma`, adapter-backed `new PrismaClient({ adapter })` in health route, dotenv load in index.ts.
- (applied) `health.ts`: added 5s timeout guard (`Promise.race`) on the `SELECT 1` probe and `console.error` in catch; response shape (HealthCheckResponse) unchanged.
- (applied) `index.ts`: PORT validated — NaN or <= 0 logs FATAL and exits 1.
- (applied) Per-repo `.dockerignore` + per-repo `.gitignore` added (backend also ignores `src/generated/`); root `.dockerignore` already covers node_modules/dist/.git/.env.

## Suggested Review Order

**Backend bootstrap & health**

- Express entrypoint: DATABASE_URL guard + PORT validation; fails fast on bad config
  [`index.ts:4`](../../sms-backend/src/index.ts#L4)
- Health route: Prisma `SELECT 1` with 5s timeout, logs real error, keeps HealthCheckResponse shape
  [`health.ts:9`](../../sms-backend/src/routes/health.ts#L9)

**Prisma 7 wiring**

- `prisma.config.ts` — schema/migrations paths + datasource URL from env (build-safe fallback)
  [`prisma.config.ts:1`](../../sms-backend/prisma.config.ts#L1)
- Stub schema — generated client into `src/generated/prisma`; authoritative entities in Story 1.4
  [`schema.prisma:1`](../../sms-backend/prisma/schema.prisma#L1)
- Initial empty migration so `migrate deploy` (AC #3) has something to apply
  [`migration.sql:1`](../../sms-backend/prisma/migrations/20260903000000_init/migration.sql#L1)

**Shared types contract**

- ErrorEnvelope, PaginatedResponse, HealthCheckResponse — sole cross-repo shapes (AD-16)
  [`index.ts:1`](../../sms-shared/src/index.ts#L1)

**Frontend shell**

- Placeholder React app importing HealthCheckResponse from sms-shared
  [`App.tsx:1`](../../sms-frontend/src/App.tsx#L1)
- Vite config: React plugin, port 5173, `/api` proxy to backend internal port 3000
  [`vite.config.ts:1`](../../sms-frontend/vite.config.ts#L1)

**Docker orchestration**

- Compose: PG 18 + backend + frontend; backend healthcheck + both `depends_on` on `service_healthy` (no startup race)
  [`docker-compose.yaml:1`](../../docker-compose.yaml#L1)
- Backend Dockerfile: local prisma/tsx from node_modules, builds sms-shared, prisma generate + migrate deploy
  [`Dockerfile:1`](../../sms-backend/Dockerfile#L1)
- Frontend Dockerfile: builds sms-shared, runs Vite dev server
  [`Dockerfile:1`](../../sms-frontend/Dockerfile#L1)

**Config & onboarding**

- `.env.example` — port/env template; `.dockerignore`/`.gitignore` exclude node_modules, dist, secrets
- `README.md` — day-one onboarding: docker compose up, ports, teardown, two-repo + shared layout

## Design Notes

**Repo topology:** AD-11 mandates two separate repositories (`sms-backend`, `sms-frontend`) — the user confirmed this over a single workspace monorepo. Story 1.1's literal AC wording ("monorepo scaffolded") conflicts with AD-11; AD-11 is authoritative and the spec follows two repos. `sms-shared` is a standalone package both repos consume; for Story 1.1 it is linked via a local file/path reference so type-sharing works immediately without a registry publish. Story 1.1 is organized as a monorepo-like dev container (`docker-compose.yaml` + shared env) that mounts/accelerates the two separate repos together for a single `up`, but the two app codebases remain separate repos.

**Shared package wiring:** AD-16 calls for a published, versioned `sms-shared` package, but Story 1.1 needs local type-sharing working immediately. Use a local file/path reference in each repo's `package.json` so both compile against `sms-shared` without a registry publish — satisfies Story AC #2 and defers publish/packaging to a later story. Do not start rolling the publish pipeline here.

**Prisma scope:** Story 1.1 creates only a minimal `prisma/schema.prisma` + an initial (introductory/empty) migration so `migrate deploy` in AC #3 has something to apply; authoritative entities (User, Class, etc.) land in Story 1.4. This is why a single Prisma migration exists before the real schema story.

**Ports (explicit, pinned, env-driven):** DB `5432`, backend `3000`, frontend Vite `5173`. Encode as env vars (referenced from `.env.example`) and consumed by `docker-compose.yaml` so a developer with a port conflict (e.g. native Postgres on 5432) can remap without editing Compose internals. The health check in AC #1 verifies against these.

## Verification

**Commands:**
- `npm install` (or `npm ci`) at both repos — expected: node_modules populated, `sms-shared` resolved locally
- `docker compose config` -- expected: valid, all services reference pinned images
- `docker compose up --build` -- expected: PG, backend, frontend all healthy; backend migration applied; frontend served
- `npm run typecheck` at backend and frontend with a `sms-shared` type import -- expected: both pass, proving shared-import wiring (Story AC #2)

**Manual checks (if no CLI):**
- `curl localhost:3000/health` returns 200 with the health payload.
- Open `localhost:5173` in a browser — placeholder app renders.

### Review Findings

- [x] [Review][Decision] Repo topology: single-workspace vs "two separate repositories" (AD-11 / epic context) — RESOLVED: user chose (b) two separate repositories honoring AD-11. Spec rewritten to two repos (`sms-frontend`, `sms-backend`) each consuming `sms-shared` via local file reference; `docker-compose.yaml` sits at a shared tooling root that runs the two repos together with a single `up`. Intent, Boundaries, Code Map, Tasks, and Design Notes updated. AD-11 remains authoritative over Story 1.1's literal "monorepo" wording.

- [x] [Review][Patch] Dockerfiles missing for backend and frontend — RESOLVED: per-repo `Dockerfile` task added for both repos. [sms-backend/Dockerfile, sms-frontend/Dockerfile]
- [x] [Review][Patch] tsconfig.json missing per package — RESOLVED: per-repo `tsconfig.json` task added enabling `tsc --noEmit`. [sms-backend/tsconfig.json, sms-frontend/tsconfig.json, sms-shared/tsconfig.json]
- [x] [Review][Patch] .gitignore and .dockerignore missing — RESOLVED: added to the Compose/env task. [.gitignore, .dockerignore]
- [x] [Review][Patch] vite.config.ts missing — RESOLVED: `vite.config.ts` task added (React plugin, dev port 5173, `/api` proxy). [sms-frontend/vite.config.ts]
- [x] [Review][Patch] CORS / proxy strategy undefined — RESOLVED: Vite `/api` proxy to backend 3000 adopted in dev; no backend CORS needed for the scaffold. Serves Story AC #1.
- [x] [Review][Patch] Per-package package.json + root workspaces + typecheck script — RESOLVED: per-repo `package.json` + `tsconfig.json` + `typecheck` script added; each repo declares `sms-shared` as a local/file dependency. (No root workspaces — removed with the two-repo topology.) [sms-shared/package.json, sms-backend/package.json, sms-frontend/package.json]
- [x] [Review][Patch] Shared DTOs under-specified — RESOLVED: task now requires concrete initial DTOs (error envelope, pagination shape) as stubs, authoritative defs deferred to later stories. [sms-shared/src/*.ts]
- [x] [Review][Patch] "No DB schema" Never-constraint contradicts AC #3 — RESOLVED: Never-constraint scoped; Story 1.1 ships a minimal `prisma/schema.prisma` + initial migration, authoritative entities land in Story 1.4. [sms-backend/prisma/schema.prisma]
- [x] [Review][Patch] "No API endpoints" Never-constraint vs /health route — RESOLVED: constraint qualified to allow the scaffold's `/health` readiness route only.
- [x] [Review][Patch] Env loading and DB_URL source undefined — RESOLVED: Compose loads `.env` via `env_file`; backend reads `DATABASE_URL` from env with startup guard. [docker-compose.yaml, .env.example, sms-backend/src]
- [x] [Review][Patch] /health should report DB connectivity — RESOLVED: `/health` route now reports DB connectivity (e.g. `SELECT 1`), verifying AC #3 genuinely. [sms-backend/src/routes/health.ts]
- [x] [Review][Patch] npm install / dependency-install step missing — RESOLVED: `npm install`/`npm ci` step added to Verification.
- [x] [Review][Patch] Port-conflict override mechanism absent — RESOLVED: ports are env-driven (from `.env.example`), consumed by Compose, so a conflict can be remapped without editing Compose internals.
- [x] [Review][Defer] React Router 8 pinned in stack but not installed in frontend shell — DEFERRED: routing isn't needed for the placeholder shell; correct to defer router config to the first routing-dependent story.
- [x] [Review][Defer] docker compose vs docker-compose command/filename spelling — DEFERRED: aligned on `docker compose` / `docker-compose.yaml` in README; cosmetic.

- [x] [Review][Dismiss] Acceptance Criteria count mismatch — dismissed: the section actually lists 3 Given/When/Then criteria; the "only two" read was a miscount.
