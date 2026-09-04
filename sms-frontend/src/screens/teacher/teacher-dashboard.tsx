import { useStore } from "../../mock/store.js";
import { Card } from "../../components/index.js";
import { ClassCard } from "../../components/demo/class-card.js";
import "../../components/demo/class-card.css";

export function TeacherDashboard() {
  const { classes, exams, navigate, getRosterForExam } = useStore();

  const upcomingExams = exams.filter((e) => e.status !== "finalized");

  return (
    <div className="s-teacher-dashboard">
      <p className="greeting display">Welcome back, Mr. Chen</p>

      <div className="s-widget-grid">
        <Card padding="lg">
          <h2 className="s-widget-title">Today's Classes</h2>
          <div className="s-timeline">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="s-timeline-item"
                onClick={() => navigate({ screen: "teacher-class-detail", params: { classId: cls.id } })}
                style={{ cursor: "pointer" }}
              >
                <span className="s-timeline-time">{cls.schedule.split(" ").slice(-2).join(" ")}</span>
                <div>
                  <div className="s-timeline-name">{cls.name}</div>
                  <div className="s-timeline-teacher">{cls.studentCount} students</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div>
          <Card padding="lg">
            <h2 className="s-widget-title">Grading Progress</h2>
            {upcomingExams.length === 0 ? (
              <p className="s-text-muted">No pending exams.</p>
            ) : (
              <div className="s-timeline">
                {upcomingExams.map((exam) => {
                  const roster = getRosterForExam(exam.id);
                  const graded = roster.filter((r) => r.gradingStatus === "graded" || r.gradingStatus === "absent").length;
                  return (
                    <div
                      key={exam.id}
                      className="s-timeline-item"
                      onClick={() => navigate({ screen: "teacher-grading", params: { examId: exam.id } })}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="s-timeline-time">{graded}/{roster.length}</span>
                      <div>
                        <div className="s-timeline-name">{exam.title}</div>
                        <div className="s-timeline-teacher">{exam.status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
