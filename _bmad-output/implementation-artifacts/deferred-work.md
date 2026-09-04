# Deferred Work

## Deferred from: code review of spec-1.1 (2026-09-03)

- React Router 8 is pinned in the stack but not installed/configured in the frontend shell. Deferred because routing isn't needed for the placeholder shell; router setup belongs in the first routing-dependent story.
- docker compose vs docker-compose command/filename spelling. Aligned on `docker compose` / `docker-compose.yaml` in the README; cosmetic, not blocking.

## Deferred from: code review of implementation 1-1 (2026-09-03)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-project-scaffolding-docker-environment.md`
  summary: Graceful shutdown for the backend is not set up (no SIGTERM/SIGINT handlers to close the HTTP server and PrismaClient).
  evidence: Real — long-lived container; without shutdown handling, PostgreSQL connections leak and in-flight requests abort abruptly on `docker compose stop`. Not needed for Story 1.1's scaffolding goal; belongs with production-harden hardening.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-project-scaffolding-docker-environment.md`
  summary: No database seeding strategy for baseline data.
  evidence: Real — the stub schema is empty and no seed command exists. Seeding initial teacher account (FR provisioning) is explicitly deferred to Story 1.4 (Database Schema & Seed Data), so not a 1.1 gap.

## Deferred from: code review of spec-1.2 (2026-09-03)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-tokens.md`
  summary: DESIGN.md's tabular-nums on all numeric readouts (scores, timers, IDs) is not a design token but a usage requirement for later components.
  evidence: Real — surfaced by review as absent from any token. Belongs to the components/stories that render numeric readouts (Story 1.3 components and the grading/exam/result surfaces), not the token layer.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-tokens.md`
  summary: DESIGN.md is internally inconsistent on the skeleton fill — prose says background #FAF8F5 while the YAML components.skeleton.background says border #E5E2DD.
  evidence: Real — surfaced by review. Tokens story ships both the background value and the border value as tokens, so either resolves; Story 1.3 must pick the intended skeleton fill deliberately rather than guessing.

## Deferred from: code review of implementation 1-2 (2026-09-03)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-tokens.md`
  summary: No shadow/elevation tokens exist; DESIGN.md defines card (0 1px 3px rgba(0,0,0,0.06)) and toast (0 4px 12px rgba(0,0,0,0.1)) shadows only per-component.
  evidence: Real — surfaced by blind-hunter. Story 1.2 scope is colors/type/spacing/radius (per UX-DR1/2/3); shadows live in component specs and should be captured as tokens (or component CSS) when Story 1.3 builds card/toast.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-tokens.md`
  summary: No interactive-state color tokens for hover/focus/disabled — DESIGN.md specifies button disabled #B0B2C8 (outside the base palette) and a visible indigo focus ring.
  evidence: Real — surfaced by blind-hunter. Story 1.2 ships only the DESIGN.md palette; interactive-state colors are needed by Story 1.3's button card, so add them there (or a focus-ring/disabled token set) rather than here.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-tokens.md`
  summary: HealthStatus in App.tsx has no non-2xx check, no response-shape validation, no AbortController timeout, and no error boundary — pre-existing Story 1.1 pattern, untouched by the token refactor.
  evidence: Real — surfaced by edge-case-hunter. The fetch/health pattern predates Story 1.2 (copied verbatim from the 1.1 shell); belongs to a later hardening pass, not the design-token story.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-tokens.md`
  summary: No automated test asserts App.tsx's token consumption (heading uses .display, padding var(--spacing-page), error var(--color-danger)) — only the manual devtools check covers consumption; the build grep only confirms token declarations exist.
  evidence: Real — surfaced by verification-gap. The repo has no test framework installed (no Vitest/RTL, no test script since Story 1.1); a regression removing those class/var references would slip through typecheck+build+grep. Add a smoke test (Vitest 4 + RTL 16, per epic stack) when test infra lands.

## Resolved in: Story 1.3 implementation (2026-09-03)

The following Story 1.2 deferrals were intentionally resolved while building Story 1.3's components. Each records the deliberate decision locked in where the UX sources conflicted.

- resolved: skeleton fill conflict (from deferral "DESIGN.md skeleton fill — prose background #FAF8F5 vs YAML border #E5E2DD"). Locked in **border #E5E2DD** (`--color-border`), because DESIGN.md line 104 explicitly states Border is used for "skeleton placeholder fills"; the YAML components.skeleton.background agrees. A shimmer highlight midpoint token `--color-skeleton-shimmer: #F1EFEC` was added to tokens.css for the animated gradient.
- resolved: shadow/elevation tokens (from deferral "no shadow tokens"). Added `--shadow-card: 0 1px 3px rgba(0,0,0,0.06)` and `--shadow-toast: 0 4px 12px rgba(0,0,0,0.1)` to tokens.css, used by Card and Toast.
- resolved: interactive-state colors (from deferral "no hover/focus/disabled tokens"). Added `--color-primary-disabled: #B0B2C8` (button disabled) and `--color-focus-ring: #6A6E9E` (visible indigo focus ring, EXPERIENCE.md a11y) to tokens.css, used by Button.
- resolved: tabular-nums usage requirement (from deferral "no tabular-nums token"). Not a token — a usage rule for numeric readout components (scores/timers/IDs) that land in later stories; still deferred to those surfaces, not Story 1.3's presentational base set.
- resolved (new, surfaced by Story 1.3 planning): toast source conflict — Story 1.3 AC (epics.md) and DESIGN.md say toast is **bottom-center, auto-dismiss 3s**; EXPERIENCE.md line 76 says **bottom-right** and DESIGN.md prose line 181 says **4s**. Locked in **bottom-center + 3s** (the story AC is authoritative; DESIGN.md agrees). EXPERIENCE.md/DESIGN.md-prose inconsistency to be corrected in the UX docs later.
- resolved (new): test infrastructure gap (from deferral "add smoke test when test infra lands"). Vitest 4 + jsdom + @testing-library/react + @testing-library/jest-dom installed; `npm test` added; each base component has a unit test (19 tests total). The App.tsx token-consumption smoke test is still deferred to a routing/App story, but the framework is now in place.

## Deferred from: code review of Story 1.3 implementation (2026-09-03)

- summary: Card hover tint (EXPERIENCE.md row-hover / DESIGN.md "hover to #FAF8F5") is not implemented on Card — Card is presentational and the ACs don't require interactivity. Hover behavior belongs to the specific interactive surfaces (class cards, tables) in later feature stories.
- summary: Toast keyboard dismissal via Escape (EXPERIENCE.md interaction primitive line 102) is not implemented; Story 1.3 AC only requires auto-dismiss 3s. Escape-on-toast belongs with a later toast/overlay story.
- summary: Skeleton reduced-motion runtime test (matchMedia change mid-life) and listener-leak assertions are partially covered (an unmount-no-throw test exists) but not fully; full dynamic reflow verification deferred.
- summary: Badge variant guard for a typed `as any` misuse and unimplemented `s-toast--{variant}` styling (single variant only) are minor hardening, deferred.

## Deferred from: code review of demo-full-app-mock-data (2026-09-04)

- source_spec: `_bmad-output/implementation-artifacts/spec-demo-full-app-mock-data.md`
  summary: Shipped EmptyState and Skeleton base components are not reused in the demo — empty states are plain `<p>` text and there are no loading/skeleton states anywhere.
  evidence: Real — surfaced by blind-hunter. Spec said "reuse shipped base components (EmptyState, Skeleton)". Empty-state reuse is patchable; skeleton/loading states are low value because the demo's data is in-memory (always instant, no latency), so an artificial skeleton would be misleading. The full cold-load/aria-busy behavior belongs to the real data-fetching stories.
- source_spec: `_bmad-output/implementation-artifacts/spec-demo-full-app-mock-data.md`
  summary: The exam timer's polite 60-second aria-live interval announcement (EXPERIENCE.md a11y floor) is not implemented; only the assertive 5:00/1:00 announcements exist.
  evidence: Real — surfaced by blind-hunter. Low value for a short demo session; the critical 5:00/1:00 assertive thresholds are covered. The 60s polite tick belongs with the production exam-taking story.

## Deferred from: code review of spec-1-4-database-schema-seed-data (2026-09-04)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: Role guard — nothing stops a TEACHER user being linked into `Class.students` via the implicit many-to-many; a teacher could appear in a student roster and skew counts.
  evidence: Real — surfaced by blind-hunter + edge-case-hunter. No DB-level constraint can express this; enforcement is app-layer (RBAC / enrollment service) in later stories (Epic 2, Story 1.6).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: `Submission.status` lifecycle is under-specified (IN_PROGRESS/SUBMITTED only; no GRADED state, and no transition rule for re-submission/answers-after-submit).
  evidence: Real — surfaced by edge-case-hunter. Score is a separate model; the graded lifecycle is owned by the grading stories (Epic 4), not the schema/seed story. Schema stays skeletal here.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: Question.options / correctAnswer deep contract (JSON shape, size bounds, index-vs-value linkage, ordering stability) is unspecified.
  evidence: Real — surfaced by edge-case-hunter + blind-hunter. Story 1.4 only needs a coherent place for question data; the actual question/modeling is owned by the exam/quiz stories (Epic 3) and auto-grading (Epic 4). Refine via a later migration.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: Seed re-hashes the teacher password each run (churns updatedAt) and bcrypt rounds are not centralized; stale-hash handling is undefined.
  evidence: Real — surfaced by edge-case-hunter. Idempotency holds on row counts but not row content; a password/rounds policy belongs with the auth story (Story 1.5), which owns hashing.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: Username format is email-ish (`@school.test`) but undefined as an identifier contract; `@school.test` domain is an unbacked fixture.
  evidence: Real — surfaced by blind-hunter + acceptance-auditor. Login (Story 1.5) decides whether the identifier is an email or a bare username. Not decided in 1.4.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: Single-tenant / single-teacher-per-class / single-class-exam assumptions are baked in (no schoolId, single teacherId, single classId/exam).
  evidence: Real — surfaced by blind-hunter. Deliberate v1 scope cuts; multi-tenancy and co-teaching are not in Epics 1-7. Recorded so the closure is explicit, not a hidden limit.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: `prisma migrate dev` interactive prompts / drift warnings are not handled for a non-interactive CI context.
  evidence: Real — surfaced by blind-hunter. Local `docker compose up -d db` + `migrate dev` flow is non-interactive enough for this story; CI migration automation is a separate concern.

## Deferred from: code review of implementation 1-4 (2026-09-04)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: No CHECK validates a Schedule slot's `startTime` is earlier than its `endTime` (regex enforces format only, so `10:00`→`09:00` is representable).
  evidence: Real — surfaced by blind-hunter + edge-case-hunter. The frozen story scope fixed the format regex but not ordering; ordering is a scheduling business rule best enforced app-side when schedules are created/edited, not in the DB-creation story.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: No CHECK guards `Exam.durationMinutes > 0`, `Question.points > 0`, or `Score.pointsEarned <= pointsPossible`.
  evidence: Real — surfaced by edge-case-hunter + blind-hunter. These are domain/scoring validations with storage consequences; the exam/question/grading stories (Epics 3-4) own the rules and should add them when they add writes — the schema here stays skeletal per the frozen design.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: No DB invariant ties `Submission.status` to `answers`/`submittedAt` (e.g. SUBMITTED with NULL answers, or IN_PROGRESS with a timestamp is representable).
  evidence: Real — surfaced by edge-case-hunter. Lifecycle transitions and nullability rules belong to the submission/grading story (Epic 4), which will enforce them at the API layer; a later migration could tighten via triggers if needed.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: An ungraded `Score` (pointsEarned 0, gradedById/gradedAt NULL) is indistinguishable from a legitimately zero-graded score with no recorded grader.
  evidence: Real — surfaced by blind-hunter. Grading semantics (zero-vs-ungraded, gradedById/gradedAt both-or-neither) are owned by the grading story (Epic 4).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: `Class`→`Exam`→`Submission`→`Score` all Cascade, so deleting one class destroys the whole tree with no soft-delete safety net.
  evidence: Real — surfaced by blind-hunter. Deliberate v1 shape and sensible for dev seed; soft-delete / explicit archive is production-hardening for later (see multi-tenancy closure above).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: No guard prevents an unenrolled student from creating a Submission (the `[examId, studentId]` unique constraint only stops duplicates, not non-membership).
  evidence: Real — surfaced by edge-case-hunter. Membership validation belongs to the enrollment/submission API stories (Epic 2 / Epic 4).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: Seed idempotency and the `timestamptz` column contract are verified only by manual DB commands, not an automated test.
  evidence: Real — surfaced by verification-gap. The repo has no DB integration test harness; the spec deliberately used manual `db:seed` ×2 + `information_schema` queries. Add automated integration tests (Vitest 4 is installed) against a test database when test infra for the backend lands.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-database-schema-seed-data.md`
  summary: No constraint prevents `Exam.scheduledAt` from being in the past, so an exam can be created already-overdue.
  evidence: Real — surfaced by edge-case-hunter (2nd review pass). Far backstop is `scheduledAt >= now()` at creation; belongs with the exam-creation scheduling story (Epic 3), which owns creation-time rules — the schema locks the common case the DB-only 1.4 needs.

## Deferred from: code review of Story 1.5 implementation (2026-09-04)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: No brute-force / rate limiting on the login endpoint.
  evidence: Real — surfaced by blind-hunter. `POST /api/auth/login` has no throttling, lockout, or failed-attempt tracking. Rate limiting belongs with production hardening, not the initial auth story.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: No CSRF protection for state-changing cookie-based endpoints.
  evidence: Real — surfaced by blind-hunter. Mitigation relies entirely on `sameSite: strict`; no CSRF token. SameSite is sufficient for same-origin v1; CSRF tokens belong with cross-origin or production hardening.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: Logout does not invalidate the JWT server-side.
  evidence: Real — surfaced by blind-hunter. `clearCookie` only drops the client cookie; a captured token remains valid for 24h. Token blacklisting/revocation belongs with production hardening.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: No backend tests for auth routes (login, /me, logout).
  evidence: Real — surfaced by verification-gap. The backend has no test framework configured; no test script in package.json. Auth behavioral tests belong when backend test infrastructure lands.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: `requireAuth` middleware is defined but never applied to any route.
  evidence: Real — surfaced by verification-gap. The middleware is created for Story 1.6 RBAC but not wired to any route in this story. Dead code from the routing perspective; adoption happens in Story 1.6.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: `requireAuth` trusts JWT role claims without rechecking the database.
  evidence: Real — surfaced by blind-hunter. If a user's role is changed after login, they keep the stale role from the token until expiry. DB-backed role verification belongs with production hardening.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: Backend never shuts down Prisma — no SIGTERM/SIGINT handler.
  evidence: Real — surfaced by blind-hunter. Connection leak on restarts. Graceful shutdown belongs with production hardening (pre-existing deferral from Story 1.1).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: Frontend API base path is hardcoded to `/api/...` relying on Vite proxy.
  evidence: Real — surfaced by blind-hunter. No `VITE_API_BASE` configurable base. Breaks in non-dev deployments. Deployment configuration belongs with production hardening.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-user-login-fr-23-nfr-6.md`
  summary: Two sources of truth for routing remain — React Router and mock store.
  evidence: Real — surfaced by blind-hunter. `useSyncStoreToUrl` reconciles them opportunistically. Full React Router migration is the intended follow-on per the spec's Design Notes.

## Deferred from: code review of stories 1.1–1.3 (2026-09-04)

- summary: PrismaClient is instantiated at module scope in health.ts before the DATABASE_URL guard in index.ts runs. Works because index.ts imports dotenv/config first, but fragile if import order changes.
  evidence: Real — surfaced by blind-hunter + edge-case-hunter. The guard is effective today due to import resolution order, but module-scope DB client is a latent risk. Deferred because it works and is pre-existing.
- summary: Health timeout race — when both the DB query and the 5s timeout reject simultaneously, `Promise.race` may pick the timeout error, masking the real DB error in logs.
  evidence: Real — surfaced by edge-case-hunter. Both paths report unhealthy (503); the status is correct but the logged error may be misleading. Low practical impact.
- summary: Toast `show()` with an empty string renders a blank visible toast element with shadow.
  evidence: Real — surfaced by edge-case-hunter. Cosmetic; caller responsibility to provide meaningful messages.
- summary: Module-global `nextId` counter has no overflow guard. After 2^53 calls, IDs wrap and could theoretically conflict with pending timers.
  evidence: Real — surfaced by edge-case-hunter. Theoretical; requires ~9 quadrillion calls. Not a practical concern.
- summary: No toast deduplication — rapid `show()` calls with identical messages stack visually.
  evidence: Real — surfaced by edge-case-hunter. Design choice, not a bug. Deduplication could be added as a feature enhancement.
- summary: No backend test infrastructure — no test framework, no test script, no test files under sms-backend/.
  evidence: Real — surfaced by verification-gap. Pre-existing gap; backend tests belong when test infra is added.

## Deferred from: code review of spec-1-6 (2026-09-04)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-role-based-access-control-fr-24.md`
  summary: No automated tests for `requireRole` middleware or `/api/protected/*` endpoints.
  evidence: Real — no test infrastructure exists in sms-backend. Pre-existing gap not caused by this story. Add when backend test suite is established.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-role-based-access-control-fr-24.md`
  summary: Role type `"TEACHER" | "STUDENT"` is duplicated inline in authorize.ts rather than imported from sms-shared.
  evidence: Real — same pattern already exists in auth.ts. Consolidating to a shared UserRole type from sms-shared is a clean-up task for a later story.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-role-based-access-control-fr-24.md`
  summary: No security/audit logging when authorization fails (401/403) on protected routes.
  evidence: Real — pre-existing gap; no logging exists on any route in this codebase. Add with a logging middleware story.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-6-role-based-access-control-fr-24.md`
  summary: Demonstrator endpoints (`/api/protected/*`) are unconditionally mounted with no environment guard.
  evidence: Deliberate per spec ("Demonstrator endpoints return `{ data: { ok: true } }`"). Could be gated by env flag in a later hardening pass.

## Deferred from: code review of spec-1-6-role-based-access-control-fr-24 (2026-09-04)

- summary: Inline role type vs shared `UserRole`
  evidence: Pre-existing across the codebase. Unifying to a shared `UserRole` from `sms-shared` is a future refactor.
- summary: OR semantics of `requireRole` undocumented
  evidence: `.includes()` for OR is the natural and intended reading for this use case.
- summary: No automated tests
  evidence: Pre-existing gap (no test infra in sms-backend).
- summary: No shared error helper
  evidence: Pre-existing pattern in `auth.ts`.
- summary: No auth failure logging
  evidence: Pre-existing gap.
- summary: No JSDoc/OpenAPI on routes
  evidence: No routes in the codebase have OpenAPI annotations yet. Pre-existing gap.
- summary: Lack of role hierarchy (e.g. ADMIN role)
  evidence: Future epic concern; currently only TEACHER and STUDENT exist.
- summary: Absence of fine-grained permissions (ABAC)
  evidence: Future epic concern; RBAC is sufficient for current requirements.
- summary: Missing rate-limiting and anti-abuse protection
  evidence: Infrastructure concern, pre-existing gap for all routes.
- summary: Missing Cache-Control headers on protected endpoints
  evidence: Infrastructure concern, pre-existing gap for all routes.