# Story 1.3 — Base Components

**Status:** `done`
**Epic:** 1 — Foundation & Authentication
**Story key:** `1-3-base-components-ux-dr4-ux-dr5-ux-dr6-ux-dr8`
**Iteration:** 0 -- initial planning.
**Repo focus:** `sms-frontend`

## Statement

As a developer,
I want the base UI components (button, card, badge, skeleton, toast, empty-state) implemented,
So that feature stories can compose consistent UI from a shared component library.

Coverage: UX-DR4 (component library), UX-DR5 (skeleton shimmer), UX-DR6 (toast), UX-DR8 (empty state), UX-DR19 (prefers-reduced-motion).

## Mission

Ship the reusable React component library that all feature stories (Epics 2-7) will compose. Every component consumes Story 1.2's design tokens. Because the acceptance criteria are behavioral (toast auto-dismiss, skeleton reduced-motion, badge variants), set up the declared test infrastructure (Vitest 4 + React Testing Library 16) and back each component with a unit test. This closes the verification gap deferred from Story 1.2 and resolves the token-source conflicts deferred there.

## Scope

**In scope (build 6 components + test infra):**

- `Button` — primary variant, sm/md sizes, disabled, focus ring.
- `Card` — surface, border, shadow, default/lg padding.
- `Badge` — 3 tinted variants (pending, absent, graded), pill shape.
- `Skeleton` — shimmer bar(s); respects `prefers-reduced-motion`.
- `Toast` — presentational + `ToastProvider`/`useToast`; bottom-center, auto-dismiss 3s.
- `EmptyState` — centered Georgia serif heading, muted body, single primary action.
- Barrel export `components/index.ts`.
- Components stylesheet(s) consuming `tokens.css`; token additions to `tokens.css` to resolve deferred items.
- Test infra: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` + `npm test` script.
- Unit tests for Button, Badge, Skeleton (reduced-motion), Toast (auto-dismiss 3s), EmptyState (copy/action).

**Out of scope (later stories use these):**

- Inline banner (error feedback) — Story 1.3 does not include it despite UX-DR4 listing it in the library; no AC references it. Belongs with an error-handling surface story.
- exam-question-card, progress-bar, timer, confirm-dialog — exam-taking-specific components (Stories 6.x).
- Toast keyboard/Escape dismissal is out of scope for v1 (`Escape` dismiss on toast is an interaction primitive, but Story 1.3 AC only requires auto-dismiss 3s; note as deferred).
- No router integration; components are fully presentational/provider-based.

## Constraints

**Decided stack (do NOT deviate):** React 19, TypeScript 7, Vite 8, plain CSS (no Tailwind, no CSS-in-JS), Vitest 4, RTL 16, jsdom.

**Source of truth:** `DESIGN.md` YAML color/typography/spacing/rounded tokens + Story 1.2 `tokens.css`. Do not introduce new hex values that aren't justified by DESIGN.md or already in `tokens.css`.

**Existing-facing behavior must not regress:** `App.tsx` (health fetch) keeps working. Importing the library must not change rendered output of current pages beyond intentional use.

**Accessibility floor (EXPERIENCE.md):** WCAG 2.2 AA contrast; visible focus ring on all interactive elements; `prefers-reduced-motion` disables all transitions; ARIA on interactive/status elements (`role="status"` for toast, `aria-label`/`aria-hidden` for skeleton).

**Code Map:** This passes through the following pre-existing or Story 1.2 files (read carefully before editing):
- `sms-frontend/src/tokens.css` — the token source of truth; add deferred tokens here (see Design Notes), do not duplicate.
- `sms-frontend/src/App.tsx`, `src/main.tsx` — existing surfaces that must keep working.
- `sms-frontend/package.json` — add test deps + `test` script.
- `sms-frontend/vite.config.ts` — add Vitest config (a `test` block, or a separate `vitest.config.ts`).

## Verification

If I can run this, check the following to be sure it works before calling it done:

- `npm run typecheck` in `sms-frontend` passes.
- `npm test` in `sms-frontend` passes (Vitest + RTL unit tests).
- `npm run build` in `sms-frontend` passes.
- Components render via a temporary showcase in `App.tsx` (visual smoke), or a dedicated dev-only preview; then reverted or kept minimal.
- Story 1.3 spec and `sprint-status.yaml` updated to `review`.

## Design Notes (→ Code Map)

These enable the component implementation. They resolve the Story 1.2 deferrals and lock in deliberate decisions where UX docs conflict.

1. **Test infra** — add to `package.json` devDeps: `vitest ^4`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`. Script `"test": "vitest run"`. Add `test` block to `vite.config.ts` (or `vitest.config.ts`) with `environment: "jsdom"` and a `setupFiles` that imports `@testing-library/jest-dom/vitest`. Vitest is read from Vite config.

2. **Token additions to `tokens.css`** (resolving Story 1.2 deferred items):
   - `--color-primary-disabled: #B0B2C8` (button disabled, DESIGN.md line 160).
   - `--color-focus-ring: #6A6E9E` (indigo, EXPERIENCE.md a11y "indigo ring"; use with a white/paper offset via `outline-offset: 2px` so it reads on the primary-or-white surface).
   - Shadows: `--shadow-card: 0 1px 3px rgba(0,0,0,0.06)` and `--shadow-toast: 0 4px 12px rgba(0,0,0,0.1)` (DESIGN.md lines 162-163, 181).
   - Badge tint colors (DESIGN.md prose lines 169-176): `--color-badge-pending-bg: #FDF5E6` / `--color-badge-pending-text: #9E8A5A`; `--color-badge-absent-bg: #FDECEC` / `--color-badge-absent-text: #B3544A`; `--color-badge-graded-bg: #EDF5ED` / `--color-badge-graded-text: #3E5D3E`.

3. **Skeleton fill — RESOLUTION of conflict:** DESIGN.md YAML (`{colors.border}` = #E5E2DD) and DESIGN.md prose (`{colors.background}` = #FAF8F5) disagree. DESIGN.md line 104 explicitly states Border is "used for … skeleton placeholder fills." Therefore skeleton fill = **`--color-border` (#E5E2DD)**, radius-md. Record the prose/YAML conflict in `deferred-work.md`.

4. **Toast position + duration — RESOLUTION of conflicts:** Story 1.3 AC (epics.md line 195) and DESIGN.md both say **bottom-center** + **auto-dismiss 3s**; EXPERIENCE.md line 76 says bottom-right, and DESIGN.md prose line 181 says 4s. Lock in **bottom-center + 3s** (AC is authoritative). Record the EXPERIENCE.md discrepancy in `deferred-work.md`.

5. **Badge is tinted, not filled:** DESIGN.md prose + Do's/Don'ts ("Use tinted badges — light background + colored text") override the YAML `background: {colors.warning}` with white text. Variants = pending/absent/graded only.

6. **Component class naming:** global plain-CSS class names must be collision-safe (Story 1.2 already reserves `.display`/`.label`). Use prefixed class names: `s-button`, `s-card`, `s-badge`, `s-badge--pending|absent|graded`, `s-skeleton`, `s-toast`, `s-toast-wrap`, `s-empty-state`. Co-locate a `.css` per component (e.g. `Button.css`) and import it in the `.tsx`.

7. **Component APIs (TypeScript, forwardRef not required for v1):**
   - `<Button variant="primary" size="md|sm" disabled onClick>` → `<button className="s-button">`.
   - `<Card padding="default|lg">` → `<div className="s-card">`.
   - `<Badge variant="pending|absent|graded">` → pill, tinted, 11px/600.
   - `<Skeleton width height className style>` → geometric shimmer rect, radius-md, fill border; shimmer disabled under reduced motion (CSS `@media (prefers-reduced-motion: reduce)`), `aria-hidden="true"` (no text content).
   - `<ToastProvider><ToastConsumer/…>` — `useToast()` returns `{ show(msg, variant?), dismiss }`; renders a bottom-center stack; each toast: surface bg, border, shadow-toast, auto-dismiss via `setTimeout(3000)` cleaned up on unmount; `role="status"`.
   - `<EmptyState heading body actionLabel onAction actionDisabled>` → centered, `.display-sm` serif heading, muted body, single primary `Button`; max-width 320px.

8. **Testing approach per component** (behaviors only — snapshot-free):
   - `Button`: renders, disabled prevents click.
   - `Badge`: renders 3 variants + correct class.
   - `Skeleton`: renders; reduced-motion present → no `s-skeleton--shimmer` class (assert via `window.matchMedia` mock).
   - `Toast`: `useToast().show()` → appears; after 3s (fake timers) → gone; `role="status"`.
   - `EmptyState`: heading/body/action render; action click calls `onAction`; actionDisabled disables.

## Assumptions

- Vitest 4 + RTL 16 are compatible with the pinned React 19 / TS 7 / Vite 8 set (epic stack declares them).
- Vitest picks up `vite.config.ts` test block without a separate config file (can fall back to `vitest.config.ts` if the merge conflicts with the Vite `server`/`build` config).
- Component styles co-located per component is acceptable next to the single `tokens.css`; no CSS modules — project uses global plain CSS.
- No dark mode, no i18n — beyond current scope.

## Blockers

- None identified at planning time. If a pinned package version is unavailable, fall to the nearest compatible 4.x / 16.x and record in the Change Log.

## Acceptance Checklist (as-written)

- [ ] skeleton renders shimmer bars, not spinners, matching expected layout shape (UX-DR5)
- [ ] `prefers-reduced-motion` → shimmer disabled, static placeholders (UX-DR19)
- [ ] toast triggers, appears bottom-center, auto-dismisses after 3s, surface bg + card shadow (UX-DR6)
- [ ] empty-state: centered Georgia serif heading, muted body, single primary action, warm copy (UX-DR8)
- [ ] badge supports the 3 DESIGN.md variants (UX-DR4)
- [ ] `npm run typecheck`, `npm test`, `npm run build` all pass
- [ ] story and sprint status set to `review`

## Suggested Review Order

- `sms-frontend/src/tokens.css` (token additions)
- `sms-frontend/src/components/Button.tsx` + `Button.css` + `Button.test.tsx`
- `sms-frontend/src/components/Badge.tsx` + `Badge.css` + `Badge.test.tsx`
- `sms-frontend/src/components/Skeleton.tsx` + `Skeleton.css` + `Skeleton.test.tsx`
- `sms-frontend/src/components/Toast.tsx` + `Toast.css` + `Toast.test.tsx`
- `sms-frontend/src/components/EmptyState.tsx` + `EmptyState.css` + `EmptyState.test.tsx`
- `sms-frontend/src/components/index.ts` (barrel)
- `sms-frontend/vite.config.ts` / `vitest.config.ts` + `package.json` (test infra)

## Spec Change Log

| When | What | Why |
|---|---|---|
| Plan | Created initial spec | Story 1.3 planning |
| Impl | Added `--text-badge`, `--color-skeleton-shimmer`, `--shadow-card`, `--shadow-toast`, `--color-primary-disabled`, `--color-focus-ring` + 6 badge tint tokens to `tokens.css` | Resolve Story 1.2 deferred items (shadows, interactive-state, skeleton fill) consumed by the components |
| Impl | Added Vitest 4 + jsdom + RTL to frontend; `npm test`; tests for Button/Card/Badge/Skeleton/Toast/EmptyState | Behavioral ACs needed automated verification (user-approved scope) |
| Review | Toast: added `dismiss` to `useToast` context API, timer cleanup on unmount, module-scoped id counter, `role="status"` moved to wrapper (a11y), `max-width`+`word-break` | Findings: API contract, leak, id collision, screen-reader noise, long-message overflow |
| Review | Skeleton: lazy-init reduced-motion (no shimmer flash), `{...rest}` before explicit `aria-hidden`; `width`/`height` win over `style` | Findings: reduced-motion flash, aria-hidden override |
| Review | EmptyState: extends `HTMLAttributes`, forwards `...rest`, disables action when no `onAction` | Findings: API inconsistency, fire-on-missing-handler |
| Review | Badge/Skeleton tokenized hardcoded px/hex; added Card.test.tsx + strengthened tests | Findings: magic numbers, coverage gaps |

## Notes

- Story 1.2 deferred items (tabular-nums rule, skeleton-fill conflict, shadow/elevation tokens, interactive-state colors, App consumption test) — this story resolves #skeleton-fill, #shadow, #interactive-state; see `deferred-work.md`.

### Review Findings (2026-09-04 — code review of stories 1.1–1.3)

- [x] [Review][Patch] Skeleton listener-cleanup test is a no-op — mock never registers real listeners [`Skeleton.test.tsx:46-50`] — rewrote test to spy on addEventListener/removeEventListener and verify cleanup on unmount
