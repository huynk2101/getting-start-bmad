import { useStore } from "../../mock/store.js";
import { Badge } from "../../components/index.js";

export function ResultsList() {
  const { exams, classes, navigate } = useStore();

  const finalizedExams = exams.filter((e) => e.status === "finalized");

  const getClassName = (classId: string) =>
    classes.find((c) => c.id === classId)?.name || classId;

  return (
    <div className="s-results-list">
      <h2 className="display-sm">Results</h2>
      {finalizedExams.length === 0 ? (
        <p className="s-text-muted">No graded exams yet. Results will appear here after you finalize grades.</p>
      ) : (
        <div className="s-results-items">
          {finalizedExams.map((exam) => (
            <div
              key={exam.id}
              className="s-result-item"
              onClick={() => navigate({ screen: "teacher-results-detail", params: { examId: exam.id } })}
            >
              <div className="s-result-item__main">
                <div className="s-result-item__title">{exam.title}</div>
                <div className="s-result-item__meta">{getClassName(exam.classId)}</div>
              </div>
              <div className="s-result-item__right">
                <Badge variant="graded">Finalized</Badge>
                <span className="s-result-item__count">{exam.totalStudents} students</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
