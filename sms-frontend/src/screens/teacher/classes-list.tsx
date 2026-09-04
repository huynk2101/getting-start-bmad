import { useStore } from "../../mock/store.js";
import { ClassCard } from "../../components/demo/class-card.js";
import "../../components/demo/class-card.css";

export function ClassesList() {
  const { classes, navigate } = useStore();

  return (
    <div className="s-classes-list">
      <h2 className="display-sm">Classes</h2>
      <div className="s-classes-grid">
        {classes.map((cls) => (
          <ClassCard
            key={cls.id}
            name={cls.name}
            teacherName={cls.teacherName}
            schedule={cls.schedule}
            studentCount={cls.studentCount}
            nextExam={cls.nextExam}
            onClick={() => navigate({ screen: "teacher-class-detail", params: { classId: cls.id } })}
          />
        ))}
      </div>
    </div>
  );
}
