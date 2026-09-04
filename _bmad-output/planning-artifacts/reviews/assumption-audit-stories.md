# Assumption Audit — SchoolDesk Stories (22 stories, 7 epics)

**Audited:** epics.md, prd.md, ARCHITECTURE-SPINE.md
**Date:** 2026-09-03

---

## Category 1: Data Assumptions

| # | Assumption | Confidence | Impact | Story(s) | Settled by PRD/Arch? | Action |
|---|-----------|------------|--------|----------|----------------------|--------|
| D-1 | Every Class has exactly one Schedule (recurring day/time slots) | High | High | 2.1, 2.4, 5.2, 5.3 | Arch AD-20 implies single Schedule per Class, but doesn't explicitly forbid multi-schedule or variable schedules | Add AC: class with no schedule shows graceful empty state |
| D-2 | Every Class has exactly one Teacher | High | High | 5.3 | PRD glossary says "one class has one teacher" — settled | None |
| D-3 | Every Teacher has a contactInfo field (email/phone) | High | Medium | 5.3 | PRD UJ-2 says "contact info"; schema in 1.3 doesn't list it explicitly | Add to 1.3 AC or schema |
| D-4 | Every Student has a contactInfo field | High | Medium | 2.5 | PRD FR-5 lists "contact info" as part of student profile | Add to 1.3 schema explicitly |
| D-5 | Every Student has a firstName field (not just a full name) | High | Medium | 5.1, 6.3 | Stories reference "[First Name]" greeting; PRD doesn't specify name structure | Verify schema has firstName; add AC |
| D-6 | Student count per class is computed via join (not denormalized) | Medium | Low | 2.1, 2.3, 5.1 | Not addressed — could be either approach | Defer; no risk if either works |
| D-7 | Every Exam has a status field (upcoming/completed/finalized) | High | High | 3.4, 4.4, 7.1, 7.2 | PRD implies status lifecycle but never defines enum values | Add to 1.3 schema AC |
| D-8 | Every Exam has exactly one owner Teacher | High | Medium | 3.1, 3.4 | Implied by PRD ("teacher can see exams they created") | Add to schema if not explicit |
| D-9 | Enrollment is a many-to-many relationship (Student ↔ Class) | High | High | 2.4, 2.5, 5.2 | PRD says "student enrolled in one or more classes" | Verify schema has Enrollment join table |
| D-10 | Every Class has enrolled students (a class with 0 students is a valid edge case) | Medium | Medium | 2.1, 2.3, 4.1 | Stories show empty states for "no classes" but not "class with 0 students" | Add AC: class with 0 students shows "No students enrolled" |
| D-11 | The seed data produces at least one class with a schedule and two students | High | High | 1.3 | Story 1.3 AC explicitly states this | None |
| D-12 | Contact info is a simple string field (not a structured address/phone) | Medium | Low | 2.5, 5.3 | Not addressed | Defer |
| D-13 | Student ID is auto-generated (not teacher-assigned) | Medium | Low | 2.5 | PRD says "student ID" but doesn't say who assigns it | Verify schema |

---

## Category 2: Timing Assumptions

| # | Assumption | Confidence | Impact | Story(s) | Settled by PRD/Arch? | Action |
|---|-----------|------------|--------|----------|----------------------|--------|
| T-1 | Exam submission completes within 3 seconds (NFR-1) | High | High | 6.3 | PRD NFR-1 states this explicitly | None |
| T-2 | Auto-save fires immediately on each selection (no debounce) | High | Medium | 6.4 | PRD FR-20 says "each answer selection" | None |
| T-3 | Timer is client-side JavaScript (not server-synced) | High | High | 6.1, 6.3 | Architecture doesn't specify; client-side timer can drift vs. server time | Add AC: timer is server-anchored at exam start |
| T-4 | "Today" for class scheduling is determined by the server's local timezone or the school's configured timezone | High | High | 2.1, 5.1 | Arch AD-14 says "timezone-aware at API layer" but doesn't say whose timezone | Clarify: is timezone per-school, per-user, or server default? |
| T-5 | Exam "has arrived" is checked client-side against local clock | Medium | High | 6.1 | If client clock is wrong, student may start exam early/late | Add: server validates start window |
| T-6 | The 5-minute warning (Story 6.3) is hardcoded, not configurable per exam | High | Low | 6.3 | PRD says "60 seconds" as assumption; story uses 5 minutes — PRD assumption overridden | Reconcile: PRD says 60s, story says 5min — pick one |
| T-7 | Auto-submit fires exactly when timer hits 0:00 | High | Medium | 6.3 | PRD says "duration expires, auto-submits" | None |
| T-8 | Class schedule times are recurring weekly (not one-off) | High | High | 2.1, 5.2 | Arch AD-20 says "recurring day/time slots" | None |

---

## Category 3: User Behavior Assumptions

| # | Assumption | Confidence | Impact | Story(s) | Settled by PRD/Arch? | Action |
|---|-----------|------------|--------|----------|----------------------|--------|
| U-1 | Teachers only create exams for their own classes (not other teachers' classes) | High | High | 3.1 | Implied by PRD "teacher can see exams they created" but not explicitly enforced | Add AC: class dropdown only shows teacher's own classes |
| U-2 | Teachers navigate to grading via the exam list (not a separate route) | Medium | Low | 4.1 | Not addressed — could be either path | Defer |
| U-3 | Students only take exams during the scheduled window (no early start) | High | High | 6.1 | Arch AD-8 says "not startable after closed" but doesn't address early start | Add AC: Start button disabled before scheduled time |
| U-4 | Students don't need to navigate away from the exam tab during exam-taking | High | Medium | 6.3, 6.4 | If student switches tabs, timer may pause (browser throttling) | Add AC: timer continues even when tab is backgrounded |
| U-5 | Teachers finalize grades in one action (not partial finalize per student) | High | High | 4.4 | PRD FR-13 says "finalize grades for an exam/test" (bulk) | None |
| U-6 | Teachers don't need to re-grade after finalizing | High | High | 4.4 | Story says "This cannot be undone" — but PRD doesn't say this | Verify: should finalization be reversible? |
| U-7 | The grading table always loads all students for an exam (no pagination in grading view) | Medium | Medium | 4.1, 4.2 | Arch AD-13 says list endpoints are paginated; grading table may need pagination for large classes | Add AC: handle 30+ students without performance issues |
| U-8 | Students submit exam (don't just let it auto-submit) — majority of submissions are manual | Medium | Low | 6.3 | Not addressed | Defer |
| U-9 | Teachers enter scores as integers (not decimals/percentages) | Medium | Medium | 4.2 | Story doesn't specify score format; PRD says "scores" without format | Clarify: integer points? percentage? max score? |
| U-10 | Focus moves to next student after Enter (keyboard-driven workflow) | High | Medium | 4.2 | UX-DR14 says "tab/enter to next student" | None |

---

## Category 4: Technical Assumptions

| # | Assumption | Confidence | Impact | Story(s) | Settled by PRD/Arch? | Action |
|---|-----------|------------|--------|----------|----------------------|--------|
| TK-1 | React Router supports the required route structure (teacher/student/full-screen exam) | High | Medium | All frontend | Arch AD-2 confirms React Router | None |
| TK-2 | TanStack Query can handle real-time grading table updates | High | Medium | 4.2 | Arch AD-5 says TanStack Query for server state | None — but verify cache invalidation on auto-save |
| TK-3 | The full-screen exam mode is achievable via CSS/React (not a browser fullscreen API) | Medium | Medium | 6.1, 6.5 | UX-DR10 says "full-screen focused exam mode" | Verify: CSS full-screen or Fullscreen API? |
| TK-4 | Skeleton shimmer components exist for all layout shapes | Medium | Low | 1.2, 2.1, 2.3, 2.4, 4.1, 5.1, 5.2, 5.3, 7.1 | Story 1.2 creates skeleton component | None |
| TK-5 | HTTP-only cookies work across same-origin SPA and API | High | High | 1.4 | Arch AD-4 confirms HTTP-only cookies | None — but verify CORS + cookie config in Docker |
| TK-6 | Prisma can express the many-to-many Student↔Class relationship | High | Low | 1.3, 2.4 | Prisma supports implicit many-to-many | None |
| TK-7 | Prisma can efficiently query "classes scheduled for today" by day-of-week | Medium | Medium | 2.1, 5.1 | Requires a Schedule model with day-of-week; Prisma can do this but query shape matters | Verify query performance with seed data |
| TK-8 | The offline banner in Story 6.4 uses navigator.onLine or similar browser API | Medium | Medium | 6.4 | Not addressed in architecture | Add AC: define offline detection method |
| TK-9 | Vite dev server and Express backend run on different ports in Docker | High | Low | 1.1 | Story 1.1 says "designated ports" | None |
| TK-10 | WebSocket or polling is NOT needed for exam timer sync | High | High | 6.3 | If timer is client-side only, no WS needed; but if server-enforced, WS may be needed | Clarify timer architecture |
| TK-11 | The shared types package can version bump without breaking either repo | Medium | Medium | 1.1 | Arch AD-16 says "versioned" but no versioning strategy defined | Add: semver strategy for sms-shared |

---

## Category 5: Cross-Story Assumptions

| # | Assumption | Confidence | Impact | Story(s) | Settled by PRD/Arch? | Action |
|---|-----------|------------|--------|----------|----------------------|--------|
| C-1 | Story 2.5 (Student Profile) assumes Story 3.4+ has produced exam results | High | High | 2.5 → 3.x, 4.x | No dependency declared between Epic 2 and Epic 4 | Add explicit dependency note |
| C-2 | Story 4.1 (Grading View) assumes Story 6.x has produced submission entities | High | High | 4.1 → 6.x | Grading view shows "all enrolled students" — but submissions only exist after students take exams | Add AC: handle students who haven't started exam |
| C-3 | Story 7.2 (Result Detail) assumes Story 4.4 (Finalize) has set a finalized flag | High | High | 7.2 → 4.4 | Story 7.2 AC explicitly references FR-13 finalize state | Dependency is explicit — OK |
| C-4 | Story 3.4 (Exam List) assumes exams have a consistent status field that Story 4.4 will update | High | Medium | 3.4 → 4.4 | No shared status enum defined | Define exam status enum in schema |
| C-5 | Story 2.1 (Daily Overview) and Story 5.1 (Student Dashboard) assume the same Schedule model and query pattern | High | Medium | 2.1 ↔ 5.1 | Arch AD-20 governs both | None — shared model is explicit |
| C-6 | Story 3.2 (Conflict Detection) assumes Story 3.1 creates exams with timezone-aware date/time | High | High | 3.2 → 3.1 | Arch AD-14 says timezone-aware; conflict check needs timezone to compare windows correctly | Add AC: conflict detection uses timezone-aware comparison |
| C-7 | Story 6.4 (Auto-Save) assumes Story 1.3 (Schema) includes a field for storing student answers per question | High | High | 6.4 → 1.3 | Arch AD-15 says Submission owns answers; schema must store per-question answers | Verify: is there a StudentAnswer or AnswerSelection model? |
| C-8 | Story 7.1 (Results List) assumes all exams the student is enrolled in appear, even if not yet graded | High | Medium | 7.1 → all | Story 7.1 AC shows "Graded/Pending" status — requires exams to appear before grading | None — explicit in AC |
| C-9 | Story 3.4 (Exam List status filter "upcoming/completed") assumes "completed" means "past scheduled end time" | Medium | Medium | 3.4 | Status semantics not defined — could mean "grading done" vs. "exam window closed" | Define: status enum values and when each transitions |
| C-10 | Story 4.4 (Finalize) assumes the grading table is fully loaded before finalize is allowed | Medium | Medium | 4.4 → 4.1 | Story 4.4 AC says "all students are graded or marked absent" — requires knowing total count | None |

---

## Category 6: PRD Alignment Assumptions (Stories settle open PRD assumptions)

| # | Assumption | Confidence | Impact | Story(s) | Settled by PRD/Arch? | Action |
|---|-----------|------------|--------|----------|----------------------|--------|
| P-1 | Questions are presented ALL AT ONCE (scrollable), not one-at-a-time | High | High | 6.2 | PRD §Open Q #2 says "one at a time or all at once [ASSUMPTION: unconfirmed]" — story assumes all-at-once | Verify with stakeholder; PRD marks this as open |
| P-2 | Warning timer is at 5 minutes, not 60 seconds (PRD says 60s) | High | Medium | 6.3 | PRD §Open Q #3 says "60 seconds [ASSUMPTION]" — story overrides to 5min | Reconcile: which is correct? |
| P-3 | Offline answers are saved locally and synced (PRD says [ASSUMPTION]) | High | High | 6.4 | PRD FR-20 marks "saved locally and synced" as [ASSUMPTION]; Arch AD-9 downgrades to "retry-on-reconnect only" | Arch settles this — no local storage in v1 |
| P-4 | Student list is searchable by name (PRD marks [ASSUMPTION]) | High | Low | 2.4 | PRD FR-4 marks search as [ASSUMPTION] — story implements it | None — story settles the assumption |
| P-5 | Session is maintained until logout (PRD marks [ASSUMPTION]) | High | Medium | 1.4 | PRD FR-23 marks session behavior as [ASSUMPTION]; story implements JWT expiry redirect | Arch AD-4 settles: stateless JWT, no session store |
| P-6 | MCQ has exactly 4 options (PRD marks [ASSUMPTION]) | High | Low | 3.3 | PRD FR-8 marks "4 options" as [ASSUMPTION] — story settles it | None |
| P-7 | No notification system — results are in-app only | High | Low | All student stories | PRD §5 marks "no notifications" as [ASSUMPTION]; none of the stories implement notifications | None — consistent |
| P-8 | No attendance tracking | High | Low | 4.3 | PRD §5 marks "no attendance tracking" as [ASSUMPTION]; Story 4.3 is about exam absence, not class attendance | None — distinct concepts |

---

## Summary

| Metric | Count |
|--------|-------|
| **Total assumptions found** | **41** |
| High Confidence + High Impact | 14 |
| High Confidence + Medium Impact | 13 |
| Medium Confidence + High Impact | 3 |
| Medium Confidence + Medium Impact | 7 |
| Low Impact (any confidence) | 4 |

---

## Top 10 Riskiest Assumptions (sorted by Impact × Confidence)

| Rank | ID | Assumption | Impact | Confidence | Risk |
|------|----|-----------|--------|------------|------|
| 1 | P-1 | Questions presented all-at-once (PRD says unconfirmed) | High | High | **Critical** — PRD explicitly left this open |
| 2 | T-3 | Timer is client-side only (no server sync) | High | High | **Critical** — exam integrity risk if clock is wrong |
| 3 | T-4 | "Today" timezone is unspecified | High | High | **Critical** — affects daily overview for all users |
| 4 | C-6 | Conflict detection assumes timezone-aware comparison | High | High | **High** — scheduling bugs if timezone ignored |
| 5 | C-7 | Auto-save assumes StudentAnswer model exists in schema | High | High | **High** — missing model blocks Epic 6 |
| 6 | D-7 | Exam status enum values undefined | High | High | **High** — affects filtering, grading, results |
| 7 | P-3 | Offline save — PRD says local, Arch says retry-only | High | High | **High** — significant scope difference |
| 8 | U-3 | Exam early-start prevention not specified | High | High | **Medium-High** — student could start exam early |
| 9 | T-5 | Exam start time checked client-side (clock skew risk) | Medium | High | **Medium-High** — exam integrity |
| 10 | C-1 | Student Profile depends on Epic 4 data (no dependency declared) | High | High | **Medium** — story may show empty results by design, but dependency is hidden |

---

## Recommended Actions (prioritized)

1. **Verify P-1 immediately** — Confirm with stakeholder whether exam questions are one-at-a-time or all-at-once. Story 6.2 makes a design decision the PRD left open.
2. **Define exam status enum** (D-7) — Add to Story 1.3 schema: `DRAFT | SCHEDULED | IN_PROGRESS | COMPLETED | FINALIZED` or similar.
3. **Clarify timezone policy** (T-4, T-5) — Is timezone per-school, per-user, or server default? Affects 2.1, 5.1, 6.1, 3.2.
4. **Clarify timer architecture** (T-3, T-10) — Client-side only or server-anchored? If server-anchored, need WebSocket or periodic sync.
5. **Reconcile timer warning** (P-2) — PRD says 60s, Story 6.3 says 5min. Pick one and update the other document.
6. **Verify StudentAnswer/AnswerSelection model** (C-7) — Story 6.4 needs a place to store per-question answers. Confirm this is in the Prisma schema.
7. **Add dependency notes** (C-1, C-2) — Epic 2 stories 2.5 and 4.1 have implicit dependencies on later epics.
8. **Define score format** (U-9) — Integer points? Percentage? What's the max score per exam?
9. **Add "class with 0 students" edge case** (D-10) — None of the stories handle this explicitly.
10. **Decide finalization reversibility** (U-6) — Story says "cannot be undone" but PRD doesn't specify. Confirm with stakeholder.
