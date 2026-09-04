---
title: Student Management System
created: 2026-09-03
updated: 2026-09-03
status: final
---

# PRD: Student Management System

## 0. Document Purpose

This PRD is for the development team and any stakeholders involved in building the Student Management System (SMS). It is structured around glossary-anchored vocabulary, features grouped with functional requirements (FRs) nested, and assumptions tagged inline. UX and architecture decisions are deferred — this PRD establishes the "what" before the "how."

## 1. Vision

The Student Management System is a web application that empowers teachers to efficiently manage their classes, students, exams, and tests from a single dashboard. Teachers can view their daily schedule at a glance, manage student rosters, create exam and test schedules, and grade student submissions — all in one place.

Students benefit from a personalized portal where they can view their schedule, class information, teacher details, upcoming exams and tests, take exams online, and review their results. The system replaces spreadsheets and paper-based tracking with a clean, purpose-built tool designed around the real workflows of a classroom.

The goal is a lightweight, focused system that does a few things well rather than a bloated all-in-one platform. It is a hobby project built with production-grade rigor.

## 2. Target User

Two roles define v1 scope — Teacher and Student; three audiences are explicitly out of scope.

### 2.1 Jobs To Be Done

- **Teacher:** "I need a single place to see my classes, manage my students, schedule exams, and grade them — without juggling spreadsheets and paper."
- **Student:** "I need to check my schedule, see when my next exam is, take it online, and review my results — all in one spot."

### 2.2 Non-Users (v1)

- **School administrators** — no admin dashboard, reporting, or multi-teacher management in v1.
- **Parents** — no parent portal or guardian access in v1.
- **External integrations** — no SIS, LMS, or third-party API integrations in v1.

### 2.3 Key User Journeys

- **UJ-1. Mr. Chen checks his daily classes at a glance.**
  - **Persona + context:** Mr. Chen is a high school teacher with 4 classes. He opens the app first thing in the morning.
  - **Entry state:** Authenticated via username/password. Landing on the dashboard.
  - **Path:** Dashboard shows today's classes in a timeline view. He taps a class card to see class details: student count, student list, schedule.
  - **Climax:** He sees all 4 classes with student counts and times in a single view.
  - **Resolution:** He knows his day at a glance. He can navigate to any class from here.
  - **Edge case:** If no classes are scheduled today, the dashboard shows an empty state with a friendly message.

- **UJ-2. Mr. Chen views student information in a class.**
  - **Persona + context:** Mr. Chen is preparing for parent-teacher conferences and needs to review a student's record.
  - **Entry state:** Authenticated. On the class detail page.
  - **Path:** He selects a class → taps the Students tab → sees a searchable list of students → taps a student to view their profile (name, ID, contact info, enrolled classes, exam/test results).
  - **Climax:** He sees the student's full academic profile in one view.
  - **Resolution:** He has the information he needs. He navigates back to the class list.
  - **Edge case:** If the student has no exam results yet, the results section shows an empty state.

- **UJ-3. Mr. Chen creates an exam schedule.**
  - **Persona + context:** Mr. Chen needs to schedule a midterm exam for his Biology class next week.
  - **Entry state:** Authenticated. On the Exams section.
  - **Path:** He taps "Create Exam" → enters title ("Biology Midterm"), selects class, sets date, time, and duration → saves. The exam appears on the class's upcoming exams list.
  - **Climax:** The exam is saved and visible in both the teacher's exam list and the student's upcoming exams for that class.
  - **Resolution:** The exam is scheduled. Students in the class will see it in their portal.
  - **Edge case:** If the teacher tries to create an exam at a time that overlaps with an existing exam for the same class, the system shows a conflict warning and prevents the overlap.

- **UJ-4. Mr. Chen grades a test.**
  - **Persona + context:** Mr. Chen's class just completed a quiz. He needs to enter grades.
  - **Entry state:** Authenticated. On the Exams/Tests section, viewing a completed test.
  - **Path:** He opens the test → sees a list of students with input fields for scores → enters scores for each student → saves. Students can now see their results.
  - **Climax:** All scores are saved and immediately visible to students in their results view.
  - **Resolution:** Grading is done. Students are notified (in-app) that results are available.
  - **Edge case:** If a student was absent, the teacher can mark them as "absent" and the system skips them in the grading view.

- **UJ-5. Ms. Rivera (student) takes an exam online.**
  - **Persona + context:** Ms. Rivera is a student in Mr. Chen's Biology class. She has an exam scheduled for today.
  - **Entry state:** Authenticated as student. On the student dashboard.
  - **Path:** She sees "Biology Midterm — Today" on her dashboard → taps "Start Exam" → sees questions one at a time (or all at once) [ASSUMPTION] → selects answers → submits. She sees confirmation that her exam was submitted.
  - **Climax:** She submits her exam and sees the confirmation.
  - **Resolution:** Her exam is submitted for grading. She can view her result once the teacher grades it.
  - **Edge case:** If she loses internet connection mid-exam, her answers are saved locally [ASSUMPTION] and synced when connection is restored. If the exam time is about to expire, she sees a warning; when the time expires, the exam auto-submits whatever was answered.

- **UJ-6. Ms. Rivera checks her exam results.**
  - **Persona + context:** Ms. Rivera wants to see how she did on last week's quiz.
  - **Entry state:** Authenticated as student. On the Results section.
  - **Path:** She navigates to Results → sees a list of graded exams/tests with scores → taps one to view detailed results (score, possibly question-by-question breakdown [ASSUMPTION]).
  - **Climax:** She sees her score and knows how she performed.
  - **Resolution:** She has her result. She can navigate to other results or back to the dashboard.
  - **Edge case:** If the teacher hasn't graded the exam yet, the result shows "Pending" status.

## 3. Glossary

- **Class** — A group of students assigned to a specific course (e.g., "Biology 101"). Has a name, schedule, and a teacher. One teacher can have many classes; one class has one teacher. A class contains many Students.
- **Student** — A user who is enrolled in one or more Classes. Has a name, student ID, and contact info. Can view their schedule, upcoming exams, class info, take exams, and view results.
- **Teacher** — A user who manages Classes, Students, Exams, and Tests. Has a name, teacher ID, and contact info.
- **Exam** — A scheduled assessment tied to a Class. Has a title, date, time, duration, and a set of questions. Students take Exams; Teachers grade them.
- **Test** — A smaller, shorter assessment (e.g., a quiz). Functionally identical to an Exam but semantically distinct for organizational purposes. Same structure as an Exam.
- **Question** — A single item within an Exam or Test. Can be multiple-choice or true/false. Has a question text, options, and a correct answer.
- **Score** — The grade a Student receives on an Exam or Test after grading. Associated with a Student and an Exam/Test.
- **Schedule** — The timetable of Classes for a Student or Teacher on a given day.
- **Result** — A Student's Score on a specific Exam or Test, viewable by the Student and the Teacher.

## 4. Features

### 4.1 Teacher Dashboard
**Description:** The teacher lands on a dashboard showing today's classes in a timeline view. Each class card shows the class name, time, and student count. Tapping a class navigates to class details. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Daily class overview
Teacher can see all classes scheduled for today with class name, time, and student count.

**Consequences (testable):**
- Dashboard loads and displays all classes for the authenticated teacher filtered by today's date.
- Each class card shows: class name, scheduled time, student count.
- If no classes are scheduled, an empty state message is shown.

#### FR-2: Navigate to class details
Teacher can tap a class card to navigate to the class detail page.

**Consequences (testable):**
- Tapping a class card navigates to the class detail view (FR-4).

### 4.2 Class Management
**Description:** Teachers can view and manage their classes. Each class has a name, schedule, and a list of enrolled students. Teachers can view class details and student rosters. Realizes UJ-2.

**Functional Requirements:**

#### FR-3: List classes
Teacher can see a list of all their classes (not just today's).

**Consequences (testable):**
- Class list page shows all classes for the authenticated teacher.
- Each entry shows class name and student count.

#### FR-4: View class details
Teacher can view a specific class's details: name, schedule, and student list.

**Consequences (testable):**
- Class detail page shows class name, schedule, and a list of enrolled students.
- Student list is searchable by name [ASSUMPTION].

#### FR-5: View student profile
Teacher can tap a student in the class list to view their profile: name, ID, contact info, enrolled classes, and exam/test results.

**Consequences (testable):**
- Student profile page shows name, student ID, contact info, list of enrolled classes, and list of exam/test results.
- If the student has no results, an empty state is shown.

### 4.3 Exam and Test Management
**Description:** Teachers can create exams and tests, schedule them for specific classes, and manage their questions. Students see upcoming exams in their portal for their enrolled classes. Realizes UJ-3.

**Functional Requirements:**

#### FR-6: Create exam/test
Teacher can create an exam or test by providing a title, selecting a class, setting date, time, and duration.

**Consequences (testable):**
- Form validates all required fields (title, class, date, time, duration).
- Exam/test is saved and appears in the class's upcoming exams list.
- Exam/test appears in the student portal for enrolled students.

#### FR-7: Exam scheduling conflict detection
System prevents creating an exam/test at a time that overlaps with an existing exam/test for the same class.

**Consequences (testable):**
- If date/time/duration overlaps with an existing exam for the same class, the system shows a conflict warning and does not save.
- If no conflict exists, the exam/test is saved successfully.

#### FR-8: Add questions to exam/test
Teacher can add questions to an exam/test using multiple-choice or true/false types.

**Consequences (testable):**
- Teacher can add multiple-choice questions with text, 4 options [ASSUMPTION], and a correct answer.
- Teacher can add true/false questions with a correct answer.
- Questions are saved and associated with the exam/test.

#### FR-9: List exams/tests
Teacher can see a list of all exams/tests they have created, filterable by class and status (upcoming, completed).

**Consequences (testable):**
- Exam list shows title, class, date, status (upcoming, completed).
- Teacher can filter by class and status.

### 4.4 Grading
**Description:** After students complete an exam/test, the teacher can enter scores for each student. Scores are saved and immediately visible to students. Realizes UJ-4.

**Functional Requirements:**

#### FR-10: View completed exam submissions
Teacher can view a list of all enrolled students for a specific exam/test, with input fields for scores.

**Consequences (testable):**
- Grading page shows all enrolled students for the exam/test.
- Each student has an input field for their score.
- Absent students can be marked as "absent."

#### FR-11: Enter and save scores
Teacher can enter scores for each student and save them.

**Consequences (testable):**
- Scores are saved to the database.
- Saved scores are immediately visible to students in their results view.

#### FR-12: Mark student as absent
Teacher can mark a student as absent for an exam/test.

**Consequences (testable):**
- Absent student is excluded from the grading input.
- Student's result shows "Absent" status.

#### FR-13: Finalize grades
Teacher can finalize grades for an exam/test, which unlocks the per-question correct-answer disclosure for students.

**Consequences (testable):**
- A "Finalize Grades" action opens a confirmation dialog; upon confirmation, correct-answer disclosure is unlocked for all students.
- Until finalize, students see score plus correct/incorrect only.
- After finalize, students can see the correct answer for each question.

### 4.5 Student Portal — Dashboard and Schedule
**Description:** Students see a personalized dashboard with their schedule, upcoming exams/tests, class info, and teacher details — and can view their schedule, upcoming exams, and results from it. Realizes UJ-5, UJ-6.

**Functional Requirements:**

#### FR-14: Student dashboard
Student can see a dashboard with today's classes, upcoming exams/tests, and class/teacher info.

**Consequences (testable):**
- Dashboard shows classes for today, upcoming exams/tests with dates, and class/teacher info.
- If no classes or exams today, empty state is shown.

#### FR-15: View schedule
Student can view their full class schedule (all classes with times).

**Consequences (testable):**
- Schedule page shows all enrolled classes with day, time, and teacher name.

#### FR-16: View class and teacher info
Student can view details of a specific class: class name, schedule, teacher name, and teacher contact info.

**Consequences (testable):**
- Class detail page shows class name, schedule, teacher name, teacher contact info.

### 4.6 Student Portal — Take Exams
**Description:** Students can take exams/tests online through the portal. Questions are presented, answers are recorded, and the exam is submitted when complete. Realizes UJ-5.

**Functional Requirements:**

#### FR-17: Start exam
Student can start an exam/test from their dashboard or upcoming exams list.

**Consequences (testable):**
- "Start Exam" button is available when the exam time has arrived.
- Tapping it opens the exam interface with questions.

#### FR-18: Answer questions
Student can answer questions (select an option for each question).

**Consequences (testable):**
- Each question shows text and its answer options (4 options for multiple-choice, True/False for true/false).
- Student can select one option per question.
- Student can navigate between questions [ASSUMPTION].

#### FR-19: Submit exam
Student can submit the exam when all questions are answered (or when the exam's duration expires).

**Consequences (testable):**
- "Submit" button submits the exam.
- The system warns the student shortly before the duration expires (e.g., 60 seconds before [ASSUMPTION]).
- If the duration expires, the system auto-submits whatever was answered.
- After submission, student sees a confirmation.

#### FR-20: Auto-save answers
System auto-saves student answers during the exam.

**Consequences (testable):**
- Answers are saved each time a student selects an answer.
- If connection is lost, answers are saved locally and synced when connection is restored [ASSUMPTION].

### 4.7 Student Portal — Results
**Description:** Students can view their exam/test results after the teacher has graded them. Realizes UJ-6.

**Functional Requirements:**

#### FR-21: View results list
Student can see a list of all graded exams/tests with their scores.

**Consequences (testable):**
- Results page shows exam/test title, date, score, and status (graded/pending).

#### FR-22: View result details
Student can tap a result to see detailed information: total score and a per-question breakdown.

**Consequences (testable):**
- Detail view shows the score and total possible score.
- Detail view shows a per-question breakdown (question, student's answer, correct/incorrect). Disclosure of correct answers follows FR-13 (finalize to unlock).
- If the exam hasn't been graded yet, shows "Pending" status.

### 4.8 Authentication
**Description:** Users (teachers and students) must authenticate to access the system.

**Functional Requirements:**

#### FR-23: User login
Users can log in with username and password.

**Consequences (testable):**
- Valid credentials grant access and redirect to the appropriate dashboard (teacher or student).
- Invalid credentials show an error message.
- Session is maintained until logout [ASSUMPTION].

#### FR-24: Role-based access
System enforces role-based access: teachers can only access teacher features, students can only access student features.

**Consequences (testable):**
- A student cannot access teacher dashboard or grading features.
- A teacher cannot access student exam-taking features.

## 5. Non-Goals (Explicit)

- **No admin dashboard** — this is a teacher/student tool, not a school management platform.
- **No parent portal** — parents are not a user role in v1.
- **No attendance tracking** — out of scope for v1 [ASSUMPTION].
- **No report cards or PDF export** — not in v1.
- **No notifications (email/push)** — students see results in-app only [ASSUMPTION].
- **No mobile app** — web app only.
- **No SIS/LMS integration** — standalone system.
- **No multi-school support** — single-school scope.
- **No file attachments** — exams are text/multiple-choice/true-false only [ASSUMPTION].

## 6. MVP Scope

### 6.1 In Scope

- Teacher dashboard with daily class overview (FR-1, FR-2)
- Class management (list FR-3, view details FR-4, student roster FR-5)
- Student profile view (teacher) (FR-5)
- Exam/test creation with scheduling and conflict detection (FR-6, FR-7, FR-9)
- Question management (FR-8)
- Grading interface (enter scores FR-10, FR-11, mark absent FR-12, finalize to unlock answers FR-13)
- Student dashboard with schedule (FR-14, FR-15, FR-16)
- Student exam-taking interface (FR-17, FR-18, FR-19, FR-20)
- Student results view (FR-21, FR-22)
- Authentication with role-based access (FR-23, FR-24)
- PostgreSQL database for persistence

### 6.2 Out of Scope for MVP

Items already listed in §5 Non-Goals (admin dashboard, parent portal, attendance, report cards/PDF, notifications, mobile app, SIS/LMS integration, file attachments) are omitted here. Additional deferrals beyond §5:

- Essay/free-text and fill-in-the-blank question types (multiple-choice and true/false only in v1)
- Question bank / question reuse across exams
- Exam time limit enforcement is auto-submit on expiry only [ASSUMPTION].

## 7. Success Metrics

**Primary:**
- **SM-1:** Mr. Chen manages his classes, students, schedules exams, and grades them using the app instead of spreadsheets for 5 consecutive school days. Validates FR-1 through FR-13.

**Secondary:**
- **SM-2:** A student can take and submit an exam without errors in a single session. Validates FR-17, FR-18, FR-19, FR-20.
- **SM-3:** A student can view their schedule, upcoming exams, and results in the portal. Validates FR-14, FR-15, FR-16, FR-21, FR-22.

**Counter-metrics (do not optimize):**
- **SM-C1:** Exam submission latency — a student's final submit action must complete within 3 seconds; do not sacrifice data integrity (auto-save reliability, correct-answer gating) for speed.

## 8. Open Questions

1. **Teacher/student creation** — manual creation only confirmed for v1; is CSV import deferred to v2?
2. **Exam question presentation** — are questions shown one at a time or all on one screen? [ASSUMPTION: currently unconfirmed]
3. **Time-limit warning window** — how far before the duration expires should the warning appear? [ASSUMPTION: 60 seconds]
4. **Result breakdown disclosure** — confirm the per-question breakdown (correct/incorrect plus post-finalize correct answers) is the desired level of detail. [ASSUMPTION: yes]

## 9. Assumptions Index

- §2.3 UJ-5 — Exam questions are presented one at a time or all at once (needs confirmation).
- §3 — Exams/Tests use multiple-choice and true/false question types only.
- §4.2 FR-4 — Student list is searchable by name.
- §4.3 FR-6 — Exam form requires title, class, date, time, duration.
- §4.3 FR-8 — Multiple-choice questions have 4 options.
- §4.6 FR-17 — "Start Exam" button is available when exam time has arrived.
- §4.6 FR-18 — Student can navigate between questions during exam.
- §4.6 FR-19 — Warning shown 60 seconds before the duration expires.
- §4.6 FR-20 — Answers are saved on each answer selection.
- §4.6 FR-20 — Answers are saved locally and synced when connection is restored.
- §4.7 FR-22 — Correct answers are shown only after the teacher finalizes grades.
- §4.4 FR-13 — Teacher finalizes grades to unlock correct-answer disclosure.
- §4.8 FR-23 — Session is maintained until logout.
- §5 — No attendance tracking in v1.
- §5 — No notifications (email/push) in v1.
- §5 — Exams are text/multiple-choice/true-false only (no file attachments).
- §6.2 — Exam time limit enforcement is auto-submit on expiry only.
