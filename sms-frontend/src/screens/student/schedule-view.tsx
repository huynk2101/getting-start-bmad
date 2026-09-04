import { useStore } from "../../mock/store.js";

export function ScheduleView() {
  const { schedules, classes } = useStore();

  const studentClasses = classes.filter((c) => c.studentIds.includes("s1"));
  const studentSchedule = schedules.filter((s) =>
    studentClasses.some((c) => c.id === s.classId)
  );

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="s-schedule-view">
      <h2 className="display-sm">Schedule</h2>
      <div className="s-schedule-grid">
        {days.map((day) => {
          const dayEntries = studentSchedule.filter((s) => s.day === day);
          return (
            <div key={day} className="s-schedule-day">
              <h3 className="s-schedule-day__title">{day}</h3>
              {dayEntries.length === 0 ? (
                <p className="s-text-muted s-schedule-day__empty">No classes</p>
              ) : (
                <div className="s-schedule-day__items">
                  {dayEntries.map((sch, i) => (
                    <div key={i} className="s-schedule-item">
                      <span className="s-schedule-item__time">{sch.time} – {sch.endTime}</span>
                      <div className="s-schedule-item__name">{sch.className}</div>
                      <div className="s-schedule-item__teacher">{sch.teacher}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
