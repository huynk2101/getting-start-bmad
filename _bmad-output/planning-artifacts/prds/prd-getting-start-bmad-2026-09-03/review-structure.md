# Structure Review — PRD: Student Management System

**Purpose/audience read:** This PRD exists to help the development team and stakeholders align on the "what" (not yet the "how") of a hobby-but-production-grade Student Management System — scope, features, and the acceptance boundaries for a v1 web app.

**Reader type:** humans (default) — Microsoft Writing Style Guide in effect.

**Structure model chosen:** Strategic/Context (Pyramid) — the reference shape for PRDs: top-down, grouped context, most critical first, MECE, evidence supporting arguments.

**Model fit:** Good overall fit. Vision → Target User → Features → Scope → Metrics follows the pyramid (conclusion/scope surfaced via Non-Goals and MVP Scope; features as the supporting detail). The main gaps against the model are (a) true redundancy between Non-Goals and MVP Out-of-Scope, (b) duplicated correct-answer-disclosure logic across two FRs, and (c) a thin Success Metrics section that evidences only 5 of 23 FRs.

Word metrics: 3,198 total words. All numbers below are grounded in those counts.

---

## Findings

| Pass | Original Text | Revised Text | Changes |
| ---- | ------------- | ------------ | ------- |
| structure | §5 Non-Goals (~93 words) + §6.2 Out of Scope for MVP (~80 words) | MERGE: Make §5 Non-Goals the single authority; trim §6.2 to only the items §5 does not already carry (essay/free-text & fill-in-blank question types, question bank, exam-time-limit enforcement) plus one pointer line ("Items already listed in §5 Non-Goals are omitted here.") | True redundancy: both list admin dashboard, parent portal, attendance tracking, report cards/PDF, notifications, mobile app, SIS/LMS, file attachments — near-verbatim, no reinforcement value. Keep one source of truth (saves ~55 words) |
| structure | §4.7 FR-21: "The correct answer for each question is only shown after the teacher finalizes grades; until then it is shown as correct/incorrect only." (+ the two preceding consequences lines) | CONDENSE: "...shows a per-question breakdown (question, student's answer, correct/incorrect). Disclosure of correct answers follows FR-12.1 (finalize to unlock)." | Duplicates FR-12.1 consequences verbatim. Replace with a pointer to the single source of truth (saves ~30 words) |
| structure | §2.3 UJ-5 edge case: "If she loses internet connection mid-exam, her answers are saved locally... synced when connection is restored" and UJ-2 edge case ("If the student has no exam results...") | CONDENSE: The journey edge cases that restate an FR consequence should point to the FR ("Edge case: per FR-19 / FR-5") instead of re-typing it | Cross-cutting journeys are valuable for humans, but several repeat FR consequences word-for-word; a pointer keeps the journey narrative while removing duplication (saves ~25 words) |
| structure | §2 Target User — heading directly followed by subheadings (0 words under the heading) | ADD one framing line, e.g. "Two roles define v1 scope; three groups are explicitly out of scope." | Missing scaffolding: the reader gets no orientation sentence before the headings; a single lead-in front-loads the reader (adds ~12 words, net-zero vs. cuts) |
| structure | §7 Success Metrics — SM-1, SM-2 validate only FR-1, FR-2, FR-16, FR-17, FR-18 (5 of 23 FRs) | QUESTION: Are metrics intended to cover the full feature set, or are they smoke-level acceptance checks? If the former, add coverage for class management, grading, and authentication | Pyramid rule "evidence supports arguments" isn't met — metrics are the evidence layer and currently cover ~22% of features. Not a cut; a scope decision for the author |
| structure | §4.8 Authentication placed last among Features | MOVE (optional) / QUESTION: Consider placing Authentication as §4.1 — it is the cross-cutting entry point every other feature depends on | Ordering note: logically, auth precedes all teacher/student features. Leaving it last is acceptable as a catch-all grouping; flag for author preference (no word change) |
| structure | §6.1 In Scope (~72 words) | PRESERVE — keep at-is | The In Scope list restates the Features section, but as the pyramid's top-level scope conclusion it is intentional, front-loaded reinforcement, not wasteful redundancy |
| structure | §9 Assumptions Index (~195 words) | PRESERVE — keep at-is | Repeated inline `[ASSUMPTION]` tags plus this index is a valid cross-reference pattern for a PRD; the index is the random-access map. Not true redundancy |
| structure | §4.4 FR-12.1 "Finalize grades" sub-numbered 12.1 and cross-referenced by FR-21 | CONDENSE (minor): If keeping FR-12.1's numbering, add one traceability line under 4.7 pointing at it (covered by the FR-21 change above) | Sub-numbering artifact (FR-12.1 under FR-12) is clear enough; no change required beyond the FR-21 pointer (0 words) |

---

## Summary

- **Recommendations:** 9 (3 PRESERVE / 4 actionable cuts-merges / 2 QUESTION)
- **Estimated word reduction if all accepted:** ~110 words — **~3.4%** of the 3,198-word original
- **Length target:** none provided; no target to assess against
- **Comprehension trade-offs:** The main cuts (Non-Goals vs. Out-of-Scope merge, FR-21 pointer) remove verbatim duplication without losing meaning or reader engagement. The UJ-5/UJ-2 edge-case consolidation is the only cut that trims reader-oriented narrative detail — recommend keeping one or two journeys fully expanded if the author values the human journey walkthroughs.
- **Biggest wins:** all three top rows — each removes true redundancy while preserving a single source of truth.
