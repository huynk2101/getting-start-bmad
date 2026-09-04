---
name: review-tech-currency
type: technology-currency-review
subject: 'ARCHITECTURE-SPINE.md (Student Management System)'
reviewer: technology-verification
reviewed: '2026-09-03'
verdict: 'CONCERNS'
status: complete
---

# Technology Currency Review — Architecture Spine

**Subject:** `ARCHITECTURE-SPINE.md`
**Date reviewed:** 2026-09-03 (all version data web-researched on this date)
**Verdict:** CONCERNS

This review verifies that every committed technology decision in the spine's **Stack** table
and its associated invariant rules (AD-1, AD-2, AD-3, AD-5, AD-10) is current for a **new**
project starting in 2026 — i.e., web-researched/reality-checked rather than asserted from
training data. No changes were made to the spine file.

---

## 1. Stack Table Audit (current-as-of-2026-09-03)

| Name | Spine | Current (web-verified) | Status |
| --- | --- | --- | --- |
| Node.js | 22 LTS | **24 LTS** (24.20.0, Active LTS); 26 enters LTS Oct 2026; 22 is Maintenance LTS | ⚠️ BEHIND |
| TypeScript | 5.x | **7.0.2** (latest, Aug 2026); **6.0** released Mar 2026; 5.x is 2 majors old | ⚠️ BEHIND |
| Express | 4.x | **5.x** (latest 5.2.1; 5.x is now npm default) | ⚠️ BEHIND |
| Prisma | 6.x | **7.x** (latest 7.10.0); v8 in RC | ⚠️ BEHIND |
| PostgreSQL | 16 | **18** (latest stable 18.6); 17 is current-but-mature; 16 still supported to 2028 | ⚠️ BEHIND |
| React | 19.x | **19.2.x** (latest 19.2.8); no React 20 exists | ✔ CORRECT |
| Vite | 6.x | **8.x** (latest 8.2.2, released Mar 2026); 7.x previous | ⚠️ BEHIND |
| React Router | 7.x | **8.x** (latest 8.3.1, released Jun 2026) | ⚠️ BEHIND |
| TanStack Query | 5.x | **5.102.x** stable for React; **6.x** in RC | ✔ CORRECT (5.x still stable) |
| Vitest | 3.x | **4.x** (latest 4.1.11); 5.x in RC | ⚠️ BEHIND |
| React Testing Library | latest | **16.3.x** (latest 16.3.3) | ✔ CORRECT (float) |
| Docker / docker-compose | latest | Docker Compose **5.5.0** (or v2.40.x in Docker Desktop); Docker Engine ~29+ | ✔ ACCEPTABLE (float) |

**Upshot:** 8 of 12 named technologies are behind their current major line for a 2026 greenfield
project. React, TanStack Query, React Testing Library and Docker are current/acceptable.

---

## 2. Item-by-Item Findings & Current Versions

### 2.1 Node.js — spine `22 LTS` → current **24 LTS** (Active)
- Node 24 entered LTS (May 2025, "Krypton"); latest 24.20.0, Active LTS until Oct 2026.
- Node 22 (Jod) is in **Maintenance** LTS (22.23.x); still supported but winding down.
- Node 26 (Current) goes LTS in Oct 2026.
- **Action for a new 2026 project:** pin Node 24 LTS (or start on it now; not 22).
- **Compatibility note:** React Router v8 requires Node 22.22+; Express 5 min is Node 18+ (fine either way), but a fresh build should use the Active LTS line.

### 2.2 TypeScript — spine `5.x` → current **7.0.2** (2 majors behind)
- TypeScript **6.0** released 2026-03-23 (final JS-ported release, "Strada").
- TypeScript **7.0** released 2026-07-08 (Go-based native compiler, "Corsa"), latest 7.0.2 (Aug 2026).
- The 5.x line the spine pins is effectively end-of-line/two majors old.
- **Action:** use TypeScript 7.x (or at minimum 6.x) for a greenfield project.

### 2.3 Express — spine `4.x` → current **5.x**
- Express **5.2.1** is now the npm `latest`/default (5.x became default on npm in late 2025).
- Express 5 requires Node 18+ and brings async error forwarding to error middleware, path-to-regexp v8, removed legacy APIs.
- 4.x (4.22.2) is still maintained but is the legacy line.
- **Action:** start new projects on Express 5.x, not 4.x. ES2019+ features in TS 7 also favor the current framework line.

### 2.4 Prisma — spine `6.x` → current **7.x**
- Prisma **7.0** released 2025-11-19 (Rust-free client default); latest **7.10.0** (Aug 2026). v8 is in RC.
- 7.x is a significant architecture change (Rust-free client, Prisma Postgres integration, query cache, partial indexes, compilerBuild).
- **Action:** adopt Prisma 7 for a fresh 2026 project.

### 2.5 PostgreSQL — spine `16` → current **18** (17 also mature)
- PostgreSQL **18.0** (Sep 2025), latest **18.6**; 18 is the current stable.
- PostgreSQL **17.11** is the previous-but-still-current line; **16** remains supported until Nov 2028.
- The spine's choice of 16 is two majors behind the current release. It is NOT EOL, so this is a softer miss, but a greenfield project in 2026 would normally start on 18 (or at least 17).
- **Action:** use PostgreSQL **18** (or 17) for a new project; 16 is defensible only for maximum ecosystem conservatism, not currency.

### 2.6 React — spine `19.x` → current **19.2.x** — ✔ CORRECT
- Latest stable is **19.2.8** (Jul 2026). There is **no React 20** (rumors persist; 19.2 is the intended "next" line via 19.2 minor releases).
- React 19 + 19.2 minor is the correct, current, recommended choice. No change needed.

### 2.7 Vite — spine `6.x` → current **8.x** (2 majors behind)
- **Vite 7.0** released Jun 2025; **Vite 8.0** released 2026-03-12 (Rolldown/unified Rust bundler), latest **8.2.2** (npm `latest`).
- Vite 6 is on the **security-patch-only** backport list and is no longer the actively supported line.
- create-vite is now v9.2.0 and scaffolds Vite 8 + React templates by default.
- **Action:** use Vite **8.x** (or 7.3.x) — Vite 6 is not the current recommended starter.

### 2.8 React Router — spine `7.x` → current **8.x** (1 major behind)
- **React Router 8.0** released 2026-06-17; latest **8.3.1**. v6 & Remix v2 declared EOL.
- v8 is ESM-only, requires React 19.2.7+, and aligns with Vite 8.
- **Action:** start on React Router **8.x**.

### 2.9 TanStack Query — spine `5.x` → current **5.102.x** — ✔ CORRECT (watch for v6)
- For React, the stable line is still **v5** (5.102.x). v6 is in RC for non-React adapters (Solid/Svelte/Vue) but React's v6 is not yet the stable default.
- **Action:** 5.x is correct/current; keep an eye out for a React v6 stabilization.

### 2.10 Vitest — spine `3.x` → current **4.x**
- **Vitest 4.0** released 2025-10-22; latest stable **4.1.11**. v5 is in RC (Aug 2026).
- Vitest 4.1 adds Vite 8 support and uses the installed Vite.
- **Action:** use Vitest **4.x** (4.1.x).

### 2.11 React Testing Library — spine `latest` → current **16.3.x** — ✔ CORRECT
- Latest **16.3.3** (Aug 2026). Pin-compatible with React 19. Float ("latest") is acceptable for a new project; consider pinning a major (16.x).

### 2.12 Docker / docker-compose — spine `latest` → current — ✔ ACCEPTABLE
- Docker Compose **5.5.0** (Aug 2026) / **v2.40.x** line inside Docker Desktop; Docker Engine ~29.
- "latest" is a reasonable convention; recommend pinning compose major + image tags (e.g., `postgres:18`) for reproducibility.

---

## 3. Claim Check: "React 19 + Vite 6 is the current recommended SPA starter"

- **React 19**: TRUE — still the current stable React, no React 20.
- **Vite 6**: FALSE / STALE — the current recommended Vite starter is **Vite 8** (create-vite 9.2 scaffolds Vite 8 + React). Vite 6 is 2 majors behind and on security-patch-only support.

So the greenfield-default claim in AD-2 / the Stack table is **half-current**: React 19 is right, Vite 6 is not.

---

## 4. Technology Existence & Paradigm Fit

All named technologies **still exist and are actively maintained** as of 2026, and all fit the
declared **REST API + SPA** paradigm:

- Backend: Express 5 + TypeScript 7 + Prisma 7 + PostgreSQL 18 — a standard, healthy REST stack.
- Frontend: React 19 + Vite 8 + React Router 8 + TanStack Query 5 — a standard SPA stack.
- Vitest 4 + React Testing Library 16 — standard unit/integration test tooling.
- Docker Compose (v2/v5) for local PostgreSQL container — standard.
- AD-5 rule (TanStack Query for server state) is consistent with current best practice.

No technology needs to be replaced because it no longer exists or no longer fits — the issue is
**version currency only**, not technology viability.

---

## 5. Recommended Version Corrections (proposed, NOT applied)

| Spine line | Correct 2026 target |
| --- | --- |
| Node.js 22 LTS | Node.js **24 LTS** (Active) |
| TypeScript 5.x | TypeScript **7.x** (or 6.x) |
| Express 4.x | Express **5.x** |
| Prisma 6.x | Prisma **7.x** |
| PostgreSQL 16 | PostgreSQL **18** (or 17) |
| React 19.x | React **19.2.x** (unchanged) |
| Vite 6.x | Vite **8.x** (or 7.3.x) |
| React Router 7.x | React Router **8.x** |
| TanStack Query 5.x | TanStack Query **5.102.x** (unchanged; watch v6) |
| Vitest 3.x | Vitest **4.x** |
| React Testing Library latest | React Testing Library **16.3.x** |
| Docker / docker-compose latest | pin compose major + image tags |

---

## 6. Methodology & Confidence

- All version claims cross-checked against primary/current sources on 2026-09-03:
  nodejs.org release blog, typescriptlang.org / MS devblogs, expressjs.com, prisma.io changelog,
  postgresql.org release notes, react.dev versions, vite.dev release notes, reactrouter.com changelog,
  TanStack docs, vitest.dev releases, gitHub testing-library releases, docker compose release feeds.
- Confidence in the "BEHIND" flags is HIGH (all current majors confirmed by package `latest` tags
  and official release announcements).

---

## 7. Summary

- **Verdict: CONCERNS.** The architecture is well-scoped and every chosen technology is viable for
  the REST API + SPA paradigm, but **8 of 12 pinned versions are behind** the current 2026 major
  lines, and the greenfield-default claim ("React 19 + Vite 6") is half-stale (Vite should be 8).
- The spine was, in several rows, effectively pinning a 2024-era toolchain for a 2026 project.
- **No changes were made to `ARCHITECTURE-SPINE.md`** — this is a review only; the re-pinning is
  proposed for the architect to apply in a follow-up edit.
