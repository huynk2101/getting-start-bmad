import { useEffect, useState, useRef, useCallback } from "react";
import { useStore } from "../../mock/store.js";
import { useToast } from "../../components/index.js";
import { Timer } from "../../components/demo/timer.js";
import { ProgressBar } from "../../components/demo/progress-bar.js";
import { ConfirmDialog } from "../../components/demo/confirm-dialog.js";
import "../../components/demo/timer.css";
import "../../components/demo/progress-bar.css";
import "../../components/demo/confirm-dialog.css";

interface ExamTakingParams {
  examId: string;
}

export function ExamTaking({ examId }: ExamTakingParams) {
  const { getExam, saveExamAnswer, submitExam, results, navigate } = useStore();
  const { show } = useToast();

  const exam = getExam(examId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [timeExpired, setTimeExpired] = useState(false);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const studentResult = results.find((r) => r.examId === examId && r.studentId === "s1");

  const answers = studentResult?.answers ?? {};
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam?.questions.length ?? 0;

  useEffect(() => {
    if (surfaceRef.current) {
      surfaceRef.current.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const surface = surfaceRef.current;
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSubmitConfirm(true);
      }
      if (e.key === "Tab" && surface) {
        const focusables = surface.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        if (currentQuestion < totalQuestions - 1) {
          e.preventDefault();
          setCurrentQuestion((q) => q + 1);
        }
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        if (currentQuestion > 0) {
          e.preventDefault();
          setCurrentQuestion((q) => q - 1);
        }
      }
    },
    [currentQuestion, totalQuestions]
  );

  const handleSelectAnswer = useCallback(
    (questionId: string, optionIndex: number) => {
      saveExamAnswer(examId, questionId, optionIndex);
    },
    [examId, saveExamAnswer]
  );

  const handleThreshold = useCallback(
    (remaining: number) => {
      if (remaining === 300) setAnnouncement("5 minutes remaining");
      if (remaining === 60) setAnnouncement("1 minute remaining");
    },
    []
  );

  const handleTimeUp = useCallback(() => {
    setTimeExpired(true);
    setAnnouncement("Time is up. Your exam has been submitted.");
    submitExam(examId);
    show("All done, Alex!");
    navigate({ screen: "student-results" });
  }, [examId, submitExam, show, navigate]);

  const handleSubmit = useCallback(() => {
    setShowSubmitConfirm(false);
    submitExam(examId);
    show("All done, Alex!");
    navigate({ screen: "student-results" });
  }, [examId, submitExam, show, navigate]);

  if (!exam) {
    return <p>Exam not found.</p>;
  }

  const currentQ = exam.questions[currentQuestion];

  return (
    <div
      ref={surfaceRef}
      className="s-exam-surface"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      aria-label={`${exam.title} — exam in progress`}
    >
      <div className="s-exam-surface__header">
        <div className="s-exam-surface__title">{exam.title}</div>
        <Timer
          totalSeconds={exam.durationMinutes * 60}
          onTimeUp={handleTimeUp}
          onThreshold={handleThreshold}
        />
      </div>

      {announcement && (
        <div className="s-exam-announcement" role="status" aria-live="assertive">
          {announcement}
        </div>
      )}

      {timeExpired && (
        <div className="s-inline-banner" role="alert" aria-live="assertive">
          Time is up. Your exam has been submitted.
        </div>
      )}

      <div className="s-exam-surface__content">
        <aside className="s-exam-surface__sidebar">
          <nav aria-label="Question navigation">
            <ol className="s-exam-nav">
              {exam.questions.map((q, i) => {
                const answered = answers[q.id] !== undefined;
                return (
                  <li key={q.id}>
                    <button
                      className={`s-exam-nav__item ${i === currentQuestion ? "s-exam-nav__item--current" : ""} ${answered ? "s-exam-nav__item--answered" : ""}`}
                      aria-current={i === currentQuestion ? "true" : undefined}
                      aria-label={`Question ${i + 1}, ${answered ? "answered" : "not answered"}`}
                      onClick={() => setCurrentQuestion(i)}
                    >
                      {i + 1}
                      {answered && <span className="s-exam-nav__check" aria-hidden="true">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="s-exam-surface__main">
          <ProgressBar
            value={answeredCount}
            max={totalQuestions}
            label={`${answeredCount} of ${totalQuestions} questions answered`}
            showMilestone
          />

          <div className="s-exam-question-card">
            <div className="s-exam-question-card__label">Q{currentQuestion + 1}</div>
            <p className="s-exam-question-card__text">{currentQ.text}</p>

            <fieldset className="s-exam-options">
              {currentQ.options.map((opt, optIndex) => {
                const selected = answers[currentQ.id] === optIndex;
                return (
                  <div key={opt.label} className="s-exam-option">
                    <input
                      type="radio"
                      id={`q${currentQuestion}-opt${optIndex}`}
                      name={`question-${currentQ.id}`}
                      checked={selected}
                      onChange={() => handleSelectAnswer(currentQ.id, optIndex)}
                    />
                    <label htmlFor={`q${currentQuestion}-opt${optIndex}`} className="s-exam-option__label">
                      <span className="s-exam-option__label">{opt.label}.</span> {opt.text}
                      {selected && <span className="s-exam-option__check" aria-hidden="true">✓</span>}
                    </label>
                  </div>
                );
              })}
            </fieldset>

            <div className="s-exam-question-card__actions">
              <button
                className="s-button s-button--primary s-button--md"
                onClick={() => {
                  if (currentQuestion < totalQuestions - 1) {
                    setCurrentQuestion((q) => q + 1);
                  }
                }}
                disabled={currentQuestion >= totalQuestions - 1}
              >
                Next
              </button>
              <button
                className="s-button s-button--primary s-button--md"
                onClick={() => setShowSubmitConfirm(true)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showSubmitConfirm}
        title="Submit your exam?"
        description={
          timeExpired
            ? "Time is up. Your exam will be submitted."
            : `You've answered ${answeredCount} of ${totalQuestions} questions.${answeredCount < totalQuestions ? " Unanswered questions will be counted as incorrect." : ""}`
        }
        confirmLabel="Submit"
        cancelLabel="Keep Working"
        onConfirm={handleSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </div>
  );
}
