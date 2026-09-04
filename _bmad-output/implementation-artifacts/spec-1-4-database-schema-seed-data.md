---
title: 'Story 1.4 — Database Schema & Seed Data'
type: 'feature'
created: '2026-09-04'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
context:
  - '_bmad-output/implementation-artifacts/epic-1-context.md'
  - '_bmad-output/planning-artifacts/epics.md'
---

## Intent

**Problem:** The Prisma schema (`sms-backend/prisma/schema.prisma`) is an empty stub with zero models and no seed script exists, so no entity is persisted and there is no initial teacher account for later login/RBAC stories (Epics 2–7 all depend on the data model).

**Approach:** Define the authoritative Prisma schema (User, Class, Schedule, Exam, Question, Submission, Score — with a Role enum, foreign keys, indexes, UUID ids, UTC timestamps), generate one real migration, and add an idempotent seed that creates a known-credential teacher, one class with a schedule, and two enrolled students.

**Scope note (AR-4):** The epic's Story 1.4 AC4 (error envelope `{error:{code,message}}`) is an API response shape and is delivered by the API/auth stories (1.5/1.6), not this DB-only story. It is deferred explicitly, not omitted.

## Boundaries & Constraints

**Always:**
- Prisma schema is the source of truth — no raw SQL migrations hand-edited beyond what `prisma migrate` generates.
- PostgreSQL 18 via the `db` service in `docker-compose.yaml`. IDs are `uuid()` defaults. All `DateTime` fields stored UTC (AR-6) using Prisma's default UTC normalization; display conversion is a later-story (API-layer) concern.
- Backend stack from Story 1.1 is fixed: Express 5, Prisma 7 (`@prisma/adapter-pg` + `PrismaPg`), TS 7, tsx. Reuse the exact bootstrap pattern already in `sms-backend/src/routes/health.ts` (adapter + `PrismaClient({ adapter })`).
- Seed must be idempotent and converge to one stable state regardless of re-runs or partial prior state.
- All commands run from the `sms-backend` package root (where package.json + prisma.config.ts live), since Prisma resolves the config/schema relative to the working directory.
- **FK `onDelete` matrix (resolved):** `Cascade` on owned children — `Schedule.classId`, `Question.examId`, `Submission.examId`, `Submission.studentId`, `Score.submissionId`; `Restrict` on user back-refs — `Class.teacherId`, `Score.gradedById`. Deleting a parent deletes its owned rows; deleting a `User` with a teacher/grading role is restricted rather than cascading.
- **Class identity key (resolved):** `Class.slug` is unique and is the seed's upsert match key (stable, independent of display `name`).
- **Schedule multiplicity (resolved):** a class may have multiple `Schedule` rows (e.g. MWF); no `@@unique(classId, dayOfWeek)`.
- Existing files keep working: `sms-backend/src/index.ts` (env guards), `sms-backend/src/routes/health.ts` (DB probe), `sms-frontend` and `sms-shared` stay untouched this story.

**Ask First:**
- (enrollment modeling resolved — implicit many-to-many confirmed) Class↔student membership uses a Prisma **implicit many-to-many** between `Class` and `User` (students), keeping to AC1's seven declared tables. This deliberately drops enrollment metadata (enrolledAt/status).
- Password hashing is introduced now with **bcryptjs** (pure JS — no native build on the `node:24-slim` Docker image) so the seeded teacher carries a real, verifiable hash for Story 1.5 login. Story 1.5 must use the same library.

**Never:**
- No auth, session, JWT, or route logic (Stories 1.5/1.6). No error-envelope route handling (deferred to API/auth stories). No `sms-shared` domain DTOs yet (no endpoints exist; DTOs land with the first API-consuming story). No self-registration.
- Seeding is **manual/dev-only** — `prisma db seed` is invoked explicitly. The known credential (`teacher@school.test` / `change-me-123`) must never be auto-seeded by a production container start.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| SEED_FRESH | `npx prisma db seed` on empty DB | Creates teacher, class + schedule, two students; teacher owns the class (is its `teacherId`, not an enrollee) | Fails loudly with non-zero exit + message if DB unreachable |
| SEED_RE_RUN | `npx prisma db seed` twice | No duplicates; same single teacher/class/students/schedule (idempotent, convergent) | N/A |
| SEED_PARTIAL | seed on a DB where class exists but students/schedule were removed | Re-links the two students and recreates the missing schedule (converges to the documented state) | N/A |
| MIGRATE_EMPTY_STUB | `prisma migrate deploy` on fresh DB volume | Applies existing empty `init` stub then the new authoritative migration | Aborts with error if DB down |
| GENERATE_CLIENT | `npm run db:generate` | Regenerated client includes all 7 models (8 tables incl. implicit join) + `Role`/`Weekday` enums | N/A |

## Code Map

- `sms-backend/prisma/schema.prisma` -- REPLACE the 12-line stub (generator `prisma-client` → `../src/generated/prisma`, moduleFormat esm, datasource postgresql; currently zero models) with the full 7-model schema.
- `sms-backend/prisma.config.ts` -- Prisma 7 config (schema, migrations.path, datasource.url from `process.env.DATABASE_URL`). Add `migrations.seed: "tsx prisma/seed.ts"` (v7 locates seed here, NOT package.json `prisma.seed`).
- `sms-backend/prisma/seed.ts` -- NEW. Idempotent seed; `dotenv/config` + `PrismaPg` adapter (mirror `health.ts:2-11`).
- `sms-backend/package.json` -- add `db:seed` script (`prisma db seed`) + `bcryptjs` dep + `@types/bcryptjs` devDep.
- `sms-backend/prisma/migrations/` -- keep empty `20260903000000_init`; generate a NEW migration (`prisma migrate dev --name story-1.4-schema`) once the `db` container is up.
- `sms-backend/src/generated/prisma/` -- regenerated client (not hand-edited; produced by `npm run db:generate`).
- `docker-compose.yaml:2-13` -- `db` service (postgres:18-alpine) for local migration/seed verification.
- `.env` -- `DATABASE_URL` + POSTGRES_* vars drive migrate/seed connections (read-only; secrets not committed).

## Tasks & Acceptance

**Execution:**
- [x] `sms-backend/prisma/schema.prisma` -- add `Role` enum (TEACHER, STUDENT), `Weekday` enum (MONDAY..SUNDAY), and models: `User` (uuid id, unique `username`, `passwordHash`, `firstName`, `lastName`, `role`, created/updatedAt; `classes` back-relation), `Class` (uuid id, unique `slug`, `name`, `teacherId` FK→User `Restrict`, `students` implicit m2m→User, created/updatedAt), `Schedule` (uuid id, `classId` FK→Class `Cascade`, `dayOfWeek Weekday`, `startTime` String "HH:MM" with `@@check` regex + `endTime` `@@check` regex), `Exam` (uuid id, `classId` FK→Class `Cascade`, `title`, `description?`, `scheduledAt DateTime`, `durationMinutes Int`), `Question` (uuid id, `examId` FK→Exam `Cascade`, `prompt`, `options Json[]`, `correctAnswer`, `points Int`), `Submission` (uuid id, `examId` FK→Exam `Cascade`, `studentId` FK→User `Cascade`, `status` enum IN_PROGRESS/SUBMITTED, `answers Json?`, `submittedAt DateTime?`, unique `[examId, studentId]`), `Score` (uuid id, `submissionId` unique FK→Submission `Cascade`, `pointsEarned`, `pointsPossible`, `gradedBy?` FK→User `Restrict`, `gradedAt?`). Add `@@index` on every FK + `Schedule.dayOfWeek` + `Exam.scheduledAt`. Use `@check("{0} ~ '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'")` on `startTime`/`endTime`. *(mechanism deviation → DB CHECK in migration; see Spec Change Log)*
- [x] `sms-backend/prisma.config.ts` -- add `migrations.seed: "tsx prisma/seed.ts"`.
- [x] `sms-backend/package.json` -- add `"db:seed": "prisma db seed"` script (a convenience alias that resolves via `prisma.config.ts` `migrations.seed`, NOT the deprecated package.json `prisma.seed`); add `bcryptjs` dependency and `@types/bcryptjs` devDependency.
- [x] `sms-backend/prisma/seed.ts` -- NEW idempotent, convergent seed: connect via `prisma.$transaction` (`PrismaPg`); `upsert` teacher by `username` `teacher@school.test` / password `change-me-123` (bcryptjs hash, 10 rounds) role TEACHER; `upsert` class by `slug` (e.g. `biology-midterm`) with a display `name`; always ensure the class has its `Schedule` (upsert by `classId`+`dayOfWeek`) and exactly the two students `alex.rivera` + `sara.chen` (role STUDENT) linked in `Class.students` (connect missing, even if the class already existed); log a concise summary. Convergence: re-running or running on a partial prior state yields the same single teacher/class/schedule/two students.
- [x] `sms-backend/prisma/migrations/<new>/migration.sql` -- generated by running `docker compose up -d db` then `npm run db:migrate:dev -- --name story-1.4-schema` from `sms-backend`; verify SQL creates 8 tables (7 models + implicit m2m join table) with the declared FK actions + indexes.

**Acceptance Criteria:**
- Given a fresh database, when `prisma migrate deploy` runs, then all tables (`User`, `Class`, `Schedule`, `Exam`, `Question`, `Submission`, `Score`, plus the implicit class-student join table) exist with correct foreign keys (incl. the `onDelete` matrix) and indexes, and `User` has a `TEACHER`/`STUDENT` role enum.
- Given `npx prisma db seed` runs, when it completes, then a teacher exists with username `teacher@school.test` and a bcryptjs hash verifiable against `change-me-123`, plus one class with a schedule and two enrolled students (verified by DB queries, not just process exit).
- Given the seed runs again (or on a partial prior state with removed students/schedule), when it completes, then the state converges — no duplicate records are created and the two students + schedule are restored (idempotent, verified by row counts).
- Given a record is created, when read back, then all timestamps are UTC (AR-6) — verified by a `timestamptz` column check.
- Given `npm run typecheck` and `npm run build` run in `sms-backend`, then they pass.

## Spec Change Log

- **2026-09-04 (implement)** — Deviations from planning-time task wording, recorded per step-03:
  - `@check`/`@@check` is **not supported in Prisma 7.10** (`Attribute not known`). The `startTime`/`endTime` "HH:MM" validation is enforced via **DB CHECK constraints** (`Schedule_startTime_check`, `Schedule_endTime_check`), added to the generated migration (`--create-only` then appended) rather than as Prisma `@check` attributes. Design intent (format/range validation) is satisfied; mechanism differs. See `sms-backend/prisma/migrations/20260904042829_story_1_4_schema/migration.sql`.
  - `DateTime` columns carry `@db.Timestamptz(3)` so all timestamps map to `timestamptz` (AC4/AR-6 / Verification `udt_name` check). Prisma's default `DateTime` maps to `timestamp(3)` (no TZ), so the attribute is required to satisfy the spec's own UTC/timestamptz verification.

- **2026-09-04 (review fix)** — Corrected the Schedule time CHECK regex: the original `'^[0-2][0-9]:[0-5][0-9]$'` erroneously allowed hours 20–29 (`[0-2][0-9]` matches `2[0-9]`). Both `Schedule_startTime_check` and `Schedule_endTime_check` now use `'^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'` (hours 00–23 only) in `sms-backend/prisma/migrations/20260904042829_story_1_4_schema/migration.sql`, and the already-applied DB constraints were dropped and re-added with the corrected expression. Verified: `23:59` inserts, `25:00`/`29:59` are rejected.

## Design Notes

- **Entity set follows AC1's authoritative table list exactly** (`User, Class, Schedule, Exam, Question, Submission, Score`). The epic story's prose mentions "Student, Teacher" but AC1 resolves them to the `Role` enum on `User` — no separate `Student`/`Teacher` tables. Exam ≡ Test (both are `Exam`); the "test" naming in docs is semantic only.
- **Enrollment** is an implicit Prisma many-to-many (`Class.students ⇄ User.classes`). This satisfies "two enrolled students" and later roster/student-count queries while keeping to the 7 declared tables. Implicit m2m renders the join table + indexes automatically; it deliberately drops enrollment metadata (enrolledAt/status).
- **onDelete matrix (resolved):** `Cascade` on owned children (schedule/questions/submissions/scores are meaningless without their parent), `Restrict` on user back-refs (`teacherId`, `gradedBy`) so deleting a User in a teacher/grading role fails rather than silently detaching.
- **Class `slug`** is the stable seed identity key (unique). Seed upserts the class by `slug`, so renames of `name` or partial state never duplicate it.
- **Seed password `change-me-123`** is deliberately a known dev credential (matches Story 1.5 login test) and is **dev-only** — `prisma db seed` is manual; it is never auto-seeded by a production container start. Seeding the hash now avoids a placeholder that would break 1.5.
- **`include` example for the seed / later queries:**
  - `prisma.class.findMany({ include: { students: true, schedule: true } })`
- **UTC** needs no extra code: Prisma `DateTime` maps to `timestamptz` and normalizes to UTC in the driver (mirrors `health.ts`'s `new Date().toISOString()`). Display-timezone conversion is deferred to the API layer (later stories).
- **Schedule is time-of-day only:** `startTime`/`endTime` are 24h "HH:MM" strings validated by `@@check`, not `DateTime` — a weekly recurring slot has no meaningful date. A class may hold multiple slots (no `(classId, dayOfWeek)` uniqueness).
- **Stub migration stays.** The empty `20260903000000_init` remains applied-first; the new migration adds all real tables. On a fresh volume, `migrate deploy` applies both in order.

## Verification

All commands run from `sms-backend` (the package root), unless noted.

**Commands:**
- `docker compose up -d db` -- expected: postgres:18-alpine healthy (healthcheck `pg_isready`).
- `cd sms-backend && npx prisma validate` -- expected: schema valid, config loads.
- `cd sms-backend && npm run db:migrate:dev -- --name story-1.4-schema` -- expected: migration generated + applied; SQL creates 8 tables (7 models + implicit m2m join) with the declared FK actions + indexes. Confirm by inspecting `prisma/migrations/<new>/migration.sql`.
- `cd sms-backend && npm run db:generate` -- expected: client regenerated with all 7 models + `Role`/`Weekday` enums.
- `cd sms-backend && npm run db:seed` then `npm run db:seed` again -- expected: both succeed; **row counts unchanged** after the second run (query `"User"`/`"Class"`/`"Schedule"`; assert exactly 1 teacher, 1 class, 1 schedule, 2 students, and 2 join rows in the implicit `_ClassToUser`/`_UserToClass` table).
- Verify UTC: query `information_schema.columns` on a datetime column (e.g. `"User".createdAt`) and assert `udt_name` = `timestamptz`.
- Verify FKs/indexes: query `pg_constraint` (contype='f') and `pg_indexes` for each declared FK + `@@index`; assert each exists.
- `cd sms-backend && npm run typecheck && npm run build` -- expected: pass.
- `cd sms-backend && npx prisma migrate deploy` (fresh volume) -- expected: reapplies cleanly (Dockerfile does this on container start).

### Review Findings

**Decision-needed (resolved 2026-09-04):**
- [x] [Review][Decision] Class identity key for seed -- RESOLVED: added unique `Class.slug`, used as the seed's upsert key (`name` remains display-only).
- [x] [Review][Decision] FK `onDelete` action matrix -- RESOLVED: Cascade on owned children (Schedule, Question, Submission, Score), Restrict on user back-refs (teacherId, gradedBy). Recorded in Always + Design Notes.
- [x] [Review][Decision] Enrollment modeling -- RESOLVED: implicit many-to-many confirmed (no explicit `Enrollment`); enrollment metadata deliberately out of scope.
- [x] [Review][Decision] Seed environment gating -- RESOLVED: seeding is manual/dev-only; known credential never auto-seeded on a production container start. Recorded in Never.
- [x] [Review][Decision] Schedule uniqueness -- RESOLVED: multiple `Schedule` rows per class allowed; no `@@unique(classId, dayOfWeek)`.

**Patch (applied 2026-09-04):**
- [x] [Review][Patch] Verification: added DB queries (post-seed row counts proving idempotency; `timestamptz` round-trip; FK/index existence; implicit m2m join table existence) -- applied to Verification.
- [x] [Review][Patch] Seed idempotency made convergent (re-link students + schedule when the class already exists; wrapped seed in `prisma.$transaction`) -- applied to Tasks/Design Notes.
- [x] [Review][Patch] Schedule `startTime`/`endTime` format + range validation via `@@check` regex (24h HH:MM) -- applied to schema task.
- [x] [Review][Patch] Documented the AR-4 (error-envelope) deferral explicitly -- applied to Intent scope note + Never.
- [x] [Review][Patch] Fixed I/O matrix "teacher enrolled" (teacher is class owner, not an enrollee) -- applied to I/O matrix.
- [x] [Review][Patch] Fix typo "RCEPLACE" -> "REPLACE" -- no-op: the Code Map already read "REPLACE" (reviewer finding was against an earlier draft).
- [x] [Review][Patch] Clarified `db:seed` delegates via `prisma.config.ts` `migrations.seed` (Prisma 7), not package.json `prisma.seed` -- applied to Tasks + Design Notes.
- [x] [Review][Patch] Reworded AC2: password stored as bcryptjs hash *verifiable against* `change-me-123` -- applied to Acceptance Criteria.
- [x] [Review][Patch] Made "7 models / 8 tables" count consistent (7 Prisma models + implicit join table = 8 tables) -- applied to Tasks/Verification.
- [x] [Review][Patch] Stated working directory (`sms-backend` root) for migrate/seed commands -- applied to Always + Verification.

**Deferred:**
- [x] [Review][Defer] Role guard (a TEACHER user must not be in `Class.students`) -- app-layer, later stories
- [x] [Review][Defer] `Submission.status` GRADED lifecycle -- Epic 4 grading
- [x] [Review][Defer] Question.options/correctAnswer deep contract -- Epics 3-4 own question detail; schema intentionally skeletal
- [x] [Review][Defer] bcrypt rounds stale-hash re-hash policy -- Story 1.5
- [x] [Review][Defer] Username format (email-ish `@school.test`) -- Story 1.5 login
- [x] [Review][Defer] Co-teacher / multi-class exam / multi-tenancy -- out of 1.4 scope (single-tenant assumption)
- [x] [Review][Defer] `prisma migrate dev` interactive/CI behavior -- non-blocking local dev

## Suggested Review Order

**Schema: entity model & relations**

- Anchor: `Class` is the hub of every FK (teacher, students m2m, schedules, exams).
  [`schema.prisma:47`](../../sms-backend/prisma/schema.prisma#L47)

- Role enum drives RBAC in later stories; pairs with the implicit m2m below.
  [`schema.prisma:11`](../../sms-backend/prisma/schema.prisma#L11)

- User's four relations show the Convention-driven naming (ClassStudents/ClassTeacher/ScoreGradedBy); the onDelete matrix lives here.
  [`schema.prisma:31`](../../sms-backend/prisma/schema.prisma#L31)

- Submission/Score carry the `[examId, studentId]` unique + rest of the delete matrix.
  [`schema.prisma:105`](../../sms-backend/prisma/schema.prisma#L105)

**Time & format validation**

- CHECK constraints enforce the 24h HH:MM format; note the corrected 00-23 hour regex and the drop/re-add.
  [`migration.sql:179`](../../sms-backend/prisma/migrations/20260904042829_story_1_4_schema/migration.sql#L179)

**Seed idempotency & convergence**

- Transaction wraps teacher/class/students upserts so a re-run or partial state converges.
  [`seed.ts:41`](../../sms-backend/prisma/seed.ts#L41)

- Class upsert by `slug` + `students: set` is what makes re-runs deterministic.
  [`seed.ts:83`](../../sms-backend/prisma/seed.ts#L83)

- Schedule is created only when missing; the class can hold multiple slots.
  [`seed.ts:89`](../../sms-backend/prisma/seed.ts#L89)

**Credential handling**

- Students hash the same plaintext independently so stored hashes differ per user.
  [`seed.ts:59`](../../sms-backend/prisma/seed.ts#L59)

- Early guard gives a clear error instead of a confusing adapter failure.
  [`seed.ts:6`](../../sms-backend/prisma/seed.ts#L6)

- Explicit success exit so the Pool handle cannot keep the process alive.
  [`seed.ts:130`](../../sms-backend/prisma/seed.ts#L130)

**Config**

- `migrations.seed` is how Prisma 7 locates the seed (not package.json `prisma.seed`).
  [`prisma.config.ts:8`](../../sms-backend/prisma.config.ts#L8)

- `db:seed` convenience alias resolving through the config above.
  [`package.json:15`](../../sms-backend/package.json#L15)