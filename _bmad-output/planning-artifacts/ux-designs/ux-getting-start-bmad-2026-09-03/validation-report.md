# Validation Report — SchoolDesk

- **DESIGN.md:** `_bmad-output/planning-artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/DESIGN.md`
- **EXPERIENCE.md:** `_bmad-output/planning-artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/EXPERIENCE.md`
- **Run at:** 2026-09-03

## Overall verdict

The SchoolDesk spine pair is structurally sound — canonical section order, all required EXPERIENCE defaults present, sources resolve. But as a consumer contract it carries significant gaps. Two load-bearing token contradictions in DESIGN.md (badge filled vs tinted, skeleton background vs border) would produce incorrect UI if implemented from frontmatter. Four of six user journeys lack dedicated key flows. The accessibility floor is well-intentioned but broken by the badge token mismatch, a non-compliant timer warning color, missing focus traps in exam full-screen mode, and the `role="application"` anti-pattern. Edge cases around permission boundaries, race conditions in concurrent grading, offline conflict resolution, and empty states for less-common surfaces are largely undefined. The happy paths are solid; the "what breaks" paths need reinforcement before story-dev picks this up.

Cross-referencing all three lenses: the badge token contradiction is the single most dangerous finding — it appears in rubric, accessibility, and is the root cause of the critical contrast failure. Resolving it (aligning frontmatter to the tinted-background prose spec) would eliminate findings across all three reviewers.

## Category verdicts

- Flow coverage — **thin**
- Token completeness — **thin**
- Component coverage — **thin**
- State coverage — **adequate**
- Visual reference coverage — **broken**
- Bloat & overspecification — **adequate**
- Inheritance discipline — **thin**
- Shape fit — **strong**

## Findings by severity

### Critical (4)

**Token Completeness / Accessibility** — Badge token contradiction: filled vs tinted (DESIGN.md:63–74 vs 166–173, 210)
Frontmatter badge-pending/absent/graded are filled (white-on-color), but the prose spec explicitly stipulates tinted badges. If implemented from frontmatter, white-on-warning yields ~2.7:1 contrast — a WCAG failure.
*Fix:* Rewrite frontmatter badge tokens to tinted values (e.g. #FDF5E6/#9E8A5A) or remove color from frontmatter.

**Token Completeness** — Skeleton token contradiction: border vs background (DESIGN.md:76 vs 177)
Frontmatter skeleton.background = '{colors.border}' (#E5E2DD) but prose says '{colors.background}' (#FAF8F5). Two different fills.
*Fix:* Align to one value (prose's #FAF8F5 reads intentional) and update frontmatter.

**Accessibility** — Badge token mismatch produces WCAG AA failure
Same root cause as above. White-on-warning #9E8A5A yields ~2.7:1 contrast.
*Fix:* Delete or correct frontmatter badge tokens.

**Edge Cases** — Permission boundary behavior undefined
No definition of what happens when a student navigates to a teacher URL (or vice versa). No redirect, 403 page, or routing guard.
*Fix:* Server-side 403 on API; client-side redirect to own dashboard with toast.

### High (26)

**Flow coverage** — Four UJs have no dedicated Key Flow
UJ-1, UJ-2, UJ-3, UJ-6 have no Key Flow. Only UJ-4 and UJ-5 are realized.
*Fix:* Add 2–4 short flows or annotate existing flows.

**Token Completeness** — Timer warning color fails AA contrast
Danger #9E6A6A on exam-surface #F5F2ED yields ~4.37:1 — fails AA 4.5:1 for 20px Georgia.
*Fix:* Darken to #8E5555 or #7A4A4A.

**Component coverage** — Six behavioral components with no visual spec
Student Roster Table, Grading Table, Results Detail, Confirm Dialog, Class Card, Exam Card have no visual spec in DESIGN.
*Fix:* Add visual specs or "uses card + standard table/dialog" contracts.

**Visual references** — Mockup reference points to nonexistent path
EXPERIENCE.md references mockups/key-screens-1.html but file lives at .working/key-screens-1.html.
*Fix:* Update path or move file.

**Visual references** — Two working files orphaned/unreferenced
color-themes-1.html and directions-1.html are not referenced in either spine.
*Fix:* Link at relevant DESIGN.md sections.

**Inheritance** — Offline promise contradicts architecture spine
EXPERIENCE Flow 2 promises local save + sync but ARCHITECTURE-SPINE AD-9 defers to retry-on-reconnect only.
*Fix:* Rewrite Flow 2's failure path to retry-on-reconnect.

**Inheritance** — Requirement names not verbatim
No flow is keyed to UJ/FR numbers from source.
*Fix:* Tag each flow with source UJ/FR identifiers.

**Accessibility** — No focus trap in exam full-screen mode
Keyboard user could Tab out of exam into browser chrome.
*Fix:* Specify focus-trap on exam-taking container.

**Accessibility** — role="application" anti-pattern
Suppresses standard screen reader shortcuts. Exam doesn't justify it.
*Fix:* Remove role="application". Use standard landmarks.

**Accessibility** — Skeleton loading silent for screen readers
No aria-busy or aria-live on skeleton containers.
*Fix:* Add aria-busy="true" and aria-live="polite".

**Accessibility** — Missing modal/exam focus management
No focus specification after dialog open/close or exam redirect.
*Fix:* Focus to Cancel on open; return to trigger on close; focus to heading after redirect.

**Accessibility** — Exam auto-submit blind to screen readers
Timer expiry auto-submits with no announcement.
*Fix:* Announce "Time is up. Your exam has been submitted." via aria-live="assertive".

**Accessibility** — Question sidebar has no ARIA structure
No roles specified for question navigation.
*Fix:* Use <nav> with <ol>, aria-current for current question.

**Edge Cases** — Exam submission failure (network drop on Submit)
No retry UX defined for final submit failure.
*Fix:* Define retry: "Submission failed. Retry" inline banner.

**Edge Cases** — Race condition: two teachers grading simultaneously
No conflict detection.
*Fix:* Optimistic locking or last-write-wins with conflict banner.

**Edge Cases** — Timer expires while submit confirmation dialog is open
Undefined behavior.
*Fix:* Auto-close dialog, auto-submit, show toast.

**Edge Cases** — Session expiry mid-use undefined
No expired-session UX.
*Fix:* Redirect to login with "Session expired" toast.

**Edge Cases** — Pagination behavior for large lists undefined
No page size, controls, or search+paginate behavior.
*Fix:* Define page size (25 rows), controls, and search filtering.

**Edge Cases** — Offline conflict resolution undefined
What if teacher finalized while student was offline?
*Fix:* Show banner on sync if exam was finalized.

**Edge Cases** — Finalize failure (network drop after confirm)
No UX for finalize failure.
*Fix:* Inline banner: "Finalize failed. Try again." Prevent student-side breakdown unlock.

**Edge Cases** — Exam start while student is on page
Start button may not appear dynamically.
*Fix:* Poll at 30s intervals or use push notification.

**Edge Cases** — Toast dismiss overlapping with new toast
No toast queue behavior defined.
*Fix:* New toast replaces existing or stack with max 2.

**Edge Cases** — Offline during grading
No offline banner or local storage for grading.
*Fix:* Same offline banner pattern as exam-taking.

**Edge Cases** — Score input validation
No constraints for negative, >100, non-numeric, decimal values.
*Fix:* Min 0, max 100, integer only, inline validation.

**Edge Cases** — Student trying to start exam after time window closed
"Start" button behavior after window close undefined.
*Fix:* Don't show Start once window closes; inline banner if already on page.

### Medium (35)

**Flow coverage** — No flow annotated to UJ/FR
**Flow coverage** — Persona drift from source PRD
**Token completeness** — Cross-ref syntax inconsistency ({rounded.full} vs {rounded/full})
**Token completeness** — Five prose-only components untokenized
**State coverage** — No authentication states
**State coverage** — Offline not a State Pattern row
**Visual references** — DESIGN.md links no mockup inline
**Inheritance** — Glossary not imported from PRD
**Inheritance** — EXPERIENCE uses informal token references
**Accessibility** — text-muted borderline contrast (4.48:1)
**Accessibility** — Grading table Escape within score input undefined
**Accessibility** — Toast auto-dismiss not pausable on focus/hover
**Accessibility** — Progress milestones not announced via aria-live
**Accessibility** — Auto-save checkmark not announced to screen readers
**Accessibility** — Table column headers need explicit scope attributes
**Accessibility** — Error-field association missing in grading table
**Accessibility** — Login errors unspecified in UX spine
**Accessibility** — lang attribute not specified
**Accessibility** — Radio button native element usage not confirmed
**Accessibility** — Exam confirmation dialog focus trap missing
**Accessibility** — Timer assertive announcement at 5min/1min thresholds
**Accessibility** — Reduced-motion skeleton behavior unclear
**Accessibility** — Touch targets below 44px at sm breakpoint
**Edge Cases** — Student profile with zero exam results empty state
**Edge Cases** — Exam with zero submissions
**Edge Cases** — Student Schedule with no classes enrolled empty state
**Edge Cases** — Exam creation failure
**Edge Cases** — Auto-submit failure when timer expires
**Edge Cases** — Student submits while teacher finalizes
**Edge Cases** — Teacher finalizes while student views results
**Edge Cases** — Very long class/exam names overflow
**Edge Cases** — Score display edge cases (0, 100)
**Edge Cases** — Very many questions overflow sidebar
**Edge Cases** — Dark mode support undefined
**Edge Cases** — High contrast mode state indicators
**Edge Cases** — Zoom to 200% layout reflow

### Low (21)

**Token completeness** — Light mode only; dark mode unaddressed
**Bloat** — DESIGN prose restates frontmatter token values
**State coverage** — Exam auto-submit on expiry has no state row
**Accessibility** — Accent border decorative-only documentation
**Accessibility** — Hamburger menu keyboard handling
**Accessibility** — Toast dismiss animation not in reduced-motion list
**Accessibility** — Badge touch target if becomes clickable
**Accessibility** — Heading hierarchy unspecified
**Accessibility** — Landmark structure unspecified
**Accessibility** — Grading table score inputs at sm breakpoint
**Accessibility** — Offline warning screen reader announcement
**Edge Cases** — Exam card five-state display
**Edge Cases** — Results list with zero entries
**Edge Cases** — Login failure states
**Edge Cases** — Grading table all students absent
**Edge Cases** — Exam with zero questions
**Edge Cases** — Special characters in student names
**Edge Cases** — Auto-save vs page navigation (beforeunload)
**Edge Cases** — Print stylesheets
**Edge Cases** — Safari full-screen behavior
**Edge Cases** — Offline duration limit for timed exams

## Reviewer files

- `review-rubric.md`
- `review-accessibility.md`
- `review-edge-cases.md`
