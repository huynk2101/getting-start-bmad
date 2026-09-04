---
title: Adversarial Architecture Review
target: architecture-getting-start-bmad-2026-09-03
reviewer: adversarial-architecture-reviewer
created: 2026-09-03
verdict: CONCERNS
---

# Adversarial Architecture Review

## 1. Incompatible-Unit Construction

Two units are constructed below. Each obeys every AD in the spine to the letter. They are built by different developers who never talk to each other. Both ship. They clash.

---

### Unit A — "Exam Engine" (exam-taking + submission pipeline)

**Scope:** Student starts exam, answers questions, submits, auto-save, auto-submit on expiry.

**ADs obeyed:**

| AD | How Unit A obeys |
|---|---|
| AD-1 | Express route `POST /exams/:id/start`, `POST /exams/:id/submit`, `PUT /exams/:id/answers` |
| AD-2 | React SPA page `student/exam/[id]` with TanStack Query hooks |
| AD-3 | Prisma schema: `ExamSubmission` table, `StudentAnswer` table |
| AD-4 | JWT cookie checked on every exam endpoint; role = student enforced |
| AD-5 | TanStack Query manages `examSession` query key; cache invalidated on submit |
| AD-8 | Window-based lifecycle: `start` records `startedAt`, `submit` records `submittedAt`; auto-submit via server-side timer |
| AD-9 | Auto-save: `PUT /exams/:id/answers` fires on every selection; client retries on reconnect |
| AD-12 | Errors return `{ error: { code, message } }` envelope |
| AD-13 | Exam list endpoint uses cursor-based pagination |
| AD-14 | All timestamps UTC; `startedAt` stored as UTC with timezone alongside |

**Prisma schema (Unit A's design):**

```prisma
model ExamSubmission {
  id          String   @id @default(uuid())
  examId      String
  studentId   String
  startedAt   DateTime @db.Timestamptz
  submittedAt DateTime? @db.Timestamptz
  status      String   // "in_progress" | "submitted"
  answers     Json     // { "q1": "B", "q2": "A", ... }  ← flat optionIndex map
  createdAt   DateTime @default(now()) @db.Timestamptz

  exam    Exam    @relation(fields: [examId], references: [id])
  student Student @relation(fields: [studentId], references: [id])
}

model StudentAnswer {
  id              String   @id @default(uuid())
  examSubmissionId String
  questionId      String
  selectedOption  Int      // 0-3 for MCQ, 0-1 for TF
  savedAt         DateTime @db.Timestamptz

  examSubmission ExamSubmission @relation(fields: [examSubmissionId], references: [id])
}
```

**Key design decisions:**
- `ExamSubmission.answers` is a flat `Json` blob: `{ questionId: optionIndex }`. Optimized for fast write on every selection (AD-9).
- `StudentAnswer` is a denormalized companion table for querying individual answers.
- `ExamSubmission.status` transitions: `in_progress` → `submitted`. Unit A owns this field.
- No grading-related fields. Scoring is someone else's problem.

---

### Unit B — "Grading Pipeline" (teacher grading UI + auto-score + finalize)

**Scope:** Teacher views submissions, enters/overrides scores, marks absent, finalizes.

**ADs obeyed:**

| AD | How Unit B obeys |
|---|---|
| AD-1 | Express routes `GET /exams/:id/grading`, `PUT /exams/:id/grades`, `POST /exams/:id/finalize` |
| AD-2 | React SPA page `teacher/grading/[id]` with TanStack Query hooks |
| AD-3 | Prisma schema: `GradeRecord` table, `QuestionScore` table |
| AD-4 | JWT cookie checked; role = teacher enforced |
| AD-5 | TanStack Query manages `gradingView` query key |
| AD-7 | Dual-path: auto-score from answers + manual override; finalize unlocks disclosure |
| AD-12 | Errors return `{ error: { code, message } }` envelope |
| AD-13 | Grading list uses offset-based pagination (bounded student set) |
| AD-14 | All timestamps UTC |

**Prisma schema (Unit B's design):**

```prisma
model GradeRecord {
  id          String    @id @default(uuid())
  examId      String
  studentId   String
  totalScore  Float?
  status      String    // "pending" | "graded" | "finalized" | "absent"
  gradedAt    DateTime? @db.Timestamptz
  finalizedAt DateTime? @db.Timestamptz
  createdAt   DateTime  @default(now()) @db.Timestamptz

  exam    Exam    @relation(fields: [examId], references: [id])
  student Student @relation(fields: [studentId], references: [id])
}

model QuestionScore {
  id             String  @id @default(uuid())
  gradeRecordId  String
  questionId     String
  score          Float
  isCorrect      Boolean
  answeredOption Int?    // null if absent

  gradeRecord GradeRecord @relation(fields: [gradeRecordId], references: [id])
}
```

**Key design decisions:**
- `GradeRecord.status` transitions: `pending` → `graded` → `finalized`. Also handles `absent` (FR-12).
- `QuestionScore.isCorrect` is pre-computed at scoring time, not derived from answers at read time.
- `GradeRecord` does NOT reference `ExamSubmission`. It references `Exam` + `Student` directly.
- Unit B owns the `status` field on what it calls the "grade lifecycle."

---

### Clash Analysis

#### Clash 1 — Two Owners of "Exam Status" / "Result Status"

| Aspect | Unit A | Unit B |
|---|---|---|
| Entity | `ExamSubmission.status` | `GradeRecord.status` |
| Values | `in_progress`, `submitted` | `pending`, `graded`, `finalized`, `absent` |
| Owner claim | "I track whether the student finished" | "I track whether the exam is graded" |

**The problem:** The PRD's "Result" (§3 glossary) is defined as "A Student's Score on a specific Exam/Test, viewable by the Student and the Teacher." Both units independently create what the PRD calls a "Result." The frontend needs ONE result to display. Two tables, two status fields, two APIs — no AD specifies which is canonical.

A developer building the Student Results page (FR-21) must join `ExamSubmission` and `GradeRecord` on `(examId, studentId)`. But no AD pins this join contract. Unit A doesn't know Unit B's table exists. Unit B doesn't reference Unit A's table. The foreign key relationship is implicit and undefined.

#### Clash 2 — StudentAnswer Shape vs. Grading Expectations

| Aspect | Unit A stores | Unit B expects |
|---|---|---|
| Answer data | `{ questionId: optionIndex }` (flat JSON) | `QuestionScore { questionId, score, isCorrect }` (separate table) |
| Correct answer lookup | Not stored — Unit A doesn't know correct answers | Needs to compare `selectedOption` against `correctAnswer` on `Question` |
| Absent handling | No concept of absent | `answeredOption` is null; `GradeRecord.status = "absent"` |

**The problem:** Unit A's `StudentAnswer` table has `selectedOption: Int`. Unit B's auto-scoring logic (AD-7) needs to read this value and compare it against `Question.correctAnswer`. But:

1. `StudentAnswer` lives in Unit A's schema. Unit B has no Prisma relation to it — they're in separate repositories (AD-11).
2. Unit A's `ExamSubmission.answers` JSON blob uses `questionId` as key, but doesn't enforce that every question has an answer. Unit B's grading loop assumes all questions are answered (FR-10 shows "input fields for scores" for all students).
3. If a student is absent (FR-12), Unit A never creates a `StudentAnswer` row. Unit B needs to distinguish "not answered because absent" from "not answered because forgot." No shared enum or contract defines this.

#### Clash 3 — Exam/Test Unification Ambiguity

The PRD says Test is "functionally identical to an Exam but semantically distinct" (§3). The spine's ADs never address whether `Exam` and `Test` share a table or have separate tables.

- Unit A creates `ExamSubmission` referencing `examId`. If Tests are a separate table, Unit A needs a polymorphic reference. If they share a table, Unit A's route is `/exams/:id/start` — does it also handle tests?
- Unit B creates `GradeRecord` referencing `examId`. Same ambiguity.

Two developers will make opposite choices. Both obey every AD. The schemas are incompatible.

---

## 2. FR Coverage Gap Analysis

| FR | Description | Covered by AD(s) | Gap? |
|---|---|---|---|
| FR-1 | Daily class overview | AD-2, AD-5 (capabilities map) | ⚠️ No AD governs the "Class" entity shape or schedule query |
| FR-2 | Navigate to class details | AD-2 (React Router) | ✅ |
| FR-3 | List classes | AD-13 (pagination) | ⚠️ No AD defines class-teacher ownership constraint at data layer |
| FR-4 | View class details | AD-13 | ⚠️ Schedule entity has no AD governance |
| FR-5 | View student profile | — | 🔴 **No AD covers cross-entity aggregation (student + classes + results)** |
| FR-6 | Create exam/test | AD-1, AD-3, AD-8 | ✅ |
| FR-7 | Exam scheduling conflict detection | — | 🔴 **No AD governs where conflict detection logic lives** |
| FR-8 | Add questions to exam/test | — | 🔴 **No AD governs Question entity shape or management** |
| FR-9 | List exams/tests | AD-13 | ✅ |
| FR-10 | View completed exam submissions | AD-7, AD-3 | ✅ |
| FR-11 | Enter and save scores | AD-7 | ✅ |
| FR-12 | Mark student as absent | — | 🔴 **"Absent" concept not present in any AD** |
| FR-13 | Finalize grades | AD-7 | ✅ |
| FR-14 | Student dashboard | AD-2, AD-5 | ✅ |
| FR-15 | View schedule | — | 🔴 **"Schedule" entity/endpoint has no AD governance** |
| FR-16 | View class and teacher info | AD-2 | ✅ |
| FR-17 | Start exam | AD-8 | ✅ |
| FR-18 | Answer questions | — | ⚠️ No AD governs question presentation shape (one-at-a-time vs. all) |
| FR-19 | Submit exam | AD-8 | ✅ |
| FR-20 | Auto-save answers | AD-9 | ✅ |
| FR-21 | View results list | AD-13 | ⚠️ Which table is the "results list" source? (See Clash 1) |
| FR-22 | View result details | AD-7 (partially) | ⚠️ Per-question breakdown response shape not pinned by any AD |
| FR-23 | User login | AD-4 | ✅ |
| FR-24 | Role-based access | AD-4 | ✅ |

**Summary:** 5 FRs have zero AD coverage (FR-5, FR-7, FR-8, FR-12, FR-15). 5 more have partial coverage where the AD exists but doesn't pin the specific data shape or ownership contract needed (FR-1, FR-3, FR-18, FR-21, FR-22).

**Most critical gaps:**
- **FR-7 (conflict detection):** Business logic with no designated home. Could land in route handler, service, or Prisma middleware. Two devs will put it in different places.
- **FR-8 (Question entity):** The spine's "Deferred" section explicitly defers question bank reuse but doesn't address question storage shape at all. This is in-scope for v1.
- **FR-12 (absent marking):** AD-7 mentions "teacher can override scores" but absent is semantically different from a zero score. No AD defines the absent concept.

---

## 3. Technology Version Audit (2026)

| Technology | Spine Version | Current Status (Sept 2026) | Verdict |
|---|---|---|---|
| Node.js | 22 LTS | LTS until April 2027 | ✅ Current |
| TypeScript | 5.x | 5.x series current | ✅ Current |
| Express | 4.x | 5.x released April 2024; 4.x in maintenance mode | ⚠️ **Stale — Express 5.x available** |
| Prisma | 6.x | 6.x released 2025; current | ✅ Current |
| PostgreSQL | 16 | PG 17 released Sept 2024; PG 18 expected mid-2026 | ⚠️ **16 is behind — PG 17+ available** |
| React | 19.x | 19.x released late 2024; current | ✅ Current |
| Vite | 6.x | 6.x released late 2024; current | ✅ Current |
| React Router | 7.x | 7.x released late 2024; current | ✅ Current |
| TanStack Query | 5.x | 5.x current | ✅ Current |
| Vitest | 3.x | 3.x released 2025; current | ✅ Current |
| React Testing Library | latest | Always latest | ✅ N/A |
| Docker / docker-compose | latest | Always latest | ✅ N/A |

**Findings:**
- **Express 4.x** is in maintenance mode. Express 5.x has been stable since April 2024. Pinning to 4.x is a deliberate choice (stability) or oversight. Should be acknowledged.
- **PostgreSQL 16** is one major version behind. PG 17 brought significant performance improvements. For a new project starting in 2026, PG 17 or 18 would be more appropriate.

---

## 4. Dependency Diagram Check

**Finding: No dependency diagram exists in the architecture spine.**

The spine contains a "Capability → Architecture Map" table (§Capability → Architecture Map) and a "Structural Seed" directory tree, but no mermaid dependency diagram showing component relationships, data flow, or service dependencies.

This is a structural gap. A dependency diagram is essential for:
- Validating that Unit A and Unit B's schemas can coexist
- Visualizing which components depend on which Prisma models
- Identifying circular dependencies between frontend and backend

**Recommendation:** Add a mermaid diagram showing:
```
Frontend (React) → API Client → Express Routes → Services → Prisma → PostgreSQL
```
With entity ownership annotations on each service boundary.

---

## 5. Additional Findings

### 5.1 AD-11 (Separate Repos) Amplifies All Clashes

AD-11 mandates two separate repositories with "type sharing via shared TypeScript types package or manual sync." This means:
- Unit A's `ExamSubmission` type and Unit B's `GradeRecord` type live in different repos.
- There is no compile-time check that `(examId, studentId)` is a valid join key.
- "Manual sync" is a process, not a constraint. It will be forgotten.

### 5.2 AD-7 "Dual-Path" Doesn't Define the Merge Point

AD-7 says two grading paths exist: auto-score and manual entry. It says "score aggregates per-question answers." But it doesn't define:
- Does auto-scoring happen synchronously on submit? Or asynchronously?
- If async, when does the teacher see the grading page? Before scores are computed?
- What happens if the teacher manually enters a score and then auto-scoring runs?

Two devs will answer these differently. Both obey AD-7.

### 5.3 AD-9 vs. AD-8 Timing Contract

AD-9 says "auto-save on each answer selection with retry on reconnect." AD-8 says "auto-submit on expiry." The interaction is:
- Student's browser auto-saves answer → network fails → auto-submit timer fires server-side → server auto-submits with whatever it has.
- Client retries the save → arrives after auto-submit → what happens?

No AD defines the idempotency contract for late-arriving saves after submission.

---

## Verdict

**CONCERNS**

The spine is well-structured and the ADs are individually sound. However, the gaps between ADs are where incompatible units will emerge:

1. **Entity ownership is undefined** for Exam, StudentAnswer, GradeRecord, and Question. Two units will claim overlapping entities.
2. **Five FRs have zero AD coverage**, most critically FR-7 (conflict detection), FR-8 (Question management), and FR-12 (absent marking).
3. **Shared-data shapes are not pinned** — the join contract between exam submissions and grading records is implicit.
4. **Express 4.x and PostgreSQL 16** are behind current releases for a 2026 project.
5. **No dependency diagram** exists to validate component relationships.

**Recommended fixes before implementation:**
1. Add ADs for: Question entity ownership, Schedule entity, absent-marking concept, conflict detection placement, and cross-entity aggregation pattern (Result view).
2. Pin the Exam/Test unification strategy (shared table vs. separate tables with FK).
3. Define the `ExamSubmission` → `GradeRecord` join contract explicitly (shared type or canonical table).
4. Upgrade Express to 5.x and PostgreSQL to 17 in the stack table.
5. Add a mermaid dependency diagram with entity ownership annotations.
