---
title: 'Story 1.6 — Role-Based Access Control'
type: 'feature'
created: '2026-09-04'
status: 'done'
baseline_commit: '32d515dec588e96f5e57e6999991168acdf5f880'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-1-context.md'
  - '_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 1.5 issues a JWT whose payload carries a `role` (`TEACHER`/`STUDENT`), but the backend never enforces that role. Any authenticated user can reach any endpoint once business endpoints land in Epics 2-7, so teachers could access student features and vice versa.

**Approach:** Add a reusable `requireRole` authorization middleware that composes after the existing `requireAuth` middleware, returning a 403 error envelope on role mismatch and 401 when unauthenticated. Wire it onto demonstrator teacher-only and student-only endpoints that prove the pattern (and that Epics 2-7 business routes will reuse), verified against the three acceptance scenarios.

</frozen-after-approval>

## Boundaries & Constraints

**Always:**
- `requireAuth` runs first and attaches `req.user` (`{ userId, username, role }`); `requireRole` only inspects `req.user`.
- Protected route composition: `router.get(path, requireAuth, requireRole("TEACHER"), handler)` — `requireRole` is variadic `requireRole(...roles)` so multi-role routes work.
- No JWT / invalid JWT → 401 `{ "error": { "code": "UNAUTHORIZED" | "TOKEN_EXPIRED", "message": ... } }` (already handled by `requireAuth`).
- Valid JWT but wrong role → 403 `{ "error": { "code": "FORBIDDEN", "message": "You do not have permission to access this resource" } }`.
- If `requireRole` is reached without `req.user` set (misordered composition), it must still return 401 UNAUTHORIZED rather than crash.
- All existing error envelopes stay unchanged; role checks never return 200.
- Demonstrator endpoints return `{ "data": { "ok": true } }` on success (no invented business logic).

**Ask First:**
- None known at plan time. If a new decision emerges during execution, HALT and ask.

**Never:**
- No frontend changes — Story 1.5 already guards `/teacher/*` vs `/student/*` routes via `ProtectedRoute` in `App.tsx`. This story is backend-only.
- No invented teacher/student business routes (create exam, grade, submit exam) — those land with their own stories in Epics 2-7.
- No changes to JWT signing, cookie handling, or the login flow.
- No changes to the `User` schema or seed data.
- Do not duplicate the 401 handling already in `requireAuth`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| TEACHER_ON_TEACHER_ROUTE | Student-issued JWT + `GET /api/protected/teacher-only` | 403 + envelope `{ code: "FORBIDDEN", message: "You do not have permission to access this resource" }` | N/A |
| TEACHER_ON_STUDENT_ROUTE | Teacher-issued JWT + `GET /api/protected/student-only` | 403 + envelope `{ code: "FORBIDDEN", message: "You do not have permission to access this resource" }` | N/A |
| NO_JWT | No cookie + any protected route | 401 + envelope `{ code: "UNAUTHORIZED", message: "Authentication required" }` | N/A |
| EXPIRED_JWT | Expired cookie + any protected route | 401 + envelope `{ code: "TOKEN_EXPIRED", message: "Session expired" }` | N/A |
| CORRECT_ROLE | Teacher-issued JWT + teacher-only route (or student + student-only) | 200 + `{ data: { ok: true } }` | N/A |

## Code Map

- `sms-backend/src/middleware/auth.ts` -- EXISTING `requireAuth` + `JwtPayload` + `req.user` attachment; reuse, do not modify.
- `sms-backend/src/middleware/express.d.ts` -- EXISTING `Request.user` augmentation; read-only.
- `sms-backend/src/middleware/authorize.ts` -- NEW: `requireRole(...roles)` factory returning an Express middleware.
- `sms-backend/src/routes/protected.ts` -- NEW: demonstrator router with `GET /protected/teacher-only` and `GET /protected/student-only`.
- `sms-backend/src/index.ts:22-23` -- Mount `app.use("/api", protectedRouter)` beside `healthRouter` and `authRouter`.
- `sms-shared/src/index.ts` -- `ApiError`/`ErrorEnvelope` types for the 403 envelope (read-only reference).

## Tasks & Acceptance

**Execution:**
- [x] `sms-backend/src/middleware/authorize.ts` -- NEW: `requireRole(...roles: Array<"TEACHER" | "STUDENT">)` factory. If `!req.user` return 401 UNAUTHORIZED; if `!roles.includes(req.user.role)` return 403 FORBIDDEN with the fixed message; else `next()`.
- [x] `sms-backend/src/routes/protected.ts` -- NEW: `protectedRouter` with `GET /protected/teacher-only` using `requireAuth, requireRole("TEACHER")` and `GET /protected/student-only` using `requireAuth, requireRole("STUDENT")`, each returning `{ data: { ok: true } }`.
- [x] `sms-backend/src/index.ts` -- Import and mount `protectedRouter` under `/api`.

**Acceptance Criteria:**
- Given a student JWT, when a teacher-only route is hit, then the backend returns 403 with the FORBIDDEN error envelope.
- Given a teacher JWT, when a student-only route is hit, then the backend returns 403 with the FORBIDDEN error envelope.
- Given no JWT cookie, when any protected route is hit, then the backend returns 401 with the UNAUTHORIZED error envelope.
- Given a matching role JWT, when the matching protected route is hit, then the backend returns 200 with `{ data: { ok: true } }`.
- Given `npm run typecheck` and `npm run build` run in sms-backend, then both pass.

## Spec Change Log

## Design Notes

The epic framing references "create exam, grade" and "submit exam, view personal results" as teacher/student-only examples, but those endpoints do not exist until Epics 2-7. Per planning decision, this story proves the RBAC pattern on clearly-labeled demonstrator routes (`/api/protected/teacher-only`, `/api/protected/student-only`). Business routes in later epics adopt the identical `requireAuth, requireRole(...)` composition, so the ACs here validate the actual mechanism that production routes will use.

## Verification

**Commands:**
- `cd sms-backend && npm run typecheck && npm run build` -- expected: pass
- `cd sms-backend && npm run dev` (with DB up), then:
  - `curl -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username":"teacher@school.test","password":"change-me-123"}' -c cookies.txt` -- login as teacher
  - `curl -i http://localhost:3000/api/protected/teacher-only -b cookies.txt` -- expected: 200 `{ data: { ok: true } }`
  - `curl -i http://localhost:3000/api/protected/student-only -b cookies.txt` -- expected: 403 FORBIDDEN envelope
  - `curl -i http://localhost:3000/api/protected/teacher-only` -- expected: 401 UNAUTHORIZED envelope
- Repeat the 403 checks with a student account (seed student credentials from 1.5/login flow).

## Suggested Review Order

**Authorization middleware**

- Entry point: the `requireRole` factory — core RBAC pattern future routes will reuse.
  [`authorize.ts:3`](../../sms-backend/src/middleware/authorize.ts#L3)

- Guard when `req.user` is absent despite reaching `requireRole` (mis-ordered middleware).
  [`authorize.ts:10`](../../sms-backend/src/middleware/authorize.ts#L10)

- Guard when `req.user.role` is missing or not in the allowed set → 403 FORBIDDEN envelope.
  [`authorize.ts:18`](../../sms-backend/src/middleware/authorize.ts#L18)

**Demonstrator routes**

- Middleware composition pattern — `requireAuth` then `requireRole` — that Epic 2-7 routes will copy.
  [`protected.ts:7`](../../sms-backend/src/routes/protected.ts#L7)

- Student-only counterpart; confirms the symmetric pattern.
  [`protected.ts:16`](../../sms-backend/src/routes/protected.ts#L16)

**Application wiring**

- `protectedRouter` mounted under `/api` alongside existing routers.
  [`index.ts:25`](../../sms-backend/src/index.ts#L25)
