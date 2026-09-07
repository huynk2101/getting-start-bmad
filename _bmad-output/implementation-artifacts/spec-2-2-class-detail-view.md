---
title: 'Story 2.2 — Class Detail View'
type: 'feature'
created: '2026-09-07'
status: 'done'
baseline_commit: '910c1c20e2ef64d78beeebe743a6d71317cfd023'
review_loop_iteration: 0
context:
  - '_bmad-output/implementation-artifacts/epic-2-context.md'
  - '_bmad-output/planning-artifacts/epics.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The class detail page (`sms-frontend/src/screens/teacher/class-detail.tsx`) relies on mock store data (`getClass`, `students`, `schedules`) from `DemoDataProvider`. It does not fetch real class metadata or student rosters from the backend, lacks skeleton loading states, and doesn't verify teacher ownership for class details.

**Approach:** Implement `GET /api/teacher/classes/:classId` on the backend to fetch class details, schedule slots, and enrolled student roster for the authenticated teacher. Wire `class-detail.tsx` to a new `useClassDetail` TanStack Query hook, add skeleton loading shimmer placeholders, real-time student search filtering, and semantic HTML table rendering.

</frozen-after-approval>

## Boundaries & Constraints

**Always:**
- Access control on `GET /api/teacher/classes/:classId` requires `requireAuth` + `requireRole('TEACHER')`.
- Backend verifies `class.teacherId === req.user.userId`. Return 404 with standard envelope `{ "error": { "code": "NOT_FOUND", "message": "Class not found" } }` if class does not exist or does not belong to teacher.
- Student search on the roster filters dynamically by student `firstName`, `lastName`, or `studentId` in real-time.
- Loading state renders `<Skeleton>` placeholders for class title, stats, tabs, and table rows (UX-DR5) — no spinners.
- Table uses semantic HTML elements: `<table>`, `<thead>`, `<tbody>`, and `<th scope="col">` (UX-DR18).
- Tab order matches visual reading order (UX-DR20).
- Standard error envelope returned on errors: `{ "error": { "code": "STRING", "message": "STRING" } }`.

**Ask First:**
- None.

**Never:**
- Do not remove the `exams` tab — class-level exam integration will connect to real exams in Epic 3.
- Do not implement pagination controls if roster fits within default limits — filter locally when dataset is pre-fetched for the class.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Teacher navigates to class detail page for owned class | Class header (name, teacher, schedule summary), student roster table with real names/IDs | N/A |
| SEARCH_FILTER | Teacher types "John" in search input | Roster table updates instantly to show only matching students | N/A |
| NO_STUDENTS_FOUND | Search term matches 0 students | Roster table renders EmptyState: "No students match your search." | N/A |
| LOADING | Data fetch in flight | Skeleton shimmer rows for header, stats, and table | N/A |
| NOT_FOUND / UNAUTHORIZED_CLASS | classId does not exist or belongs to another teacher | Backend returns 404 | Show inline error banner: "Class not found or access denied." with Back button |
| FETCH_ERROR | Network or server 500 error | Show inline error banner with Retry action | Retry triggers refetch |

## Code Map

- `sms-shared/src/index.ts` -- ADD: `ClassDetailStudent`, `ClassSchedule`, `ClassDetailDTO`, and `ClassDetailResponse` cross-repo types.
- `sms-backend/src/routes/teacher.ts` -- MODIFY: add `GET /api/teacher/classes/:classId` endpoint with teacher-ownership validation and Prisma student roster include.
- `sms-frontend/src/api/teacher.ts` -- MODIFY: add `fetchClassDetail(classId: string)` and `useClassDetail(classId: string)` TanStack Query hook.
- `sms-frontend/src/screens/teacher/class-detail.tsx` -- MODIFY: replace mock `getClass()` with `useClassDetail()`, add skeleton shimmer, search filtering, and semantic `<table>`.
- `sms-frontend/src/screens/teacher/class-detail.css` -- MODIFY: ensure table layout, search input, and skeleton styles follow design system.

## Tasks & Acceptance

**Execution:**
- [x] `sms-shared/src/index.ts` -- ADD `ClassDetailStudent`, `ClassSchedule`, `ClassDetailDTO`, `ClassDetailResponse` types.
- [x] `sms-backend/src/routes/teacher.ts` -- ADD `GET /api/teacher/classes/:classId`. Validate `classId`, check `teacherId === req.user.userId`. Query `prisma.class.findFirst({ where: { id: classId, teacherId }, include: { schedules: true, students: { select: { id: true, firstName: true, lastName: true, email: true, studentId: true } } } })`. Return 404 if null. Return `{ data: { class } }`.
- [x] `sms-frontend/src/api/teacher.ts` -- ADD `fetchClassDetail(classId: string): Promise<ClassDetailDTO>` and export `useClassDetail(classId: string)` hook with `queryKey: ['classDetail', classId]`.
- [x] `sms-frontend/src/screens/teacher/class-detail.tsx` -- MODIFY: replace mock `getClass` read with `useClassDetail(classId)`. Render skeleton loading state, inline error banner with retry, real-time client-side search filter, and semantic HTML `<table>` for student roster.
- [x] `sms-frontend/src/screens/teacher/class-detail.css` -- MODIFY: add responsive table styles and search bar styling matching design system.

**Acceptance Criteria:**
- Given the teacher clicks a class card or navigates to `/class-detail`, when the page loads, then the class name, schedule, and student roster are displayed.
- Given the class detail page is loading, when the fetch is in flight, then skeleton shimmer placeholders matching the layout are displayed.
- Given the teacher types in the search input, when typing, then the student roster filters in real-time by student first name, last name, or ID.
- Given the student roster is displayed, when rendered, then it uses semantic HTML `<table>`, `<thead>`, `<tbody>`, and `<th scope="col">`.
- Given `npm run typecheck` in sms-backend and sms-frontend, then both pass.

### Review Findings

- [x] [Review][Defer] No automated route test for GET /api/teacher/classes/:classId [`sms-backend/src/routes/teacher.ts:88`](file:///d:/huyn/project/getting-start-bmad/sms-backend/src/routes/teacher.ts#L88) — deferred, pre-existing backend test infra gap

## Verification

**Commands:**
- `cd sms-backend ; npm run typecheck` -- expected: pass
- `cd sms-frontend ; npm run typecheck` -- expected: pass
