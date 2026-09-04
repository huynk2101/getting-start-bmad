---
type: story-critique
created: 2026-09-03
epic-file: planning_artifacts/epics.md
ux-files:
  - planning_artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/EXPERIENCE.md
  - planning_artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/DESIGN.md
---

# Story Critique — SchoolDesk (28 Stories, 7 Epics)

**Reviewer methodology:** Each story evaluated against 5 criteria — scope (single dev session), independence (no forward deps), acceptance criteria quality (specific, testable, complete), UX-DR coverage, and implementation clarity.

---

## Epic 1: Foundation & Authentication

### Story 1.1 — Project Scaffolding & Docker Environment

- **Verdict:** ✅ Ready
- **Improvements:** None required. Well-scoped foundation story with clear success criteria.
- **Missing ACs:**
  - AC: Given the developer runs the backend, when any TypeScript source file is modified, then the Express dev server hot-reloads without restarting the container.
  - AC: Given the sms-shared package, when a type is added or changed, then both frontend and backend detect the change and recompile without manual intervention (workspace linking).
- **UX-DR coverage:** N/A — no UI in this story.

---

### Story 1.2 — Design System Foundation

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** This story bundles too many components into one story (tokens + skeleton + toast + empty-state). Each is independently testable but the ACs are dense. Recommend splitting into 1.2a (tokens + radius) and 1.2b (skeleton, toast, empty-state components). The skeleton AC references `{colors.background}` (#FAF8F5) as fill, but DESIGN.md specifies `{colors.border}` (#E5E2DD) for skeleton fill — resolve this discrepancy. The badge variant styles (tinted light-background vs. DESIGN.md filled-white-on-color) also need alignment.
- **Missing ACs:**
  - AC: Given the skeleton component is rendered, when the `prefers-reduced-motion` media query is active, then the shimmer animation is disabled and static placeholders appear.
  - AC: Given any component, when the toast auto-dismisses, then it dismisses after 4 seconds per DESIGN.md (not 3 seconds as currently stated — reconcile this discrepancy).
- **UX-DR coverage:** UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR6, UX-DR8 all referenced. Good coverage.

---

### Story 1.3 — Database Schema & Seed Data

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The AC references "AD-4" and "AD-6" but the Architecture section labels these as "AR-4" and "AR-6" — fix the cross-reference. The story says User model has "Teacher" and "Student" as entities but the schema should clarify whether Teacher and Student are separate Prisma models or roles on the User model (recommend separate models linked via FK for referential integrity). The error envelope AC is a backend contract concern — consider whether this belongs in Story 1.3 or Story 1.5 (RBAC middleware).
- **Missing ACs:**
  - AC: Given the Prisma schema, when `prisma generate` runs, then TypeScript types are generated for all models and the `Role` enum.
  - AC: Given the seed script, when it runs, then the seed is idempotent (running twice does not duplicate records).
- **UX-DR coverage:** N/A — backend-only story.

---

### Story 1.4 — User Login (FR-23, NFR-6)

- **Verdict:** ✅ Ready
- **Improvements:** Minor — add AC for login page accessibility: given a user navigates to the login page, when they Tab through fields, then focus order is username → password → submit with visible focus ring (UX-DR17).
- **Missing ACs:**
  - AC: Given the login page, when it loads, then it uses the Book Binder visual direction: warm paper background (#FAF8F5), Georgia serif heading "SchoolDesk", and system sans-serif form labels (UX-DR1, UX-DR2).
- **UX-DR coverage:** UX-DR17 (focus ring) and UX-DR7 (inline error banner) are covered. Consider explicit UX-DR1 reference for the page styling.

---

### Story 1.5 — Role-Based Access Control (FR-24)

- **Verdict:** ✅ Ready
- **Improvements:** Well-scoped, three clear ACs. Consider adding a non-AC test case: given a student JWT, when the student hits a student endpoint, then 200 OK is returned (happy path verification).
- **Missing ACs:** None.
- **UX-DR coverage:** N/A — backend-only story.

---

## Epic 2: Teacher Dashboard & Class Management

### Story 2.1 — Teacher Daily Class Overview (FR-1)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The UX world table for Teacher Dashboard says it shows "upcoming exams, recent grading activity, class summaries" — the story AC only addresses "today's classes." Confirm whether "upcoming exams" and "recent grading activity" widgets are in scope for this story or deferred. The hover tint AC is correct but overly specific (#FAF8F5) — reference UX-DR1 for the background color token instead. Missing skeleton loading AC (required by UX-DR5).
- **Missing ACs:**
  - AC: Given the dashboard is loading, when data is being fetched, then skeleton shimmer placeholders appear matching the class card layout (UX-DR5).
  - AC: Given the teacher is authenticated and on the dashboard, when the page loads, then a greeting "Welcome back, [First Name]" is displayed in Georgia serif (EXPERIENCE.md Flow 1, UX-DR1).
- **UX-DR coverage:** UX-DR5 (skeletons), UX-DR8 (empty state) are covered in the skeleton AC but need to be explicitly called out. UX-DR1 referenced for card hover.

---

### Story 2.2 — Navigate to Class Details from Dashboard (FR-2)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** This is too thin as a standalone story — it is a single AC (click card → navigate). Consider merging with Story 2.4 (Class Detail View) since both are about the same navigation flow and the class detail page. If kept separate, add a keyboard accessibility AC.
- **Missing ACs:**
  - AC: Given the teacher uses keyboard navigation, when they Tab to a class card and press Enter, then they are navigated to the class detail page.
- **UX-DR coverage:** UX-DR20 (tab order matches visual reading order).

---

### Story 2.3 — Class List (FR-3)

- **Verdict:** ✅ Ready
- **Improvements:** Solid, well-scoped. The skeleton AC correctly references UX-DR5. Consider adding the "Enrolled Since" column to the student roster table if it is part of the class list scope (it is mentioned in the UX spec but not in this story's AC).
- **Missing ACs:**
  - AC: Given the teacher navigates to Classes, when the page loads, then the top nav highlights "Classes" as the active item (UX-DR9 — teacher world navigation).
- **UX-DR coverage:** UX-DR5 (skeleton), UX-DR8 (empty state) covered.

---

### Story 2.4 — Class Detail View (FR-4)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The UX spec for the Student Roster Table mentions "Enrolled Since" and "Actions (View)" columns — the story AC only mentions "student list" without these columns. Clarify. The search AC is good. Missing skeleton AC.
- **Missing ACs:**
  - AC: Given the class detail is loading, when data is being fetched, then skeleton shimmer rows appear for the schedule and student list (UX-DR5).
  - AC: Given the class detail page, when it loads, then it shows the class name, schedule (day/time slots), teacher name, and a searchable student roster with columns: Name, Student ID, Enrolled Since, Actions (View).
- **UX-DR coverage:** UX-DR4 (skeleton component), UX-DR18 (semantic table) — add explicit reference.

---

### Story 2.5 — Student Profile View (FR-5)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The story description mentions "exam/test results" in the student profile — this requires data from Epic 7 (results) and Epic 4 (grading). This creates a forward dependency: the results shown in the teacher's student profile depend on graded/finalized exams from later epics. Add an AC clarifying that pending or ungraded results show "—" score. Also missing skeleton loading AC.
- **Missing ACs:**
  - AC: Given the student profile loads, when data is being fetched, then skeleton shimmer placeholders appear (UX-DR5).
  - AC: Given the student has exam results with mixed statuses, when the results list loads, then graded results show a green "Graded" badge with score, pending results show an amber "Pending" badge with "— / [total]", and finalized results show a green badge with correct answer indicator available.
- **UX-DR coverage:** UX-DR5 (skeleton), UX-DR4 (badge variants) — add references.

---

## Epic 3: Exam & Test Management

### Story 3.1 — Create Exam/Test (FR-6)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The UX design for "Exam Card" mentions status as "draft, open, closed, finalized" — the story AC only says "upcoming/completed" for status. Clarify the full status lifecycle. The inline validation AC is good (UX-DR7). Missing loading/skeleton state for the class dropdown.
- **Missing ACs:**
  - AC: Given the teacher opens the create exam form, when the class dropdown loads, then it shows skeleton shimmer while fetching the teacher's class list (UX-DR5).
  - AC: Given the teacher creates an exam, when the form is submitted, then the exam enters "Upcoming" status and appears in the exam list (Story 3.4).
- **UX-DR coverage:** UX-DR7 (inline error banner) covered. Consider UX-DR4 reference for badge styling on status.

---

### Story 3.2 — Exam Scheduling Conflict Detection (FR-7)

- **Verdict:** ✅ Ready
- **Improvements:** Three ACs covering happy path, conflict, and cross-class non-conflict. Well-scoped. The inline banner for conflict is correct per EXPERIENCE.md ("inline banner, not modal").
- **Missing ACs:**
  - AC: Given the teacher sees the conflict message, when they modify the date/time to a non-overlapping slot, when they re-submit, then the exam is saved successfully (conflict is resolved inline, not by closing the form).
- **UX-DR coverage:** UX-DR7 (inline banner) correctly applied.

---

### Story 3.3 — Add Questions to Exam/Test (FR-8)

- **Verdict:** ✅ Ready
- **Improvements:** MC and T/F question types covered. Inline validation (UX-DR7) referenced. Consider adding AC for question ordering or the exam detail page layout.
- **Missing ACs:**
  - AC: Given the teacher is on the exam detail page, when they add questions, then each question displays a question number (Q1, Q2, etc.) matching the exam-question-card component (DESIGN.md).
- **UX-DR coverage:** UX-DR7 (inline error) covered. Consider UX-DR18 (semantic form) reference.

---

### Story 3.4 — Exam List with Filters (FR-9)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** Status badge styling is not referenced. The UX spec for exam cards uses "draft, open, closed, finalized" statuses, but this story only mentions "upcoming/completed." Align the status definitions across stories. Missing skeleton loading AC.
- **Missing ACs:**
  - AC: Given the exam list is loading, when data is being fetched, then skeleton shimmer rows appear (UX-DR5).
  - AC: Given the exam list, when no exams exist, then an empty state is shown: "No exams on the horizon. Enjoy the quiet." (EXPERIENCE.md state pattern).
- **UX-DR coverage:** UX-DR5 (skeleton), UX-DR8 (empty state) — add references.

---

## Epic 4: Grading

### Story 4.1 — View Exam Submissions for Grading (FR-10)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The summary bar AC mentions "grading progress and average score" but does not specify the exact copy format. Reference EXPERIENCE.md voice: "25 of 28 graded · Average score: 78.3%". Missing skeleton loading AC.
- **Missing ACs:**
  - AC: Given the grading view is loading, when data is being fetched, then skeleton shimmer rows appear for the table and summary bar (UX-DR5).
  - AC: Given the grading table, when it renders, then it uses semantic HTML `<table>`, `<thead>`, `<tbody>`, and `<th scope>` attributes (UX-DR18).
- **UX-DR coverage:** UX-DR4 (badge variants — Graded/Pending/Absent), UX-DR14 (grading table with inline inputs), UX-DR18 (semantic table) — add explicit references.

---

### Story 4.2 — Enter and Save Scores (FR-11)

- **Verdict:** ✅ Ready
- **Improvements:** The auto-save-on-Enter pattern is well-defined. The inline error banner for network failure correctly references UX-DR7. Consider adding a keyboard workflow AC: Tab/Enter to next student.
- **Missing ACs:**
  - AC: Given the teacher presses Tab after saving a score, when focus moves, then it lands on the next student's score input (EXPERIENCE.md: "Tab/Enter to next student").
- **UX-DR coverage:** UX-DR6 (toast), UX-DR7 (inline error banner), UX-DR14 (grading table inline inputs) — all covered.

---

### Story 4.3 — Mark Student as Absent (FR-12)

- **Verdict:** ✅ Ready
- **Improvements:** Toggle switch (UX-DR15) correctly referenced. Row muting, badge change, and summary bar update all covered. Consider adding AC for when all students are absent — the finalize button should be enabled (edge case).
- **Missing ACs:**
  - AC: Given all students are marked absent, when the teacher views the grading page, then the "Finalize Grades" button is enabled and the summary bar shows "0 of [N] graded" with "All students marked absent."
- **UX-DR coverage:** UX-DR15 (toggle switch), UX-DR14 (grading table) — well covered.

---

### Story 4.4 — Finalize Grades (FR-13)

- **Verdict:** ✅ Ready
- **Improvements:** Confirmation dialog (UX-DR16) correctly implemented. The "cannot be undone" messaging matches EXPERIENCE.md. The disabled button AC with helper text is good.
- **Missing ACs:** None — this story is complete.
- **UX-DR coverage:** UX-DR16 (confirmation dialog) — well covered.

---

## Epic 5: Student Portal — Dashboard & Schedule

### Story 5.1 — Student Dashboard (FR-14)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The greeting AC references "Welcome back, [First Name]" which is good. However, the story description mentions "upcoming exams" but the AC only references a basic widget — the actual widget layout (exam name, date/time, class) is defined in EXPERIENCE.md Flow 2 but not in the AC. Clarify the exam widget contents.
- **Missing ACs:**
  - AC: Given the student dashboard loads, when the Upcoming Exams widget is displayed, then each exam shows exam name, date/time, class association, and status badge (pending/upcoming) — matching the Exam Card component (EXPERIENCE.md).
- **UX-DR coverage:** UX-DR5 (skeleton), UX-DR8 (empty state), UX-DR1 (Book Binder direction) — add UX-DR1 reference for greeting styling (Georgia serif).

---

### Story 5.2 — Student Schedule View (FR-15)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The AC says "weekly or list layout" — this is vague. Specify which layout is used at each breakpoint (e.g., weekly grid at lg/md, card stack at sm per EXPERIENCE.md responsive patterns). The student world table in the UX spec defines the schedule as "Full weekly class schedule" — align.
- **Missing ACs:**
  - AC: Given the schedule page loads at lg/md breakpoints, when classes are displayed, then a weekly grid layout is used with time slots and class blocks (per DESIGN.md responsive patterns).
  - AC: Given the schedule page loads at sm breakpoint, when classes are displayed, then a stacked card layout is used instead of a grid.
- **UX-DR coverage:** UX-DR5 (skeleton) covered. Add UX-DR4 reference.

---

### Story 5.3 — Student Class Detail View (FR-16)

- **Verdict:** ✅ Ready
- **Improvements:** Straightforward, well-scoped. Skeleton loading AC is present. The class name, schedule, teacher name, and teacher contact info are all specified. Consider adding a "navigate back to schedule" action.
- **Missing ACs:**
  - AC: Given the student is on the class detail page, when they click "Back to Schedule" or the Schedule nav item, then they return to the schedule view (EXPERIENCE.md — student world navigation).
- **UX-DR coverage:** UX-DR5 (skeleton) — covered.

---

## Epic 6: Student Portal — Exam Taking

### Story 6.1 — Start Exam (FR-17)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The fade-to-full-screen transition is correctly referenced (UX-DR10). However, the AC says the "Start" button is "disabled or hidden" for future exams — pick one behavior. EXPERIENCE.md Flow 2 shows "Start" button only when time has arrived. Recommend: button is hidden before the time, shown when time arrives. Add AC for what happens if the student navigates away from the full-screen exam.
- **Missing ACs:**
  - AC: Given the student is in the full-screen exam mode, when they press Escape, then a confirmation dialog appears: "Exit exam? Your progress is saved." with Confirm (exit) and Cancel (stay) buttons (EXPERIENCE.md: Escape exits exam with confirmation).
- **UX-DR coverage:** UX-DR10 (exam-taking full-screen mode with fade transition) — covered.

---

### Story 6.2 — Answer Questions (FR-18)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The AC references "sidebar" for question navigation — this is an implementation detail not defined in the UX spec's component patterns. The UX spec describes a "progress bar with milestone messages" and "question navigation sidebar" in the Exam-Taking Interface component, so this is valid. However, the sidebar's exact behavior (is it a list of Q1-Q30 clickable items? arrow-key navigable?) needs more specificity. The auto-save checkmark indicator (UX-DR12) is referenced.
- **Missing ACs:**
  - AC: Given the student is in the exam-taking interface, when the progress bar advances, then milestone messages appear: "Halfway there!" at 50% and "Just 5 more!" when 5 questions remain (UX-DR13).
  - AC: Given the student views a question, when the question type is Multiple Choice, then four radio options are displayed; when True/False, then two radio options are displayed.
- **UX-DR coverage:** UX-DR12 (checkmark indicator), UX-DR13 (milestone messages) — add explicit references.

---

### Story 6.3 — Submit Exam with Timer and Auto-Submit (FR-19, NFR-1)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The timer color transition AC says "green to amber at 5min → red at 1min" (UX-DR11), but DESIGN.md says the timer shifts to danger color at 5 minutes and has no amber state. Reconcile this discrepancy between UX-DR11 and DESIGN.md. The 3-second submit latency (NFR-1) is correctly referenced. The confirmation dialog AC correctly shows question count.
- **Missing ACs:**
  - AC: Given the student submits the exam, when the submit is in progress, then a loading indicator appears on the Submit button (not a spinner — use the button's disabled state with "Submitting..." label).
  - AC: Given the exam auto-submits on timeout, when the timer reaches 0:00, then the student is redirected to the Results page with a toast: "Time's up — your answers have been submitted."
- **UX-DR coverage:** UX-DR11 (timer color transitions) — covered but needs reconciliation with DESIGN.md. UX-DR6 (toast) covered.

---

### Story 6.4 — Auto-Save During Exam (FR-20, NFR-5)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The offline handling AC is well-defined. The "sync on reconnect" behavior is specified. However, the AC does not address: what happens if the student submits while offline? Add an AC for offline submit handling. Also, the auto-save fires "immediately" — is there debouncing? Specify.
- **Missing ACs:**
  - AC: Given the student is offline and clicks Submit, when the submit is attempted, then the submission is queued locally, an inline banner appears: "You're offline — your exam will be submitted when you reconnect," and the student is redirected to results after sync completes.
  - AC: Given the student selects an answer, when multiple rapid selections are made within 500ms, then auto-save debounces and fires once with the latest answer (not once per click).
- **UX-DR coverage:** UX-DR7 (inline banner) — covered. UX-DR12 (checkmark indicator) — covered.

---

### Story 6.5 — Exam-Taking Accessibility (NFR-2, NFR-3, UX-DR17, UX-DR18, UX-DR19, UX-DR20)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** This story bundles all accessibility requirements for exam-taking into one story. While accessibility is important, this story depends on Stories 6.1–6.4 being implemented first (you cannot add keyboard support to an interface that does not exist). Consider whether this should be a cross-cutting concern applied to each of 6.1–6.4, or a dedicated story after all exam-taking features are complete. The `role="application"` AC is controversial — WCAG recommends against `role="application"` for exam-like interfaces; consider whether `role="document"` or no role is more appropriate.
- **Missing ACs:**
  - AC: Given the exam-taking interface, when a screen reader announces the timer, then it announces at 60-second intervals via `aria-live="polite"` (EXPERIENCE.md: "Screen reader announces timer at intervals (every 60 seconds)").
  - AC: Given the exam-taking interface, when error banners appear (offline, submit failure), then they use `aria-live="assertive"` so screen readers announce immediately (EXPERIENCE.md accessibility floor).
- **UX-DR coverage:** UX-DR17 (focus ring), UX-DR18 (semantic HTML), UX-DR19 (reduced-motion), UX-DR20 (tab order) — all covered. Good.

---

## Epic 7: Student Portal — Results

### Story 7.1 — Results List (FR-21)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** The AC mentions "Graded/Pending" status badges but not "Upcoming" (exams not yet taken). The UX student world table shows "Personal exam results, question-by-question breakdown" — the list itself is clear. Missing: what happens when the student taps a result — is it a navigation to Story 7.2's detail page? Add a navigation AC.
- **Missing ACs:**
  - AC: Given the student taps a result row, when the tap/click occurs, then they are navigated to the result detail page (Story 7.2) showing the full breakdown.
  - AC: Given the results list loads, when an exam is still pending (not yet graded), then the score shows "— / [total]" with an amber "Pending" badge (EXPERIENCE.md Flow 2).
- **UX-DR coverage:** UX-DR5 (skeleton), UX-DR8 (empty state), UX-DR4 (badge variants) — covered.

---

### Story 7.2 — Result Detail with Per-Question Breakdown (FR-22, FR-13 dependency)

- **Verdict:** ⚠️ Needs refinement
- **Improvements:** This is the most complex story with 4 ACs covering finalized, non-finalized, and pending states. The FR-13 dependency is correctly noted in the story title. However, the AC for "total score (large number + percentage)" does not specify the typography — this should use Georgia serif display font per DESIGN.md (score display uses display typography). The correct/incorrect indicator color (green = correct, red = incorrect) should reference DESIGN.md success/danger tokens.
- **Missing ACs:**
  - AC: Given the result detail page, when the total score is displayed, then it uses Georgia serif display font (28px, weight 400) with the score as a large number and percentage (UX-DR1, DESIGN.md display typography).
  - AC: Given the per-question breakdown, when a question is correct, then a green "Correct" badge is shown (DESIGN.md success color); when incorrect, a red "Incorrect" badge is shown (DESIGN.md danger color).
- **UX-DR coverage:** UX-DR1 (Book Binder direction for score typography), UX-DR4 (badge variants) — add explicit references.

---

## Consolidation & Splitting Recommendations

### Stories to Combine (too small, same epic, same files)

| Stories | Rationale | New Story |
|---------|-----------|-----------|
| **2.2 + 2.4** | Story 2.2 is a single-AC navigation story; Story 2.4 is the class detail page it navigates to. Both touch the same route and component. | **2.2 — Class Detail View (with dashboard navigation)** |
| **4.1 + 4.2** | Story 4.1 is the grading table view; Story 4.2 is inline score entry on the same table. They share the same component and API. Combining avoids building the table twice. | **4.1 — Grading View with Inline Score Entry** |

### Stories to Split (too large)

| Story | Rationale | Suggested Split |
|-------|-----------|-----------------|
| **1.2** | Bundles tokens + skeleton + toast + empty-state. Each is independently testable and has distinct UX-DR references. A single dev session might struggle to implement and test all four correctly. | **1.2a:** Design tokens & radius system (UX-DR1, DR2, DR3). **1.2b:** Skeleton, toast, empty-state components (UX-DR5, DR6, DR8). |
| **6.3** | Bundles timer behavior, submit flow, confirmation dialog, auto-submit, and NFR-1 latency. This is functionally two distinct features: timer management and exam submission. | **6.3a:** Timer & auto-submit (UX-DR11, NFR-1). **6.3b:** Submit confirmation & post-submit flow (UX-DR6). |

---

## Cross-Story Issues

### 1. Skeleton Loading States Missing from Multiple Stories
Stories 2.1, 2.4, 2.5, 3.4, and 4.1 do not include skeleton loading ACs despite UX-DR5 requiring shimmer loading on all surfaces. Add skeleton ACs to each.

### 2. Timer Color Discrepancy (UX-DR11 vs. DESIGN.md)
- UX-DR11 says: green → amber at 5min → red at 1min (3 states)
- DESIGN.md says: shifts to danger color at 5 minutes (2 states, no amber)
- Story 6.3 references UX-DR11. Resolve which is authoritative.

### 3. Toast Auto-Dismiss Time Discrepancy
- Story 1.2 AC says 3 seconds
- EXPERIENCE.md says "auto-dismiss after 3s"
- DESIGN.md says "auto-dismiss after 4 seconds"
- Reconcile to a single value.

### 4. Status Lifecycle Undefined
- Exam statuses are mentioned inconsistently: "upcoming/completed" (Story 3.4) vs. "draft, open, closed, finalized" (EXPERIENCE.md) vs. "Graded/Pending" (Story 7.1)
- Define the complete status lifecycle once and reference it in all stories.

### 5. Student Profile View (2.5) Forward-Depends on Results
- Story 2.5 shows "exam/test results" in the student profile, but graded results depend on Epic 4 (grading) and Epic 7 (results). Either defer this section of the profile to after those epics, or specify that only pending/ungraded exams appear initially.

---

## Summary

| Metric | Count |
|--------|-------|
| **Total stories reviewed** | 28 |
| **✅ Ready** | 11 |
| **⚠️ Needs refinement** | 17 |
| **❌ Needs rework** | 0 |

### Top 3 Improvements

1. **Add skeleton loading ACs to all data-fetching stories** (Stories 2.1, 2.4, 2.5, 3.4, 4.1). UX-DR5 requires shimmer on all surfaces — 5 stories are missing this AC.

2. **Resolve the timer color discrepancy** between UX-DR11 (3-state: green/amber/red) and DESIGN.md (2-state: green/red at 5min). This affects Stories 6.3 and 6.5 and will cause implementation confusion.

3. **Split Story 1.2 and consolidate Stories 2.2+2.4** to match single-dev-session scope. Story 1.2 is too large; Story 2.2 is too thin.

### Output File
`D:\huyn\project\getting-start-bmad\_bmad-output\planning-artifacts\reviews\critique-stories.md`
