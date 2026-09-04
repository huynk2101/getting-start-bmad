# PRD Quality Review — Student Management System

## Overall verdict
**Adequate.** The PRD is well-structured, has a clean glossary, testable consequences on every FR, and honest scope boundaries — more rigor than most hobby PRDs. Two things are at risk: (1) the Grade Finalize feature (FR-12.1) arrived late, broke the FR numbering, and sits partially outside the grading section's own description, which will confuse story sequencing; (2) the success metrics are too thin to validate the PRD's own thesis (consolidation over spreadsheets) — they measure load speed and submission completion, not whether the tool actually replaces the spreadsheet workflow. Neither is a blocker at hobby stakes, but the FR-12.1 discontinuity should be patched before architecture handoff.

## Decision-readiness — adequate

The PRD makes real choices and names what it cuts. Non-goals §5 is specific and non-generic — "no attendance tracking," "no file attachments" are concrete deferrals, not weasel phrases. The single Open Question §8 is genuinely open (CSV import) and scoped to a clear decision.

The main gap is that several `[ASSUMPTION]` items are treated as settled design decisions in the FR text but not escalated to Open Questions. §4.6 FR-18 says "warning shown 60 seconds before" — that's a specific UX choice masquerading as an assumption. A decision-maker scanning this PRD would not realize the warning window is unconfirmed. Similarly, §4.7 FR-21 (per-question breakdown) is a significant UX commitment downstream.

### Findings
- **medium** Unconfirmed UX commitments tagged as assumptions (§4.6 FR-18, §4.7 FR-21) — These are design decisions that should either be confirmed with a `[ASSUMPTION]` that reads as provisional, or escalated to Open Questions. As written, they look like facts. *Fix:* Promote the 60-second warning and question-by-question breakdown to Open Questions, or add a `[NOTE FOR PM]` confirming they are provisional defaults.
- **low** Single Open Question is thin (§8) — Only one item is listed. For a PRD with ~15 indexed assumptions, more of them likely deserve a decision call. *Fix:* Scan Assumptions Index and promote any that block architecture (e.g., question presentation mode in UJ-5) to Open Questions.

## Substance over theater — strong

No persona theater: two roles (Teacher, Student), both grounded in JTBD statements §2.1 that directly map to features. No innovation theater — the Vision §1 explicitly says "does a few things well." No NFR theater — there are no boilerplate scalability or reliability claims. No Vision theater — the Vision is specific ("empowers teachers to manage classes, students, exams, and tests from a single dashboard") and cannot be copy-pasted into an LMS PRD.

This is clean work.

## Strategic coherence — adequate

The thesis is clear: replace spreadsheets and paper with a purpose-built tool for classroom workflows (§1). Features follow from it: dashboard → class management → exams → grading → student portal forms a logical workflow arc.

The weak point is the Success Metrics §7. SM-1 validates dashboard load time, SM-2 validates exam submission. Neither validates the thesis that the tool *replaces the spreadsheet*. The metrics measure that the software works, not that it solves the stated problem. For hobby stakes this is fine — the developer knows if they'd use it — but the metrics as written are decoupled from the Vision.

### Findings
- **medium** Success metrics don't validate the thesis (§7) — SM-1 measures load speed; SM-2 measures submission success. Neither answers "does this replace the spreadsheet?" *Fix:* Add at least one usage/retention metric or a qualitative criterion (e.g., "Mr. Chen uses the dashboard instead of his spreadsheet for 5 consecutive school days").
- **low** Counter-metric SM-C1 is generic boilerplate — "do not sacrifice accuracy for speed" doesn't measure anything. *Fix:* Drop it or replace with a real constraint (e.g., "exam submission must complete within 3 seconds of student action").

## Done-ness clarity — strong

Every FR (FR-1 through FR-23) has at least one testable consequence. No "handles X gracefully" or "reasonable performance" language. Consequences are concrete: "Dashboard loads and displays all classes for the authenticated teacher filtered by today's date" (§4.1 FR-1). Even edge cases have empty states specified (§4.1 FR-1, §4.2 FR-5, §4.5 FR-13).

The only friction point is FR-12.1, which breaks the numbering pattern and whose consequences are slightly less precise than its siblings ("unlocks the correct-answer disclosure once at least the teacher confirms grading is complete" — the "at least" is ambiguous; does it mean one click, or a confirmation dialog?).

### Findings
- **low** FR-12.1 numbering discontinuity (§4.4) — FR-12.1 is a sub-feature of FR-12 but reads as a peer. Downstream story creation may treat it as separate. *Fix:* Renumber to FR-13 and shift subsequent FRs, or clearly nest it under FR-12 with a "b)" suffix.
- **low** FR-12.1 acceptance ambiguity (§4.4) — "once at least the teacher confirms grading is complete" is vague about what the confirmation UI looks like. *Fix:* Specify: e.g., "teacher clicks 'Finalize Grades' button; a confirmation dialog appears; upon confirmation, correct-answer disclosure is unlocked for all students."

## Scope honesty — strong

Non-goals §5 is explicit and itemized. Out-of-scope §6.2 is comprehensive and mirrors §5 without duplication. The Assumptions Index §9 is well-maintained with 17 entries, each cross-referenced to its source location. `[ASSUMPTION]` tags appear inline throughout the FRs. The habit of tagging assumptions is consistent and disciplined.

The only gap: the Open Questions section §8 is underpopulated relative to the assumption count, as noted in Decision-readiness.

### Findings
- **low** Open Questions underpopulated (§8) — 1 Open Question vs. 17 indexed assumptions. *Fix:* Promote 2-3 architecture-blocking assumptions to Open Questions (exam presentation mode, offline sync approach).

## Downstream usability — adequate

The glossary §3 is tight, consistent, and covers all domain nouns. IDs are contiguous (FR-1 through FR-23, UJ-1 through UJ-6, SM-1 through SM-C1). Cross-references resolve cleanly — each feature states "Realizes UJ-X." Each UJ has a named protagonist (Mr. Chen, Ms. Rivera).

The friction point is FR-12.1: it breaks contiguity. Also, the In Scope §6.1 list uses plain English while the FRs use numbered IDs — a minor inconsistency that forces cross-referencing.

### Findings
- **medium** FR-12.1 breaks contiguity (§4.4) — FR-12 is followed by FR-12.1, then FR-13. Downstream tooling or scripts that enumerate FRs by regex will miss the sub-number or break. *Fix:* Renumber to FR-13 and shift subsequent FRs by +1.
- **low** In Scope list doesn't reference FR IDs (§6.1) — Forces a manual mapping between scope items and FRs. *Fix:* Append FR references in parentheses to each scope item, e.g., "Teacher dashboard with daily class overview (FR-1, FR-2)."

## Shape fit — strong

This is a hobby-stakes PRD for a two-role web app. The PRD shape (Vision → UJs → Glossary → Features with FRs → Non-Goals → Scope → Metrics) is appropriate. UJs are load-bearing here — they describe real user workflows, not decorative personas. The rigor is calibrated correctly: more than a napkin sketch, less than a regulatory compliance document. The "build it like a real project" intent is honored without over-formalizing.

## Mechanical notes

- **Glossary drift:** None detected. "Class," "Student," "Teacher," "Exam," "Test," "Score," "Result" are used consistently throughout. Plurals and possessives are handled correctly. "Test" and "Exam" are distinguished in the glossary §3 and used consistently (FR-6 says "exam or test," FR-7 says "exam/test"). Clean.
- **ID continuity:** FR-12.1 breaks the FR numbering sequence. UJ-1 through UJ-6 are contiguous. SM-1, SM-2, SM-C1 are contiguous. FR-23 is the terminal FR. If FR-12.1 is renumbered, FR-13 through FR-23 all shift by +1.
- **Assumptions Index roundtrip:** All 17 index entries (§9) map to inline `[ASSUMPTION]` tags. Spot-checked §4.6 FR-17 (question navigation), §4.6 FR-19 (offline sync), §4.8 FR-22 (session maintenance) — all present inline and in index. The inline tag in §6.2 line 354 ("[ASSUMPTION]") is not in the index — it tags the out-of-scope item "exam time limit enforcement" which is reasonable as a non-goal but the tag is orphaned.
- **UJ protagonist naming:** UJ-1 through UJ-4 use Mr. Chen (teacher). UJ-5 and UJ-6 use Ms. Rivera (student). Both named at the start of each UJ. No floating UJs.
- **Orphaned ASSUMPTION tag:** §6.2 line 354 has `[ASSUMPTION]` on the out-of-scope item "Exam time limit enforcement" — this is not indexed in §9. *Fix:* Either add it to the Assumptions Index or remove the tag (it's a scope decision, not an assumption).
