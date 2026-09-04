import { useStore } from "../../mock/store.js";
import { Card } from "../../components/index.js";

export function StudentDashboard() {
  const { classes, exams, results, navigate, schedules } = useStore();

  const studentClasses = classes.filter((c) => c.studentIds.includes("s1"));
  const studentExams = exams.filter((e) =>
    studentClasses.some((c) => c.id === e.classId)
  );
  const upcomingExams = studentExams.filter((e) => e.status === "upcoming" || e.status === "open");
  const studentResults = results.filter((r) => r.studentId === "s1" && r.submitted);

  const todaySchedule = schedules.filter((s) =>
    studentClasses.some((c) => c.id === s.classId)
  );

  return (
    <div className="s-student-dashboard">
      <p className="greeting display">Welcome back, Alex</p>

      <div className="s-widget-grid">
        <Card padding="lg">
          <h2 className="s-widget-title">Today's Classes</h2>
          <div className="s-timeline">
            {todaySchedule.length === 0 ? (
              <p className="s-text-muted">No classes scheduled today — enjoy the break.</p>
            ) : (
              todaySchedule.map((sch, i) => (
                <div key={i} className="s-timeline-item">
                  <span className="s-timeline-time">{sch.time} – {sch.endTime}</span>
                  <div>
                    <div className="s-timeline-name">{sch.className}</div>
                    <div className="s-timeline-teacher">{sch.teacher}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div>
          <Card padding="lg">
            <h2 className="s-widget-title">Upcoming Exams</h2>
            {upcomingExams.length === 0 ? (
              <p className="s-text-muted">No exams on the horizon. Enjoy the quiet.</p>
            ) : (
              <div className="s-timeline">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="s-timeline-item"
                    onClick={() => navigate({ screen: "student-exams" })}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="s-timeline-time">{exam.date} {exam.time}</span>
                    <div>
                      <div className="s-timeline-name">{exam.title}</div>
                      <div className="s-timeline-teacher">{exam.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card padding="lg" style={{ marginTop: "var(--spacing-gutter)" }}>
            <h2 className="s-widget-title">Recent Results</h2>
            {studentResults.length === 0 ? (
              <p className="s-text-muted">No results yet — your scores will appear here after your teacher grades your exams.</p>
            ) : (
              <div className="s-timeline">
                {studentResults.map((r) => {
                  const exam = exams.find((e) => e.id === r.examId);
                  return (
                    <div
                      key={r.examId}
                      className="s-timeline-item"
                      onClick={() => navigate({ screen: "student-result-detail", params: { examId: r.examId } })}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="s-timeline-time">{r.score} / 100</span>
                      <div>
                        <div className="s-timeline-name">{exam?.title || r.examId}</div>
                        <div className="s-timeline-teacher">Graded</div>
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
