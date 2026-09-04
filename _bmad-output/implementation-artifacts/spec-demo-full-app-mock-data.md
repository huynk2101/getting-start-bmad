---
title: 'Full-app interactive demo with mock data'
type: 'feature'
created: '2026-09-04'
status: 'done'
baseline_commit: 'NO_VCS'
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The app's screens are all backlog; only base tokens + 6 components exist. There is no runnable, clickable way to see SchoolDesk as a whole, so the user has no demo to navigate or share.

**Approach:** Build a runnable front-end-only demo in `sms-frontend` covering the full SchoolDesk experience (teacher + student worlds, per EXPERIENCE.md key flows), driven by an in-memory mock dataset with a tiny client-side store. Zero backend dependency; dev server renders all screens clickable end-to-end.

## Boundaries & Constraints

**Always:**
- Reuse shipped base components (`Badge`, `Button`, `Card`, `EmptyState`, `Skeleton`, `ToastProvider`/`useToast`) from `src/components`. Do not reimplement them.
- Use design tokens from `src/tokens.css` verbatim (CSS custom properties, `var(--...)`). **Use corrected danger `--color-danger` = `#8E5555`; update `tokens.css` if it still reads `#9E6A6A`.**
- Follow EXPERIENCE.md Component Patterns + Key Flows; canonical lower-kebab component names; personas Mr. Chen (teacher) and Alex Rivera (student, she/her).
- All screens are responsive per EXPERIENCE.md Responsive & Platform (touch targets at sm, `color-scheme: light`, high-contrast non-color cues, 200% zoom reflow).
- Every feature here is a prototype of a backlog story — behavior must match the spine, but state is in-memory only (lost on refresh).

**Ask First:** Adding any external dependency (e.g. react-router); restructuring the existing shipped components; touching stories 1-2/1-3 behavior beyond the danger-token correction.

**Never:** No backend/API wiring; no persistence (localStorage or server); no real auth (a simple in-app role/login picker only); no production-grade concerns beyond demo fidelity; no changes outside `sms-frontend` except this spec.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| ROLE_LOGIN | Pick "Sign in as Mr. Chen (Teacher)" or "Alex Rivera (Student)" | Lands on that world's Dashboard with the matching top nav and greeting | Switcher always available to return and change role |
| GRADE_SAVE | Type score in grading row, press Enter | Row shows "Graded" badge + score; toast "Grade saved for <name>"; focus moves to next pending row | Non-numeric / 0–100 out-of-range → inline error, value not committed |
| MARK_ABSENT | Toggle absent on a row | Score input disabled+cleared; badge "Absent"; row muted | Toggle off restores editable pending row |
| FINALIZE | Click Finalize Grades (enabled only when all graded) | Confirm dialog → on confirm, summary locks, helper text shows, results unlocked | Button disabled until all rows graded/absent |
| EXAM_START | Click Start on an upcoming exam | Full-screen exam surface: timer, progress bar, question nav, radio options | Focus trapped; Escape asks confirm exit |
| EXAM_TIMER | Timer reaches 5:00 / 1:00 | Color shifts to amber / danger + assertive announcement text | Timer hits 0 → auto-submit, banner, redirect to Results |
| EXAM_SUBMIT | Click Submit | Confirm dialog lists unanswered count → on confirm, toast + redirect to Results | Confirmed/auto path handled; unanswered shown in dialog |

</frozen-after-approval>

## Code Map

- `sms-frontend/src/components/index.ts` -- shipped base-component barrel; reuse, add new demo primitives as new files (do not modify existing components)
- `sms-frontend/src/tokens.css` -- design tokens; correct `--color-danger` to `#8E5555`
- `sms-frontend/src/App.tsx` -- today shows scaffold showcase; the demo replaces the entry (keep base-3 health/showcase removed or behind a "Storybook" area)
- `sms-frontend/src/components/{Badge,Button,Card,EmptyState,Skeleton,Toast}.tsx` -- reuse `s-` prefixed classes
- `_bmad-output/planning-artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/mockups/key-screens-1.html` -- reference layouts + mock values for teacher class/grading and student dashboard/results
- `_bmad-output/.../DESIGN.md` -- component visual specs (data-table, class-card, exam-card, confirm-dialog, timer, progress-bar, inline-banner, empty-state, skeleton)
- `_bmad-output/.../EXPERIENCE.md` -- IA (two worlds), Key Flows 1-6, State Patterns, Interaction Primitives, Accessibility Floor

## Tasks & Acceptance

**Execution:**
- [x] `src/tokens.css` -- correct `--color-danger` to `#8E5555` -- align tokens.css with corrected DESIGN.md spine
- [x] `src/mock/data.ts` -- define mock domain (students, classes, exams with questions, scheduled results, roster/grading rows) -- single source of truth for demo data
- [x] `src/mock/store.tsx` -- `DemoDataProvider` + hooks (useStore: grade, setAbsent, finalize, saveExamAnswers, currentRole) -- in-memory state with toast wiring
- [x] `src/demo/demo-layout.tsx` -- `TopNav` (role nav items per EXPERIENCE IA), `AppShell`, lightweight state router + route context -- app chrome + routing for both worlds
- [x] `src/components/demo/` -- add missing primitives as new files: `DataTable.tsx`, `InlineInput.tsx`, `Toggle.tsx`, `ProgressBar.tsx`, `Timer.tsx`, `ConfirmDialog.tsx`, `InlineBanner.tsx`, `ClassCard.tsx`, `ExamCard.tsx` (+ `.css` each) -- support screens; per DESIGN/EXPERIENCE specs, `s-` prefixed, lowercase-kebab names
- [x] `src/screens/teacher/` -- `TeacherDashboard.tsx`, `ClassesList.tsx`, `ClassDetail.tsx`, `StudentsList.tsx`, `StudentProfile.tsx`, `ExamsList.tsx`, `CreateExam.tsx`, `ExamDetail.tsx`, `GradingView.tsx`, `ResultsList.tsx`, `ResultsDetail.tsx` -- full teacher world per EXPERIENCE Key Flows 1,3,4,5
- [x] `src/screens/student/` -- `StudentDashboard.tsx`, `ScheduleView.tsx`, `StudentExamsList.tsx`, `ExamTaking.tsx`, `StudentResultsList.tsx`, `StudentResultDetail.tsx` -- full student world per EXPERIENCE Key Flows 2,6
- [x] `src/screens/RoleLogin.tsx` -- pick Teacher/Student role -- entry to either world
- [x] `src/App.tsx` -- render `DemoDataProvider` + `RoleLogin`/`AppShell` -- replace scaffold showcase with the demo
- [x] Tests -- `src/mock/store.test.tsx` + `src/screens/exam-taking.test.tsx` + `src/screens/grading-view.test.tsx` -- cover I/O matrix (grade save, absent toggle, finalize gate, exam submit)

**Acceptance Criteria:**
- Given the demo is loaded, when the user signs in as a role, then they are on that world's dashboard with that role's top nav and greeting.
- Given Teacher grading, when all rows are graded/absent, then Finalize becomes enabled and finalizing locks grades + unlocks student breakdowns.
- Given an exam in progress, when the user answers, then auto-save marks the question answered and progress advances; submit confirms and returns to Results.
- Given any screen, when it is resized from lg to sm, then it stacks without horizontal scroll and interactive targets reach 44px.
- Given the full set of screens, when navigated end-to-end (both worlds, all Key Flows), then no console errors and `npm run typecheck` + `npm run test` pass.

## Spec Change Log

<!-- Append-only. Populated by step-04 during review loops. -->

## Design Notes

Remove this section if not needed. (See warnings: this is a large, multi-screen build. The demo reuses the shipped token system and base components; the 9 new primitives mirror already-specified base-component backlog (stories 1-3) but are kept local to the demo to avoid touching shipped review-pending code.)

Golden example — grading row interactions (per EXPERIENCE Key Flow 1): grading table row holds Name; Score as `InlineInput` (pending, placeholder `__`) or static text (graded `85 / 100`); Status Badge; Actions (Save for pending, View for graded). Summary bar: "`<n>` of `<total>` graded · Average score: `x%`" + Finalize (disabled until all done). Inline error binds via `aria-describedby`/`aria-errormessage`.

Golden example — exam taking (per EXPERIENCE Key Flow 2): radio options with native `<input type="radio">`+`<label>`; checkmark on answered; progress-bar milestone text at 50/75/90/100; timer shifts amber@5:00 / danger@1:00 with assertive announcement string; question nav `<nav aria-label="Question navigation">` + `<ol>` with `aria-current`; submit confirm dialog "Submit your exam? You've answered X of Y questions."; focus trapped in the surface.

## Verification

**Commands:**
- `npm run typecheck` -- expected: 0 errors
- `npm run test` -- expected: all suites green (base + new)
- `npm run build` -- expected: tsc + vite build succeed
- `npm run dev` -- manual: full click-through of both worlds

**Manual checks (if no CLI):**
- Sign in as each role; walk every Key Flow 1-6 and each nav item; verify visual fidelity to mockups, responsive stack at sm, focus/keyboard on exam surface and dialogs, timer + progress behavior, and corrected danger `#8E5555`.

## Suggested Review Order

**Data layer (mutations scoped correctly)**

- Grading and absent mutations keyed by exam's classId, so one class's entries can't corrupt another's.
  [`store.tsx:116`](../../sms-frontend/src/mock/store.tsx#L116)

- Zero-answer submit now records a result instead of being dropped.
  [`store.tsx:214`](../../sms-frontend/src/mock/store.tsx#L214)

- New `createExam` action powering the Create Exam form.
  [`store.tsx:151`](../../sms-frontend/src/mock/store.tsx#L151)

**Grading flow**

- Inline score now digits-only with 0-100 range; focus advances to next pending row after save.
  [`grading-view.tsx:52`](../../sms-frontend/src/screens/teacher/grading-view.tsx#L52)

- Finalize gating and absent-toggle behavior on the summary bar.
  [`grading-view.tsx:143`](../../sms-frontend/src/screens/teacher/grading-view.tsx#L143)

**Exam experience**

- Timer side effects moved out of the state updater to avoid StrictMode double-fire; thresholds announce the 5:00 / 1:00 marks once.
  [`timer.tsx:12`](../../sms-frontend/src/components/demo/timer.tsx#L12)

- Full-screen exam surface traps Tab; Escape opens (not reopens) the submit dialog.
  [`exam-taking.tsx:48`](../../sms-frontend/src/screens/student/exam-taking.tsx#L48)

- Biology Midterm is now startable ("open"), making the headline Flow-2 path reachable.
  [`student-exams-list.tsx:32`](../../sms-frontend/src/screens/student/student-exams-list.tsx#L32)

- Correct-answer breakdown shown only once the exam is finalized.
  [`student-result-detail.tsx:19`](../../sms-frontend/src/screens/student/student-result-detail.tsx#L19)

**Dialogs & inputs**

- Dialog Escape stops propagation (no reopen) and uses unique per-instance ARIA ids.
  [`confirm-dialog.tsx:43`](../../sms-frontend/src/components/demo/confirm-dialog.tsx#L43)

- Inline input exposes a forwardable ref and unique error ids per row.
  [`inline-input.tsx:36`](../../sms-frontend/src/components/demo/inline-input.tsx#L36)

**Accessibility shell & data**

- sr-only page h1 announces the actual screen title per route.
  [`demo-layout.tsx:79`](../../sms-frontend/src/demo/demo-layout.tsx#L79)

- DataTable cells carry `data-label` so the sm stacked layout renders correctly.
  [`data-table.tsx:52`](../../sms-frontend/src/components/demo/data-table.tsx#L52)

**Tests**

- Grading: save toast, focus forward, non-integer rejection.
  [`grading-view.test.tsx:1`](../../sms-frontend/src/screens/grading-view.test.tsx#L1)

- Exam timer expiry drives the surface auto-submit / redirect.
  [`exam-taking.test.tsx:1`](../../sms-frontend/src/screens/exam-taking.test.tsx#L1)

- Store: cross-class scope, zero-answer submit, role/login.
  [`store.test.tsx:1`](../../sms-frontend/src/mock/store.test.tsx#L1)
