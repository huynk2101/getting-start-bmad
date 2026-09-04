import { useStore } from "../../mock/store.js";
import { Button, Badge, EmptyState } from "../../components/index.js";

export function StudentExamsList() {
  const { exams, classes, navigate } = useStore();

  const studentClasses = classes.filter((c) => c.studentIds.includes("s1"));
  const studentExams = exams.filter((e) =>
    studentClasses.some((c) => c.id === e.classId)
  );

  return (
    <div className="s-student-exams-list">
      <h2 className="display-sm">Exams</h2>
      {studentExams.length === 0 ? (
        <EmptyState
          heading="No exams available"
          body="No exams on the horizon. Enjoy the quiet."
        />
      ) : (
        <div className="s-exam-items">
          {studentExams.map((exam) => (
            <div key={exam.id} className="s-exam-item">
              <div className="s-exam-item__main">
                <div className="s-exam-item__title">{exam.title}</div>
                <div className="s-exam-item__meta">{exam.date} {exam.time} &middot; {exam.durationMinutes} min</div>
              </div>
              <div className="s-exam-item__right">
                <Badge variant={exam.status === "finalized" ? "graded" : "pending"}>
                  {exam.status}
                </Badge>
                {(exam.status === "upcoming" || exam.status === "open") && (
                  <Button onClick={() => navigate({ screen: "student-exam-taking", params: { examId: exam.id } })}>
                    Start
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
