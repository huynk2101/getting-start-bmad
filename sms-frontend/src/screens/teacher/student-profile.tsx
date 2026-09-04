import { useStore } from "../../mock/store.js";
import { Card } from "../../components/index.js";

interface StudentProfileParams {
  studentId: string;
}

export function StudentProfile({ studentId }: StudentProfileParams) {
  const { getStudent, classes, results, exams, navigate, getClassesForStudent } = useStore();

  const student = getStudent(studentId);
  if (!student) return <p>Student not found.</p>;

  const studentClasses = getClassesForStudent(studentId);
  const studentResults = results.filter((r) => r.studentId === studentId);

  return (
    <div className="s-student-profile">
      <button className="s-back-link" onClick={() => navigate({ screen: "teacher-students" })}>
        &larr; Back to Students
      </button>

      <Card padding="lg">
        <h2 className="display-sm">{student.name}</h2>
        <p className="s-student-profile__meta">
          {student.studentId} &middot; {student.email} &middot; Enrolled {student.enrolledSince}
        </p>
      </Card>

      <Card padding="lg">
        <h3 className="s-section-title">Enrolled Classes</h3>
        <div className="s-timeline">
          {studentClasses.map((cls) => (
            <div key={cls.id} className="s-timeline-item">
              <span className="s-timeline-time">{cls.schedule}</span>
              <div>
                <div className="s-timeline-name">{cls.name}</div>
                <div className="s-timeline-teacher">{cls.teacherName}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="s-section-title">Exam Results</h3>
        {studentResults.length === 0 ? (
          <p className="s-text-muted">No results yet.</p>
        ) : (
          <div className="s-timeline">
            {studentResults.map((r) => {
              const exam = exams.find((e) => e.id === r.examId);
              return (
                <div key={r.examId} className="s-timeline-item">
                  <span className="s-timeline-time">{r.submitted ? `${r.score} / 100` : "—"}</span>
                  <div>
                    <div className="s-timeline-name">{exam?.title || r.examId}</div>
                    <div className="s-timeline-teacher">{r.submitted ? "Submitted" : "Not submitted"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
