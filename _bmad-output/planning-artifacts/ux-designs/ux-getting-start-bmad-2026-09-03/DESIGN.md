---
name: SchoolDesk
description: Modern, minimal web app for teachers managing classes/exams/grades and students taking exams and viewing results
status: final
created: 2026-09-03
updated: 2026-09-04
colors:
  background: '#F8FAFC'
  surface: '#FFFFFF'
  primary: '#2563EB'
  primary-foreground: '#FFFFFF'
  accent: '#64748B'
  accent-foreground: '#FFFFFF'
  success: '#15803D'
  warning: '#B45309'
  danger: '#B91C1C'
  text: '#0F172A'
  text-muted: '#475569'
  border: '#E2E8F0'
  exam-surface: '#F1F5F9'
typography:
  display:
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: 26px
    fontWeight: '600'
    lineHeight: '1.3'
  display-sm:
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.35'
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  full: 9999px
spacing:
  gutter: 16px
  section: 24px
  page: 32px
  card-padding: 16px
  card-padding-lg: 24px
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: '{rounded.md}'
  card:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    shadow: '0 1px 3px rgba(15,23,42,0.08)'
  badge-pending:
    background: '#FFFBEB'
    foreground: '{colors.warning}'
    radius: '{rounded.full}'
  badge-absent:
    background: '#FEF2F2'
    foreground: '{colors.danger}'
    radius: '{rounded.full}'
  badge-graded:
    background: '#F0FDF4'
    foreground: '{colors.success}'
    radius: '{rounded.full}'
  skeleton:
    background: '{colors.border}'
    radius: '{rounded.md}'
    shimmer: '#F8FAFC'
  toast:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    shadow: '0 4px 12px rgba(15,23,42,0.12)'
  inline-banner:
    background: '{colors.exam-surface}'
    radius: '{rounded.md}'
  empty-state:
    radius: '{rounded.md}'
  exam-question-card:
    background: '{colors.exam-surface}'
    radius: '{rounded.md}'
  progress-bar:
    track: '{colors.border}'
    fill: '{colors.primary}'
    radius: '{rounded.full}'
  timer:
    foreground: '{colors.text}'
    danger: '{colors.danger}'
  data-table:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    row-hover: '{colors.background}'
  class-card:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    shadow: '0 1px 3px rgba(15,23,42,0.08)'
    hover: '{colors.background}'
  exam-card:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    shadow: '0 1px 3px rgba(15,23,42,0.08)'
    hover: '{colors.background}'
  confirm-dialog:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.lg}'
---

## Brand & Style

SchoolDesk is a modern, minimal web app — a clean, focused workspace built for the rhythm of a classroom. Cool white and slate surfaces, one crisp blue accent, and a single modern sans-serif do all the work. No decorative texture, no ornament, no metaphor. The palette is cool, calm, and high-contrast: this is a tool that gets out of the way so teachers and students can see their data clearly.

There are two roles in the system: teachers (who manage classes, grade exams, track students) and students (who take exams, view results, follow their schedule). The visual language is identical for both; the density shifts. Teachers see tables, inline inputs, and action buttons — dense, data-first surfaces. Students see cards, timelines, and score displays — calm, readable, reflective. Both surfaces share the same color vocabulary and typographic rhythm, so the app feels like one place, not two products stitched together.

> The `mockups/` folder holds illustrations from the earlier warm/studious direction and is retained for reference only — it does not reflect the current direction. The live render of this redesign is the `sms-frontend` demo (see `sms-frontend/src/tokens.css`, which mirrors this spine verbatim). Spine wins on conflict any illustration.

## Colors

SchoolDesk's palette is ten tokens. Every color has a job. No color is decorative.

- **Background (`#F8FAFC`)** — cool slate off-white. The page surface behind everything. Never used on cards or interactive elements — it is the canvas, not the furniture.
- **Surface (`#FFFFFF`)** — clean white for cards, modals, table rows, and any element that sits on top of the background.
- **Primary (`#2563EB`)** — crisp blue. The **single accent** of the system. Used on primary buttons, active nav tabs, links, focus rings, the progress-bar fill, and brand text ("SchoolDesk" wordmark). This is the only color that means "clickable." Every other color is neutral or semantic — blue is the one chromatic accent.
- **Accent (`#64748B`)** — slate, a *functional* neutral, not a second accent. Used only for the left-border stripe of note callouts and contextual asides. It reads as supporting gray, never as an interactive color.
- **Success (`#15803D`)** — deep green. Graded badges, "Save" act in the grading view, and the "Correct" indicator. Green means "done / correct / confirmed."
- **Warning (`#B45309`)** — deep amber. Pending badges, helper text, countdown chips ("3 days away"). Amber means "in progress / attention needed / not yet."
- **Danger (`#B91C1C`)** — deep red, chosen (not the brighter red-600) so a single token serves both white-on-fill and text-on-tint at WCAG AA 4.5:1. Absent badges, "Mark Absent" actions, toggle tracks for the absent state, "Incorrect" indicators, and the timer's low-time final state. Red means "stop / absent / wrong."
- **Text (`#0F172A`)** — slate near-black for all primary copy. High contrast on both `#F8FAFC` background and `#FFFFFF` surface.
- **Text-muted (`#475569`)** — slate gray for secondary information: table headers, timestamps, meta lines ("Mr. Chen · Mon / Wed / Fri 09:00"), search placeholders. Chosen at slate-600 so muted text clears WCAG AA 4.5:1 on every surface, including the exam surface (`#F1F5F9` ≈ 6.9:1).
- **Border (`#E2E8F0`)** — cool slate for table borders, card outlines, input borders, stat-bar dividers, and skeleton placeholder fills.

Do not introduce gradients, shadow color casts, or chromatic overlays. The palette is flat and deliberate. Blue fills an interactive role only; semantic colors fill a status role only.

**Light mode only in v1.** SchoolDesk ships a single light theme anchored to the cool slate palette. No dark-mode tokens or `-dark` variants in v1; set `color-scheme: light` so the browser never applies a dark form theme. Dark mode is a v2 consideration.

## Typography

One family, two weights. Modern, minimal, legible.

- **Display (system sans-serif, weight 600)** — used for page headings, section titles, score displays ("92"), widget titles inside cards, the "Welcome back, Alex" greeting, and empty-state hero text. The semibold weight sets headings apart without a second font. It is never used for body copy, table data, badges, or form labels.
  - `display`: 26px, weight 600, line-height 1.3
  - `display-sm`: 18px, weight 600, line-height 1.35

- **Body / Label (system sans-serif)** — used for everything else: table cell text, button labels, input values, badge text, helper copy, navigation items, meta lines. The sans-serif is invisible by design — it carries information without calling attention to itself.
  - `body`: 14px, weight 400, line-height 1.5
  - `label`: 12px, weight 500, line-height 1.4

No serif, no decorative or display-only face. Weight (not a second family) does the hierarchy work: 600 for headings, 500 for labels, 400 for body.

## Layout & Spacing

**Spacing scale:** 16px gutter, 24px section gap, 32px page padding. The scale is tight because SchoolDesk is data-dense — teachers need rows, columns, and inline actions to feel close together, not spread across a marketing page.

**Grid:** Sidebar + content layout on desktop. Sidebar holds role-switching and secondary navigation. Content area takes the remainder.

**Max-width:** ~1200px for the content area. SchoolDesk needs data tables with 4–5 columns, inline inputs, and action buttons in the same row, but the content does not go edge-to-edge — 32px page padding on both sides keeps it from touching the viewport.

**Breakpoints:** The sidebar collapses below 1024px. Below 768px, tables switch to stacked card layouts. The app is designed desktop-first; the mobile experience is functional but not a first-class citizen.

**Vertical rhythm:** 24px between sections (stat-bar to tab-bar, tab-bar to table). 16px between cards in a grid. 8px between rows inside a table or timeline. The rhythm is consistent: 8 / 16 / 24 / 32, always.

## Elevation & Depth

Subtle and flat. Hierarchy comes from color and background, not shadow depth.

- **Cards:** `0 1px 3px rgba(15,23,42,0.08)` — a hairline of depth to lift the card off the slate background; not a design feature.
- **Toasts:** `0 4px 12px rgba(15,23,42,0.12)` — slightly elevated because toasts float above everything and must feel detached from the page.
- **Hover states:** No shadow changes on hover. Cards and table rows get a subtle background tint (`{colors.background}`, `#F8FAFC`) on hover — a flat "surface sinks" effect that reads interactive without elevation.
- **No elevation hierarchy.** There is no "elevation 1 / 2 / 3" system. Shadow is binary: either an element has the card shadow or it does not. Modals and overlays use a backdrop dim, not a deeper shadow.

Do not use elevation to indicate importance. Use color, position, and typography weight instead.

## Shapes

Corner radii are a three-tier system, tuned slightly softer for the modern feel:

- **`{rounded.sm}` (6px)** — input fields, inline score inputs, search bars. Small interactive elements that sit inside cards or table cells.
- **`{rounded.md}` (10px)** — cards, buttons, browser chrome frames, stat bars, summary bars, note callouts. The default corner radius for anything that is a "container" or "surface."
- **`{rounded.lg}` (14px)** — modals and dialog boxes. Only used for floating surfaces that overlay the page.
- **`{rounded.full}` (9999px)** — status badges (Pending, Graded, Absent), toggle tracks. Pills are exclusively for status indicators — never used on buttons or cards.

## Components

Component visual specs live here and pair with the `components` frontmatter tokens; EXPERIENCE.md.Component Patterns owns the behavioral rules. **Canonical component names are lower-kebab** (`badge-absent`, `exam-question-card`, `grading-table`, `confirm-dialog`) and are used verbatim everywhere — DESIGN (this section + frontmatter), EXPERIENCE.Component Patterns, and the code — so a consumer can link by exact name.

### button-primary

`{colors.primary}` fill, `{colors.primary-foreground}` (white) text, `{rounded.md}` (10px) corners. Padding: 6px 14px at default size, 4px 10px in `btn-sm` variant. Font: 12px label, weight 500. Disabled state: background shifts to `#BFDBFE` (desaturated blue), cursor to `not-allowed`. Used for primary actions: "Save" in grading, "Finalize Grades" (disabled until conditions met). The primary button is the only element that uses blue as a fill — it is the singular "act now" affordance.

### card

`{colors.surface}` background, `1px solid {colors.border}` outline, `{rounded.md}` corners, `0 1px 3px rgba(15,23,42,0.08)` shadow. Padding: 16px (`card-padding`) at default, 24px (`card-padding-lg`) for summary bars. Cards are the building blocks of every surface: widget cards on the student dashboard, the grading summary bar, the question breakdown panel. Cards do not change elevation on hover — they tint to `{colors.background}` instead.

### badge (pending / absent / graded)

Pill-shaped (`{rounded.full}`). Padding: 3px 10px. Font: 11px, weight 600. Three variants, all tinted-background labels (not filled):

- **Pending:** `#FFFBEB` background, `{colors.warning}` text
- **Absent:** `#FEF2F2` background, `{colors.danger}` text
- **Graded:** `#F0FDF4` background, `{colors.success}` text

Tinted-background badges read as labels, not buttons; the tint sits at ~15% opacity of its semantic color on a white base, and the text uses the full `*-700` semantic token so every pair clears WCAG AA 4.5:1.

### skeleton

`{colors.border}` (`#E2E8F0`) fill, `{rounded.md}` corners, with a `#F8FAFC` shimmer highlight swept across while loading. Placeholder bars match the size of the element they replace. No text inside skeletons; rendered with `aria-hidden="true"` and an `aria-busy` container so screen readers know content is loading.

### toast

`{colors.surface}` background, `1px solid {colors.border}` outline, `{rounded.md}` corners, `0 4px 12px rgba(15,23,42,0.12)` shadow. Padding: 16px. Toasts appear bottom-center, auto-dismiss after 3 seconds, and support one line of text with an optional action link. Toasts are the only component with a noticeably elevated shadow.

### inline-banner

`{colors.exam-surface}` (`#F1F5F9`) background, no border, `{rounded.md}` corners. Padding: 12px 16px. Font: 13px body. Used for contextual notices inside exam-taking surfaces — "Your teacher has not yet published correct answers" or "Time remaining: 14:32." The cool slate tint signals exam context without warmth. Left-bordered variant (`3px solid {colors.accent}` on the left edge) for note callouts in results views.

### empty-state

Centered layout. Display-sm (18px) heading, 14px body text in `text-muted`, and a single `{colors.primary}` action button below. Max-width: 320px for the text block. Empty states appear when a class has no students, a student has no upcoming exams, or a teacher has no classes yet. The tone is direct, not apologetic: "No students enrolled" — not "Oops! Looks like you haven't added any students yet."

### exam-question-card

Card variant with `{colors.exam-surface}` background instead of `{colors.surface}`. Padding: 16px. Left label in `{colors.primary}` weight-600 (Q1, Q2, Q3). Question text in 13px body. Answer and correct/incorrect status right-aligned. When incorrect, the expected answer appears below in 11px `text-muted`. This variant exists because exam content has a different visual weight than dashboard widgets — it needs to feel "inside the exam," not "inside the app."

### progress-bar

Track: 4px height, `{colors.border}` background, `{rounded.full}` corners. Fill: `{colors.primary}` background. Used on the student exam-taking surface to show "3 of 10 questions answered." The bar is thin and non-intrusive.

### timer

Display-sm (18px) font, weight 600, `{colors.text}` color. `font-variant-numeric: tabular-nums` for stable digit widths. When time drops below 5 minutes, the color shifts to `{colors.danger}` (`#B91C1C`, tinted amber at 5:00 per EXPERIENCE). No animation, no pulsing — the timer is a calm readout. Urgency comes from the color change, not motion.

### data-table (student-roster / grading / results)

A standard data table on `{colors.surface}`, 1px `{colors.border}` row dividers, no outer border, `{rounded.md}` top corners only (tables sit flush in a page or card). Header row: `text-muted` 12px label weight 500, left-aligned, `border` divider beneath. Body: 14px body, `{colors.text}`, `{spacing.gutter}`-axed padding, rows `8px` tall minimum. Hover reveals `{colors.background}` row tint (md+ viewports only). Numeric cells right-aligned in tabular-nums. Uses `<th scope>` for both column and row headers.

### class-card & exam-card

Composed from `card` (`{rounded.md}`, `{colors.surface}`, card shadow). Title uses `display-sm`; schedule/meta line in 12px `text-muted`; count/time readouts in tabular-nums. A status `badge-*` sits top-right for exam-card. Cards are not elevated on hover — they tint to `{colors.background}`, matching the interactive row treatment.

### confirm-dialog

Modal surface, `{rounded.lg}` (14px), `{colors.surface}` background, 1px `{colors.border}` outline, backdrop dim (no shadow tier). Display-sm title, 14px body text, and a footer with a neutral Cancel button and a `button-primary` confirm. Padding: 24px. Only floating surface tier in the system (14px radius reserved for modals).

## Do's and Don'ts

| Do | Don't |
|---|---|
| Use the sans-serif display (weight 600) for headings | Use a serif or display-only font anywhere |
| Use blue (`#2563EB`) as the sole fill color for interactive elements | Use accent (slate) or success/warning/danger as button fills |
| Keep card shadows at `0 1px 3px rgba(15,23,42,0.08)` — barely visible | Add elevation tiers, drop shadows, or shadow-on-hover effects |
| Use tinted badges (light background + colored text) for status | Use filled badges (white text on solid color) for status |
| Stay within the 8/16/24/32 spacing scale | Use arbitrary spacing values or 3rd-party spacing scales |
| Show skeleton placeholders during data loads | Show spinners or progress rings |
| Write direct empty-state copy ("No students enrolled") | Write apologetic or playful empty-state copy |
| Keep `{rounded.md}` (10px) as the default container radius | Use radius > 14px on non-modal elements |
| Use `#F8FAFC` as the page background only | Apply the slate tone to cards, modals, or interactive surfaces |
| Use tabular-nums on all numeric readouts (scores, timers, IDs) | Let proportional digits wobble in score displays or countdowns |
