import { useStore } from "../../mock/store.js";
import { Badge, Button } from "../../components/index.js";

export function ExamsList() {
  const { exams, classes, navigate } = useStore();

  const getClassName = (classId: string) =>
    classes.find((c) => c.id === classId)?.name || classId;

  const statusVariant = (status: string) => {
    if (status === "finalized") return "graded" as const;
    if (status === "open") return "pending" as const;
    return "pending" as const;
  };

  return (
    <div className="s-exams-list">
      <div className="s-exams-list__header">
        <h2 className="display-sm">Exams</h2>
        <Button onClick={() => navigate({ screen: "teacher-create-exam" })}>Create Exam</Button>
      </div>
      <div className="s-exams-items">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="s-exam-item"
            onClick={() => navigate({ screen: "teacher-exam-detail", params: { examId: exam.id } })}
          >
            <div className="s-exam-item__main">
              <div className="s-exam-item__title">{exam.title}</div>
              <div className="s-exam-item__meta">{getClassName(exam.classId)} &middot; {exam.date} {exam.time}</div>
            </div>
            <div className="s-exam-item__right">
              <Badge variant={statusVariant(exam.status)}>{exam.status}</Badge>
              {exam.status !== "upcoming" && (
                <span className="s-exam-item__progress">{exam.submittedCount}/{exam.totalStudents} submitted</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
