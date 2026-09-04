---
type: pre-mortem-review
target: epics.md
storiesReviewed: 22
epicsReviewed: 7
generatedAt: 2026-09-03
---

# Pre-Mortem Analysis: SchoolDesk Stories

## Verdict: CONCERNS

The story set is structurally sound but contains three high-probability failure paths rooted in missing edge cases, weak NFR coverage, and silent dependency gaps. No single story is fatally broken, but the interaction between Epic 6 (Exam Taking) and Epic 4 (Grading) is fragile.

---

## Failure Scenario 1: "Students lose exam answers during a network blip and can't submit"

### The Failure
On exam day, 40% of students experience intermittent WiFi. During a 2-minute outage, answers selected in the UI appear saved locally (checkmark visible), but when connectivity restores, the sync silently fails because the retry queue has no deduplication or conflict resolution. Students hit "Submit" and the backend rejects the submission — half their answers are missing or corrupted. Support tickets flood in. Teachers can't see submissions. The exam window closes. Trust collapses.

### Trace Back
- **Story 6.4** (Auto-Save) — AC covers offline banner and retry-on-reconnect, but has no AC for: retry queue dedup, handling a partially-synced state at submit time, or what happens if the student submits while sync is still in flight.
- **Story 6.3** (Submit) — AC says "submit completes within 3 seconds" but doesn't define what happens if the backend receives a partially-synced answer set. No AC for: minimum answer count before allowing submit, or warning on incomplete sync.
- **Story 6.5** (Accessibility) — No mention of offline-capable focus management or how the offline banner interacts with screen readers.

### What's Missing
1. **No AC for sync-at-submit-time integrity check.** When the student clicks Submit, there's no story that validates all answers are synced to the backend before the submit request fires.
2. **No retry queue dedup or conflict resolution strategy.** The AC says "answers sync" but doesn't define what happens if the same answer is saved twice (e.g., student selects, connection drops, selects again).
3. **No AC for partial-submit guard.** Story 6.3 says the confirmation dialog shows answered count, but if auto-save failed for some answers, the count is wrong — it reflects local state, not server state.
4. **Missing NFR coverage:** No network-recovery SLA or offline-duration limit defined anywhere.

### Proposed Fix
- **New Story 6.6 — Exam Submission Integrity Guard.** ACs: (1) Before submitting, the system must verify all answers are synced to the backend; if not, display "Still saving your answers — please wait" and block submit until sync completes. (2) If sync cannot complete within 10 seconds of the submit attempt, warn the student and offer retry. (3) The submission confirmation dialog must reflect server-confirmed answer count, not local count.
- **Modify Story 6.4:** Add AC: "Given the network connection drops and multiple saves queue up for the same question, when the connection restores, only the latest answer per question is sent to the backend (no duplicates)."

---

## Failure Scenario 2: "Teachers finalize grades with wrong data, students see incorrect scores"

### The Failure
A teacher grades 30 students across 3 exams in one sitting. They enter scores rapidly, marking some absent and entering scores for others. They finalize Exam A — but the grading table had a stale average because the summary bar didn't update after the last absent toggle. Exam B is finalized with a student marked absent who actually submitted answers (the submission exists in the database). Students see "Finalized — correct answer breakdown available" but their score is 0. Parents complain. The teacher can't undo finalization (the confirmation dialog says "This cannot be undone"). The school administrator has no override mechanism.

### Trace Back
- **Story 4.3** (Mark Absent) — AC says toggling absent clears the score and disables input, but doesn't check if the student has an existing submission. No AC for: "If a student has a submission, warn the teacher before marking absent."
- **Story 4.4** (Finalize Grades) — AC says "all students are graded or marked absent" but doesn't validate that absent students don't have submissions. No AC for: validation that the absence marking is consistent with submission data.
- **Story 4.1** (View Submissions) — Shows status badges (Graded/Pending/Absent) but doesn't indicate whether a student has a submission on file.

### What's Missing
1. **No submission-aware absent marking.** Story 4.3 doesn't consider whether the student actually submitted the exam before allowing the teacher to mark them absent.
2. **No finalization integrity check.** Story 4.4 doesn't validate that the grading state is consistent with submission data before allowing finalization.
3. **No undo or correction mechanism.** The confirmation dialog says "cannot be undone" but there's no story for an admin override or grade correction workflow. This is a hard constraint with no escape hatch.
4. **Missing NFR:** No audit trail for grading actions — who graded what, when, what changed.

### Proposed Fix
- **Modify Story 4.3:** Add AC: "Given a student has a submission on file (answer data exists), when the teacher toggles absent, then a warning banner appears: '[Student Name] has a submission on file. Marking absent will discard their exam. Continue?' with Confirm/Cancel."
- **Modify Story 4.4:** Add AC: "Given any student marked absent has a submission on file, when the teacher clicks Finalize, then the system displays a count of affected students and requires explicit confirmation."
- **New Story 4.5 — Grade Correction & Audit Trail.** ACs: (1) After finalization, a teacher can reopen grading for a specific exam (with confirmation). (2) All grading changes are logged with timestamp, previous value, and new value. (3) An admin endpoint exists for emergency grade override.

---

## Failure Scenario 3: "Exam creation silently allows past-date exams, students see ghost exams"

### The Failure
A teacher creates an exam and accidentally sets the date to last week. The system accepts it (no validation on date being in the future). The exam appears in the teacher's list with status "completed" even though no student ever took it. The exam also appears in the student portal as an upcoming exam with a negative countdown ("Started 5 days ago"). Students are confused. The teacher can't delete the exam (no delete story exists). The exam list becomes cluttered with phantom exams. Eventually the teacher gives up and creates a duplicate, causing a scheduling conflict that the conflict detector catches — but now there are two broken exams in the system.

### Trace Back
- **Story 3.1** (Create Exam) — AC validates required fields but has no AC for: date must be in the future, time must be within school hours, duration must be positive and reasonable (e.g., ≤ 300 minutes).
- **Story 3.2** (Conflict Detection) — Only checks overlap for the same class, doesn't check for invalid dates.
- **Story 3.4** (Exam List) — Displays status as "upcoming/completed" but doesn't define how status is determined. If an exam date is in the past and no one took it, what status does it get?

### What's Missing
1. **No date/future validation on exam creation.** Story 3.1 has no AC for rejecting past dates.
2. **No exam duration bounds.** A teacher could set duration to 0 minutes or 99999 minutes.
3. **No exam deletion or archival.** There's no story for removing or hiding invalid exams.
4. **Ambiguous status logic.** Story 3.4 uses "upcoming/completed" but doesn't define the transition rules. What happens to an exam whose date passed but has no submissions?
5. **Missing: exam editing.** Once created, there's no story for editing an exam's details (date, time, duration) before it starts.

### Proposed Fix
- **Modify Story 3.1:** Add ACs: (1) "Given the teacher selects a date that is in the past, when they submit, then an inline error appears: 'Exam date must be today or in the future.'" (2) "Given the teacher sets a duration of 0 or greater than 300 minutes, when they submit, then an inline error appears." (3) "Given the teacher sets a start time outside 07:00–21:00 local time, when they submit, then an inline warning appears: 'Start time is outside school hours.'"
- **New Story 3.5 — Exam Edit & Delete.** ACs: (1) Before an exam's scheduled start time, the teacher can edit date, time, duration, and title. (2) Before an exam has any submissions, the teacher can delete it with confirmation. (3) After an exam has submissions, edit is restricted to title only.

---

## Cascade Failure Analysis

### CRITICAL: Epic 6 — Exam Taking

**Single-story failure that cascades:** Story 6.3 (Submit Exam) or Story 6.4 (Auto-Save).

If either of these stories fails or has bugs, the entire exam-taking workflow is broken. Students cannot complete exams. This cascades into:
- Epic 4 (Grading) — No submissions to grade
- Epic 7 (Results) — No results to display
- Epic 3 (Exam Management) — Teachers see exams with zero submissions

These stories are the **critical path bottleneck**. There is no fallback if auto-save or submit breaks.

**Mitigation:** Story 6.4 and 6.3 should have the highest testing priority. Consider adding a Story 6.6 (Submission Integrity Guard) as described above to add a safety net.

### HIGH RISK: Epic 4 — Grading

**Single-story failure that cascades:** Story 4.4 (Finalize Grades).

If finalization is broken or the "cannot be undone" constraint causes problems (as described in Failure Scenario 2), the entire results pipeline stalls. Students never see their correct answers. The teacher cannot re-grade.

**Mitigation:** Story 4.5 (Grade Correction) should be added before finalization ships.

### MODERATE RISK: Epic 1 — Foundation

**Single-story failure that cascades:** Story 1.3 (Database Schema).

If the schema has missing relations or incorrect indexes, every subsequent epic is affected. However, this is lower risk because schema issues are caught early in development.

---

## Summary of Gaps by Category

### Missing Acceptance Criteria (per story)
| Story | Gap |
|---|---|
| 3.1 | No date-in-future validation, no duration bounds |
| 3.4 | Undefined status transition logic |
| 4.3 | No submission-aware absent marking |
| 4.4 | No finalization integrity check, no undo mechanism |
| 6.3 | No sync-at-submit validation, no partial-submit guard |
| 6.4 | No dedup, no server-state confirmation |

### Missing Stories
| Story | Rationale |
|---|---|
| 3.5 — Exam Edit & Delete | Teachers need to correct mistakes before exam day |
| 4.5 — Grade Correction & Audit Trail | Finalization is irreversible with no safety net |
| 6.6 — Submission Integrity Guard | Auto-save + submit must be coordinated |

### Missing NFR Coverage
| Area | Gap |
|---|---|
| Auto-save reliability | No SLA for sync completion time or retry limits |
| Audit trail | No logging of grading actions or exam modifications |
| Data integrity | No submission-count validation at submit time |
| Offline resilience | No defined max offline duration or degradation behavior |

---

## Risk Heatmap

| Epic | Story | Risk | Rationale |
|---|---|---|---|
| Epic 6 | 6.3 | **CRITICAL** | Submit is the single point of failure for the entire exam workflow |
| Epic 6 | 6.4 | **CRITICAL** | Auto-save failure cascades into submit, grading, and results |
| Epic 4 | 4.4 | **HIGH** | Irreversible finalization with no correction path |
| Epic 4 | 4.3 | **HIGH** | Absent marking ignores submission data |
| Epic 3 | 3.1 | **MEDIUM** | No input validation on date/duration allows junk data |
| Epic 7 | 7.2 | **MEDIUM** | Depends on Epic 4 finalization state — no graceful fallback |
| Epic 2 | 2.5 | **LOW** | Student profile shows results — depends on Epic 4/7 but degrades gracefully |
| Epic 1 | 1.1-1.5 | **LOW** | Foundation stories — caught early, low blast radius |

---

## Recommendations (Priority Order)

1. **Add Story 6.6 — Submission Integrity Guard.** This is the highest-impact missing story. Without it, the auto-save/submit interaction is fragile and untested.
2. **Add Story 4.5 — Grade Correction & Audit Trail.** The "cannot be undone" finalization is a production hazard. Teachers will make mistakes.
3. **Add Story 3.5 — Exam Edit & Delete.** Prevents ghost exams and gives teachers an escape hatch for data entry errors.
4. **Modify Story 3.1** to add date, duration, and time-of-day validation ACs.
5. **Modify Story 4.3** to warn when marking absent a student with a submission on file.
6. **Modify Story 6.4** to add dedup and server-state confirmation.
7. **Modify Story 6.3** to add sync-check-before-submit logic.
8. **Define NFR for auto-sync SLA** — add to Epic 6 or as a new NFR-7: "Auto-save sync must complete within 5 seconds of network restoration."
