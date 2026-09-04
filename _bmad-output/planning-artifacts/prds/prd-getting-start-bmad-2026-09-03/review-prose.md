# Prose Review — PRD: Student Management System

**Purpose/audience read:** This PRD exists to help the development team and stakeholders align on scope, features, and acceptance boundaries for a v1 Student Management System — a hobby project treated with production-grade rigor.

**Reader type:** humans — Microsoft Writing Style Guide in effect.

**Structure model (from structure pass):** Strategic/Context (Pyramid) — top-down, grouped context, MECE.

**Style/tone/voice analysis:** The author writes in a professional-but-accessible register: clear, direct, not stiff. Concrete personas (Mr. Chen, Ms. Rivera) ground abstract features in real workflows — this is a deliberate storytelling choice worth preserving. The document uses present-tense "Teacher can…" / "Student can…" for FRs, "If…then" for consequences and edge cases, and em-dash-asides for parenthetical context. The tone is confident without being assertive; it reads like an experienced PM speaking to a dev team, not like legal copy. These are all intentional and preserved throughout.

**Word metrics:** 3,198 total words (script-grounded).

---

## Findings

| Pass | Original Text | Revised Text | Changes |
| ---- | ------------- | ------------ | ------- |
| prose | §4.7 FR-21 — "The correct answer for each question is only shown after the teacher finalizes grades; until then it is shown as correct/incorrect only." | "Disclosure of correct answers follows FR-12.1 (finalize to unlock)." | Structure pass flagged this as a duplicate of FR-12.1 consequences; this prose revision replaces the verbatim repetition with a pointer, eliminating the comprehension friction of two competing disclosure rules (saves ~22 words; attach to surviving FR-12.1) |
| prose | §0 "No UX or architecture work has been done yet — this PRD establishes the 'what' before the 'how.'" | "UX and architecture decisions are deferred — this PRD establishes the 'what' before the 'how.'" | The claim is misleading: the document contains detailed user journeys, personas, and a PostgreSQL persistence decision. "Deferred" is accurate; "not done" is not (6 words) |
| prose | §5 "No attendance tracking — out of scope for v1. [ASSUMPTION]" | "No attendance tracking — out of scope for v1 [ASSUMPTION]" | Microsoft style: no period after a fragment-level parenthetical tag. Same pattern applies to §5 "No notifications (email/push) — students see results in-app only. [ASSUMPTION]" — remove the period before [ASSUMPTION] (2 words adjusted) |
| prose | §4.4 FR-10 consequences: "Grading page shows all enrolled students for the exam/test." / §4.4 FR-10 description: "Teacher can view a list of students who completed a specific exam/test" | FR-10 description: "Teacher can view a list of all enrolled students for a specific exam/test, with input fields for scores." | "students who completed" implies only submitted exams; the grading view includes all enrolled students (including absent). The consequences line is correct; the description contradicts it (8 words) |
| prose | §4.3 FR-9 "filterable by class and status (upcoming, completed)" | "filterable by class and status (upcoming, completed,)" — Consider: serial comma before "and" for consistency with lists elsewhere (e.g., §3 "name, schedule, and a teacher") | Missing serial comma in a list of two items with a conjunction; inconsistent with §3's three-item list that uses the serial comma. Microsoft style is permissive here; flag for author preference (?) |
| prose | §4.3 description ends: "Students see upcoming exams in their portal. Realizes UJ-3." | Complete the sentence: "Students see upcoming exams in their portal for their enrolled classes." | Sentence reads as complete but the qualifier "for their enrolled classes" is implied by the FRs and should be explicit — otherwise the reader infers a global exam feed (1 word added) |
| prose | §4.3 "manage their question sets" | "manage their questions" | "Question sets" is not defined in the glossary; "questions" is the glossary term. Unnecessary compound noun (2 words saved) |
| prose | §4.6 FR-18 "when the time limit expires" / "the system warns the student shortly before the time limit expires" | "when the exam's duration expires" / "the system warns the student shortly before the duration expires" | "the time limit" has no antecedent — the exam has a "duration" field (FR-6). Replace with the defined term (2 words) |
| prose | §2.3 UJ-5 "She sees a confirmation that her exam was submitted." | "She sees confirmation that her exam was submitted." | "A confirmation" is redundant — "confirmation" alone is the noun Microsoft style prefers in this construction (2 words saved) |
| prose | §2.3 UJ-1 "He sees all 4 classes with student counts and times in a single view." | "He sees all 4 classes — names, times, and student counts — at a glance." | Earlier in the same journey: "Dashboard shows today's classes in a timeline view" already establishes the layout. This sentence restates the climax with weaker phrasing; "at a glance" echoes the journey title and the §2.1 job-to-be-done, reinforcing the value proposition (net 0 words) |
| prose | §0 "It is built as a hobby project but treated with production-grade rigor." | "It is a hobby project built with production-grade rigor." | "but treated with" adds 3 words and creates a concessive clause that undermines the stated intent; "built with" is direct and preserves the author's voice (3 words saved) |

---

## Summary

- **Total recommendations:** 11 prose rows + 9 structure rows (from structure pass) = 20 total
- **Estimated word reduction if all accepted:** ~110 words structure + ~45 words prose = **~155 words — ~4.8%** of the 3,198-word original
- **Length target:** none provided; no target to assess against
- **Comprehension trade-offs:** No cuts sacrifice reader engagement. The FR-21/FR-12.1 consolidation and §0 rewording are the only prose changes that alter meaning — both improve accuracy. All other fixes are mechanical (serial comma, glossary alignment, wordiness) with zero engagement cost.

### Highest-impact prose fixes (top 5)

1. **FR-21 disclosure duplication** — replaces 22 words of verbatim repetition with a pointer to FR-12.1; eliminates the confusion of two competing rules for the same behavior.
2. **§0 misleading scope claim** — "No UX or architecture work" contradicts the document's own content; "deferred" is accurate and prevents stakeholders from dismissing the document's decisions.
3. **FR-10 description/consequences mismatch** — "students who completed" implies a subset; the grading page shows all enrolled students. Fix aligns description with the testable consequence.
4. **FR-18 undefined antecedent** — "the time limit" references nothing; the exam has a "duration" field. Using the defined term prevents ambiguity in implementation.
5. **Systematic "question sets" → "questions"** — aligns §4.3 description with the glossary, which defines "Question" as the atomic unit. "Sets" introduces an undefined concept.

### Intentional stylistic choices preserved

- Concrete personas (Mr. Chen, Ms. Rivera) throughout user journeys — maintained.
- "Teacher can…" / "Student can…" FR pattern — maintained (not converted to "The system shall…").
- Em-dash parenthetical context in descriptions — maintained.
- Informal-but-professional register ("does a few things well," "all in one spot") — maintained.
- Glossary-anchored vocabulary throughout — maintained.
- `[ASSUMPTION]` tag + §9 index cross-reference pattern — preserved.

### Minor fixes not tabulated

~3 further minor prose fixes (e.g., §4.5 description cut off mid-sentence at "and teacher details. Realizes UJ-5, UJ-6" — consider completing with "Students can view their schedule, exams, and results from the dashboard."); ask to expand.
