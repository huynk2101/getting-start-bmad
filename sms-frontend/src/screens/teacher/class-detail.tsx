import { useState } from "react";
import { useStore } from "../../mock/store.js";
import { Skeleton, EmptyState, Button } from "../../components/index.js";
import { useClassDetail } from "../../api/teacher.js";

interface ClassDetailParams {
  classId: string;
}

type Tab = "students" | "schedule" | "exams";

export function ClassDetail({ classId }: ClassDetailParams) {
  const { exams, navigate } = useStore();
  const { data: classDetail, isLoading, isError, refetch } = useClassDetail(classId);
  const [tab, setTab] = useState<Tab>("students");
  const [search, setSearch] = useState("");

  const classExams = exams.filter((e) => e.classId === classId);

  const filteredStudents = (classDetail?.students ?? []).filter((s) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const email = s.email.toLowerCase();
    const studentId = s.studentId?.toLowerCase() ?? "";
    return fullName.includes(term) || email.includes(term) || studentId.includes(term);
  });

  const formattedSchedule = classDetail?.schedules
    ?.map((s) => `${s.dayOfWeek} ${s.startTime} – ${s.endTime}`)
    .join(", ");

  return (
    <div className="s-class-detail">
      <button
        className="s-back-button"
        onClick={() => navigate({ screen: "teacher-dashboard" })}
        style={{
          background: "none",
          border: "none",
          color: "var(--color-primary)",
          cursor: "pointer",
          fontSize: "var(--text-label)",
          padding: 0,
          marginBottom: "12px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        &larr; Back to Dashboard
      </button>

      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Skeleton width="240px" height="32px" />
          <Skeleton width="340px" height="20px" />
          <Skeleton width="180px" height="20px" />
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <Skeleton width="90px" height="36px" />
            <Skeleton width="90px" height="36px" />
            <Skeleton width="90px" height="36px" />
          </div>
          <Skeleton width="100%" height="40px" style={{ marginTop: "16px" }} />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height="48px" />
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div
          role="alert"
          className="s-inline-banner s-inline-banner--error"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "color-mix(in srgb, var(--color-danger) 12%, transparent)",
            color: "var(--color-danger)",
            border: "1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)",
          }}
        >
          <span>Couldn't load class details.</span>
          <button
            onClick={() => refetch()}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && classDetail && (
        <>
          <h2 className="display-sm">{classDetail.name}</h2>
          <p className="s-class-detail__sub">
            {classDetail.teacherName ?? "Teacher"} {formattedSchedule ? `· ${formattedSchedule}` : ""}
          </p>

          <div className="s-stat-bar">
            <span>
              <strong>{classDetail.studentCount}</strong> students enrolled
            </span>
          </div>

          <div className="s-tab-bar" role="tablist">
            {(["students", "schedule", "exams"] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`s-tab-item ${tab === t ? "s-tab-item--active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === "students" && (
            <div role="tabpanel">
              <div style={{ marginBottom: "16px" }}>
                <input
                  className="s-search-input"
                  type="text"
                  placeholder="Search students by name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search students by name or ID"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid var(--color-border)",
                    fontFamily: "inherit",
                    fontSize: "var(--text-body)",
                  }}
                />
              </div>

              {filteredStudents.length === 0 ? (
                <EmptyState
                  heading={
                    classDetail.students.length === 0
                      ? "No enrolled students in this class."
                      : "No students match your search."
                  }
                />
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    className="s-data-table"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                        <th scope="col" style={{ padding: "10px 12px" }}>
                          Name
                        </th>
                        <th scope="col" style={{ padding: "10px 12px" }}>
                          Email
                        </th>
                        <th scope="col" style={{ padding: "10px 12px" }}>
                          Student ID
                        </th>
                        <th scope="col" style={{ padding: "10px 12px", textAlign: "right" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s) => (
                        <tr
                          key={s.id}
                          style={{
                            borderBottom: "1px solid var(--color-border)",
                            transition: "background 0.15s ease",
                          }}
                          className="s-table-row"
                        >
                          <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                            {s.firstName} {s.lastName}
                          </td>
                          <td style={{ padding: "10px 12px", color: "var(--color-text-muted)" }}>
                            {s.email}
                          </td>
                          <td style={{ padding: "10px 12px" }}>{s.studentId ?? s.id}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right" }}>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                navigate({
                                  screen: "teacher-student-profile",
                                  params: { studentId: s.id },
                                })
                              }
                            >
                              View Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "schedule" && (
            <div role="tabpanel">
              {classDetail.schedules.length === 0 ? (
                <EmptyState heading="No schedules configured for this class." />
              ) : (
                <div className="s-timeline">
                  {classDetail.schedules.map((sch) => (
                    <div key={sch.id} className="s-timeline-item">
                      <span className="s-timeline-time">
                        {sch.dayOfWeek} {sch.startTime} – {sch.endTime}
                      </span>
                      <div>
                        <div className="s-timeline-name">{classDetail.name}</div>
                        <div className="s-timeline-teacher">{classDetail.teacherName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "exams" && (
            <div role="tabpanel">
              {classExams.length === 0 ? (
                <EmptyState heading="No exams created for this class yet." />
              ) : (
                <div className="s-timeline">
                  {classExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="s-timeline-item"
                      onClick={() =>
                        navigate({
                          screen: "teacher-exam-detail",
                          params: { examId: exam.id },
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <span className="s-timeline-time">
                        {exam.date} {exam.time}
                      </span>
                      <div>
                        <div className="s-timeline-name">{exam.title}</div>
                        <div className="s-timeline-teacher">{exam.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
