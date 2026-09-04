---
title: '1-2-design-tokens'
type: 'feature'
created: '2026-09-03'
status: 'done'
review_loop_iteration: 1
baseline_commit: 'NO_VCS'
context:
  - '_bmad-output/planning-artifacts/ux-designs/ux-getting-start-bmad-2026-09-03/DESIGN.md'
---

## Intent

**Problem:** The frontend shell uses ad-hoc inline styles (`system-ui`, hardcoded hex). There is no shared token system, so every subsequent UI story (base components, then all feature epics) would repeat colors/type/spacing/radius by hand, drifting from the "Book Binder" visual direction.

**Approach:** Implement the Book Binder design tokens as CSS custom properties in a single `tokens.css`, imported globally so every component consumes the same vocabulary. Deliver color, typography (display/body/label), spacing, and radius tokens sourced from `DESIGN.md`, with base `body`/`display` classes as golden examples of correct usage.

## Boundaries & Constraints

**Always:**
- Source of truth is `DESIGN.md` (the YAML `colors`/`typography`/`spacing`/`rounded` blocks + the prose Do's/Don'ts). Hex values and type scales come verbatim from it.
- Tokens are CSS custom properties defined on `:root` (no Tailwind — the stack has none). Expose at minimum: colors (background, surface, primary, success, warning, danger, text, text-muted, border) per UX-DR1; typography `display`, `display-sm`, `body`, `label` per UX-DR2; spacing gutter/section/page/card-padding; and the radius tier per UX-DR3.
- Georgia serif (`Georgia, "Times New Roman", serif`) for `display`/`display-sm` only; system sans-serif for `body`/`label` (UX-DR2). No serif in body/label.
- Include the full DESIGN.md palette (accent, primary-foreground, accent-foreground, exam-surface too) and the full radius scale (`sm` 4px, `md` 8px, `lg` 12px, `full` 9999px) — a superset of the minimums, matching the source.
- Token naming mirrors DESIGN.md key paths: `--color-*`, `--font-*`, `--text-*`, `--spacing-*`, `--radius-*`.
- Keep the scaffold's `/api/health` UI working after the refactor (App still renders health status).

**Ask First:**
- None expected. If a DESIGN.md value is ambiguous, HALT before inventing one.

**Never:**
- No component styling (buttons/cards/badges belong to Story 1.3). Tokens + token-consumption base classes only.
- Do not introduce Tailwind, a CSS-in-JS lib, or any build dependency — plain CSS custom properties via Vite.
- Do not change the backend or `sms-shared`.
- No hardcoded hex or named colors in the `.tsx` files this story touches — colors/type/spacing/radius must come from tokens. This binds the current `App.tsx` refactor, not just future edits.

## Code Map

- `sms-frontend/src/tokens.css` -- NEW: single source of the Book Binder tokens; `:root` custom properties for colors, typography (font families + sizes/weights/line-heights), spacing scale, radius scale; plus `.display`, `.display-sm`, `.body`, `.label` base classes demonstrating correct token usage
- `sms-frontend/src/main.tsx` -- IMPORT `./tokens.css` so Vite bundles it and tokens are global (current file has no CSS import)
- `sms-frontend/src/App.tsx` -- refactor inline styles to consume `--color-*`/`--font-*`/`--spacing-*` tokens: heading uses `.display`, container padding uses `var(--spacing-page)` (a deliberate rem→px change from the current `2rem`), and the error banner's `color: "red"` becomes `var(--color-danger)`; preserve the health-fetch behavior (read-only reference for the `/api/health` contract from `sms-shared`)
- `DESIGN.md` (read-only) -- authoritative token source

## Tasks & Acceptance

**Execution:**
- [x] `sms-frontend/src/tokens.css` -- create `:root` custom properties for full color palette (set, incl. surface/primary/primary-foreground/accent/accent-foreground/success/warning/danger/text/text-muted/border/exam-surface per DESIGN.md), typography tokens (display 28/400/1.25, display-sm 20/400/1.3, body 14/400/1.5, label 12/500/1.4; display family Georgia serif, body/label system sans-serif), spacing (gutter 16px, section 24px, page 32px, card-padding 16px, card-padding-lg 24px), radius (sm 4, md 8, lg 12, full 9999) -- satisfies UX-DR1/2/3 as CSS custom properties
- [x] `sms-frontend/src/tokens.css` -- add `.display`, `.display-sm`, `.body`, `.label` utility classes consuming the tokens, and a base `body`/reset rule with `box-sizing: border-box`, `margin: 0`, background `--color-background`, color `--color-text`, font-family `--font-body` -- demonstrable golden examples of token usage (UX-DR2); the reset prevents the default 8px body margin and content-box layout surprises in Story 1.3
- [x] `sms-frontend/src/main.tsx` -- add `import "./tokens.css"` at top -- makes tokens global
- [x] `sms-frontend/src/App.tsx` -- refactor inline `style` to use CSS/token classes (heading uses `.display`, body uses default, container padding `var(--spacing-page)`, error banner `var(--color-danger)`) while keeping health rendering -- removes ad-hoc styling, proves tokens work end-to-end
- [x] Verification -- run `npm run typecheck` and `npm run build` in `sms-frontend` and assert the bundled CSS contains the token declarations (e.g. grep dist for `--color-background:#FAF8F5`), plus visual check that body background/type now come from tokens -- confirms tokens bundle and apply

**Acceptance Criteria:**
- Given the frontend is imported with `tokens.css`, when any element uses a token variable, then the color tokens (background, surface, primary, success, warning, danger, text, text-muted, border), typography tokens (display, display-sm, body, label), spacing tokens (gutter, section, page, card-padding), and radius tokens resolve correctly as CSS custom properties (UX-DR1, UX-DR2, UX-DR3).
- Given the typography tokens are applied, when display text is rendered, then it uses Georgia serif at the display size/weight/line-height; body/label use system sans-serif (UX-DR2).
- Given the radius tokens are applied, when a surface uses them, then inputs resolve to 4px, cards/buttons to 8px, and badges to 9999px (UX-DR3).

## Spec Change Log

- (code review loopback) Review pre-approval (status `draft`), applied after `bmad-review` pass over the spec:
  - Cut the vacuous `I/O & Edge-Case Matrix` (tokens are static declarations; no behavioral I/O) per structure finding.
  - Cut the self-contradictory `index.html` Code Map entry (body styling lives in tokens.css).
  - Added a base reset to the `body` rule task: `box-sizing: border-box` + `margin: 0` — avoids the default 8px body margin framing the warm canvas and content-box layout surprises in Story 1.3.
  - App.tsx refactor task now explicitly converts the `color: "red"` error banner to `var(--color-danger)` and calls out the `2rem`→`var(--spacing-page)` rem→px change; Never-constraint re-scoped to bind the current refactored files (named colors banned, not just hex).
  - Strengthened Verification with a build-time assertion (grep `dist/assets/*.css` for `--color-background:#FAF8F5` and `--font-body`) so a typo'd token or unimported `tokens.css` can't ship undetected; dropped the unnecessary `docker compose up` optional check.
  - Design Notes: reserved the typography-utility namespace (`.display`/`.body`/`.label`) to avoid Story 1.3 collisions; documented px-anchored vs rem; documented the token-typo fallback limitation.
  - Deferred two items to `deferred-work.md`: tabular-nums requirement and the DESIGN.md skeleton-fill source conflict (prose `#FAF8F5` vs YAML `#E5E2DD`).
- (code review loopback, applied) Step-04 code review found two `patch` findings, applied directly to code (no spec loopback; no intent_gap/bad_spec):
  - Added a universal reset `*, *::before, *::after { box-sizing: border-box; }` in `tokens.css` — `box-sizing` is not inherited, so the earlier body-only rule did not cascade to Story 1.3 child elements, defeating the intended protection against content-box layout surprises.
  - Added a `var(--color-background, #FAF8F5)` fallback on the `body` background rule to harden against FOUC if the stylesheet is delayed.
  - Four `defer` findings recorded in `deferred-work.md`: shadow/elevation tokens, interactive-state (hover/focus/disabled) color tokens, HealthStatus robustness (pre-existing 1.1 pattern), and the absence of an automated App.tsx consumption test (no Vitest/RTL installed).

## Design Notes

**CSS custom properties over Tailwind:** Story 1.2 ACs permit "CSS custom properties **or** Tailwind config." The scaffold ships plain Vite + React with no Tailwind and no CSS-in-JS, and Story 1.3's components will be built with plain CSS. Custom properties are the lower-friction, dependency-free choice consistent with the current stack. Naming mirrors the DESIGN.md key paths (`--color-primary`, `--font-display`, `--spacing-gutter`, `--radius-md`) so the token name is a direct map to the design source.

**Golden example (`:root` custom properties + utility classes):**
```css
:root {
  --color-background: #FAF8F5;
  --color-surface: #FFFFFF;
  --color-primary: #6A6E9E;
  --font-display: Georgia, "Times New Roman", serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --spacing-page: 32px;
  --radius-sm: 4px; /* inputs */
  --radius-md: 8px; /* cards, buttons */
  --radius-full: 9999px; /* badges */
}
```
Utility classes (`.display`, `.display-sm`, `.body`, `.label`) are deliberately thin — they only map tokens to font-family/size/weight/line-height — and exist so App.tsx and Story 1.3's components have canonical reference points without each re-declaring fonts. These four names are the reserved typography-utility namespace; Story 1.3's component classes must not collide with them (`.label` in particular).

**Do not add component CSS here:** button/card/badge/skeleton/toast/empty-state rules land in Story 1.3. Story 1.2 ships tokens + the minimal base/utility classes needed to prove they work.

**px-anchored, not rem:** all spacing/typography tokens are fixed px values from DESIGN.md (16/24/32, 28/20/14/12). The App.tsx container refactor is an explicit `2rem`→`var(--spacing-page)` (32px) change, so it stays correct even if `html` font-size is ever altered.

**Deferred — tabular-nums & skeleton fill:** DESIGN.md's "tabular-nums on all numeric readouts" rule is not a token itself but must land in later components (scores/timers/IDs). Also, DESIGN.md is internally inconsistent on the skeleton fill (prose says background `#FAF8F5`, YAML `components.skeleton.background` says border `#E5E2DD`) — both are recorded in `deferred-work.md` so Story 1.3 resolves each deliberately instead of silently guessing.

**Unknown-token typo resilience:** a `var()` referencing a misspelled or renamed token resolves to nothing — the browser drops the declaration and the element is silently unstyled, unreported at build. Keep each token declaration exactly as named (`--color-*`, `--font-*`, `--spacing-*`, `--radius-*` mirrors of DESIGN.md) and rely on the build-time grep of dist for the canonical values to catch a consumer-side drift such as `--color-primry` (typos on the `:root` definition itself are low-risk; typos on the `var()` references are the class of drift the build check targets).

## Verification

**Commands:**
- `npm run typecheck` at `sms-frontend` -- expected: passes
- `npm run build` at `sms-frontend`, then grep `dist/assets/*.css` for `--color-background:#FAF8F5` and `--font-body` -- expected: vite build succeeds and the compiled CSS ships the token declarations

**Manual checks (if no CLI):**
- Open `localhost:5173` and inspect body — background is warm paper `#FAF8F5`, text is `#2D2D2D`, heading renders in Georgia serif. Devtools `computed` shows values sourced from `--color-*`/`--font-*` variables, not inline hex.

## Suggested Review Order

**Token source (design source of truth)**

- Single `:root` block carries the full DESIGN.md palette, typography, spacing, and radius scales — the whole design system lives here
  [`tokens.css:1`](../../sms-frontend/src/tokens.css#L1)

- Exact hex values are taken verbatim from DESIGN.md (background `#FAF8F5`, primary `#6A6E9E`, accent `#9B7E5A`)
  [`tokens.css:3`](../../sms-frontend/src/tokens.css#L3)

- Typography tokens map the two-family system — Georgia serif for display, system sans for body/label (UX-DR2)
  [`tokens.css:17`](../../sms-frontend/src/tokens.css#L17)

- Spacing (8/16/24/32 rhythm) and the four-tier radius scale (sm/md/lg/full) as tokens
  [`tokens.css:40`](../../sms-frontend/src/tokens.css#L40)

- Reset + utility classes: universal box-sizing, margin reset, `.display`/`.body`/`.label` (reserved namespace)
  [`tokens.css:53`](../../sms-frontend/src/tokens.css#L53)

**Token consumption (UI binding)**

- Heading binds the `.display` serif class; container padding comes from `--spacing-page` (2rem→32px px-anchored)
  [`App.tsx:6`](../../sms-frontend/src/App.tsx#L6)

- Error banner uses `var(--color-danger)` instead of the prior hardcoded `red`
  [`App.tsx:27`](../../sms-frontend/src/App.tsx#L27)

- Global import of `tokens.css` makes tokens available app-wide
  [`main.tsx:4`](../../sms-frontend/src/main.tsx#L4)

**Build integration**

- Vite client types reference so the `.css` import typechecks cleanly
  [`vite-env.d.ts:1`](../../sms-frontend/src/vite-env.d.ts#L1)

### Review Findings (2026-09-04 — code review of stories 1.1–1.3)

- [x] [Review][Patch] `--font-display` uses system sans-serif stack — spec requires Georgia serif [`tokens.css:33`] — changed to `Georgia, "Times New Roman", serif`
- [x] [Review][Patch] `--radius-sm`/`--radius-md` are 6px/10px — spec requires 4px/8px [`tokens.css:63-65`] — corrected to 4px/8px, `--radius-lg` also corrected to 12px
