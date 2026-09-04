# Boundary & Edge Case Sweep — SchoolDesk Stories

**Scope:** 22 stories across 7 epics (`epics.md`)
**Date:** 2026-09-03
**Method:** Systematic sweep of zero/null/empty, maximum, concurrency, timer, state-transition, role, offline→online, and missing-story cases.

---

## Verdict

The story set is **structurally solid for the happy path but under-specified at every boundary**. The single most dangerous gap is the **conflict between per-question correctness auto-grading (implied by 7.2's per-question breakdown) and the free-form manual score entry in 4.2** — there is no story or AC defining how scores are actually computed or reconciled, which poisons a chain of downstream edge cases (partial grading, re-grading, manual vs. auto scores diverging). Concurrency and timer boundaries are also largely unaddressed.

---

## Findings

### #1 — CRITICAL — Scoring computation is undefined
- **Story:** 7.2, 4.2, 4.1, 4.4
- **Edge case description:** The entire grading/result model assumes per-question correctness (7.2 requires per-question correct/incorrect indicators and correct-answer disclosure), yet 4.2 has teachers typing a **free-form total score** per student. It is never specified how a total score is derived: is it auto-computed from per-question answers, manually keyed, or a hybrid? A teacher can key a "score" with no visible relation to per-question results.
- **Current behavior (AC):** 7.2 shows per-question breakdown + total; 4.2 lets teacher type and save a raw score; 4.4 finalizes. No AC ties them together.
- **Gap:** No scoring algorithm, no validation that the typed score matches max points or per-question answers, no definition of "max score" for an exam, no story for a question's point value.
- **Proposed fix:** New story "Scoring Model & Score Computation" defining points-per-question, how the teacher's score is validated (0..max), whether grades auto-derive from correctness, and reconciliation rules. At minimum add AC to 4.2 binding score entry to max points and to 7.2.

---

### #2 — CRITICAL — Concurrency: student submits while teacher grades/finalizes; two teachers grading same exam
- **Story:** 6.3, 4.2, 4.4, 4.1
- **Edge case description:** A student can still be mid-exam (or their latest auto-save is in flight) when a teacher begins grading or hits Finalize. What happens to a score/summary derived before the final submission lands? Also, nothing scopes grading to a single session — two teachers (same class) could see the grading table concurrently.
- **Current behavior (AC):** 4.1 lists all enrolled students with editable scores; 4.4 unlocks disclosure on finalize. No AC prevents grading before/after submission, handles late-arriving submissions, or locks concurrent editors.
- **Gap:** No submission/grading staleness guard, no optimistic-concurrency/Etag on score rows, no rule that grading can only occur after the exam closes.
- **Proposed fix:** AC in 4.1: grading view disabled/locked until exam is submitted-or-expired; a pending-submission warning if a student's answers are still streaming. For concurrent grading, AC on 4.2 with a version/updatedAt check that surfaces a conflict "Grades changed by another editor — refresh." Consider whether finalize should stop new submissions.

---

### #3 — HIGH — Double-submit / submit-then-answer race
- **Story:** 6.3, 6.2, 6.4
- **Edge case description:** Student clicks Submit twice, or hits Submit while an auto-save for the last question is still in flight, or auto-submit at 0:00 fires while the user simultaneously clicks Submit. Nothing prevents duplicate submissions (two Submission rows / double-charge of score) or an answer saved after the submission snapshot.
- **Current behavior (AC):** 6.3 has confirmation dialog and auto-submit at 0:00; 6.4 auto-saves continuously. No idempotency or final-state lock.
- **Gap:** No idempotency key on submit, no end-of-exam lock preventing further saves, no rule about the last-arriving answer at the deadline.
- **Proposed fix:** AC in 6.3: submit is idempotent (server ignores repeats, returns 200/409 with existing result), exam transitions to CLOSED state server-side so post-deadline auto-saves are rejected, and a cut-off timestamp defines which answer snapshot is authoritative.

---

### #4 — HIGH — Absent → un-absent (toggle off) with no score, then finalize
- **Story:** 4.3, 4.4
- **Edge case description:** Teacher marks student absent (score cleared), then toggles OFF — student returns to pending with an **empty score input**. If the teacher finalized meanwhile, or toggles off and directly finalizes, the freshly-absent student is now pending and blocks/affects finalize. Also: is re-marking absent after a score was entered allowed, and what happens to the stored score?
- **Current behavior (AC):** 4.3 toggling off returns student to pending. 4.4 requires all students graded or absent. No AC on an in-flight finalize vs. an un-marked absentee, or preservation of a score when absent is toggled on/off.
- **Gap:** No concurrency guard between 4.3 and 4.4; no rule that un-marking absent re-validates finalize eligibility; unclear whether a cleared score is recoverable.
- **Proposed fix:** AC on 4.3/4.4: re-marking absent clears score only with confirmation if a score exists; finalize transaction re-checks that all students are still graded/absent (snapshot vs. live) and aborts with a message if the roster changed.

---

### #5 — HIGH — Timer boundary / duration extremes (0 min, midnight, exact 5:00 & 1:00)
- **Story:** 6.3, 6.1, 3.1, 3.2
- **Edge case description:** Exam duration of 0 (or negative) is accepted at creation; exam start at 23:55 crossing midnight; timer color transition at exactly 5:00 and 1:00 (which side of boundary?); auto-submit at 0:00 while a submission is mid-flight; timezone mismatch between the schedule's local display (AR-6 says UTC storage / TZ-aware display) and the countdown.
- **Current behavior (AC):** 3.1 only requires fields non-blank; 6.3 transitions at "below 5 min" and "reaches 1:00"; 6.1 gates start on "scheduled time has arrived." No AC for zero/negative duration, midnight crossing, or exact-boundary semantics, and 3.2's conflict check must handle durations/offsets spanning midnight and DST.
- **Gap:** No duration validation bounds (min 1 min), no definition of the inclusive/exclusive timer thresholds, no explicit countdown source-of-truth (server time vs. client clock) — critical when a client clock is wrong and drives auto-submit.
- **Proposed fix:** AC in 3.1: duration must be an integer ≥ 1 and ≤ some max; reject 0/negative. AC in 6.3: auto-submit/transition thresholds are explicit (>5:00 green, ≤5:00→<1:01 amber, ≤1:00 red), and countdown bases remaining time on server-issued exam end time (not client clock), with a small grace/buffer defined. 3.2 must compare against absolute UTC instants so midnight/DST spanning is handled.

---

### #6 — HIGH — Offline → online sync ordering and queue depth
- **Story:** 6.4, 6.3, 6.2
- **Edge case description:** A long offline period queues many answers; on reconnect, does the client replay in answer-order or question-order? Conflicting answers (same question re-answered) during the queue — which wins? What if the exam auto-submits (closed) while still offline and the queued answers can no longer be applied? Is the queue bounded (memory) or can it grow unbounded on a many-question exam?
- **Current behavior (AC):** 6.4 flushes local saves on reconnect and banner disappears. No ordering, conflict-resolution, or post-submit-sync AC.
- **Gap:** No queue ordering guarantee, no last-write-wins definition, no behavior when reconnect happens after exam close with undelivered answers.
- **Proposed fix:** AC in 6.4: queue replays in order with last-write-wins per question (server keeps newest timestamp), after exam close the server rejects late syncs and the client drops/notifies, and queue is bounded with a cap for excessive offline accumulation.

---

### #7 — MEDIUM — Zero/empty data across epics — mostly covered, but gaps remain
- **Story:** 2.1, 2.3, 2.5, 3.4, 5.1, 7.1
- **Edge case description:** Empty states exist for 2.1, 2.3, 2.5, 5.1, 7.1 — good. But gaps: an exam with **zero questions** (3.3 allows finishing with none; 6.2 has nothing to answer; 6.3's submit math and 4.1's grading of a zero-question exam are undefined), an exam with a class that has **zero students** (4.1 table empty — can it still be "finalized"? Finalize requires all students graded/absent, vacuously true), and the **empty results with a pending exam** transition in 7.1/7.2.
- **Current behavior (AC):** 3.3 has no minimum-question requirement; 4.4's "all students graded" is vacuously satisfied for an empty class.
- **Gap:** No minimum question count, no definition of grading/finalizing a question-less or student-less exam, empty-state only partially specified.
- **Proposed fix:** AC in 3.3: an exam must have ≥1 question before it's visible to students / before submit; AC in 4.4: define behavior when class has 0 students or exam has 0 questions (block finalize with message, or explicitly allow with a confirmation).

---

### #8 — MEDIUM — Role conflicts beyond 403: student token on teacher-only flows partially covered, but data leakage on shared endpoints
- **Story:** 1.5, 4.1, 7.2
- **Edge case description:** 1.5 covers 403 on role-mismatched endpoint classes. The gap is **horizontal authorization / object-level checks**: a student hitting a teacher-only endpoint's *resource* (e.g., student enumerating other students' scores via graded submissions, or a teacher accessing another teacher's class/exam). Role RBAC ≠ row-level authorization. Also student profile (2.5) exposes a student's results to a teacher — verify only the teacher of that class can view.
- **Current behavior (AC):** 1.5 checks role at route level only.
- **Gap:** No AC verifying an authenticated user can only access resources belonging to their own class/teacher scope; no 404-vs-403 handling to avoid enumeration.
- **Proposed fix:** AC in 1.5 (or a security story): every object-grabbing endpoint verifies ownership/tenancy (teacher only their classes/exams; student only their own results) and returns 404 (to avoid enumeration) or guarded 403; add negative test cases.

---

### #9 — MEDIUM — JWT expiry during exam-taking session
- **Story:** 1.4, 6.1, 6.4
- **Edge case description:** A long exam can outlive the JWT. If the token expires mid-exam, auto-saves fail (401) and the offline banner (6.4) will misleadingly claim "You're offline" when the real cause is an expired session. Submit at expiry can be rejected.
- **Current behavior (AC):** 1.4 redirects to login on expiry; 6.4 treats all save failures as offline.
- **Gap:** No token-refresh story, no distinction between offline vs. expired-session on the save-error path.
- **Proposed fix:** Add refresh-token story or a grace: re-authenticate/refresh silently before expiry; AC on 6.4 to distinguish 401 (session) from network (offline) errors in the banner messaging.

---

### #10 — MEDIUM — Result detail access before grading, and after finalize re-grading
- **Story:** 7.2, 4.4
- **Edge case description:** 7.2 defines pending (un-graded). What if a student has **submitted but the exam isn't graded** — can they view a detail with "Pending"? Covered. But: **can a teacher re-open / change grades after finalize?** 4.4 says "cannot be undone" but gives no mechanism if a teacher discovers an error. Score of **0 on an un-finalized exam** — is 0 a "graded" score or pending? A typed score of 0 must be unambiguous vs. an empty input.
- **Current behavior (AC):** 4.4 finalize is irreversible as stated; 7.2 treats pending vs. finalized; 4.2 treats 0 as a valid entry.
- **Gap:** No post-finalize correction story; no explicit distinction between a stored 0 and an un-entered score at the data layer (null vs 0).
- **Proposed fix:** New story or AC for post-finalize amendment (teacher-only, re-locks disclosure or flags "amended"); AC ensuring score column is NULL until graded (0 is a real grade, empty is NULL).

---

### #11 — MEDIUM — Pagination edge: max students/questions and page 0 default
- **Story:** 2.3, 3.4, 7.1, 1.3
- **Edge case description:** Paginated lists (default 20, AR-5) have no AC for page boundary overflow (asking for page beyond last), 0 results after filtering, or extremely large single-class rosters (dozens of students) in the grading table (4.1) which isn't paginated. Max-sizes for questions/students/exams are undefined anywhere.
- **Current behavior (AC):** Lists paginate; 4.1 grading table has no pagination AC.
- **Gap:** No AC for out-of-range page params, no cap on questions per exam or students per class, grading table scalability.
- **Proposed fix:** AC on paginated stories: out-of-range pages return empty gracefully; define optional caps (e.g., questions per exam) and consider pagination or virtualized rows for the grading table.

---

### #12 — LOW — Student "changing password" story missing
- **Story:** N/A (identity)
- **Edge case description:** PRD has no password-change/reset requirement; 1.4 only covers login and expiry.
- **Current behavior (AC):** None.
- **Gap:** No story for password change/forgot-password.
- **Proposed fix:** New story (low priority / deferred) for password change; at minimum flag as out-of-scope explicitly.

---

### #13 — LOW — Teacher creating a student account (roster maintenance) missing
- **Story:** N/A (roster)
- **Edge case description:** Nothing lets a teacher (or admin) create a student account or add a student to a class. Seed data only provides "at least one class with two students." New students can never be onboarded.
- **Current behavior (AC):** 1.3 seeds students; no creation path.
- **Gap:** No account-provisioning story for students.
- **Proposed fix:** New story (roster/account management) — add student, assign to class; or explicitly scope student provisioning to an admin seed/import story.

---

### #14 — LOW — Teacher viewing exam results (teacher-side aggregate)
- **Story:** N/A (reporting)
- **Edge case description:** Teachers grade per-student but there's no aggregate results view (class average distribution, per-question difficulty) on the teacher side — the summary bar (4.1) only shows progress and average score during grading.
- **Current behavior (AC):** 4.1 has a grading summary bar only.
- **Gap:** No teacher-facing post-finalize results report.
- **Proposed fix:** Optional new story for a teacher results dashboard (average, distribution, per-question pass rate) — defer or confirm 4.4's finalized view extends the report.

---

### #15 — LOW — Start-exam timing frame for late arrival
- **Story:** 6.1
- **Edge case description:** What window allows "Start" once the scheduled time arrives? Can a student start 10 minutes late? Is the exam locked after a grace period? Is Start available during the entire time window?
- **Current behavior (AC):** 6.1 shows Start "when the scheduled time has arrived" and disables before. No end-of-window rule.
- **Gap:** No late-start policy / no-join-after window.
- **Proposed fix:** AC in 6.1 defining the join window (e.g., no Start after duration elapsed or after a fixed grace), aligning with timer source-of-truth.

---

### #16 — LOW — Schedule display / timezone and day-boundary of "Today"
- **Story:** 2.1, 5.1, 2.4
- **Edge case description:** "Today's classes" and "schedule day-of-week" (2.1 uses day-of-week matching) become ambiguous across timezone boundaries and when an exam spans midnight (is an 00:30 AM class part of today?). A class scheduled at 23:50–00:10 crosses day boundary.
- **Current behavior (AC):** 2.1/5.1 filter by day; 1.3/AR-6 stores UTC, displays local.
- **Gap:** No definition of "today" in the user's local timezone as the filter basis, and where a midnight-crossing schedule is assigned.
- **Proposed fix:** AC clarifying "today" is computed in the user's local timezone and a single deterministic rule for classes/exams that span midnight.

---

## Summary Table

| # | Sev | Story(s) | Area |
|---|---|---|---|
| 1 | CRITICAL | 7.2, 4.2, 4.1, 4.4 | Scoring model undefined |
| 2 | CRITICAL | 6.3, 4.2, 4.4, 4.1 | Submit/grading/finalize concurrency |
| 3 | HIGH | 6.3, 6.2, 6.4 | Duplicate submit / answer-after-close |
| 4 | HIGH | 4.3, 4.4 | Absent un-toggle + finalize race |
| 5 | HIGH | 6.3, 6.1, 3.1, 3.2 | Timer boundary / duration extremes |
| 6 | HIGH | 6.4, 6.3, 6.2 | Offline sync ordering/queue depth |
| 7 | MEDIUM | 3.3, 4.4, 7.1 | Zero-question / zero-student exams |
| 8 | MEDIUM | 1.5, 4.1, 7.2 | Object-level authorization gap |
| 9 | MEDIUM | 1.4, 6.1, 6.4 | JWT expiry mid-exam |
| 10 | MEDIUM | 7.2, 4.4 | Post-finalize correction / 0-vs-null |
| 11 | MEDIUM | 2.3, 3.4, 7.1, 1.3 | Pagination / max sizes |
| 12 | LOW | N/A | Student password change missing |
| 13 | LOW | N/A | Student account creation missing |
| 14 | LOW | N/A | Teacher-side results report missing |
| 15 | LOW | 6.1 | Late-start/lock window |
| 16 | LOW | 2.1, 5.1, 2.4 | Timezone/day-boundary of "today" |

---

## Top 5 Edge Cases (ranked by risk)

1. **Scoring model undefined** (critical) — per-question correctness (7.2) vs. free-form manual score (4.2) never reconciled.
2. **Submit vs. finalize concurrency** (critical) — late-arriving submissions, stale grading, two editors on one grading table.
3. **Duplicate/edge-of-deadline submit** (high) — no idempotency, no server-side close, answers saved after snapshot.
4. **Timer boundaries & source of truth** (high) — 0-min duration, midnight crossing, 5:00/1:00 exact boundaries, client-clock-driven auto-submit.
5. **Offline sync ordering/depth** (high) — replay order, last-write-wins, and sync-after-close semantics unspecified.

---

*File generated by boundary/edge-case sweep.*
