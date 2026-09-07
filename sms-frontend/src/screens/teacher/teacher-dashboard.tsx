import { useStore } from "../../mock/store.js";
import { Card, Skeleton, EmptyState } from "../../components/index.js";
import { useAuth } from "../../store/auth.js";
import { useTodayClasses } from "../../api/teacher.js";
import "../../components/demo/class-card.css";

export function TeacherDashboard() {
  const { exams, navigate, getRosterForExam } = useStore();
  const { user } = useAuth();
  const { data: todayClasses, isLoading, isError, refetch } = useTodayClasses();

  const upcomingExams = exams.filter((e) => e.status !== "finalized");

  return (
    <div className="s-teacher-dashboard">
      <p className="greeting display">Welcome back, {user?.firstName ?? "Teacher"}</p>

      <div className="s-widget-grid">
        <Card padding="lg">
          <h2 className="s-widget-title">Today's Classes</h2>

          {isLoading && (
            <div className="s-timeline">
              {[0, 1, 2].map((i) => (
                <div key={i} className="s-timeline-item">
                  <Skeleton width="90px" height="18px" />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <Skeleton width="60%" height="16px" />
                    <Skeleton width="40%" height="14px" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && !isLoading && (
            <div
              role="alert"
              className="s-inline-banner s-inline-banner--error"
            >
              <span>Couldn't load today's classes.</span>
              <button className="s-inline-banner__retry" onClick={() => refetch()}>
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && todayClasses && todayClasses.length === 0 && (
            <EmptyState heading="No classes scheduled today — enjoy the break." />
          )}

          {!isLoading && !isError && todayClasses && todayClasses.length > 0 && (
            <div className="s-timeline">
              {todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="s-timeline-item"
                  onClick={() =>
                    navigate({ screen: "teacher-class-detail", params: { classId: cls.id } })
                  }
                  style={{ cursor: "pointer" }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " " || e.key === "Space") {
                      e.preventDefault();
                      navigate({ screen: "teacher-class-detail", params: { classId: cls.id } });
                    }
                  }}
                >
                  <span className="s-timeline-time">
                    {cls.startTime} – {cls.endTime}
                  </span>
                  <div>
                    <div className="s-timeline-name">{cls.name}</div>
                    <div className="s-timeline-teacher">{cls.studentCount} students</div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  const graded = roster.filter(
                    (r) => r.gradingStatus === "graded" || r.gradingStatus === "absent"
                  ).length;
                  return (
                    <div
                      key={exam.id}
                      className="s-timeline-item"
                      onClick={() =>
                        navigate({ screen: "teacher-grading", params: { examId: exam.id } })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <span className="s-timeline-time">
                        {graded}/{roster.length}
                      </span>
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
