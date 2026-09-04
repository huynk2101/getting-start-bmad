# Second-Order Story Cascade Analysis — SchoolDesk

## Methodology

This analysis traces cascading effects across 22 stories in 7 epics. For each upstream story that establishes a data shape, behavior, state, or API contract, we identify every downstream story that depends on it and the consequences if the upstream changes.

---

## 1. Data Shape Cascades

### Cascade 1.1 — Database Schema (Story 1.3) → ALL Feature Stories

**Trigger:** Story 1.3 defines the Prisma schema for User, Class, Schedule, Exam, Question, Submission, Score.

**Affected stories:**
- Epic 2: 2.1, 2.2, 2.3, 2.4, 2.5 (all depend on Class, Schedule, Student shapes)
- Epic 3: 3.1, 3.2, 3.3, 3.4 (all depend on Exam, Question shapes)
- Epic 4: 4.1, 4.2, 4.3, 4.4 (all depend on Submission, Score, Exam shapes)
- Epic 5: 5.1, 5.2, 5.3 (depend on Class, Schedule, Exam, Teacher shapes)
- Epic 6: 6.1, 6.2, 6.3, 6.4 (depend on Exam, Question, Submission shapes)
- Epic 7: 7.1, 7.2 (depend on Score, Exam, Question shapes)

**Cascade mechanism:** Any column rename, type change, or foreign key restructuring in 1.3 propagates to every API endpoint and frontend component that touches that entity. A field rename (e.g., `studentId` → `userId`) breaks Prisma queries, API responses, and frontend type imports simultaneously.

**Severity:** CRITICAL — Would block all development. A schema change after stories 2-7 are implemented requires coordinated migration across backend queries, API contracts, shared types, and frontend components.

**Mitigation:** Story 1.3 should specify: (a) final entity field names and types as a contract, (b) a "schema change protocol" requiring versioned migration + shared type update + downstream story review, (c) explicit list of which fields each downstream story reads/writes.

---

### Cascade 1.2 — Question Model (Story 3.3) → Epic 6 + Epic 7

**Trigger:** Story 3.3 defines the Question data shape: question text, question type (MC/TF), 4 options for MC, 2 for TF, correct answer selector.

**Affected stories:**
- Story 6.2 (Answer Questions) — renders questions as radio options based on question type
- Story 6.3 (Submit Exam) — counts answered questions against total question count
- Story 6.4 (Auto-Save) — saves per-question answer selections
- Story 7.2 (Result Detail) — renders per-question breakdown with correct/incorrect indicators

**Cascade mechanism:** If 3.3 adds a third question type (e.g., "short answer"), then:
- 6.2 needs a new input component (not radio)
- 6.3 needs to handle partial completion differently
- 6.4 needs to save free-text instead of option selection
- 7.2 needs to render text answers instead of option comparisons

**Severity:** HIGH — Would break exam-taking and results display. Question type expansion is a likely future requirement.

**Mitigation:** Story 3.3 should define a QuestionType enum with explicit contract for how each type renders. Stories 6.2 and 7.2 should reference this enum and specify behavior per type.

---

### Cascade 1.3 — Score Model (Story 4.2) → Story 7.1 + 7.2

**Trigger:** Story 4.2 establishes score entry: numeric score per student per exam, saved inline.

**Affected stories:**
- Story 7.1 (Results List) — displays score as a number
- Story 7.2 (Result Detail) — displays total score as "large number + percentage"

**Cascade mechanism:** If 4.2 changes score to a letter grade (A/B/C) or adds partial credit per question, then:
- 7.1 must display letter grades instead of numbers
- 7.2 must recalculate percentage from letter grade or display per-question scores

**Severity:** MEDIUM — Would break results display but not block development. Score format is a UI contract.

**Mitigation:** Story 4.2 should specify: score is a numeric value (0-100 or 0-maxPoints), stored as integer or float. Story 7.2 should reference this exact format for display calculations.

---

### Cascade 1.4 — Exam Status Enum (Story 3.1 + 4.4) → Stories 3.4, 4.1, 6.1, 7.1, 7.2

**Trigger:** Story 3.1 creates exams with "upcoming" status. Story 4.4 transitions to "finalized".

**Affected stories:**
- Story 3.4 (Exam List) — displays status badge (upcoming/completed)
- Story 4.1 (View Submissions) — needs to know if exam is completable
- Story 6.1 (Start Exam) — checks if exam time has arrived
- Story 7.1 (Results List) — displays status badge (Graded/Pending)
- Story 7.2 (Result Detail) — checks finalized status to show/hide correct answers

**Cascade mechanism:** If a third status is added (e.g., "in-progress" for students currently taking the exam), then:
- 3.4 needs a new badge variant
- 6.1 needs to handle "in-progress" state (resume vs. start)
- 7.1 needs a new status badge
- 7.2 needs to check "in-progress" in addition to "finalized"

**Severity:** HIGH — Would break exam lifecycle display across teacher and student views.

**Mitigation:** Story 3.1 should define the complete ExamStatus enum upfront: UPCOMING, IN_PROGRESS, COMPLETED, FINALIZED. Each downstream story should reference specific enum values.

---

## 2. Behavior Cascades

### Cascade 2.1 — Design System (Story 1.2) → ALL UI Stories

**Trigger:** Story 1.2 establishes color tokens, typography, radius system, skeleton loading, toast notifications, empty states.

**Affected stories:** All 22 stories with UI components (every story except 1.3, 1.5).

**Cascade mechanism:** If the design system changes (e.g., new color palette, different radius values, spinner instead of skeleton):
- Every component must be updated
- UX-DR1 through UX-DR20 would be violated
- Inconsistent visual experience across teacher and student worlds

**Severity:** HIGH — Would cause visual inconsistency across the entire application. Design system changes after implementation require global UI audit.

**Mitigation:** Story 1.2 should specify: (a) tokens are immutable once established, (b) any token change requires a "design system migration" story, (c) components must only use tokens, never hardcoded values.

---

### Cascade 2.2 — Class Card Pattern (Story 2.1) → Story 2.2 + Story 5.1

**Trigger:** Story 2.1 establishes the class card: name, time, student count, hover tint, click navigation.

**Affected stories:**
- Story 2.2 (Navigate to Class Detail) — clicks the card to navigate
- Story 5.1 (Student Dashboard) — may reuse similar card pattern for today's classes

**Cascade mechanism:** If 2.1 changes the card to a list row instead of a card:
- 2.2's click target changes (card → row)
- 5.1 may need to use a different component for student dashboard

**Severity:** LOW — Would affect navigation UX but not block functionality. Card pattern is internal to teacher dashboard.

**Mitigation:** Story 2.2 should reference the exact component from 2.1. Story 5.1 should specify whether it reuses the same component or creates a student-specific variant.

---

### Cascade 2.3 — Inline Save Pattern (Story 4.2) → Story 4.3 + Story 4.4

**Trigger:** Story 4.2 establishes inline score entry with auto-save, toast feedback, focus management, and error handling.

**Affected stories:**
- Story 4.3 (Mark Absent) — toggles absent state within the same grading table
- Story 4.4 (Finalize Grades) — depends on all scores being saved before finalization

**Cascade mechanism:** If 4.2 changes the save mechanism (e.g., batch save instead of per-row):
- 4.3 must coordinate with batch save for absent toggle
- 4.4 must wait for batch save to complete before finalizing

**Severity:** MEDIUM — Would affect grading workflow efficiency. Save mechanism is a UX contract.

**Mitigation:** Story 4.2 should specify: save is per-row on Enter key, not batch. Stories 4.3 and 4.4 should reference this save behavior.

---

### Cascade 2.4 — Auth Flow (Story 1.4) → ALL Protected Stories

**Trigger:** Story 1.4 establishes JWT in HTTP-only cookie, redirect to role-appropriate dashboard.

**Affected stories:** Every story that requires authentication (all except 1.1, 1.2, 1.3).

**Cascade mechanism:** If 1.4 changes auth to Authorization header instead of cookie:
- All API calls must include header
- All protected routes must check header instead of cookie
- CORS configuration must change

**Severity:** CRITICAL — Would break all authenticated functionality.

**Mitigation:** Story 1.4 should specify: JWT is in HTTP-only cookie named "token", sent automatically. This is an immutable contract.

---

## 3. State Cascades

### Cascade 3.1 — Exam Lifecycle States (Stories 3.1, 4.4, 6.1) → Stories 3.4, 4.1, 6.3, 7.1, 7.2

**Trigger:** Story 3.1 creates exam (UPCOMING), Story 6.1 starts exam (IN_PROGRESS), Story 4.4 finalizes grades (FINALIZED).

**Affected stories:**
- Story 3.4 (Exam List) — displays status badges
- Story 4.1 (View Submissions) — needs exam to be completable
- Story 6.3 (Submit Exam) — transitions from IN_PROGRESS to COMPLETED
- Story 7.1 (Results List) — displays status badges
- Story 7.2 (Result Detail) — checks FINALIZED for correct answer disclosure

**Cascade mechanism:** If the state machine is incomplete (e.g., no transition from COMPLETED to FINALIZED), then:
- 4.4 cannot finalize grades
- 7.2 cannot show correct answers
- 7.1 shows stale status

**Severity:** HIGH — Would break the entire exam-to-results pipeline.

**Mitigation:** Story 3.1 should define the complete state machine: UPCOMING → IN_PROGRESS → COMPLETED → FINALIZED. Each transition should be documented with the story that triggers it.

---

### Cascade 3.2 — Submission State (Story 6.4) → Story 6.3 + Story 4.1

**Trigger:** Story 6.4 creates submissions via auto-save, storing per-question answers.

**Affected stories:**
- Story 6.3 (Submit Exam) — reads saved answers to count completion
- Story 4.1 (View Submissions) — reads submission data for grading view

**Cascade mechanism:** If 6.4 changes submission format (e.g., stores answers as array instead of object):
- 6.3 must parse new format to count answers
- 4.1 must display answers in new format

**Severity:** MEDIUM — Would break exam submission and grading display.

**Mitigation:** Story 6.4 should specify: submission stores answers as `{ questionId: selectedOptionId }` object. Both 6.3 and 4.1 should reference this exact shape.

---

## 4. API Contract Cascades

### Cascade 4.1 — Error Envelope (Story 1.3) → ALL API-Consuming Stories

**Trigger:** Story 1.3 defines error envelope: `{ "error": { "code": "STRING", "message": "STRING" } }`.

**Affected stories:** Every story that makes API calls (all except 1.1, 1.2).

**Cascade mechanism:** If the error envelope changes (e.g., adds `details` field, changes structure):
- All frontend error handling must be updated
- All toast/error display components must parse new structure

**Severity:** HIGH — Would cause inconsistent error display across the application.

**Mitigation:** Story 1.3 should specify: error envelope is immutable. Any change requires a "API contract migration" story.

---

### Cascade 4.2 — Pagination Contract (Story 1.3) → Stories 2.3, 3.4, 7.1

**Trigger:** Story 1.3 defines paginated list endpoints with default page size 20.

**Affected stories:**
- Story 2.3 (Class List) — displays paginated classes
- Story 3.4 (Exam List) — displays paginated exams
- Story 7.1 (Results List) — displays paginated results

**Cascade mechanism:** If pagination changes (e.g., cursor-based instead of offset-based):
- All list components must update pagination logic
- Skeleton loading states may need adjustment

**Severity:** MEDIUM — Would break list navigation but not block core functionality.

**Mitigation:** Story 1.3 should specify: pagination uses offset-based with `page` and `limit` query params, returns `{ data: [], total: number, page: number, limit: number }`.

---

### Cascade 4.3 — Conflict Error Response (Story 3.2) → Story 3.1

**Trigger:** Story 3.2 returns 409 conflict with conflicting exam details.

**Affected stories:**
- Story 3.1 (Create Exam) — must handle 409 and display conflict message

**Cascade mechanism:** If 3.2 changes the conflict response shape (e.g., different error code or structure):
- 3.1's error handling breaks

**Severity:** LOW — Isolated to exam creation flow.

**Mitigation:** Story 3.2 should specify: conflict returns 409 with error code `EXAM_CONFLICT` and message containing conflicting exam details.

---

## 5. Cross-Epic Cascades

### Cascade 5.1 — Epic 3 (Exams) → Epic 4 (Grading)

**Trigger:** Epic 3 defines Exam and Question models.

**Affected:** Epic 4 stories 4.1-4.4 depend on Exam structure for grading view.

**Cascade mechanism:** If Epic 3 adds exam-level metadata (e.g., total points, passing score):
- 4.1 must display new fields in grading table
- 4.2 must validate scores against new constraints
- 4.4 must check new finalization rules

**Severity:** HIGH — Would break grading workflow.

**Mitigation:** Epic 3 should define the complete Exam model upfront. Epic 4 should reference specific Exam fields it uses.

---

### Cascade 5.2 — Epic 3 (Exams) → Epic 6 (Exam Taking)

**Trigger:** Epic 3 defines Question model and Exam scheduling.

**Affected:** Epic 6 stories 6.1-6.4 depend on Question structure and Exam timing.

**Cascade mechanism:** If Epic 3 changes question ordering (e.g., randomized instead of sequential):
- 6.2 must handle random order
- 6.3 must count questions correctly
- 6.4 must save answers with correct question references

**Severity:** HIGH — Would break exam-taking experience.

**Mitigation:** Epic 3 should specify: questions are ordered by `order` field. Epic 6 should reference this ordering contract.

---

### Cascade 5.3 — Epic 4 (Grading) → Epic 7 (Results)

**Trigger:** Epic 4 defines Score model and finalization state.

**Affected:** Epic 7 stories 7.1-7.2 depend on Score data and finalization status.

**Cascade mechanism:** If Epic 4 adds per-question scores (not just total):
- 7.1 must display per-question scores in results list
- 7.2 must render per-question breakdown differently

**Severity:** MEDIUM — Would break results display.

**Mitigation:** Epic 4 should specify: scores are stored as total per exam, not per question. Epic 7 should reference this score granularity.

---

### Cascade 5.4 — Epic 3 (Exams) → Epic 7 (Results)

**Trigger:** Epic 3 defines Question model with correct answers.

**Affected:** Epic 7 story 7.2 depends on Question model for per-question breakdown.

**Cascade mechanism:** If Epic 3 changes correct answer storage (e.g., stores correct option text instead of option ID):
- 7.2 must parse correct answer differently
- 7.2's correct/incorrect comparison logic breaks

**Severity:** HIGH — Would break results detail display.

**Mitigation:** Epic 3 should specify: correct answer stored as `correctOptionId` (foreign key to Option). Epic 7 should reference this exact field.

---

### Cascade 5.5 — Epic 5 (Student Dashboard) → Epic 6 (Exam Taking)

**Trigger:** Story 5.1 shows upcoming exams on student dashboard.

**Affected:** Story 6.1 starts exam from dashboard or upcoming exams list.

**Cascade mechanism:** If 5.1 changes how upcoming exams are displayed (e.g., different card layout):
- 6.1's "Start" button placement changes
- Navigation flow from dashboard to exam changes

**Severity:** LOW — Would affect UX flow but not block functionality.

**Mitigation:** Story 6.1 should reference the exact exam card component from 5.1.

---

## 6. Circular Dependency Analysis

### Story-Level Circular Dependencies

**None identified.** The dependency graph is acyclic:
- Epic 1 → Epic 2, 3, 5 (foundation)
- Epic 2 → (no cross-epic dependencies)
- Epic 3 → Epic 4, 6, 7 (exam model)
- Epic 4 → Epic 7 (grading model)
- Epic 5 → Epic 6 (dashboard → exam taking)
- Epic 6 → (no dependencies to later epics)
- Epic 7 → (no dependencies to later epics)

### Intra-Epic Circular Dependencies

**None identified.** Within each epic, stories follow a linear dependency chain:
- Epic 1: 1.1 → 1.2 → 1.3 → 1.4 → 1.5
- Epic 2: 2.1 → 2.2 → 2.4 → 2.5; 2.3 is independent
- Epic 3: 3.1 → 3.2, 3.3, 3.4
- Epic 4: 4.1 → 4.2 → 4.3 → 4.4
- Epic 5: 5.1, 5.2, 5.3 are independent
- Epic 6: 6.1 → 6.2 → 6.3, 6.4; 6.5 depends on all
- Epic 7: 7.1, 7.2 are independent

---

## Summary

### Verdict

**The SchoolDesk story breakdown is well-structured with no circular dependencies.** However, there are significant cascading risks concentrated in three areas: (1) the database schema in Story 1.3 is the single highest-risk story, (2) the Question model in Story 3.3 has the widest cross-epic blast radius, and (3) the exam status state machine spans three epics with implicit transitions.

### Cascade Count by Severity

| Severity | Count |
|----------|-------|
| CRITICAL | 2 |
| HIGH | 7 |
| MEDIUM | 5 |
| LOW | 3 |
| **Total** | **17** |

### Top 3 Cascading Risks

1. **Database Schema (Story 1.3)** — CRITICAL. Affects all 19 downstream stories. Any column change requires coordinated migration across backend, shared types, and frontend. Mitigation: Lock schema as immutable contract before feature development begins.

2. **Question Model (Story 3.3)** — HIGH. Affects Epic 6 (exam-taking) and Epic 7 (results) across 6 stories. Question type expansion would break radio-based UI in 6.2 and comparison logic in 7.2. Mitigation: Define QuestionType enum with explicit per-type rendering contract.

3. **Exam Status State Machine (Stories 3.1, 4.4, 6.1)** — HIGH. Implicit state transitions span 3 epics and affect 5 downstream stories. Missing or inconsistent transitions break the exam-to-results pipeline. Mitigation: Document complete state machine (UPCOMING → IN_PROGRESS → COMPLETED → FINALIZED) with transition triggers in Story 3.1.

---

*Analysis performed: 2026-09-03*
*Stories analyzed: 22 across 7 epics*
*Cascades identified: 17*
