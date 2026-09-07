---
title: 'Story 2.1 — Teacher Daily Class Overview'
type: 'feature'
created: '2026-09-07'
status: 'done'
baseline_commit: 'ab56d4339a7f8588a12e24ea6747072c032c5696'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-2-context.md'
  - '_bmad-output/planning-artifacts/epics.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The teacher dashboard (`sms-frontend/src/screens/teacher/teacher-dashboard.tsx`) currently uses mock data from the Zustand-like `DemoDataProvider` store. It does not fetch today's classes from the real backend, does not filter by the user's local timezone/day-of-week, does not show a real greeting with the authenticated user's first name, and has no skeleton loading or properly accessible empty state.

**Approach:** Wire the teacher dashboard to a new backend endpoint `GET /api/teacher/dashboard` that returns classes scheduled for today (by day-of-week) for the authenticated teacher. On the frontend, replace the mock store reads with a TanStack Query call, render skeleton shimmer during loading, and display a real greeting and proper empty state when no classes are scheduled.

</frozen-after-approval>

## Boundaries & Constraints

**Always:**
- "Today" is determined by the client's local timezone day-of-week (e.g. `new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()` → `MONDAY`), sent as a query param to the backend.
- Backend filters `Schedule` records by `dayOfWeek` matching the provided day param, scoped to the authenticated teacher's classes.
- Use `requireAuth` + `requireRole('TEACHER')` middleware on the new route.
- Student count is derived from `class._count.students` via Prisma.
- Loading state uses the existing `<Skeleton>` component — no spinners.
- Empty state uses the existing `<EmptyState>` component with text: "No classes scheduled today — enjoy the break."
- Greeting uses the authenticated user's `firstName` from `useAuth()`.
- Hover tint on class cards uses the existing CSS token system.
- All errors follow the standard envelope: `{ "error": { "code": "STRING", "message": "STRING" } }`.
- TanStack Query manages server state — no Context or local useState for fetched data.

**Ask First:**
- The `Schedule.startTime` and `Schedule.endTime` are stored as `String` in the schema (e.g. `"09:00"`, `"10:30"`). Confirm display format for the card: propose `"09:00 – 10:30"`.

**Never:**
- Do not replace the demo store's mock for other screens — only the teacher dashboard is in scope for this story.
- Do not implement class-detail navigation in this story (that is Story 2.2). The click handler can navigate to `teacher-class-detail` using the existing `navigate` from `useStore()` as a placeholder, or be left as a TODO comment — do not remove the demo store entirely.
- Do not add pagination — the dashboard shows all of today's classes (expected to be a small bounded set).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Teacher authenticated, classes scheduled for today | Greeting "Welcome back, [FirstName]", list of class cards with name, time, student count | N/A |
| EMPTY_DAY | Teacher authenticated, no classes scheduled for today | Greeting shown, EmptyState component: "No classes scheduled today — enjoy the break." | N/A |
| LOADING | Data fetch in flight | Skeleton shimmer placeholders matching class card layout | N/A |
| FETCH_ERROR | Network/server error | TanStack Query error state; show inline error banner with retry | Inline banner (not modal) |
| WRONG_DAY_PARAM | Invalid day param (backend guards) | Backend returns 400 with validation error envelope | Frontend never sends invalid day — defensive guard on client |
| UNAUTHORIZED | No JWT cookie | Backend 401; frontend auth redirects to /login | AuthProvider handles globally |

## Code Map

- `sms-backend/src/routes/teacher.ts` -- NEW: teacher-scoped routes. Start with `GET /api/teacher/dashboard?day=MONDAY` filtered by `dayOfWeek` and `teacherId` from `req.user`. Returns `{ data: { classes: [{ id, name, startTime, endTime, studentCount }] } }`
- `sms-backend/src/index.ts` -- MODIFY: register `teacherRouter` under `/api/teacher` with `requireAuth` + `requireRole('TEACHER')`
- `sms-backend/src/middleware/auth.ts` -- READ ONLY: `requireAuth` extracts `req.user`
- `sms-backend/src/middleware/authorize.ts` -- READ ONLY: `requireRole` guard
- `sms-backend/prisma/schema.prisma:47-73` -- READ ONLY: `Class` (with `schedules` relation), `Schedule` (with `dayOfWeek: Weekday`, `startTime: String`, `endTime: String`), `User.teacherOf`
- `sms-frontend/src/api/auth.ts` -- READ ONLY: `meRequest`, fetch pattern with `credentials: 'include'`
- `sms-frontend/src/api/teacher.ts` -- NEW: `fetchTodayClasses(day: string)` fetch function returning `TodayClass[]`. TanStack Query hook `useTodayClasses()` lives here.
- `sms-frontend/src/screens/teacher/teacher-dashboard.tsx` -- MODIFY: replace mock `useStore()` classes read with `useTodayClasses()`. Add skeleton, empty state, real greeting from `useAuth().user.firstName`.
- `sms-frontend/src/screens/teacher/teacher-dashboard.css` -- MODIFY: add hover tint rule on class card (currently `.s-timeline-item:hover` targets background but uses `--color-background` — update to use `--color-surface` or a subtle tint per design tokens).
- `sms-frontend/src/store/auth.tsx:74` -- READ ONLY: `useAuth()` exposes `user.firstName`
- `sms-frontend/src/components/Skeleton.tsx` -- READ ONLY: `<Skeleton>` component API
- `sms-frontend/src/components/EmptyState.tsx` -- READ ONLY: `<EmptyState>` component API
- `sms-shared/src/index.ts` -- ADD: `TodayClass` DTO (`{ id: string; name: string; startTime: string; endTime: string; studentCount: number }`) and `DashboardResponse` (`{ data: { classes: TodayClass[] } }`) for cross-repo contract

## Tasks & Acceptance

**Execution:**
- [x] `sms-shared/src/index.ts` -- ADD `TodayClass` and `DashboardResponse` types for cross-repo contract
- [x] `sms-backend/src/routes/teacher.ts` -- NEW: `GET /api/teacher/dashboard?day=MONDAY`. Validate `day` query param is a valid `Weekday` enum value (return 400 if not). Query `prisma.class.findMany({ where: { teacherId: req.user.userId, schedules: { some: { dayOfWeek: day } } }, include: { schedules: { where: { dayOfWeek: day } }, _count: { select: { students: true } } } })`. Map to `TodayClass[]` shape. Return `{ data: { classes } }`.
- [x] `sms-backend/src/index.ts` -- MODIFY: import and register `teacherRouter` at `/api/teacher` with `requireAuth` and `requireRole('TEACHER')` middleware applied at router level.
- [x] `sms-frontend/src/api/teacher.ts` -- NEW: `fetchTodayClasses(day: string): Promise<TodayClass[]>` using `fetch('/api/teacher/dashboard?day=' + day, { credentials: 'include' })`. Export `useTodayClasses()` TanStack Query hook with `queryKey: ['todayClasses', day]` and `staleTime: 60_000`.
- [x] `sms-frontend/src/screens/teacher/teacher-dashboard.tsx` -- MODIFY: compute `day` from `new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()`. Call `useTodayClasses(day)`. Replace mock `classes.map(...)` block with: skeleton placeholders (3 rows of `<Skeleton height="48px">`) on `isLoading`, inline error banner on `isError`, `<EmptyState>` when `classes.length === 0`, class cards otherwise. Display time as `startTime + ' – ' + endTime`. Replace hardcoded `"Mr. Chen"` greeting with `user?.firstName` from `useAuth()`. Keep the `navigate({ screen: 'teacher-class-detail', ... })` onClick as-is (Story 2.2 will implement the destination).
- [x] `sms-frontend/src/screens/teacher/teacher-dashboard.css` -- MODIFY: update `.s-timeline-item:hover` background to `var(--color-surface)` for a visible warm tint per UX-DR1 (currently it's `var(--color-background)` which is the same as the page background).

### Review Findings

- [x] [Review][Patch] Keyboard Space key navigation scrolls viewport [`sms-frontend/src/screens/teacher/teacher-dashboard.tsx:64-68`](file:///d:/huyn/project/getting-start-bmad/sms-frontend/src/screens/teacher/teacher-dashboard.tsx#L64-L68)
- [x] [Review][Patch] Backend only returns first schedule for multi-session classes [`sms-backend/src/routes/teacher.ts:61`](file:///d:/huyn/project/getting-start-bmad/sms-backend/src/routes/teacher.ts#L61)
- [x] [Review][Defer] No automated route test for GET /api/teacher/dashboard [`sms-backend/src/routes/teacher.ts:27`](file:///d:/huyn/project/getting-start-bmad/sms-backend/src/routes/teacher.ts#L27) — deferred, pre-existing backend test infra gap

**Acceptance Criteria:**
- Given the teacher is authenticated and on the dashboard, when the page loads, then the greeting "Welcome back, [FirstName]" is displayed in Georgia serif using the real JWT user name.
- Given classes exist for today's day-of-week, when the dashboard loads, then each class card shows: class name, time range (e.g. "09:00 – 10:30"), and student count.
- Given the user's browser resolves today as e.g. Monday, when the API is called, then only classes with a `Schedule.dayOfWeek = MONDAY` record are returned.
- Given data is loading, when the fetch is in flight, then 3 skeleton rows appear in the Today's Classes card (no spinner).
- Given no classes are scheduled for today, when the page loads, then the EmptyState component renders with "No classes scheduled today — enjoy the break." and the Grading Progress widget remains visible.
- Given the teacher hovers over a class card on lg/md, when hovering, then a subtle surface background tint appears.
- Given a network error occurs, when the fetch fails, then an inline error banner is shown (not a modal) with a retry action.
- Given `npm run typecheck` in sms-backend and sms-frontend, then both pass.

## Spec Change Log

## Design Notes

- **Day-of-week derivation:** The client sends the weekday string (e.g. `"MONDAY"`) as a query param. The backend does not need timezone logic — it trusts the client's day, which is correct per the architecture rule (AD-14: frontend displays in user's local timezone). This avoids complex server-side timezone inference.
- **Skeleton shape:** Render 3 `<Skeleton>` blocks sized to match a class card row (height ~48px, full width) to give the teacher a meaningful loading preview matching the expected content shape.
- **Demo store coexistence:** The `DemoDataProvider` (mock store) is still used by other screens (exams, grading, etc.). This story only replaces the Today's Classes fetch in `teacher-dashboard.tsx`. The `useStore()` import can remain for the Grading Progress widget which still reads mock exam data.

## Verification

**Commands:**
- `cd sms-backend ; npm run typecheck` -- expected: pass
- `cd sms-frontend ; npm run typecheck` -- expected: pass
- `cd sms-backend ; npm run dev` then `curl -b "sms-token=<valid_teacher_jwt>" "http://localhost:3000/api/teacher/dashboard?day=MONDAY"` -- expected: 200 with `{ data: { classes: [...] } }`
- `curl -b "sms-token=<valid_teacher_jwt>" "http://localhost:3000/api/teacher/dashboard?day=INVALID"` -- expected: 400 with error envelope
- `curl "http://localhost:3000/api/teacher/dashboard?day=MONDAY"` (no cookie) -- expected: 401 with error envelope
