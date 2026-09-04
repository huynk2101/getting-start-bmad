import { useStore } from "../../mock/store.js";
import { Card, Badge, Button } from "../../components/index.js";

interface ExamDetailParams {
  examId: string;
}

export function ExamDetail({ examId }: ExamDetailParams) {
  const { getExam, classes, navigate } = useStore();

  const exam = getExam(examId);
  if (!exam) return <p>Exam not found.</p>;

  const cls = classes.find((c) => c.id === exam.classId);

  return (
    <div className="s-exam-detail">
      <h2 className="display-sm">{exam.title}</h2>
      <Card padding="lg">
        <div className="s-exam-detail__info">
          <div><strong>Class:</strong> {cls?.name || exam.classId}</div>
          <div><strong>Schedule:</strong> {exam.date} {exam.time}</div>
          <div><strong>Duration:</strong> {exam.durationMinutes} minutes</div>
          <div><strong>Status:</strong> <Badge variant={exam.status === "finalized" ? "graded" : "pending"}>{exam.status}</Badge></div>
          <div><strong>Students:</strong> {exam.submittedCount}/{exam.totalStudents} submitted</div>
        </div>

        <div className="s-exam-detail__actions">
          {(exam.status === "open" || exam.status === "closed") && (
            <Button onClick={() => navigate({ screen: "teacher-grading", params: { examId: exam.id } })}>
              Grade
            </Button>
          )}
          {exam.status === "finalized" && (
            <Button onClick={() => navigate({ screen: "teacher-results-detail", params: { examId: exam.id } })}>
              View Results
            </Button>
          )}
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="s-section-title">Questions ({exam.questions.length})</h3>
        <div className="s-exam-detail__questions">
          {exam.questions.map((q, i) => (
            <div key={q.id} className="s-exam-detail__question">
              <span className="s-exam-detail__q-label">Q{i + 1}</span>
              <span className="s-exam-detail__q-text">{q.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
