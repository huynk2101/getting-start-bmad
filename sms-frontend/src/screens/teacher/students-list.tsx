import { useState } from "react";
import { useStore } from "../../mock/store.js";
import { DataTable } from "../../components/demo/data-table.js";
import "../../components/demo/data-table.css";

export function StudentsList() {
  const { students, classes, navigate } = useStore();
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStudentClasses = (studentId: string) =>
    classes.filter((c) => c.studentIds.includes(studentId)).map((c) => c.name).join(", ");

  return (
    <div className="s-students-list">
      <h2 className="display-sm">Students</h2>
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
          { key: "classes", header: "Classes", render: (row) => getStudentClasses(row.id) },
          {
            key: "actions",
            header: "Actions",
            align: "right",
            render: (row) => (
              <button
                className="s-button s-button--primary s-button--sm"
                onClick={() => navigate({ screen: "teacher-student-profile", params: { studentId: row.id } })}
              >
                View
              </button>
            ),
          },
        ]}
        data={filtered}
      />
    </div>
  );
}
