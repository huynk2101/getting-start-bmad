---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - planning_artifacts/prds/prd-getting-start-bmad-2026-09-03/prd.md
  - planning_artifacts/architecture/architecture-getting-start-bmad-2026-09-03/ARCHITECTURE-SPINE.md
  - planning_artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/DESIGN.md
  - planning_artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/EXPERIENCE.md
---

# SchoolDesk - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for SchoolDesk, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Teacher can see all classes scheduled for today with class name, time, and student count
FR-2: Teacher can tap a class card to navigate to the class detail page
FR-3: Teacher can see a list of all their classes
FR-4: Teacher can view a specific class's details: name, schedule, and student list
FR-5: Teacher can tap a student in the class list to view their profile
FR-6: Teacher can create an exam or test by providing a title, selecting a class, setting date, time, and duration
FR-7: System prevents creating an exam/test at a time that overlaps with an existing exam/test for the same class
FR-8: Teacher can add questions to an exam/test using multiple-choice or true/false types
FR-9: Teacher can see a list of all exams/tests they have created, filterable by class and status
FR-10: Teacher can view a list of all enrolled students for a specific exam/test, with input fields for scores
FR-11: Teacher can enter scores for each student and save them
FR-12: Teacher can mark a student as absent for an exam/test
FR-13: Teacher can finalize grades for an exam/test, which unlocks the per-question correct-answer disclosure
FR-14: Student can see a dashboard with today's classes, upcoming exams/tests, and class/teacher info
FR-15: Student can view their full class schedule
FR-16: Student can view details of a specific class
FR-17: Student can start an exam/test from their dashboard or upcoming exams list
FR-18: Student can answer questions (select an option for each question)
FR-19: Student can submit the exam when all questions are answered or when the exam's duration expires
FR-20: System auto-saves student answers during the exam
FR-21: Student can see a list of all graded exams/tests with their scores
FR-22: Student can tap a result to see detailed information: total score and per-question breakdown
FR-23: Users can log in with username and password
FR-24: System enforces role-based access: teachers access teacher features, students access student features

### NonFunctional Requirements

NFR-1: Exam submission latency — final submit must complete within 3 seconds
NFR-2: WCAG 2.2 AA contrast across entire surface
NFR-3: Full keyboard support for exam-taking
NFR-4: Desktop-first responsive design (lg/md/sm breakpoints)
NFR-5: Auto-save on each answer selection with retry on reconnect
NFR-6: Stateless JWT authentication via HTTP-only cookies

### Additional Requirements (from Architecture)

AR-1: Two separate repositories: sms-frontend and sms-backend, shared types via sms-shared package
AR-2: PostgreSQL database with Prisma ORM, schema as source of truth
AR-3: Docker-compose for local development environment
AR-4: Consistent API error envelope: { "error": { "code": "STRING", "message": "STRING" } }
AR-5: Paginated list endpoints (default page size 20)
AR-6: UTC timestamps stored in database, timezone-aware at API layer
AR-7: Seeded initial teacher account (seed script/env config)
AR-8: Express backend with TypeScript, React frontend with Vite

### UX Design Requirements

UX-DR1: Book Binder visual direction — warm paper (#FAF8F5), muted indigo (#6A6E9E), leather brown (#9B7E5A), Georgia serif headings
UX-DR2: Two-typeface system — Georgia serif for display/headings only, system sans-serif for body
UX-DR3: Three-tier radius system — 4px inputs, 8px cards/buttons, 9999px badges
UX-DR4: Component library — button-primary, card, badge (3 variants), skeleton, toast, inline-banner, empty-state, exam-question-card, progress-bar, timer
UX-DR5: Skeleton shimmer loading states on all surfaces (no spinners)
UX-DR6: Toast notifications (auto-dismiss 3s) for success feedback
UX-DR7: Inline error banners (not modals) with retry actions
UX-DR8: Empty states with warm, direct copy ("No classes scheduled today — enjoy the break.")
UX-DR9: Teacher world and student world completely separate navigation (no role-switcher)
UX-DR10: Exam-taking as a separate focused full-screen mode with fade transition
UX-DR11: Timer with color transitions (green → amber at 5min → red at 1min)
UX-DR12: Auto-save checkmark indicators per answered question during exam
UX-DR13: Progress milestones microcopy ("Halfway there!", "Just 5 more!")
UX-DR14: Grading table with inline score inputs, tab/enter to next student
UX-DR15: Absent toggle switch (not checkbox) that disables score input
UX-DR16: Finalize grades with confirmation dialog
UX-DR17: Visible focus ring on all interactive elements
UX-DR18: Semantic HTML for tables, forms, tabs with ARIA attributes
UX-DR19: prefers-reduced-motion respected — all transitions disabled
UX-DR20: Tab order matches visual reading order on every surface

## FR Coverage Map

| FR | Epic | Story |
|---|---|---|
| FR-1 | Epic 2 | 2.1 |
| FR-2 | Epic 2 | 2.2 |
| FR-3 | Epic 2 | 2.3 |
| FR-4 | Epic 2 | 2.2 |
| FR-5 | Epic 2 | 2.4 |
| FR-6 | Epic 3 | 3.1 |
| FR-7 | Epic 3 | 3.2 |
| FR-8 | Epic 3 | 3.3 |
| FR-9 | Epic 3 | 3.4 |
| FR-10 | Epic 4 | 4.1 |
| FR-11 | Epic 4 | 4.2 |
| FR-12 | Epic 4 | 4.3 |
| FR-13 | Epic 4 | 4.4 |
| FR-14 | Epic 5 | 5.1 |
| FR-15 | Epic 5 | 5.2 |
| FR-16 | Epic 5 | 5.3 |
| FR-17 | Epic 6 | 6.1 |
| FR-18 | Epic 6 | 6.2 |
| FR-19 | Epic 6 | 6.3 |
| FR-20 | Epic 6 | 6.4 |
| FR-21 | Epic 7 | 7.1 |
| FR-22 | Epic 7 | 7.2 |
| FR-23 | Epic 1 | 1.5 |
| FR-24 | Epic 1 | 1.6 |

## Epic List

1. Epic 1: Foundation & Authentication (6 stories) — Project scaffolding, design tokens, base components, database schema, Docker environment, JWT auth with role-based access
2. Epic 2: Teacher Dashboard & Class Management (4 stories) — Daily class overview, class detail view with dashboard navigation, class list, student profile
3. Epic 3: Exam & Test Management (4 stories) — Create exams, add questions, conflict detection, exam list with filters
4. Epic 4: Grading (5 stories) — Grading view with inline score entry, absent marking, finalize grades with confirmation, exam results report
5. Epic 5: Student Portal — Dashboard & Schedule (4 stories) — Student dashboard with today's classes, schedule view, class/teacher detail, change password
6. Epic 6: Student Portal — Exam Taking (5 stories) — Full-screen exam mode, question answering, auto-save, timer, submit
7. Epic 7: Student Portal — Results (2 stories) — Results list, detailed breakdown per question, finalize disclosure

---

## Epic 1: Foundation & Authentication

**Goal:** Establish the full development foundation — monorepo scaffolding, design system tokens, base components, database schema, Docker environment, and JWT-based authentication with role-based access control. All subsequent epics build on this base.

### Story 1.1 — Project Scaffolding & Docker Environment

As a developer,
I want the monorepo scaffolded with sms-frontend, sms-backend, and sms-shared packages running in Docker,
So that the team has a working local development environment from day one.

**Acceptance Criteria:**

Given the developer clones the repository,
When they run `docker-compose up`,
Then PostgreSQL, the Express backend, and the Vite dev server all start without errors and are accessible on their designated ports.

Given the sms-shared package is installed in both frontend and backend,
When a type is exported from sms-shared,
Then both repos can import and compile against it without errors.

Given the backend starts,
When Prisma migrate runs inside the Docker container,
Then the database schema is applied and the server is ready to accept requests.

### Story 1.2 — Design Tokens (UX-DR1, UX-DR2, UX-DR3)

As a developer,
I want the design tokens implemented as CSS custom properties per the Book Binder visual direction,
So that all subsequent UI work uses a consistent, on-brand token system.

**Acceptance Criteria:**

Given the DESIGN.md tokens,
When the design system is imported in the frontend,
Then all color tokens (background, surface, primary, accent, success, warning, danger, text, text-muted, border) are available as CSS custom properties or Tailwind config (UX-DR1).

Given the design tokens are defined,
When typography tokens are consumed,
Then display, display-sm, body, and label tokens map correctly — Georgia serif for display/headings only, system sans-serif for body (UX-DR2).

Given the design tokens are defined,
When spacing tokens are consumed,
Then gutter, section, page, and card-padding tokens are available as CSS custom properties.

Given a developer renders any component,
When the component uses the three-tier radius system,
Then inputs use 4px, cards/buttons use 8px, and badges use 9999px radii respectively (UX-DR3).

### Story 1.3 — Base Components (UX-DR4, UX-DR5, UX-DR6, UX-DR8)

As a developer,
I want the base UI components (button, card, badge, skeleton, toast, empty-state) implemented,
So that feature stories can compose consistent UI from a shared component library.

**Acceptance Criteria:**

Given the skeleton component is rendered,
When data is loading on any surface,
Then skeleton shimmer placeholders appear instead of spinners, matching the expected layout shape (UX-DR5).

Given the skeleton component is rendered,
When `prefers-reduced-motion` is enabled in the OS,
Then the shimmer animation is disabled and static placeholders appear (UX-DR19).

Given the toast component is triggered,
When a success action completes,
Then a toast appears at bottom-center, auto-dismisses after 3 seconds, and uses the surface background with card shadow (UX-DR6).

Given the empty-state component is rendered,
When no data is available,
Then a centered Georgia serif heading, muted body text, and a single primary action button are displayed with warm, direct copy (UX-DR8).

Given a developer renders any component,
When badge variants are used,
Then the component supports the three badge variants defined in DESIGN.md (UX-DR4).

### Story 1.4 — Database Schema & Seed Data

As a developer,
I want the complete Prisma schema for all entities (User, Class, Schedule, Student, Teacher, Exam, Question, Submission, Score) with a seeded teacher account,
So that the data model is ready for all feature epics.

**Acceptance Criteria:**

Given the Prisma schema is defined,
When `prisma migrate` runs,
Then all tables are created: User (with role enum: TEACHER, STUDENT), Class, Schedule, Exam, Question, Submission, Score — with correct foreign keys and indexes.

Given the seed script runs,
When it completes,
Then a default teacher account exists with known credentials and at least one class with a schedule and two enrolled students.

Given timestamps are stored in the database,
When any record is created or queried,
Then all timestamps are UTC (AR-6) and the API layer handles timezone conversion for display.

Given the error envelope is defined (AR-4),
When any API endpoint returns an error,
Then the response body is `{ "error": { "code": "STRING", "message": "STRING" } }` with the correct HTTP status code.

### Story 1.5 — User Login (FR-23, NFR-6)

As a user (teacher or student),
I want to log in with my username and password,
So that I can securely access the system.

**Acceptance Criteria:**

Given a user is on the login page,
When they enter valid credentials and submit,
Then an HTTP-only cookie containing a JWT is set, and they are redirected to the appropriate dashboard (teacher → teacher dashboard, student → student dashboard).

Given a user enters invalid credentials,
When they submit the login form,
Then an inline error banner appears (UX-DR7) with the message "Invalid username or password" and no JWT is issued.

Given a user is authenticated,
When the JWT expires,
Then the user is redirected to the login page and the expired cookie is cleared.

### Story 1.6 — Role-Based Access Control (FR-24)

As a developer,
I want the backend to enforce role-based access on every protected route,
So that teachers cannot access student features and vice versa.

**Acceptance Criteria:**

Given a student JWT,
When the student hits a teacher-only endpoint (e.g., create exam, grade),
Then the backend returns a 403 Forbidden with the error envelope.

Given a teacher JWT,
When the teacher hits a student-only endpoint (e.g., submit exam, view personal results),
Then the backend returns a 403 Forbidden with the error envelope.

Given no JWT cookie,
When any protected endpoint is hit,
Then the backend returns a 401 Unauthorized with the error envelope.

---

## Epic 2: Teacher Dashboard & Class Management

**Goal:** Deliver the teacher's daily class overview, class detail view with dashboard navigation and student roster, full class list, and individual student profile — the core class-management surface.

### Story 2.1 — Teacher Daily Class Overview (FR-1, UX-DR1, UX-DR5, UX-DR8)

As a teacher,
I want to see all my classes scheduled for today with class name, time, and student count,
So that I know my day at a glance.

**Acceptance Criteria:**

Given the teacher is authenticated and on the dashboard,
When the page loads,
Then a greeting ("Welcome back, [First Name]") is displayed in Georgia serif (UX-DR1), followed by all classes scheduled for today (matching the day-of-week in the class's Schedule) as cards, each showing class name, time, and student count.

Given the user's browser timezone,
When the dashboard loads,
Then 'today' is determined by the user's local timezone, not the server timezone.

Given the dashboard is loading,
When data is being fetched,
Then skeleton shimmer placeholders appear matching the class card layout (UX-DR5).

Given no classes are scheduled for today,
When the dashboard loads,
Then an empty state is shown: "No classes scheduled today — enjoy the break." (UX-DR8).

Given classes exist for today,
When the teacher hovers over a class card on lg/md breakpoints,
Then a subtle background tint appears on the card (UX-DR1).

### Story 2.2 — Class Detail View (FR-2, FR-4, UX-DR5, UX-DR18, UX-DR20)

As a teacher,
I want to navigate to a specific class's detail page from my dashboard or class list, and view its name, schedule, and student roster,
So that I can see everything about a class in one place.

**Acceptance Criteria:**

Given the teacher is on the dashboard with today's classes,
When they click a class card,
Then they are navigated to the class detail page for that class (UX-DR20).

Given the teacher uses keyboard navigation,
When they Tab to a class card and press Enter,
Then they are navigated to the class detail page (UX-DR20).

Given the teacher navigates to a class detail page,
When the page loads,
Then it shows the class name, schedule (day/time slots), and a searchable list of enrolled students.

Given the student list is long,
When the teacher types in the search input,
Then the list filters in real-time by student name.

Given the class detail is loading,
When data is being fetched,
Then skeleton shimmer rows appear for the schedule and student list (UX-DR5).

Given the class detail page renders the student roster,
When the table is displayed,
Then it uses semantic HTML `<table>`, `<thead>`, `<tbody>`, and `<th scope>` attributes (UX-DR18).

### Story 2.3 — Class List (FR-3, UX-DR5, UX-DR8, UX-DR9)

As a teacher,
I want to see a list of all my classes (not just today's),
So that I can manage classes beyond today's schedule.

**Acceptance Criteria:**

Given the teacher is authenticated and navigates to Classes,
When the page loads,
Then a paginated list of all classes for the authenticated teacher is displayed, each showing class name and student count, and the top nav highlights "Classes" as the active item (UX-DR9).

Given the class list is loading,
When data is being fetched,
Then skeleton shimmer placeholders matching the card layout are displayed (no spinners) (UX-DR5).

Given the class list is empty (teacher has no classes assigned),
When the page loads,
Then an empty state is shown with a direct message (UX-DR8).

### Story 2.4 — Student Profile View (FR-5, UX-DR4, UX-DR5)

As a teacher,
I want to tap a student in the class list to view their profile (name, ID, contact info, enrolled classes, exam/test results),
So that I can review a student's full academic record.

**Acceptance Criteria:**

Given the teacher is on the class detail page,
When they click a student row,
Then the student profile page loads showing name, student ID, contact info, list of enrolled classes, and list of exam/test results.

Given the student profile is loading,
When data is being fetched,
Then skeleton shimmer placeholders appear (UX-DR5).

Given the student has no exam results yet,
When the profile loads,
Then the results section shows an empty state: "No results yet." (UX-DR8).

Given the student has exam results with mixed statuses,
When the results list loads,
Then graded results show a green "Graded" badge with score, pending results show an amber "Pending" badge with "— / [total]", and finalized results show a green badge (UX-DR4).

---

## Epic 3: Exam & Test Management

**Goal:** Enable teachers to create exams/tests, add questions, detect scheduling conflicts, and browse their exam catalog with filters.

### Story 3.1 — Create Exam/Test (FR-6, UX-DR5, UX-DR7)

As a teacher,
I want to create an exam or test by providing a title, selecting a class, and setting date, time, and duration,
So that students in that class can take it.

**Acceptance Criteria:**

Given the teacher navigates to Exams and clicks "Create Exam",
When the form is displayed,
Then it contains fields for title (text), class (dropdown of teacher's classes), date, time, and duration (minutes), with all fields required.

Given the teacher fills in all required fields and submits,
When the form is valid,
Then the exam is saved, appears in the teacher's exam list, and is visible in the student portal for enrolled students.

Given the teacher leaves any required field blank,
When they submit the form,
Then inline validation errors appear next to each invalid field (not a modal) (UX-DR7).

Given the teacher opens the create exam form,
When the class dropdown loads,
Then it shows skeleton shimmer while fetching the teacher's class list (UX-DR5).

### Story 3.2 — Exam Scheduling Conflict Detection (FR-7, UX-DR7)

As a teacher,
I want the system to prevent me from creating an exam that overlaps with an existing exam for the same class,
So that students are never double-booked for the same class.

**Acceptance Criteria:**

Given the teacher creates an exam with a time window that overlaps an existing exam for the same class,
When they submit the form,
Then the system returns a 409 conflict with the conflicting exam's details, and the exam is not saved. An inline banner displays the conflict message (UX-DR7).

Given the teacher creates an exam with no overlap for the same class,
When they submit the form,
Then the exam is saved successfully.

Given the teacher creates an exam for a different class that overlaps with an exam for another class,
When they submit the form,
Then the exam is saved successfully (conflict is per-class, not global).

### Story 3.3 — Add Questions to Exam/Test (FR-8, UX-DR7)

As a teacher,
I want to add multiple-choice or true/false questions to an exam/test,
So that students have content to answer during the exam.

**Acceptance Criteria:**

Given the teacher is on an exam's detail page after creation,
When they click "Add Question" and select "Multiple Choice",
Then a form appears for question text, four option inputs, and a correct answer selector. On save, the question is persisted and listed under the exam.

Given the teacher selects "True/False" as the question type,
When they fill in the question text and select the correct answer (True or False),
Then the question is saved with two options.

Given the teacher adds a question without filling in the required fields,
When they click save,
Then inline validation errors appear (not a modal) (UX-DR7).

### Story 3.4 — Exam List with Filters (FR-9, UX-DR5, UX-DR8)

As a teacher,
I want to see a list of all exams/tests I have created, filterable by class and status,
So that I can quickly find and manage exams.

**Acceptance Criteria:**

Given the teacher navigates to Exams,
When the page loads,
Then a paginated list of all exams is displayed showing title, class, date, and status (upcoming/completed) with badge indicators.

Given the exam list is loading,
When data is being fetched,
Then skeleton shimmer rows appear (UX-DR5).

Given the exam list,
When no exams exist,
Then an empty state is shown: "No exams on the horizon. Enjoy the quiet." (UX-DR8).

Given the teacher applies a class filter,
When the filter is set,
Then only exams for that class are shown.

Given the teacher applies a status filter,
When the filter is set to "upcoming" or "completed",
Then only exams matching that status are shown.

---

## Epic 4: Grading

**Goal:** Deliver the full grading workflow — viewing submissions, inline score entry, absent marking, grade finalization with confirmation, and aggregated exam results report.

### Story 4.1 — View Exam Submissions for Grading (FR-10, UX-DR4, UX-DR5, UX-DR14, UX-DR18)

As a teacher,
I want to view a list of all enrolled students for a specific exam/test with input fields for scores,
So that I can begin grading efficiently.

**Acceptance Criteria:**

Given the teacher opens the grading view for an exam,
When the page loads,
Then a table shows all enrolled students with columns: Name, Score (inline input or display), Status badge (Graded/Pending/Absent), and a summary bar at the bottom with grading progress and average score.

Given the grading view is loading,
When data is being fetched,
Then skeleton shimmer rows appear for the table and summary bar (UX-DR5).

Given the exam has students with mixed statuses,
When the table loads,
Then graded students show their score in green text, pending students show an empty input with amber badge, and absent students show a disabled row with red badge (UX-DR4).

Given the grading table renders,
When the table is displayed,
Then it uses semantic HTML `<table>`, `<thead>`, `<tbody>`, and `<th scope>` attributes (UX-DR18).

### Story 4.2 — Enter and Save Scores (FR-11, UX-DR6, UX-DR7, UX-DR14)

As a teacher,
I want to enter scores for each student inline and save them with a single keystroke,
So that I can grade quickly without page reloads.

**Acceptance Criteria:**

Given the teacher is in the grading table,
When they click a pending student's score input, type a score, and press Enter,
Then the score auto-saves, a toast appears ("Grade saved for [Student Name]") (UX-DR6), and focus moves to the next student's input (UX-DR14).

Given the teacher presses Tab after saving a score,
When focus moves,
Then it lands on the next student's score input (UX-DR14).

Given auto-save succeeds,
When the save completes,
Then the summary bar updates immediately with the new grading progress and average score.

Given auto-save fails (network error),
When the save attempt fails,
Then an inline banner appears below the student's row: "Couldn't save — try again." The score input retains the typed value, and clicking retry re-sends (UX-DR7).

Given the exam uses auto-scored question types (MCQ/TF),
When the teacher opens the grading view,
Then scores are computed automatically from per-question answers (per the Submission entity, Architecture AD-15), and appear pre-filled. The teacher can override any auto-scored value by typing a new value in the score input.

Given the exam requires manual grading (non-auto-scored question types),
When the teacher opens the grading view,
Then score inputs are empty and the teacher enters scores manually.

### Story 4.3 — Mark Student as Absent (FR-12, UX-DR14, UX-DR15)

As a teacher,
I want to mark a student as absent for an exam/test using a toggle switch,
So that absent students are excluded from grading.

**Acceptance Criteria:**

Given the teacher is in the grading table,
When they toggle the absent switch for a student,
Then the student's score input is disabled and cleared, the row is visually muted, and an "Absent" badge (muted red) replaces the pending badge (UX-DR15).

Given a student is marked absent,
When the teacher toggles the switch off,
Then the score input is re-enabled and the student returns to pending status.

Given the grading summary bar is visible,
When a student is marked absent,
Then the grading progress count updates to exclude the absent student.

Given all students are marked absent,
When the teacher views the grading page,
Then the "Finalize Grades" button is enabled and the summary bar shows "0 of [N] graded" with "All students marked absent."

### Story 4.4 — Finalize Grades (FR-13, UX-DR6, UX-DR16)

As a teacher,
I want to finalize grades for an exam/test with a confirmation dialog,
So that students can see the correct answer breakdown.

**Acceptance Criteria:**

Given all students are graded or marked absent,
When the teacher clicks "Finalize Grades",
Then a confirmation dialog appears: "Finalize grades for [Exam Name]? This will unlock the correct answer breakdown for all [N] students. This cannot be undone." (UX-DR16).

Given the teacher confirms finalization,
When the dialog is confirmed,
Then the exam status changes to "finalized", a toast appears ("Grades finalized") (UX-DR6), the finalize button becomes disabled, and students can now see the per-question correct answer breakdown.

Given some students are still pending (not graded or absent),
When the teacher views the grading page,
Then the "Finalize Grades" button is disabled with helper text: "All students must be graded or marked absent before finalizing."

Given a student submits an exam after the teacher begins finalizing,
When the finalize completes,
Then any late submissions received after finalize started are graded but do not affect the finalized aggregate. A note appears: "N submissions were received after finalization."

### Story 4.5 — Teacher View Exam Results Report

As a teacher,
I want to view an aggregated results report for a finalized exam,
So that I can analyze class performance, question difficulty, and score distribution.

**Acceptance Criteria:**

Given the teacher navigates to a finalized exam's results,
When the page loads,
Then a report shows: class average score, score distribution histogram, per-question pass rate, and a list of students with their individual scores.

Given the exam is not yet finalized,
When the teacher attempts to view the report,
Then the report page is disabled with a message: "Results report is available after grades are finalized."

Given the results report loads,
When data is being fetched,
Then skeleton shimmer placeholders appear matching the report layout (UX-DR5).

---

## Epic 5: Student Portal — Dashboard & Schedule

**Goal:** Deliver the student's personalized dashboard with today's classes, upcoming exams, class/teacher detail views, and password management.

### Story 5.1 — Student Dashboard (FR-14, UX-DR1, UX-DR5, UX-DR8)

As a student,
I want to see a dashboard with today's classes, upcoming exams/tests, and class/teacher info,
So that I know my schedule and what's coming.

**Acceptance Criteria:**

Given the student is authenticated and on the dashboard,
When the page loads,
Then a greeting ("Welcome back, [First Name]") is displayed in Georgia serif (UX-DR1), followed by a Today's Classes widget and an Upcoming Exams widget showing exam name, date/time, and class.

Given the user's browser timezone,
When the dashboard loads,
Then 'today' is determined by the user's local timezone, not the server timezone.

Given no classes or exams are scheduled for today,
When the dashboard loads,
Then the Today's Classes widget shows an empty state: "No classes scheduled today — enjoy the break." (UX-DR8).

Given the dashboard is loading,
When data is being fetched,
Then skeleton shimmer placeholders appear for both widgets (UX-DR5).

### Story 5.2 — Student Schedule View (FR-15, UX-DR5)

As a student,
I want to view my full class schedule (all classes with times and teacher name),
So that I can see my week at a glance.

**Acceptance Criteria:**

Given the student navigates to Schedule,
When the page loads,
Then all enrolled classes are displayed with day, time, and teacher name in a weekly or list layout.

Given the schedule is loading,
When data is being fetched,
Then skeleton shimmer rows appear (UX-DR5).

### Story 5.3 — Student Class Detail View (FR-16, UX-DR5)

As a student,
I want to view details of a specific class — class name, schedule, teacher name, and teacher contact info,
So that I know where to be and who to contact.

**Acceptance Criteria:**

Given the student navigates to a class detail page,
When the page loads,
Then it shows class name, schedule, teacher name, and teacher contact info.

Given the class detail is loading,
When data is being fetched,
Then skeleton shimmer placeholders appear (UX-DR5).

### Story 5.4 — Student Change Password

As a student,
I want to change my password from my profile or settings,
So that I can maintain the security of my account.

**Acceptance Criteria:**

Given the student navigates to account settings or profile,
When they click "Change Password",
Then a form appears with fields for current password, new password, and confirm new password.

Given the student fills in all fields correctly and submits,
When the current password is valid and the new password meets requirements,
Then a toast appears: "Password changed successfully." (UX-DR6) and the student remains logged in.

Given the student enters an incorrect current password,
When they submit the form,
Then an inline error banner appears: "Current password is incorrect." (UX-DR7).

Given the new password and confirm password do not match,
When the student submits the form,
Then an inline validation error appears: "Passwords do not match." (UX-DR7).

---

## Epic 6: Student Portal — Exam Taking

**Goal:** Deliver the full-screen exam-taking experience — starting exams, answering questions with auto-save, countdown timer, and submission.

### Story 6.1 — Start Exam (FR-17, UX-DR10)

As a student,
I want to start an exam/test from my dashboard or upcoming exams list when the exam time has arrived,
So that I can begin taking the exam.

**Acceptance Criteria:**

Given the student is on the dashboard or exams list,
When an exam's scheduled time has arrived,
Then a "Start" button is visible on the exam card.

Given the student clicks "Start",
When the exam interface loads,
Then the screen fades to a full-screen focused exam mode (separate from normal navigation) (UX-DR10) showing the first question, timer, and progress bar.

Given the exam's scheduled time has not yet arrived,
When the student views the exam card,
Then the "Start" button is disabled or hidden with a countdown ("3 days away").

### Story 6.2 — Answer Questions (FR-18, UX-DR12, UX-DR13)

As a student,
I want to answer questions by selecting an option for each one,
So that I can complete the exam.

**Acceptance Criteria:**

Given the student is in the exam-taking interface,
When a question is displayed,
Then it shows the question text, the question number (Q1, Q2, etc.), and answer options (4 radio options for multiple-choice, True/False radio for true/false).

Given the student selects an option for a question,
When the selection is made,
Then a checkmark indicator appears next to that question in the sidebar (UX-DR12), and the auto-save fires.

Given the student navigates between questions,
When they use the sidebar or arrow keys,
Then the view scrolls to the selected question and the question is highlighted.

Given the student is in the exam-taking interface,
When the progress bar advances,
Then milestone messages appear: "Halfway there!" at 50% and "Just 5 more!" when 5 questions remain (UX-DR13).

### Story 6.3 — Submit Exam with Timer and Auto-Submit (FR-19, NFR-1, UX-DR6, UX-DR11)

As a student,
I want to submit my exam when all questions are answered or when the duration expires,
So that my work is captured and I cannot exceed the time limit.

**Acceptance Criteria:**

Given the exam start time,
When the student starts the exam,
Then the server records the start timestamp and sends the remaining duration. The client timer is advisory; the server enforces the deadline on submission.

Given the student is taking an exam,
When the timer drops below 5 minutes,
Then the timer color transitions from green to amber (UX-DR11, 3-state: green → amber at 5min → red at 1min) and the screen reader announces "5 minutes remaining" via aria-live.

Given the timer drops below 1 minute,
When the timer reaches 1:00,
Then the timer color transitions to red (UX-DR11).

Given the student clicks "Submit",
When the confirmation dialog appears,
Then it shows how many questions were answered out of total (e.g., "You've answered 28 of 30 questions.") with Confirm and Cancel buttons.

Given the student submits the exam,
When the submit is in progress,
Then a loading indicator appears on the Submit button (disabled state with "Submitting...") (UX-DR6).

Given the exam duration expires,
When the timer reaches 0:00,
Then the exam auto-submits whatever answers were saved, and the student is redirected to results with a toast: "Time's up — your answers have been submitted." (UX-DR6).

Given the student submits the exam,
When the submit completes,
Then it completes within 3 seconds (NFR-1), a toast appears ("All done, [First Name]!") (UX-DR6), and the screen fades back to normal navigation.

Given the exam deadline has passed,
When the student attempts to submit,
Then the server rejects the submission with a 409 Conflict.

### Story 6.4 — Auto-Save During Exam (FR-20, NFR-5, UX-DR7, UX-DR12)

As a student,
I want my answers to auto-save on each selection with retry on reconnect,
So that I never lose progress even if my connection is briefly interrupted.

**Acceptance Criteria:**

Given the student selects an answer for any question,
When the selection is made,
Then the answer is sent to the backend immediately (auto-save on each selection).

Given the network connection drops mid-exam,
When auto-save fails,
Then an inline banner appears: "You're offline. Answers are saved locally and will retry on reconnect." The exam continues uninterrupted (UX-DR7).

Given the network connection is restored,
When the retry fires,
Then locally saved answers retry sending to the backend and the offline banner disappears.

Given the student is in the exam-taking interface,
When auto-save succeeds for a question,
Then a small checkmark indicator appears next to that question in the sidebar (UX-DR12).

### Story 6.5 — Exam-Taking Accessibility (NFR-2, NFR-3, UX-DR17, UX-DR18, UX-DR19, UX-DR20)

As a student with accessibility needs,
I want full keyboard support, visible focus rings, semantic HTML, and reduced-motion support during exam-taking,
So that I can take exams equitably.

**Acceptance Criteria:**

Given the student is in the exam-taking interface,
When they use Tab to navigate between interactive elements,
Then focus moves in visual reading order and a visible indigo focus ring appears on each element (UX-DR17, UX-DR20).

Given the student uses arrow keys,
When navigating between questions in the sidebar,
Then the selected question updates and the question scrolls into view.

Given prefers-reduced-motion is enabled in the OS,
When any transition fires (exam fade-in, toast dismiss, skeleton shimmer),
Then transitions are disabled and content appears instantly (UX-DR19).

Given the exam-taking interface is rendered,
When a screen reader navigates the page,
Then the timer has aria-live="polite", the progress bar has aria-valuenow/aria-valuemin/aria-valuemax, and the interface uses appropriate ARIA semantics (UX-DR18).

---

## Epic 7: Student Portal — Results

**Goal:** Deliver the student results list and detailed per-question breakdown, including post-finalize correct answer disclosure.

### Story 7.1 — Results List (FR-21, UX-DR4, UX-DR5, UX-DR8)

As a student,
I want to see a list of all graded exams/tests with their scores and status,
So that I know how I performed across all my exams.

**Acceptance Criteria:**

Given the student navigates to Results,
When the page loads,
Then a paginated list of all exams is displayed showing title, date, score, and status badge (Graded/Pending) (UX-DR4).

Given the student has no graded exams yet,
When the page loads,
Then an empty state is shown: "No results yet — your grades will appear here." (UX-DR8).

Given results are loading,
When data is being fetched,
Then skeleton shimmer rows appear (UX-DR5).

Given the student taps a result row,
When the tap/click occurs,
Then they are navigated to the result detail page (Story 7.2) showing the full breakdown.

### Story 7.2 — Result Detail with Per-Question Breakdown (FR-22, FR-13 dependency, UX-DR1, UX-DR4)

As a student,
I want to tap a result to see my total score and a per-question breakdown,
So that I understand exactly where I did well and where I need to improve.

**Acceptance Criteria:**

Given the student taps a graded result,
When the detail view loads,
Then it shows the total score (large number + percentage in Georgia serif display font) (UX-DR1), a status badge, and a per-question breakdown: each question shows the question text, the student's selected answer, and a correct/incorrect indicator (UX-DR4).

Given the per-question breakdown,
When a question is correct,
Then a green "Correct" badge is shown (DESIGN.md success color); when incorrect, a red "Incorrect" badge is shown (DESIGN.md danger color) (UX-DR4).

Given the student's answers are stored in the Submission entity (Architecture AD-15),
When the result detail loads,
Then the score is sourced from the auto-scored Submission for MCQ/TF questions, and the per-question breakdown matches the Submission's stored answer selections.

Given the teacher has finalized the grades (FR-13),
When the student views the result detail,
Then the correct answer for each incorrect question is displayed, and a callout note appears: "Your teacher has finalized these results — full correct answer breakdown is now available."

Given the teacher has NOT finalized the grades,
When the student views the result detail,
Then only the score and correct/incorrect indicator are shown; the expected correct answer is hidden for incorrect questions, and a note reads: "Correct answers will be available after your teacher finalizes grades."

Given the exam result is still pending (not yet graded),
When the student views the result detail,
Then the score shows as "— / [total]" with a "Pending" badge and a message: "Your teacher hasn't graded this exam yet."
