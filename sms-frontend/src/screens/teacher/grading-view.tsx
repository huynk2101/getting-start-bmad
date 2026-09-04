import { useState, useCallback, useRef } from "react";
import { useStore, type Route } from "../../mock/store.js";
import { useToast, Badge, Button } from "../../components/index.js";
import { InlineInput } from "../../components/demo/inline-input.js";
import { Toggle } from "../../components/demo/toggle.js";
import { ConfirmDialog } from "../../components/demo/confirm-dialog.js";
import "../../components/demo/inline-input.css";
import "../../components/demo/toggle.css";
import "../../components/demo/confirm-dialog.css";

interface GradingViewParams {
  examId: string;
}

interface GradeRow {
  studentId: string;
  studentName: string;
  score: number | undefined;
  gradingStatus: "pending" | "graded" | "absent";
  absent: boolean;
}

export function GradingView({ examId }: GradingViewParams) {
  const { getExam, getRosterForExam, getStudent, gradeStudent, setAbsent, finalizeGrades, navigate } = useStore();
  const { show } = useToast();
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const exam = getExam(examId);
  const rosterEntries = getRosterForExam(examId);

  if (!exam) return <p>Exam not found.</p>;

  const rows: GradeRow[] = rosterEntries.map((r) => ({
    studentId: r.studentId,
    studentName: getStudent(r.studentId)?.name || r.studentId,
    score: r.score,
    gradingStatus: r.gradingStatus,
    absent: r.absent,
  }));

  const gradedCount = rows.filter((r) => r.gradingStatus === "graded" || r.gradingStatus === "absent").length;
  const totalStudents = rows.length;
  const allDone = totalStudents > 0 && gradedCount === totalStudents;

  const gradedScores = rows.filter((r) => r.gradingStatus === "graded" && r.score !== undefined);
  const average = gradedScores.length > 0
    ? Math.round((gradedScores.reduce((sum, r) => sum + (r.score || 0), 0) / gradedScores.length) * 10) / 10
    : 0;

  const handleGradeSave = useCallback(
    (studentId: string, value: string) => {
      if (!/^\d{1,3}$/.test(value)) {
        setErrors((prev) => ({ ...prev, [studentId]: "Must be a number" }));
        return;
      }
      const num = parseInt(value, 10);
      if (num < 0 || num > 100) {
        setErrors((prev) => ({ ...prev, [studentId]: "Score must be 0–100" }));
        return;
      }
      setErrors((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
      gradeStudent(examId, studentId, num);
      const studentName = getStudent(studentId)?.name || studentId;
      show(`Grade saved for ${studentName}`);

      const currentIdx = rows.findIndex((r) => r.studentId === studentId);
      const nextPending = rows
        .slice(currentIdx + 1)
        .find((r) => r.gradingStatus === "pending");
      if (nextPending) {
        const input = inputRefs.current.get(nextPending.studentId);
        input?.focus();
      }
    },
    [examId, gradeStudent, getStudent, show, rows]
  );

  const handleAbsentToggle = useCallback(
    (studentId: string, absent: boolean) => {
      setAbsent(examId, studentId, absent);
    },
    [examId, setAbsent]
  );

  const handleFinalize = useCallback(() => {
    finalizeGrades(examId);
    setShowFinalizeConfirm(false);
    show("Grades finalized");
  }, [examId, finalizeGrades, show]);

  const handleViewStudent = useCallback(
    (studentId: string) => {
      navigate({ screen: "teacher-student-profile", params: { studentId } } as Route);
    },
    [navigate]
  );

  return (
    <div className="s-grading-view">
      <h2 className="display-sm">{exam.title} — Grading</h2>
      <p className="s-grading-view__sub">
        {totalStudents} students, {gradedCount} graded, {totalStudents - gradedCount} pending
      </p>

      <table className="s-grading-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
            <th scope="col">Status</th>
            <th scope="col" style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.studentId} className={row.absent ? "s-grading-row--absent" : undefined}>
              <td>{row.studentName}</td>
              <td>
                {row.gradingStatus === "graded" ? (
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{row.score} / 100</span>
                ) : row.gradingStatus === "absent" ? (
                  <span>—</span>
                ) : (
                  <InlineInput
                    placeholder="__"
                    onSubmit={(val) => handleGradeSave(row.studentId, val)}
                    disabled={row.absent}
                    error={errors[row.studentId]}
                    ref={(el) => {
                      if (el) inputRefs.current.set(row.studentId, el);
                    }}
                  />
                )}
              </td>
              <td>
                <Badge variant={row.gradingStatus === "graded" ? "graded" : row.gradingStatus === "absent" ? "absent" : "pending"}>
                  {row.gradingStatus === "graded" ? "Graded" : row.gradingStatus === "absent" ? "Absent" : "Pending"}
                </Badge>
              </td>
              <td style={{ textAlign: "right" }}>
                {row.gradingStatus === "graded" ? (
                  <Button size="sm" onClick={() => handleViewStudent(row.studentId)}>View</Button>
                ) : (
                  <Toggle
                    checked={row.absent}
                    onChange={(absent) => handleAbsentToggle(row.studentId, absent)}
                    label={row.absent ? "Present" : "Absent"}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="s-grading-summary">
        <span className="s-grading-summary__text">
          <strong>{gradedCount}</strong> of {totalStudents} graded &middot; Average score: <strong>{average}%</strong>
        </span>
        <Button
          disabled={!allDone}
          onClick={() => setShowFinalizeConfirm(true)}
        >
          Finalize Grades
        </Button>
      </div>
      <p className="s-grading-helper">Finalizing unlocks the correct answer breakdown for students.</p>

      <ConfirmDialog
        open={showFinalizeConfirm}
        title={`Finalize grades for ${exam.title}?`}
        description="This will unlock the correct answer breakdown for all students. This cannot be undone."
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={handleFinalize}
        onCancel={() => setShowFinalizeConfirm(false)}
      />
    </div>
  );
}
