# Accessibility review — Modern & Minimal redesign (2026-09-04)

Lens scope: WCAG 2.2 AA contrast verification of the new palette tokens and their concrete usage in DESIGN.md, EXPERIENCE.md, and the `sms-frontend` demo.

## Method

Computed relative-luminance contrast for every token pair and audited every CSS `var(--color-…)` usage to confirm each token is only used on backgrounds where it clears AA. All three tinted-badge pairs and all fill-with-white pairs were checked, plus muted/secondary text across every surface (white, background, exam surface).

## Findings

- **[critical] `text-muted` fails AA on the exam surface.** `text-muted #64748B` on `--color-exam-surface #F1F5F9` = **4.34:1**, below the 4.5:1 AA floor for normal text. Muted helper text (timestamps, "Your teacher has not yet published correct answers", meta lines) renders inside `inline-banner` and `exam-question-card`, which use the exam-surface background.
  - *Fix applied:* `text-muted` → slate-600 `#475569` in DESIGN.md Color tokens and `tokens.css`. Verified: 7.58:1 on white, 7.24:1 on background, **6.92:1 on exam surface** — AA on every surface.
- **[high] `accent` used as a text color, not just the decorative border.** `role-login.css` styles `.s-role-login__role` (the "TEACHER"/"STUDENT" label) with `color: var(--color-accent)`. `#64748B` on the login background `#F8FAFC` = 4.55:1 (a very tight pass), but this violates DESIGN.md's rule that accent is decorative-only (note-callout border) and leaves no margin.
  - *Fix applied:* switched `.s-role-login__role` to `var(--color-text-muted)` (now `#475569`, 7.24:1 on background) — larger margin and spec-consistent.
- **[low] Inaccurate contrast claim.** EXPERIENCE.md Accessibility Floor cited "Blue-on-slate … verified at 5.2:1"; the true ratio is **4.94:1**.
  - *Fix applied:* corrected to 4.94:1 and added the verified muted-text note.

## Verified clean (AA for normal text)

- Primary `#2563EB` on surface 5.17:1 · on background 4.94:1 ✓
- White on primary (button text) 5.17:1 ✓
- Text `#0F172A` on background 17.06:1 ✓
- Badge pairs: pending `#B45309`/`#FFFBEB` 4.84:1 · absent `#B91C1C`/`#FEF2F2` 5.91:1 · graded `#15803D`/`#F0FDF4` 4.79:1 ✓
- Fills: white on success 5.02:1 · white on danger 6.47:1 · white on accent-foreground 4.76:1 ✓
- Timer danger `#B91C1C` on exam surface 5.91:1 ✓
- Accent border `#64748B` on white 4.76:1 (decorative) ✓

## Verdict

All palette pairs now meet or exceed WCAG 2.2 AA (≥4.5:1, ≥3:1 for the decorative accent border). No remaining contrast failures. Evidence: `tokens.css`, `role-login.css`, corrected `EXPERIENCE.md`.
