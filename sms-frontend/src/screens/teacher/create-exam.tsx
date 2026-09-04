import { useState, useMemo } from "react";
import { useStore } from "../../mock/store.js";
import { Card, Button } from "../../components/index.js";

export function CreateExam() {
  const { classes, exams, createExam, navigate } = useStore();
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");

  const conflict = useMemo(() => {
    const trimmed = title.trim().toLowerCase();
    return classes
      .filter((c) => c.id === classId)
      .flatMap((c) =>
        exams
          .filter((e) => e.classId === c.id)
          .filter((e) => e.title.trim().toLowerCase() === trimmed)
          .map((e) => e.title)
      )[0];
  }, [title, classId, exams, classes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && classId && !conflict) {
      const newId = createExam({
        title: title.trim(),
        classId,
        date,
        time,
        durationMinutes: parseInt(duration, 10) || 0,
      });
      navigate({ screen: "teacher-exams" });
      void newId;
    }
  };

  return (
    <div className="s-create-exam">
      <h2 className="display-sm">Create Exam</h2>
      <Card padding="lg">
        <form onSubmit={handleSubmit} className="s-create-exam__form">
          <div className="s-form-field">
            <label htmlFor="exam-title" className="s-form-label">Title</label>
            <input
              id="exam-title"
              className={`s-form-input ${conflict ? "s-form-input--error" : ""}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Biology Midterm"
              aria-invalid={!!conflict || undefined}
              required
            />
            {conflict && (
              <span className="s-inline-warning" role="alert">
                An exam with this title already exists in this class.
              </span>
            )}
          </div>
          <div className="s-form-field">
            <label htmlFor="exam-class" className="s-form-label">Class</label>
            <select
              id="exam-class"
              className="s-form-input"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="s-form-row">
            <div className="s-form-field">
              <label htmlFor="exam-date" className="s-form-label">Date</label>
              <input
                id="exam-date"
                className="s-form-input"
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Fri"
              />
            </div>
            <div className="s-form-field">
              <label htmlFor="exam-time" className="s-form-label">Time</label>
              <input
                id="exam-time"
                className="s-form-input"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 08:00"
              />
            </div>
            <div className="s-form-field">
              <label htmlFor="exam-duration" className="s-form-label">Duration (min)</label>
              <input
                id="exam-duration"
                className="s-form-input"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <div className="s-form-actions">
            <Button type="submit" disabled={!!conflict}>Save Exam</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
