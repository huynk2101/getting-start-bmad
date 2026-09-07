# Epic 2 Context: Teacher Dashboard & Class Management

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Deliver the teacher's daily class overview, class detail view with dashboard navigation and student roster, full class list, and individual student profile — the core class-management surface.

## Stories

- Story 2.1: Teacher Daily Class Overview
- Story 2.2: Class Detail View
- Story 2.3: Class List
- Story 2.4: Student Profile View

## Requirements & Constraints

- Today's classes are determined by the user's local browser timezone, not the server timezone.
- The student list on the class detail view must be searchable in real-time.
- All lists must be paginated (default page size 20) using offset-based pagination for student rosters.
- All tables must use semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th scope>`).
- Focus management and keyboard navigation (Tab, Enter) must match visual reading order and allow navigation into class details.
- `prefers-reduced-motion` must be respected (disabling animations/shimmers).

## Technical Decisions

- The SPA is built with React 19 + Vite 6 and managed with TanStack Query (no Redux/Zustand for server state).
- The Express backend uses Prisma with a PostgreSQL database.
- A class's `Schedule` models its recurring day/time slots and belongs to a `Class`. This is the single source for rendering "today's classes".
- Timestamps are stored in UTC, timezone-aware at the API layer, and displayed locally.
- All API errors return a consistent envelope: `{ "error": { "code": "STRING", "message": "STRING" } }`.
- Shared DTO shapes are published in the `sms-shared` package.

## UX & Interaction Patterns

- Apply Book Binder visual direction (warm paper, muted indigo, leather brown, Georgia serif headings, system sans-serif body).
- Use three-tier radius system: 4px inputs, 8px cards/buttons, 9999px badges.
- Use skeleton shimmer placeholders matching the layout for all loading states (no spinners).
- Provide clear, direct empty states (e.g., "No classes scheduled today — enjoy the break.").
- Teacher and student navigation must be completely separate (no role-switcher).
- Hover effects applied to class cards on lg/md breakpoints (subtle background tint).

## Cross-Story Dependencies

- Relies on Epic 1 foundation: base components (cards, badges, skeletons, empty states), database schema (Class, Schedule, Student, User), and JWT authentication.
- Navigation flows from Dashboard (2.1) or Class List (2.3) into Class Detail (2.2), and then into Student Profile (2.4).
