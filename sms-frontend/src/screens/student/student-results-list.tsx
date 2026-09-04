import { useStore } from "../../mock/store.js";
import { Badge } from "../../components/index.js";

export function StudentResultsList() {
  const { results, exams, navigate } = useStore();

  const studentResults = results.filter((r) => r.studentId === "s1");

  return (
    <div className="s-student-results-list">
      <h2 className="display-sm">Results</h2>
      {studentResults.length === 0 ? (
        <p className="s-text-muted">No results yet — your scores will appear here after your teacher grades your exams.</p>
      ) : (
        <div className="s-result-items">
          {studentResults.map((r) => {
            const exam = exams.find((e) => e.id === r.examId);
            return (
              <div
                key={r.examId}
                className="s-student-result-item"
                onClick={() => navigate({ screen: "student-result-detail", params: { examId: r.examId } })}
              >
                <div className="s-result-item__main">
                  <div className="s-result-item__title">{exam?.title || r.examId}</div>
                  <div className="s-result-item__meta">
                    {r.submitted ? (r.score !== undefined ? "Graded" : "Pending") : "Not submitted"}
                  </div>
                </div>
                <div className="s-student-result-item__right">
                  <span className="s-result-item__score">
                    {r.submitted && r.score !== undefined ? (
                      <>
                        <span className="s-result-item__score-big">{r.score}</span>
                        <span className="s-result-item__score-pct"> / 100</span>
                      </>
                    ) : (
                      "— / 100"
                    )}
                  </span>
                  <Badge variant={r.submitted && r.score !== undefined ? "graded" : "pending"}>
                    {r.submitted && r.score !== undefined ? "Graded" : "Pending"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
