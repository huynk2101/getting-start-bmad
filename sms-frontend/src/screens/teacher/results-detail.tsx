import { useStore } from "../../mock/store.js";
import { Card, Badge } from "../../components/index.js";
import { DataTable } from "../../components/demo/data-table.js";
import "../../components/demo/data-table.css";

interface ResultsDetailParams {
  examId: string;
}

export function ResultsDetail({ examId }: ResultsDetailParams) {
  const { getExam, getRosterForExam, getStudent } = useStore();

  const exam = getExam(examId);
  const roster = getRosterForExam(examId);

  if (!exam) return <p>Exam not found.</p>;

  const gradedRows = roster
    .filter((r) => r.gradingStatus === "graded")
    .map((r) => ({
      ...r,
      studentName: getStudent(r.studentId)?.name || r.studentId,
    }));

  const average = gradedRows.length > 0
    ? Math.round((gradedRows.reduce((sum, r) => sum + (r.score || 0), 0) / gradedRows.length) * 10) / 10
    : 0;

  return (
    <div className="s-results-detail">
      <h2 className="display-sm">{exam.title} — Results</h2>
      <div className="s-results-detail__stats">
        <span>Average: <strong>{average}%</strong></span>
        <span>Graded: <strong>{gradedRows.length}/{roster.length}</strong></span>
      </div>

      <DataTable
        columns={[
          { key: "name", header: "Name", render: (row) => row.studentName },
          {
            key: "score",
            header: "Score",
            align: "right",
            render: (row) => <span style={{ fontVariantNumeric: "tabular-nums" }}>{row.score} / 100</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge variant="graded">Graded</Badge>,
          },
        ]}
        data={gradedRows}
      />

      <Card padding="lg">
        <p className="s-grading-helper">Finalizing unlocks the correct answer breakdown for students.</p>
      </Card>
    </div>
  );
}
