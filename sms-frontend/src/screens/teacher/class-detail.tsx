import { useState, useCallback } from "react";
import { useStore } from "../../mock/store.js";
import { DataTable } from "../../components/demo/data-table.js";
import "../../components/demo/data-table.css";

interface ClassDetailParams {
  classId: string;
}

type Tab = "students" | "schedule" | "exams";

export function ClassDetail({ classId }: ClassDetailParams) {
  const { getClass, students, exams, schedules, navigate } = useStore();
  const [tab, setTab] = useState<Tab>("students");
  const [search, setSearch] = useState("");

  const cls = getClass(classId);
  if (!cls) return <p>Class not found.</p>;

  const classStudents = cls.studentIds
    .map((id) => students.find((s) => s.id === id))
    .filter(Boolean);

  const filteredStudents = classStudents.filter((s) =>
    s!.name.toLowerCase().includes(search.toLowerCase())
  );

  const classExams = exams.filter((e) => e.classId === classId);
  const classSchedules = schedules.filter((s) => s.classId === classId);

  const nextExam = cls.nextExam;

  return (
    <div className="s-class-detail">
      <h2 className="display-sm">{cls.name}</h2>
      <p className="s-class-detail__sub">{cls.teacherName} &middot; {cls.schedule}</p>

      <div className="s-stat-bar">
        <span><strong>{cls.studentCount}</strong> students</span>
        {nextExam && <span>Next exam: <strong>{nextExam}</strong></span>}
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
          <input
            className="s-search-input"
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search students"
          />
          <DataTable
            columns={[
              { key: "name", header: "Name", render: (row) => row.name },
              { key: "studentId", header: "Student ID", render: (row) => row.studentId },
              { key: "enrolledSince", header: "Enrolled Since", render: (row) => row.enrolledSince },
              {
                key: "actions",
                header: "Actions",
                align: "right",
                render: (row) => (
                  <button
                    className="s-button s-button--primary s-button--sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ screen: "teacher-student-profile", params: { studentId: row.id } });
                    }}
                  >
                    View
                  </button>
                ),
              },
            ]}
            data={filteredStudents.map((s) => s!)}
          />
        </div>
      )}

      {tab === "schedule" && (
        <div role="tabpanel">
          <div className="s-timeline">
            {classSchedules.map((sch, i) => (
              <div key={i} className="s-timeline-item">
                <span className="s-timeline-time">{sch.day} {sch.time} – {sch.endTime}</span>
                <div>
                  <div className="s-timeline-name">{sch.className}</div>
                  <div className="s-timeline-teacher">{sch.teacher}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "exams" && (
        <div role="tabpanel">
          {classExams.length === 0 ? (
            <p className="s-text-muted">No exams for this class.</p>
          ) : (
            <div className="s-timeline">
              {classExams.map((exam) => (
                <div
                  key={exam.id}
                  className="s-timeline-item"
                  onClick={() => navigate({ screen: "teacher-exam-detail", params: { examId: exam.id } })}
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
        </div>
      )}
    </div>
  );
}
