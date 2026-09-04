---
name: SchoolDesk
status: final
created: 2026-09-03
updated: 2026-09-04
sources:
  - {planning_artifacts}/prds/prd-getting-start-bmad-2026-09-03/prd.md
  - {planning_artifacts}/architecture/architecture-getting-start-bmad-2026-09-03/ARCHITECTURE-SPINE.md
---

# SchoolDesk — Experience Spine

> Desktop-first responsive web for a Student Management System. Two distinct user worlds — Teacher and Student — with separate navigation, surfaces, and microcopy. `DESIGN.md` is the visual identity reference (Modern & Minimal direction: cool slate surfaces, crisp blue single accent, one modern sans-serif display). This spine is the experience.

## Foundation

Desktop-first responsive web, responsive down for basic usability on tablets and phones. Two user roles with completely separate sidebar/navigation worlds: Teacher and Student. Top nav provides primary navigation; sidebar is implicit via the top nav items in each role. A user logs in as either Teacher or Student — they never see the other role's surfaces. `DESIGN.md` is the visual identity reference (Modern & Minimal tokens: cool slate background, clean white surfaces, crisp blue primary, one modern sans-serif family for display and body). This spine is the experience. Single-tenant per school; teachers manage classes they are assigned to, students see only their enrolled classes and personal data.

**Glossary & naming (imported from PRD §3).** Class, Student, Teacher, Exam, Test, Question, Score, Schedule, Result all carry the PRD's definitions. **Exam ≡ Test for UX purposes** — the two are functionally identical and share the same surfaces and copy; "Test" is a semantically smaller assessment (a quiz), never a different flow. Journey personas use these canonical names: **Mr. Chen** (teacher) and **Alex Rivera** (student). These names/pronouns are used verbatim everywhere; no drift from source.

## Information Architecture

**Teacher World** — data-dense, class-management focus.

| Surface | Reached from | Purpose |
|---|---|---|
| Dashboard | App open / top nav "Dashboard" | Overview: upcoming exams, recent grading activity, class summaries |
| Classes | Top nav "Classes" | List of classes teacher is assigned to |
| Class Detail | Classes row | Student roster, schedule, exams for that class — tabbed sub-nav (Students, Schedule, Exams) |
| Students | Top nav "Students" | All students across classes, searchable |
| Exams | Top nav "Exams" | List of exams created, status (draft, open, closed, finalized) |
| Grading | Exams row / "Grade" action | Inline score entry per student, absent toggle, progress stats |
| Results | Top nav "Results" | Aggregated results per exam, class averages, breakdowns |

**Student World** — reassuring, schedule-driven focus.

| Surface | Reached from | Purpose |
|---|---|---|
| Dashboard | App open / top nav "Dashboard" | Today's classes, upcoming exams, recent results |
| Schedule | Top nav "Schedule" | Full weekly class schedule |
| Exams | Top nav "Exams" | Upcoming and available exams, countdown timers |
| Exam Taking | Exams "Start" button | Full-screen focused exam mode (separate from normal nav) |
| Results | Top nav "Results" | Personal exam results, question-by-question breakdown (post-finalize) |

→ Composition reference: `mockups/key-screens-1.html`. Spine wins on conflict.

## Voice and Tone

Calm, measured, professional microcopy. Brand voice and aesthetic posture live in `DESIGN.md`.

| Do | Don't |
|---|---|
| Teacher: "25 of 28 graded · Average score: 78.3%" | "You have graded 25 students out of 28 total students." |
| Teacher: "Biology Midterm — Grading" | "Welcome to the Exam Grading Interface!" |
| Student: "You're doing great" | "Excellent work, keep it up! 🎉" |
| Student: "All done, Alex!" | "You have successfully completed the exam." |
| Error: "Something went wrong loading your classes — try again." | "Error 500: Internal Server Error. Contact support." |
| Empty: "No classes scheduled today — enjoy the break." | "No data available. Please add classes." |
| Pending badge: "Pending" | "Awaiting Grading Processing..." |
| Finalize helper: "Finalizing unlocks the correct answer breakdown for students." | "Warning: This action is irreversible." |
| Greeting: "Welcome back, Alex" | "Good morning! Here is your dashboard overview." |
| Timer warning: "5 minutes left" | "ALERT: Time is running out!" |

## Component Patterns

Behavioral. Visual specs live in `DESIGN.md`.

| Component | Use | Behavioral rules |
|---|---|---|
| class-card | Teacher Classes list | Shows class name, teacher name, schedule (e.g. "Mon / Wed / Fri 09:00"), student count, next exam. Click opens Class Detail. Hover tints to `{colors.background}` (no elevation change). |
| student-roster-table | Teacher Class Detail (Students tab) | `data-table` visual; columns: Name, Student ID, Enrolled Since, Actions (View). Search input above filters by name. Hover row reveals subtle highlight. |
| exam-card | Teacher Exams list, Student Exams list | Shows exam name, date/time, class association, status badge. Teacher sees grading progress; student sees countdown ("3 days away") or "Start" button. Reflects five states: upcoming, in-progress, submitted, expired, graded — only "upcoming" gets a Start button. |
| grading-table | Teacher Grading view | `data-table` visual; columns: Name, Score (inline input for ungraded, display for graded), Status badge (Graded/Pending/Absent), Actions (Save/View). Summary bar at bottom with grading progress and average. Finalize button (disabled until all graded). Absent toggle disables score input for that row. Score input validates: integer 0–100, inline error on out-of-range/non-numeric. |
| exam-taking-interface | Student Exam Taking (focused full-screen) | Fades in from normal nav. Timer top-right with color transitions (green → amber at 5min → `{colors.danger}` at 1min). Progress bar with milestone messages ("Halfway there!", "Just 5 more!"). Each answer auto-saves with checkmark indicator. Question navigation sidebar `<nav aria-label="Question navigation">` with `<ol>`; current question `aria-current="true"`, answered `aria-label="Question n, answered"`. Submit button with confirmation. **Focus is trapped inside the exam surface** while full-screen. |
| results-detail | Student Results detail | Score display (large number + percentage), status badge, question-by-question breakdown (Q label, question text, your answer, correct/incorrect indicator, expected answer if incorrect). Callout note when teacher has finalized ("Your teacher has finalized these results — full correct answer breakdown is now available."). |
| confirm-dialog | Teacher Grading, on Finalize click | `confirm-dialog` visual; modal confirmation: "Finalize grades for Biology Midterm?" with explanatory text, Confirm and Cancel. **On open, focus moves to Cancel (safest); on close, focus returns to the trigger.** Focus is trapped within the dialog. Also used for exam submit confirmation, where it lists unanswered question count: "Submit your exam? You've answered 28 of 30 questions." |
| empty-state | Anywhere | Direct, not apologetic. `display-sm` heading, `text-muted` body below, single primary action. Example: "No classes scheduled today — enjoy the break." |
| skeleton | Anywhere on cold load | Shimmer rows matching expected layout shape. Resolves on data load. No text content. Container gets `aria-busy="true"`; a "Loading…" status is announced via `aria-live="polite"` so screen-reader users know content is fetching. |
| toast | Global (success feedback) | Auto-dismiss after 3s, bottom-center, pauses on focus/hover (10s cap). Used for: save confirmation ("Grade saved for Morgan Lee"), exam submitted ("All done, Alex!"), settings changed. Non-blocking. Focus returns to the previously-focused element on dismiss. |
| inline-banner | Global (error feedback) | Destructive variant, inline below the triggering element (not modal). "Something went wrong loading your classes — try again." with retry action. Errors announced via `aria-live="assertive"`. |
| exam-question-card | Student Exam Taking | `exam-question-card` visual: left Q-label, question text, options. Uses native `<input type="radio">` with associated `<label>`; selected state via standard radio semantics plus the visual checkmark. Correct/incorrect right-aligned; expected answer below when incorrect. |
| progress-bar | Student Exam Taking | `progress-bar` visual: thin primary bar over `{colors.border}` track. Milestones ("Halfway there!", "Just 5 more!") announced via `aria-live="polite"` at 50/75/90/100% thresholds. `aria-valuenow/min/max` set. |
| timer | Student Exam Taking | `timer` visual: tabular-nums readout. Announces via `aria-live="assertive"` at the 5-minute and 1-minute remaining thresholds (polite at 60s intervals before that). Color is never the only cue — the interval announcement accompanies each color change. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold load (all surfaces) | Any | Skeleton shimmer rows matching expected layout. `aria-busy` + "Loading…" announced. Resolves on data fetch. |
| Empty — no classes | Teacher Classes, Student Dashboard | Warm message: "No classes scheduled today — enjoy the break." No clinical "no data" text. |
| Empty — no exams | Teacher Exams, Student Exams | "No exams on the horizon. Enjoy the quiet." with optional create button (teacher only). |
| Empty — no results | Teacher Results, Student Results | Teacher: "No graded exams yet. Results will appear here after you finalize grades." Student: "No results yet — your scores will appear here after your teacher grades your exams." |
| Error — fetch failure | Any | Inline banner below the content area (not modal). "Something went wrong loading your classes — try again." with retry link, `aria-live="assertive"`. |
| Success — save | Grading, Exam Taking | Toast auto-dismiss 3s: "Grade saved for Morgan Lee." / "All done, Alex!" |
| Pending — not yet graded | Grading Table | Muted amber badge: "Pending". Score input enabled, inline text field with placeholder "__". |
| Absent — student absent | Grading Table | Toggle switch flipped on, row muted. Score input disabled and cleared. Badge: "Absent" in muted red. "Mark Absent" button toggles state. |
| Finalized — grades locked | Grading Table, Student Results Detail | Grading: Finalize button becomes disabled/locked state with helper text. Student Results: full question breakdown unlocked, note callout confirms teacher has finalized. |
| Exam — in progress | Student Exam Taking | Timer counting down, progress bar advancing, checkmarks on answered. Auto-save on each selection. Focus trapped within exam surface. |
| Exam — submitted | Student Exam Taking | Transition back to normal nav. Toast: "All done, Alex!" Focus moves to the Results page heading on redirect. Redirects to Results. |
| Exam — time expired / auto-submitted | Student Exam Taking | Timer hits zero (including while a submit-confirm dialog is open — the dialog auto-closes). Auto-submits whatever was answered. `aria-live="assertive"` announces "Time is up. Your exam has been submitted." Focus moves to the Results heading on redirect. |
| Exam — conflict | Student Exam Taking | Inline warning below the form, not modal. `aria-live="assertive"` on appearance. Does not interrupt the exam flow. |
| Offline — connection lost | Exam Taking, Grading, Any fetch | Inline banner (not modal): "You're offline. Trying again automatically when you reconnect." Reconnects via retry-on-reconnect (no local queue in v1, per architecture AD-9); grading entries and exam answers retry on reconnect. If a timed exam expires while offline, the server-authoritative timer auto-submits what was saved on reconnect. |
| Login — invalid credentials | Login | Inline error below the form, `role="alert"`, focus moves to the error on failed submit. "Invalid username or password." |
| Permission denied — wrong role | Any gated surface | Server returns 403 on API; client redirects to the user's own dashboard and shows a toast: "You don't have access to that page." A student never sees teacher surfaces and vice versa (FR-24). |
| Session expired — mid-use | Any | Redirect to login with toast: "Session expired — please log in again." |

## Interaction Primitives

**Keyboard support:**

- `Tab` — Move between interactive elements in logical reading order on every surface.
- `Enter` / `Space` — Activate buttons, toggle switches, select radio/checkbox options.
- `Escape` — Close dialogs, dismiss toasts, exit exam full-screen mode (with confirmation).
- `Arrow keys` — Navigate between questions **only within the exam question sidebar list**; once focus is in a question's answer options, arrow keys operate the radio buttons (`Tab` moves between the sidebar zone and the question zone).
- `Tab` / `Enter` in Grading — Move to next student's score input after saving (inline workflow, no page reload). `Escape` inside a score input reverts the in-progress edit and moves focus to the row's action area.

**Mouse interactions:**

- Click to act — table rows, cards, buttons, toggles.
- Hover reveals subtle row highlight on data tables (`md+` viewports).
- Exam launch fades to full-screen mode (CSS transition, not instant snap).

**Banned everywhere:**

- No modal stacks deeper than one level (never dialog-on-dialog).
- No hover-only affordances on `sm` viewports.
- No infinite scroll — pagination only for large lists.
- No pop-up confirmations for routine saves (auto-save + toast).
- No celebratory animations or gamification elements.
- No drag interactions in v1.
- No modal for exam conflict warnings — inline banner only.

## Accessibility Floor

- WCAG 2.2 AA contrast across the entire surface. Blue-on-slate (`#2563EB` on `#F8FAFC`) verified at 4.94:1. Muted text (`#475569`) verified ≥4.5:1 on every surface, including the exam surface (≈6.9:1). Timer warning and all badge/tinted pairs verified at 4.5:1+ (`{colors.danger}` `#B91C1C`, badge text `{colors.warning}`/`{colors.danger}`/`{colors.success}`).
- Visible focus ring on all interactive elements — blue ring against white/slate background, clearly distinguishable.
- **Lang & structure:** `lang` is set on `<html>`; each surface has exactly one `h1`; heading hierarchy `h1 → h2 → h3`, never skipped. Top nav = `<nav aria-label="Primary">`, main content = `<main>`, sidebar = `<nav aria-label="Secondary">` (retained at lg).
- Semantic HTML for all tables (`<table>`, `<thead>`, `<tbody>`, **`<th scope="col">` for column headers, `<th scope="row">` for row headers**), forms (`<label>`, `<fieldset>`), and tab navigation (`role="tablist"`, `role="tab"`, `role="tabpanel"`).
- ARIA: timer (`aria-live`), progress bar (`aria-valuenow/min/max`), status badges (`aria-label`), question navigation sidebar (`<nav aria-label="Question navigation">` + `<ol>`, `aria-current` + `aria-label="Question n, answered"`), and exam full-screen **without** `role="application"` (standard landmarks and radio semantics are used instead — see Interaction Primitives below).
- **Focus management:** exam full-screen mode **traps focus** inside the exam surface (Tab cycles within, releases only on confirmed exit); non-exam background content is inert while full-screen. Modals move focus to Cancel on open and return focus to the trigger on close. After exam submit redirect, focus moves to the Results page heading. Toasts save and restore focus. On route change, focus moves to the page `h1`.
- Full keyboard support for exam-taking: arrow keys navigate questions within the sidebar list, `Enter`/`Space` select answers, `Tab` moves between zones, `Escape` exits (with confirmation).
- **Timer announcements:** `aria-live="polite"` at 60-second intervals; `aria-live="assertive"` at the 5-minute and 1-minute remaining thresholds (and on auto-submit: "Time is up. Your exam has been submitted."), so color change is never the only cue.
- **Loading:** skeleton containers use `aria-busy="true"` and announce "Loading…" via `aria-live="polite"`; loading is never silent for screen-reader users.
- Errors surface via `aria-live="assertive"` on inline banners; grading-table errors associate with the offending input via `aria-describedby`/`aria-errormessage`.
- `prefers-reduced-motion` respected: all transitions (exam fade-in, toast dismiss, skeleton shimmer) are disabled; content appears instantly; skeletons resolve to loaded content without shimmer or fade.
- Tab order matches visual reading order on every surface. `Esc` always closes the topmost overlay (dialog, menu, full-screen exam with confirmation).

## Responsive & Platform

| Breakpoint | Behavior |
|---|---|
| `lg` (1024px+) | Full layout. Top nav with all items visible. Data tables show all columns. Two-column widget grid on student dashboard. Grading table with all columns including inline inputs. |
| `md` (768–1023px) | Top nav condenses — "Students" and "Results" may move to a dropdown. Data tables stack to card layout on narrow `md`. Grading inline inputs remain functional but compact. Exam-taking full-screen works as designed. |
| `sm` (< 768px) | Basic usability only. Top nav becomes hamburger menu. Tables become card stacks. Grading view stacks to one student at a time. Exam-taking remains full-screen and functional (primary use case is tablet/desktop). |

SchoolDesk is responsive web, not a native mobile app. The primary surface is desktop/laptop for teachers, and tablet/laptop for students taking exams. Phones support read-only browsing of dashboards and results.

**Platform guarantees:**
- **Touch targets:** at `sm`, all interactive elements meet a minimum 44×44px hit area; small dense elements (inline score inputs) that are below 44px at `lg` must enlarge at `sm`. Badges are informational-only and never interactive (if any badge ever becomes a control it must grow to 44×44px).
- **Dark mode:** not supported in v1 (see DESIGN.md "Light mode only"). Set `color-scheme: light`; no `-dark` tokens.
- **High contrast:** Windows High Contrast / forced-colors strips custom colors — all state indicators (badges, timer, absent toggle) carry a non-color cue (icon/text label) so they survive.
- **Zoom:** layout reflows without horizontal scroll at 200% zoom (WCAG 1.4.4). Verify at the 1200px max-width + 32px padding combination.
- **Print:** grading summaries and results are printable as-is; no dedicated print stylesheet in v1.

## Inspiration & Anti-patterns

- **Lifted from Google Classroom:** the class-centric information architecture — classes as the primary organizing unit for teachers, with students nested inside.
- **Lifted from Canvas LMS:** the exam-taking focused mode, timer with color transitions, and question-by-question navigation sidebar.
- **Lifted from Notion:** inline-editable score inputs in the grading table — click to edit, tab/enter to next student, no separate edit mode.
- **Lifted from Linear:** the two-world navigation pattern — teacher and student get entirely separate top-nav surfaces, not a role-switcher.
- **Rejected — Gamification (streaks, badges, achievements):** SchoolDesk is an academic tool, not a habit app. No celebratory animations, no "🎉 5-day streak!" toasts.
- **Rejected — Chat or messaging between teacher/student:** Out of scope. SchoolDesk surfaces data and exams, not communication.
- **Rejected — Modal-heavy grading workflow:** Grading is a high-volume task. Modals would interrupt flow. Inline editing with auto-save and toast confirmation keeps the teacher in the zone.
- **Rejected — Role-switcher toggle:** Teacher and Student are completely separate logins, not a single user toggling between views. This keeps the IA clean and avoids confusion.

## Key Flows

### Flow 1 — Mr. Chen grades a midterm (Tuesday evening, 8:15pm) — realizes UJ-4 / FR-10–13

1. Mr. Chen opens SchoolDesk in his browser. Dashboard loads with skeleton shimmer, then resolves: "Welcome back, Mr. Chen." Shows upcoming class tomorrow and a grading summary.
2. He clicks "Exams" in the top nav. Exam list loads — he sees "Biology Midterm" with status "25 of 28 submitted." He clicks the "Grade" action.
3. Grading view loads: "Biology Midterm — Grading. 28 students, 25 submitted, 3 pending." The table shows Alex Rivera graded (85/100, green badge), Morgan Lee pending (amber badge, empty score input), Taylor Swift absent (toggle on, score disabled).
4. **Climax:** Mr. Chen clicks Morgan Lee's score input, types "72", hits Enter. The row auto-saves (toast: "Grade saved for Morgan Lee"), focus jumps to Jordan Kim's score input. He types "81", hits Enter — toast confirms. He repeats for Casey Chen: "88", Enter, toast. Three students graded in under 30 seconds without leaving the keyboard.
5. Summary bar updates live: "28 of 28 graded · Average score: 79.1%." The "Finalize Grades" button is now enabled.
6. He clicks "Finalize Grades." Confirm dialog appears: "Finalize grades for Biology Midterm? This will unlock the correct answer breakdown for all 28 students. This cannot be undone." He clicks Confirm.
7. Toast: "Grades finalized." Summary bar shows locked state with helper text: "Finalizing unlocks the correct answer breakdown for students." All students can now see their full results.

Failure: Auto-save fails for Morgan Lee → inline banner below her row: "Couldn't save — try again." Score input retains the value; clicking retry re-sends.

### Flow 2 — Alex Rivera takes the Biology Midterm (Friday morning, 8:00am) — realizes UJ-5 / FR-17–20

1. Alex opens SchoolDesk. Student dashboard loads: "Welcome back, Alex." Today's Classes widget shows Biology 101 at 09:00. Upcoming Exams shows "Biology Midterm — Today 08:00" with a "Start" button.
2. Alex clicks "Start." The screen fades to the full-screen exam-taking interface. Timer appears in the top-right corner (45:00, green). Question 1 is displayed with four radio options.
3. Alex selects option B. A small checkmark appears next to the question in the sidebar. Auto-save fires. Toast (non-blocking): checkmark indicator only. She moves to Question 2.
4. **Climax (midpoint):** Alex reaches Question 15 of 30. Progress bar shows "Halfway there!" Timer shows 22:30, still green. She's in the zone — sidebar shows 15 checkmarks, 15 empty. She keeps going.
5. Timer drops to 5:00 — color transitions to amber, screen reader announces "5 minutes remaining" via `aria-live="assertive"`. At 1:00, it transitions to `{colors.danger}` red with the same assertive announcement.
6. Alex clicks "Submit." Confirmation dialog: "Submit your exam? You've answered 28 of 30 questions." She confirms.
7. Toast: "All done, Alex!" Screen fades back to normal nav. Results page loads showing "Biology Midterm — Your Results" with status "Pending" (awaiting teacher grading). Score shows as "— / 100" until Mr. Chen grades and finalizes.

Failure: Network drops during exam → inline warning below the form (not modal): "You're offline. Trying again automatically when you reconnect." Auto-save retries on reconnect (retry-on-reconnect, no offline queue in v1 per architecture AD-9). If the timer expires while offline, the server-authoritative timer auto-submits what was saved on reconnect. Exam continues uninterrupted.

### Flow 3 — Mr. Chen checks his day at a glance (Monday morning, 7:30am) — realizes UJ-1 / FR-1–2

1. Mr. Chen opens SchoolDesk and lands on the Teacher Dashboard. It loads with skeletons, then resolves.
2. He sees today's four classes as a timeline of class-cards: Biology 101 (09:00, 28 students), Chemistry (10:15, 24), Algebra (13:00, 31) — each with student count and next exam.
3. **Climax:** All four classes, with counts and times, are visible in one glance — no spreadsheet tabbing.
4. He clicks Biology 101 and lands on Class Detail.
5. He returns via top nav to the Dashboard.

Failure: If no classes are scheduled today, the dashboard shows the empty state "No classes scheduled today — enjoy the break."

### Flow 4 — Mr. Chen reviews a student before conferences (Wednesday, 4:00pm) — realizes UJ-2 / FR-3–5

1. Mr. Chen opens SchoolDesk, clicks "Classes", then Biology 101 → the Students tab.
2. He types "Alex" into the roster search and the `student-roster-table` filters to one row.
3. **Climax:** He clicks Alex Rivera → the student profile shows name, ID, contact info, enrolled classes, and exam/history at a glance.
4. He backs out to the Class Detail.

Failure: A student with no results yet shows the "No results yet" empty state on the profile's results section.

### Flow 5 — Mr. Chen schedules a midterm (Monday, 10:00am) — realizes UJ-3 / FR-6–9

1. Mr. Chen clicks "Exams" → "Create Exam".
2. He fills the form: title "Biology Midterm", class Biology 101, date/time, duration. Saves.
3. **Climax:** The exam is saved and appears in both his Exams list and Alex's upcoming exams for Biology 101.
4. He clicks into the exam to add questions (multiple-choice / true-false).

Failure: If the time overlaps an existing exam for the same class, an inline conflict warning appears and the save is blocked (FR-7); the form retains his inputs so he can adjust.

### Flow 6 — Alex Rivera checks her midterm result (Friday evening, 6:00pm) — realizes UJ-6 / FR-21–22

1. Alex opens SchoolDesk → Results.
2. She sees the list of graded exams with scores; "Biology Midterm — 85 / 100" shows a Graded badge.
3. **Climax:** She taps it and sees the score, status, and the unlocked question-by-question breakdown (correct answers now visible because Mr. Chen finalized).
4. She returns to the Results list to check the next one.

Failure: If Mr. Chen hasn't graded yet, the result shows "Pending" with a "— / 100" score (as in Flow 2, step 7).
