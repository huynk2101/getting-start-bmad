# Edge Case Review — SchoolDesk

## Overall verdict
The spines are well-structured with a clear two-world IA, thoughtful component specs, and a few key flows. However, they leave substantial gaps in empty states for less-common surfaces, error handling beyond fetch/auto-save, race conditions in concurrent grading, permission boundary behavior, offline sync conflict resolution, and data boundary cases. The "happy path" is well-covered; the "everything else" is not.

## Findings by category

### Missing States — thin
- **high** Teacher with zero classes ever (first-time teacher login, no Classes surface exists to navigate to). *Fix:* Define a first-run empty state on Dashboard: "You don't have any classes yet. Contact your admin to get started."
- **high** Class Detail tab with zero students / zero exams / no schedule. Each tab needs its own empty state. *Fix:* Define per-tab empty copy ("No students enrolled yet" / "No exams scheduled" / "No schedule configured").
- **high** Student global search returning zero results. *Fix:* Inline empty state below search bar: "No students match your search."
- **medium** Student profile with zero exam results. *Fix:* Define empty state on Results section of profile ("No results yet — this student hasn't taken any exams.").
- **medium** Exam with zero submissions (all students pending, none submitted). *Fix:* Grading table should show all students in Pending state; define "No submissions yet" summary stat.
- **medium** Student Schedule with no classes enrolled. *Fix:* Empty state: "You're not enrolled in any classes yet."
- **low** Exam already submitted / already expired / already in-progress when student reaches Exams list. *Fix:* Exam card should reflect five states: upcoming, in-progress, submitted, expired, graded — only "upcoming" gets Start button.
- **low** Results list with zero entries (student has taken no exams or none graded). *Fix:* Empty state: "No results yet — your scores will appear here after your teacher grades your exams."

### Error Paths — thin
- **high** Exam submission failure (network drops on final Submit, not just auto-save). Student sees confirmation but server never receives it. *Fix:* Define retry UX — "Submission failed. Retry" inline banner with the submit action preserved. Do not redirect to Results.
- **high** Finalize failure (network drops after teacher confirms finalize). Grades may be partially saved. *Fix:* Inline banner: "Finalize failed. Your grades are saved but not finalized. Try again." Prevent student-side breakdown unlock until finalize succeeds.
- **high** Session expiry mid-use (any surface). PRD says "session maintained until logout" but sessions time out. *Fix:* Define expired-session redirect to login with a "Session expired — please log in again" toast.
- **medium** Score input validation: negative numbers, >100, non-numeric, decimal values. *Fix:* Define input constraints in Grading component: min 0, max 100, integer only, inline validation message.
- **medium** Exam creation failure (network drops on save). *Fix:* Unsaved form state preserved, inline error with retry.
- **medium** Student trying to start exam after the time window has closed. *Fix:* "Start" button should not appear once exam window closes. If student is already on the page, show inline banner: "This exam is no longer available."
- **medium** Auto-submit failure when timer expires. *Fix:* Define fallback: local queue + retry toast, with a "Submit failed — your answers were saved locally" banner.
- **low** Login failure (invalid credentials). PRD FR-23 mentions this but the UX spine has zero login surface definition. *Fix:* Define login screen states: empty form, loading, error ("Invalid username or password"), rate-limited.

### Empty States — thin
- **high** "No exams on the horizon" is defined for teacher and student Exams list, but no empty state is defined for the teacher Results surface (what if no exams have been graded yet). *Fix:* "No graded exams yet. Results will appear here after you finalize grades."
- **medium** "No classes scheduled today" is defined but only for Dashboard. The Schedule surface (student) has no empty state defined. *Fix:* "No classes scheduled — check back later."
- **medium** Grading table when all students are absent (all toggles on, no scores to enter). *Fix:* Summary bar should read "All students marked absent" and Finalize should still be available (or not, depending on policy — define it).
- **low** Exam taking surface: no state defined for "exam has zero questions" (teacher-created exam with no questions added). *Fix:* Prevent student from starting; teacher sees "Add questions before students can start" on Exam detail.

### Permission & Role Boundaries — broken
- **critical** No definition of what happens when a student navigates to a teacher URL (or vice versa). The spine says "they never see the other role's surfaces" but defines no redirect, 403 page, or routing guard behavior. *Fix:* Define: server-side 403 on API; client-side redirect to own dashboard with toast "You don't have access to that page."
- **high** No definition of unauthorized access to exam-taking URL by wrong student (student B opens student A's exam link). *Fix:* Server rejects; client shows "This exam is not available to you."
- **medium** No definition of what the login screen looks like or how role-based redirect works post-login. *Fix:* Define login surface and post-login routing (teacher → Teacher Dashboard, student → Student Dashboard).

### Race Conditions & Concurrency — thin
- **high** Two teachers grading the same exam simultaneously. Grades could overwrite each other. *Fix:* Define optimistic locking or last-write-wins with a conflict banner ("Another teacher has updated grades since you loaded this page. Refresh to see latest.").
- **high** Exam timer expires while student is on the submit confirmation dialog. The confirm dialog is open, timer hits zero. *Fix:* Auto-close dialog, auto-submit whatever is answered, show toast: "Time expired — your exam was submitted."
- **medium** Student submits exam while teacher is actively finalizing grades. If finalize completes first, student's submit sees finalized state; if submit completes first, teacher's finalize includes the new submission. *Fix:* Define ordering — submission is always accepted; finalize reads latest state at confirmation time.
- **medium** Teacher finalizes while student is viewing results (not yet finalized). Student's page suddenly shows correct-answer breakdown mid-view. *Fix:* Require student to refresh or poll; or show a subtle "Results have been updated" banner.
- **low** Browser tab conflict: student opens exam in two tabs. *Fix:* Lock exam to one tab via localStorage flag; second tab shows "Exam is already open in another tab."

### Data Edge Cases — thin
- **high** Pagination behavior for large lists (Classes, Students, Exams, Results). Spine says "pagination only" but defines no page size, no UI for pagination controls, no behavior on search + paginate. *Fix:* Define page size (e.g., 25 rows), pagination controls (prev/next/page numbers), and search filtering within paginated results.
- **medium** Very long class/exam names overflowing card or table cell. *Fix:* Define truncation strategy: ellipsis on single-line with title attribute on hover.
- **medium** Score display edge cases: score of 0 ("0 / 100"), score of 100 ("100 / 100"). Both should display cleanly. *Fix:* Ensure score display handles zero-padding and alignment (tabular-nums is defined, good).
- **medium** Very many questions in exam-taking sidebar. 50+ questions could overflow the sidebar scroll. *Fix:* Define sidebar scroll behavior with sticky current-question indicator.
- **low** All students absent for an exam. Summary bar shows "0 graded · 0 average" which is misleading. *Fix:* "All students marked absent" — suppress average calculation.
- **low** Special characters or very long student names in roster table. *Fix:* Same truncation strategy as class names.

### Timing Edge Cases — thin
- **high** Exam starts while student is on the page but hasn't clicked Start yet. Student is on Exams list, exam window opens. *Fix:* Define whether Start button appears dynamically (polling/websocket) or requires a page refresh. Polling at 30s intervals or push notification.
- **high** Toast dismiss overlapping with new toast (e.g., grade save toast + finalize toast). *Fix:* Define toast queue: new toast replaces existing toast, or stack with max 2 visible.
- **medium** Network drop during exam submit (in-flight request). *Fix:* Same as submission failure above — retry with preserved state.
- **low** Auto-save fires at same moment as manual page navigation away from exam. *Fix:* Use beforeunload guard to warn "You have unsaved answers. Leave anyway?"

### Offline/Sync — thin
- **high** Offline during grading. Teacher enters scores while offline; auto-save queues locally but there's no defined offline banner or local storage for grading. *Fix:* Define: grading auto-save should queue locally with the same offline banner pattern as exam-taking. Show "You're offline. Grades will sync when you reconnect."
- **high** Conflict resolution when connection returns after offline exam-taking. What if teacher finalized the exam while student was offline? *Fix:* On sync, if exam is finalized, show student a banner: "Your teacher has finalized this exam while you were offline." Do not allow further edits.
- **medium** Offline during dashboard load. *Fix:* Show cached data if available; otherwise show error banner with retry. Define whether dashboard data is cached.
- **medium** Multiple queued grading saves on reconnect. If teacher saved 10 grades offline, do they all sync sequentially? *Fix:* Define sync strategy: batch upload with progress toast, or sequential with individual confirmation.
- **low** Offline duration limit. If student is offline for hours during a timed exam, what happens? *Fix:* Timer is server-authoritative; if student reconnects after expiry, exam is auto-submitted with whatever was saved.

### Browser/Platform — thin
- **medium** Dark mode. The warm paper palette (#FAF8F5 background) will look jarring in dark mode. *Fix:* Define whether dark mode is supported (toggle in settings?) or explicitly blocked (force light mode via `color-scheme: light`).
- **medium** High contrast mode. Winows High Contrast Mode will strip the custom colors. *Fix:* Ensure all state indicators (badges, timer color) have non-color cues (icons, text labels).
- **medium** Zoom to 200% (WCAG 1.4.4). The 1200px max-width with 32px padding may cause horizontal scroll at high zoom. *Fix:* Verify layout reflows at 200% zoom. Define: no horizontal scroll at 200%.
- **low** Print stylesheets. Teacher may want to print grading summary or results. *Fix:* Define print behavior (or explicitly "not supported in v1").
- **low** Safari-specific: CSS full-screen mode for exam-taking may behave differently. *Fix:* Test and define fallback (maximize content area without true full-screen API).

## Summary
- Critical: 1
- High: 12
- Medium: 17
- Low: 12

**File:** `D:\huyn\project\getting-start-bmad\_bmad-output\planning-artifacts\ux-designs\ux-getting-start-bmad-2026-09-03\review-edge-cases.md`
