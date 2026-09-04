# Spine Pair Review — getting-start-bmad

## Overall verdict

Structurally the pair is complete — DESIGN.md follows the canonical section order, EXPERIENCE.md carries every required default, and both source references in `sources` resolve. But as a consumer contract it is **adequate-to-thin**: two load-bearing token contradictions in DESIGN.md (badge and skeleton) would make a story-dev build the wrong thing, four of six UJs lack dedicated key flows, the single mockup reference points at a path that does not exist, and component naming is inconsistent across spines so cross-references resolve only by fuzzy reading, not by name. The bones are right; several load-bearing details are unresolved or contradictory.

## 1. Flow coverage — thin

The PRD defines 6 Key User Journeys (UJ-1 → UJ-6 in `prd.md` §2.3). EXPERIENCE.md ships exactly 2 Key Flows: "Mr. Chen grades a midterm" (Flow 1) and "Alex Rivera takes a midterm" (Flow 2). Both are well-formed — named protagonist, 7 numbered steps, an explicit **Climax** beat, and a failure path each. The remaining four journeys have no key flow.

### Findings
- **[high]** UJ-1 (daily classes glance), UJ-2 (view student info), UJ-3 (create exam schedule), UJ-6 (check results) have **no** dedicated Key Flow (EXPERIENCE.md §Key Flows, lines 155–179 vs `prd.md` §2.3). Only UJ-4 (grades) and UJ-5 (takes exam) are realized as flows; UJ-1/UJ-6 appear only as incidental resolution beats inside Flow 1/Flow 2. *Fix:* add 2–4 short flows (or annotate existing flows as realizing specific UJs) so every UJ has a named, step-numbered, climax-bearing walk.
- **[medium]** No flow is annotated to a UJ/FR (e.g. "Realizes UJ-4 / FR-10–13"). A downstream story-dev cannot tell which journey a flow is the contract for. *Fix:* tag each flow header with the UJ/FR set it covers.
- **[medium]** Persona drift from source: PRD uses "Ms. Rivera (student)" for UJ-5/6; EXPERIENCE Flow 2 names the same student "Alex Rivera" with he/him pronouns (EXPERIENCE.md line 169–177). Teacher greeting in Flow 1 is "Welcome back, David" though the protagonist is Mr. Chen (line 159) while the STUDENT is "Alex" in DESIGN.md line 112. *Fix:* keep persona names/pronouns verbatim from PRD or reconcile deliberately.

## 2. Token completeness — thin

All 13 `colors` tokens carry hex values (DESIGN.md lines 8–20) — none missing, so that rule passes. `typography` (display/display-sm/body/label), `rounded` (sm/md/lg/full), and `spacing` (5 named tokens) are all defined per spec. But two frontmatter→prose contradictions are load-bearing, and cross-reference syntax is inconsistent, so consumers cannot trust the tokens as-is.

### Findings
- **[critical]** Badge token contradiction: frontmatter `badge-pending/absent/graded` are **filled** (background = `{colors.warning/danger/success}`, foreground `#FFFFFF`) (DESIGN.md lines 63–74), but the prose spec (lines 166–173) explicitly stipulates **tinted** badges — "This is a light-background variant, not white-on-color" — and the Do's/Don'ts (line 210) bans "filled badges (white text on solid color)". A consumer resolving the frontmatter would render filled pills that violate the brand's own stated discipline. *Fix:* rewrite frontmatter badge tokens to the tinted values (e.g. `#FDF5E6`/`#9E8A5A`), or remove color from frontmatter and let prose own badge colors, so token and spec agree.
- **[critical]** Skeleton token contradiction: frontmatter `skeleton.background = '{colors.border}'` (#E5E2DD) (line 76) but prose says "`{colors.background}` (`#FAF8F5`) fill" (line 177). Two different fills for the same component. *Fix:* align to one (prose's warm-paper `#FAF8F5` fill reads intentional) and update frontmatter.
- **[medium]** Cross-ref syntax inconsistency: `{rounded.full}` (dot, used in frontmatter line 66 and prose) vs `{rounded/full}` (slash, DESIGN.md line 197 in `progress-bar`). Per design-md-spec the syntax is `{path.to.token}` with dots. *Fix:* normalize to `{rounded.full}`.
- **[medium]** Five prose-only components — `inline-banner`, `empty-state`, `exam-question-card`, `progress-bar`, `timer` — have visual specs in prose but **no** `components` frontmatter entry (frontmatter lists only button-primary, card, badge-*, skeleton, toast; lines 54–82 vs 183–201). They are untokenized, so story-dev cannot resolve them against the token system. *Fix:* add frontmatter `components` entries (at least color/radius) for each.
- **[low]** Light mode only; no `-dark` tokens and DESIGN.md never addresses dark mode. Defensible if dark is out of scope (PRD never requests it), but the INTENT is uncommitted, leaving consumers guessing. *Fix:* state "light mode only in v1" explicitly.

## 3. Component coverage — thin

Shared coverage (Empty State, Skeleton, Toast, Inline Banner, and the generic Card/Button/badge) exists in both spines. But the two spines use **different naming schemes** (DESIGN: lower-kebab `exam-question-card`; EXPERIENCE: Title Case `Exam-Taking Interface`, `Grading Table`), and several behavioral components have no visual counterpart — and vice versa.

### Findings
- **[high]** EXPERIENCE behavioral components with no visual spec in DESIGN: `Student Roster Table`, `Grading Table`, `Results Detail`, `Confirm Dialog (Finalize Grades)`, `Class Card`, `Exam Card` (EXPERIENCE.md lines 68–78 vs DESIGN.md §Components lines 156–201). Design covers card/button/badge/timer/progress/skeleton/toast/banner but not tables, dialogs, or the composite detail views. *Fix:* add visual specs (or explicit "uses `card` + standard table/dialog" contracts) for tables, dialogs, and the result/composite surfaces.
- **[medium]** DESIGN visual components with no behavioral row in EXPERIENCE: `timer`, `progress-bar`, `exam-question-card` appear in DESIGN §Components but are not rows in EXPERIENCE.Component Patterns — they surface only inside prose/State/Flow (EXPERIENCE.md lines 72, 92). *Fix:* either add rows or document that they are owned by the "Exam-Taking Interface" composite row.
- **[medium]** Component names differ across spines and even across sections within a file (`badge` prose vs `badge-pending/absent/graded` frontmatter; `Inline Banner` EXPERIENCE vs `inline-banner` DESIGN). A consumer cannot link by exact name. *Fix:* single canonical token-per-component name used verbatim in DESIGN.Components, EXPERIENCE.Component Patterns, and both frontmatters.

## 4. State coverage — adequate

State Patterns (EXPERIENCE.md lines 82–94) cover cold load, empty (classes/exams), error-fetch, success-save, pending, absent, finalized, exam in-progress/submitted/conflict — all with surfaces and treatments. Missing pieces below are real but narrow.

### Findings
- **[medium]** No authentication states: FR-23 invalid-credential error and FR-24 role-based access denial (permission-denied screen) have no State Pattern row (EXPERIENCE.md §State Patterns vs `prd.md` §4.8). A student/teacher who hits a gated surface has no defined treatment. *Fix:* add "Permission denied / empty role surface" and "Invalid login" rows.
- **[medium]** "Offline" is not a State Patterns row even though Flow 2's failure path depends on it (EXPERIENCE.md line 179). The state table is otherwise the discoverable source for a story-dev, and offline is absent from it. *Fix:* add a row mirroring Flow 2's treatment.
- **[low]** Exam auto-submit on expiry (FR-19) has no state row; only the timer-warning path is described (line 92 covers in-progress). *Fix:* add an "exam — time expired / auto-submitted" row.

## 5. Visual reference coverage — broken

Directory state: the ux project has files only under `.working/` — `color-themes-1.html`, `directions-1.html`, `key-screens-1.html`. There is **no** `mockups/`, `wireframes/`, or content in `imports/`.

### Findings
- **[high]** EXPERIENCE.md references `` `mockups/key-screens-1.html` `` (line 43) but the file lives at `.working/key-screens-1.html`; no `mockups/` dir exists. The reference does not resolve. *Fix:* update path to the real location (or move the file into a `mockups/` dir) and keep "Spine wins on conflict."
- **[high]** `color-themes-1.html` and `directions-1.html` are orphans — referenced in neither spine (verified: DESIGN.md has only a passing "in mockups" mention, line 98, no file link; EXPERIENCE.md references only key-screens-1). Since these two files document the pre-decision directions (option scope) and the winning palette, burying them unreferenced loses the design rationale a consumer would want. *Fix:* link each at the relevant DESIGN.md section (Colors → `directions-1.html`, Colors/Elevation → `color-themes-1.html`) or archive them with a note.
- **[medium]** DESIGN.md links no mockup inline at any section; only EXPERIENCE links one reference. "Spines link to each inline at the relevant section" is only half satisfied. *Fix:* reference `key-screens-1.html` from DESIGN's Brand & Style and/or Components matching the screen it illustrates.
- **[ok]** "Spine wins on conflict" appears once (EXPERIENCE.md line 43). Good.

## 6. Bloat & overspecification — adequate

The spines are generally lean; prose earns its place and microcopy tables are sharp. Some redundancy but not severe.

### Findings
- **[low]** DESIGN §Components restates in prose the exact hex/radius/shadow values already in frontmatter (e.g. `card`, `toast`, `button-primary` at lines 158–181 duplicate lines 54–82). Per the design-md-spec "reference tokens, don't restate values" discipline, this is duplication — a single source change requires a two-place edit and risks the exact bad/skeleton drift found above (already happened). *Fix:* prose should reference tokens (`{colors.primary}`, `{rounded.md}`) and keep only the narrative; let frontmatter own values.
- **[low]** "Welcome back, {name}" appears as a token value inside prose rather than as a token; and the `exam-question-card` left-label is hardcoded as "Q1/Q2/Q3" (Georgia bold) — a minor instance of spec-pixel that's fine but could be a token. No downstream consumer is blocked.

## 7. Inheritance discipline — thin

- **[ok]** `sources` frontmatter resolves: `{planning_artifacts}/prds/prd-getting-start-bmad-2026-09-03/prd.md` and `{planning_artifacts}/architecture/.../ARCHITECTURE-SPINE.md` both exist on disk.
- **[high]** Cross-source conflict with the architecture: EXPERIENCE Flow 2 failure promises "answers are saved locally and will sync when you reconnect" (line 179), but the source ARCHITECTURE-SPINE AD-9 explicitly downgrades offline resilience to **retry-on-reconnect only** and defers any offline queue, overruling PRD FR-20's assumption. EXPERIENCE restates the discarded PRD assumption instead of honoring its own listed source. *Fix:* rewrite Flow 2's failure path and any offline copy to retry-on-reconnect, or secure a new decision.
- **[high]** Requirement names are NOT verbatim: no flow is keyed to "UJ-4"/"UJ-5"/FR numbers; flows are titled with new prose. Per the rubric that's a naming break — tied to finding 1.2.
- **[medium]** Glossary: neither spine defines a Glossary and neither honors the PRD's Exam-vs-Test semantic distinction (PRD §3: functionally identical, semantically distinct). EXPERIENCE.md uses "Exam" broadly and even its IA lists "exams and tests" without carrying the distinction through. *Fix:* import the PRD glossary terms into both spines (or at least state "Exam ≡ Test for UX purposes") so downstream builders don't invent a division the product doesn't have.
- **[medium]** EXPERIENCE.md makes no formal `{path.to.token}` references to DESIGN tokens by name (it names roles like "Georgia", "indigo", and hex values instead). A consumer can't tell that "indigo" == `{colors.primary}` except by reading. *Fix:* use token syntax on first reference.

## 8. Shape fit — strong

- **[ok]** DESIGN.md sections in canonical order: Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts (lines 85–216). Compliant.
- **[ok]** EXPERIENCE.md all required defaults present: Foundation, Information Architecture, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Responsive & Platform, Inspiration & Anti-patterns, Key Flows (lines 15–179). No dropped defaults; the desktop-first posture is stated (line 142), matching PRD §5 "No mobile app."
- **[high]** Required-when-applicable gaps: role-based access (FR-24) requires a permission-denied/access state and auth (FR-23) requires an invalid-login/error state — neither present in State Patterns (see finding 4.1). Since authentication is in MVP scope, this is triggered and unfulfilled.

## Mechanical notes

- **Frontmatter completeness:** DESIGN.md has `name/description/status/created/updated`; EXPERIENCE.md has `name/status/created/updated` + `sources`. Both fine. DESIGN.md lacks a `sources`/`updated`-style provenance into PRD — acceptable for DESIGN (matches the examples, which are deltas) but it means traceability to the PRD lives only in EXPERIENCE.
- **Broken cross-refs:** `mockups/key-screens-1.html` (path) — EXPERIENCE.md:43; `{rounded/full}` (syntax) — DESIGN.md:197.
- **Contradictions (token vs prose):** `badge-*` filled vs tinted (DESIGN.md:63–74 vs 166–173, 210); `skeleton.background` `border` vs `background` (DESIGN.md:76 vs 177).
- **Cross-source conflict:** offline local-queue promise (EXPERIENCE.md:179) vs ARCHITECTURE-SPINE AD-9 retry-only.
- **Name inconsistencies:** component naming lower-kebab vs Title Case across spines; flow titles not keyed to UJ/FR names; "Ms. Rivera"/"Alex Rivera"/"David"/"Mr. Chen" persona mismatch.
- **Orphans/untracked:** `color-themes-1.html`, `directions-1.html` unreferenced; 5 DESIGN prose components untokenized in frontmatter.
