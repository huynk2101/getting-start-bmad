---
id: SPEC-story-2-1
companions: []
sources: 
  - ../../planning-artifacts/epics.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 2.1 — Teacher Daily Class Overview

## Why

As a teacher, they need a clear at-a-glance view of their daily schedule when they log in. This story provides a dashboard displaying all classes scheduled for their local "today," including class name, time, and student count, anchoring their daily workflow in the SchoolDesk platform.

## Capabilities

- **CAP-1**
  - **intent:** Teacher can view a dashboard showing a personalized greeting and all classes scheduled for their local 'today'.
  - **success:** Authenticated teacher lands on dashboard and sees "Welcome back, [First Name]" along with cards for each class scheduled for today (matching the day-of-week).

- **CAP-2**
  - **intent:** Teacher sees a clear, friendly empty state if no classes are scheduled for today.
  - **success:** Teacher with no classes today sees the message "No classes scheduled today — enjoy the break."

## Constraints

- Today's date is determined strictly by the user's browser local timezone, not the server timezone.
- The UI must use Georgia serif for the greeting and apply the Book Binder visual direction including a subtle background tint on class card hover (lg/md breakpoints) (UX-DR1).
- Data loading states must use skeleton shimmer placeholders matching the layout (UX-DR5).
- No spinners or generic loading indicators.

## Non-goals

- Showing the teacher's schedule for future or past days on this specific widget (handled by a future full-schedule view).
- Interacting with the class cards to navigate to class details (navigation is covered in Story 2.2).

## Success signal

- A teacher can log in, view the dashboard, and instantly verify how many classes they have today and when they occur, rendered with the correct typography and loading states.
