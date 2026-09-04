import { useStore } from "../../mock/store.js";
import { Badge } from "../../components/index.js";
import { InlineBanner } from "../../components/demo/inline-banner.js";
import "../../components/demo/inline-banner.css";

interface StudentResultDetailParams {
  examId: string;
}

export function StudentResultDetail({ examId }: StudentResultDetailParams) {
  const { getExam, results } = useStore();

  const exam = getExam(examId);
  const result = results.find((r) => r.examId === examId && r.studentId === "s1");

  if (!exam) return <p>Exam not found.</p>;

  const isPending = !result || !result.submitted || result.score === undefined;
  const isFinalized = exam.status === "finalized";
  const score = result?.score;
  const percentage = score !== undefined ? `${score}%` : "—";

  return (
    <div className="s-student-result-detail">
      <div className="s-result-header">
        <div>
          <h2 className="display-sm">{exam.title} — Your Results</h2>
          <div className="s-result-header__status">
            <Badge variant={isPending ? "pending" : "graded"}>
              {isPending ? "Pending" : "Graded"}
            </Badge>
          </div>
        </div>
        <div className="s-score-display">
          <span className="s-score-big">{isPending ? "—" : score}</span>
          <span className="s-score-pct">{isPending ? "/ 100" : `/ 100 · ${percentage}`}</span>
        </div>
      </div>

      {isPending ? (
        <p className="s-text-muted">
          Your teacher has not yet graded this exam. Your score will appear here after grading.
        </p>
      ) : isFinalized ? (
        <div className="s-student-result-detail__breakdown">
          <h3 className="s-section-title">Question Breakdown</h3>
          {exam.questions.map((q, i) => {
            const studentAnswer = result?.answers?.[q.id];
            const isCorrect = studentAnswer === q.correctIndex;
            const hasAnswered = studentAnswer !== undefined;
            return (
              <div key={q.id} className="s-q-row">
                <span className="s-q-label">Q{i + 1}</span>
                <span className="s-q-text">{q.text}</span>
                <div className="s-q-answer">
                  {hasAnswered ? (
                    <div>Your answer: <strong>{q.options[studentAnswer].label}. {q.options[studentAnswer].text}</strong></div>
                  ) : (
                    <div>No answer</div>
                  )}
                  {!isCorrect && (
                    <div className="s-q-expected">Correct answer: <strong>{q.options[q.correctIndex].label}. {q.options[q.correctIndex].text}</strong></div>
                  )}
                </div>
                <span className={`${isCorrect ? "s-q-correct" : "s-q-incorrect"}`}>
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="s-text-muted">
          Your score is ready, but the correct answer breakdown will be available once the teacher finalizes the exam.
        </p>
      )}

      {!isPending && isFinalized && (
        <InlineBanner variant="note">
          Your teacher has finalized these results — full correct answer breakdown is now available.
        </InlineBanner>
      )}
    </div>
  );
}
