---
title: 'Story 1.5 — User Login'
type: 'feature'
created: '2026-09-04'
status: 'done'
review_loop_iteration: 1
baseline_commit: '7b9635fcfede4cae754a9866d58f282754410c9e'
context:
  - '_bmad-output/implementation-artifacts/epic-1-context.md'
  - '_bmad-output/planning-artifacts/epics.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The mock role-login screen (`sms-frontend/src/screens/role-login.tsx`) lets users pick a role without authentication, and the backend has no login endpoint, JWT issuance, or cookie-based session management. Story 1.5 delivers real username/password authentication with HTTP-only JWT cookies and role-based redirection to teacher or student dashboards.

**Approach:** Add a backend `POST /api/auth/login` endpoint that validates credentials against the seeded User table, issues a signed JWT in an HTTP-only cookie, and returns user info. On the frontend, replace the mock role-login with a real login form that submits credentials, stores the JWT cookie, and redirects to the appropriate dashboard based on role. Handle JWT expiry by clearing the cookie and redirecting to login.

</frozen-after-approval>

## Boundaries & Constraints

**Always:**
- JWT is stateless, stored in HTTP-only cookies only — no localStorage, no server-side session store.
- Use `jsonwebtoken` library for JWT signing/verification.
- Use the existing `bcryptjs` library (already in sms-backend) for password verification.
- Login response sets cookie with `httpOnly: true`, `sameSite: 'strict'`, `secure: false` (dev only), `path: '/'`.
- JWT payload contains `userId`, `username`, `role`, `iat`, `exp`.
- On invalid credentials, return `{ "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid username or password" } }` with 401 status.
- On valid credentials, return `{ "data": { "user": { "id", "username", "firstName", "lastName", "role" } } }` and set the JWT cookie.
- All errors use the standard envelope: `{ "error": { "code": "STRING", "message": "STRING" } }`.
- Frontend login form uses inline error banner (not modal) with `role="alert"` for invalid credentials.
- Focus moves to the error banner on failed submit.

**Ask First:**
- JWT secret key source: use `process.env.JWT_SECRET` with a fallback default for dev. Confirm this is acceptable.
- JWT expiration time: propose 24 hours. Confirm or adjust.
- Cookie name: propose `sms-token`. Confirm or adjust.

**Never:**
- No self-registration — users are created via seed script or manually by teachers.
- No password reset flow — deferred to later story if needed.
- No refresh token mechanism — JWT expiry triggers full re-login.
- No role-switcher in UI — teacher and student navigation are completely separate.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| LOGIN_SUCCESS | Valid username + password | JWT cookie set, response contains user object with role | N/A |
| LOGIN_INVALID_CREDENTIALS | Wrong password or non-existent username | 401 + error envelope `{ code: "INVALID_CREDENTIALS", message: "Invalid username or password" }` | Inline error banner on frontend |
| LOGIN_MISSING_FIELDS | Empty username or password | 400 + error envelope `{ code: "VALIDATION_ERROR", message: "Username and password are required" }` | Inline validation on frontend |
| JWT_EXPIRED | Expired JWT in cookie | 401 + error envelope `{ code: "TOKEN_EXPIRED", message: "Session expired" }` | Frontend clears cookie, redirects to login |
| NO_JWT | No cookie present on protected route | 401 + error envelope `{ code: "UNAUTHORIZED", message: "Authentication required" }` | Frontend redirects to login |
| REDIRECT_AFTER_LOGIN | Teacher logs in | Redirect to `/teacher/dashboard` | N/A |
| REDIRECT_AFTER_LOGIN | Student logs in | Redirect to `/student/dashboard` | N/A |

## Code Map

- `sms-backend/src/routes/auth.ts` -- NEW: login endpoint with JWT issuance
- `sms-backend/src/index.ts:19` -- Register auth router (`app.use("/api", authRouter)`)
- `sms-backend/src/middleware/auth.ts` -- NEW: JWT verification middleware (used by 1.6 RBAC, but base logic lives here)
- `sms-backend/prisma/schema.prisma:31-45` -- READ ONLY: User model with username, passwordHash, role
- `sms-backend/src/generated/prisma/client.js` -- PrismaClient for User queries
- `sms-frontend/src/screens/role-login.tsx` -- REPLACE: mock role selector → real login form
- `sms-frontend/src/screens/teacher/teacher-dashboard.tsx` -- READ ONLY: redirect target for teachers
- `sms-frontend/src/screens/student/student-dashboard.tsx` -- READ ONLY: redirect target for students
- `sms-frontend/src/mock/store.tsx:24` -- Current Role type definition (will be replaced by real auth)
- `sms-frontend/src/App.tsx:41-46` -- Current DemoRouter (will need auth-aware routing)
- `sms-shared/src/index.ts` -- Add shared auth types (LoginRequest, LoginResponse, UserDTO)

## Tasks & Acceptance

**Execution:**
- [x] `sms-shared/src/index.ts` -- Add `LoginRequest` (`{ username: string; password: string }`), `LoginResponse` (`{ data: { user: UserDTO } }`), `UserDTO` (`{ id: string; username: string; firstName: string; lastName: string; role: "TEACHER" | "STUDENT" }`) types for cross-repo contract
- [x] `sms-backend/package.json` -- Add `jsonwebtoken` dependency and `@types/jsonwebtoken` devDependency
- [x] `sms-backend/src/routes/auth.ts` -- NEW: `POST /api/auth/login` endpoint: validate body fields exist, query User by `username` with `prisma.user.findUnique({ where: { username } })`, verify password with `bcryptjs.compare(password, user.passwordHash)`, sign JWT with `jsonwebtoken.sign({ userId: user.id, username: user.username, role: user.role }, secret, { expiresIn: '24h' })`, set httpOnly cookie via `res.cookie('sms-token', token, { httpOnly: true, sameSite: 'strict', secure: false, path: '/' })`, return user data (excluding passwordHash)
- [x] `sms-backend/src/index.ts` -- Import and register `authRouter` under `/api/auth`
- [x] `sms-backend/src/middleware/auth.ts` -- NEW: `requireAuth` middleware that extracts JWT from `req.cookies['sms-token']`, verifies with `jsonwebtoken.verify`, attaches `{ userId, username, role }` to `req.user`. Export for use in Story 1.6 RBAC. Add `express.d.ts` augmentation for `req.user` type
- [x] `sms-frontend/package.json` -- Add `react-router-dom` dependency for client-side routing
- [x] `sms-frontend/src/api/auth.ts` -- NEW: `login(username: string, password: string)` fetch wrapper with `credentials: 'include'`, returns `LoginResponse`, throws on error
- [x] `sms-frontend/src/store/auth.ts` -- NEW: `AuthProvider` context with `user` state, `login(username, password)` action (calls API, sets user state, redirects based on role), `logout()` action (clears state, redirects to login), `useAuth()` hook. Check for existing session on mount via cookie
- [x] `sms-frontend/src/screens/role-login.tsx` -- REPLACE: real login form with username input, password input, submit Button, inline error banner (using `role="alert"`), loading state on submit button. On submit, call `login()` from auth context, redirect to `/teacher/dashboard` or `/student/dashboard` based on role
- [x] `sms-frontend/src/App.tsx` -- Wrap app in `AuthProvider`, add React Router with routes: `/login` → RoleLogin, `/teacher/*` → teacher screens (protected), `/student/*` → student screens (protected). Protected routes check auth state and redirect to `/login` if unauthenticated

**Acceptance Criteria:**
- Given a user is on the login page, when they enter valid credentials (`teacher@school.test` / `change-me-123`) and submit, then an HTTP-only cookie containing a JWT is set, and they are redirected to the teacher dashboard.
- Given a student logs in with valid credentials, when login completes, then they are redirected to the student dashboard.
- Given a user enters invalid credentials, when they submit the login form, then an inline error banner appears with "Invalid username or password" and no JWT is issued.
- Given a user is authenticated, when the JWT expires, then the user is redirected to the login page and the expired cookie is cleared.
- Given the login form is loading (submit in progress), when the request is in flight, then the submit button shows a loading state and is disabled.
- Given `npm run typecheck` runs in sms-backend and sms-frontend, then both pass.
- Given `npm run build` runs in sms-backend, then it passes.

## Spec Change Log

- **2026-09-04 (review patch)** — Applied patches from blind-hunter, edge-case-hunter, and verification-gap reviews:
  - Added try/catch for all DB operations, bcrypt.compare, and jwt.sign in auth routes (prevents 500 crashes)
  - Added JWT payload validation (userId/username/role) in requireAuth middleware
  - Made cookie `secure` flag dynamic based on `NODE_ENV` (production gets `secure: true`)
  - Added JWT_SECRET production validation (fatal error if missing in production)
  - Added `decoded.userId` validation in `/auth/me` endpoint
  - Added expired cookie clearing on TOKEN_EXPIRED in `/auth/me`
  - Added JSON shape validation in frontend `meRequest`
  - Added username trimming in login endpoint
  - Extracted shared `COOKIE_OPTIONS` constant for consistency
  - Added defensive `req.body ?? {}` to prevent TypeError on undefined body

## Design Notes

- **JWT cookie strategy:** The cookie is set by the backend via `Set-Cookie` header in the login response. The frontend does not manually manage the cookie — it relies on the browser's automatic cookie handling with `credentials: 'include'` on fetch requests.
- **Auth middleware placement:** The `requireAuth` middleware is created in this story but only fully wired in Story 1.6 (RBAC). This story uses it internally for session validation, but the primary deliverable is the login flow.
- **Frontend state:** Auth state lives in a simple React Context (not Redux/Zustand per architecture decisions). The context checks for an existing valid JWT on app load (via a `/api/auth/me` or similar endpoint) to restore session.
- **Routing migration:** The current `DemoRouter` in `App.tsx` uses a custom `route` state. This story migrates to React Router for proper URL-based routing, which is required for the real auth flow.

## Verification

**Commands:**
- `cd sms-backend && npm run typecheck && npm run build` -- expected: pass
- `cd sms-frontend && npm run typecheck` -- expected: pass
- `cd sms-backend && npm run dev` then `curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username":"teacher@school.test","password":"change-me-123"}' -c cookies.txt` -- expected: 200 response with user object, cookies.txt contains sms-token
- `curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username":"teacher@school.test","password":"wrong"}' -c cookies.txt` -- expected: 401 with error envelope
- `cd sms-frontend && npm run dev` -- expected: login form renders, submitting valid credentials redirects to dashboard

## Suggested Review Order

**Authentication entry point**

- Login endpoint: credential validation, JWT issuance, cookie setting
  [`auth.ts:16`](../../sms-backend/src/routes/auth.ts#L16)

- Session restore and logout endpoints
  [`auth.ts:88`](../../sms-backend/src/routes/auth.ts#L88)

**JWT middleware**

- requireAuth middleware: token verification, payload validation, error handling
  [`auth.ts:14`](../../sms-backend/src/middleware/auth.ts#L14)

- Express Request augmentation for req.user
  [`express.d.ts:1`](../../sms-backend/src/middleware/express.d.ts#L1)

**Frontend auth flow**

- AuthProvider context: login action, session restore, role-based redirect
  [`auth.tsx:23`](../../sms-frontend/src/store/auth.tsx#L23)

- Login form: inputs, error banner, loading state
  [`role-login.tsx:1`](../../sms-frontend/src/screens/role-login.tsx#L1)

- Protected route wrapper and React Router setup
  [`App.tsx:142`](../../sms-frontend/src/App.tsx#L142)

**API layer**

- Frontend fetch wrappers with credentials: include
  [`auth.ts:3`](../../sms-frontend/src/api/auth.ts#L3)

**Shared types**

- LoginRequest, LoginResponse, UserDTO cross-repo contract
  [`index.ts:28`](../../sms-shared/src/index.ts#L28)

**Infrastructure**

- Backend: cookie-parser, authRouter registration
  [`index.ts:1`](../../sms-backend/src/index.ts#L1)

- Frontend: BrowserRouter wrapper, auth logout in demo layout
  [`main.tsx:1`](../../sms-frontend/src/main.tsx#L1)
