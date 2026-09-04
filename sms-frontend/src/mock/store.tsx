import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  students as initialStudents,
  classes as initialClasses,
  exams as initialExams,
  roster as initialRoster,
  schedules as initialSchedules,
  results as initialResults,
  type Student,
  type ClassInfo,
  type Exam,
  type RosterEntry,
  type ScheduleEntry,
  type ResultEntry,
} from "./data.js";

export type Role = "teacher" | "student";

export type Route =
  | { screen: "role-login" }
  | { screen: "teacher-dashboard" }
  | { screen: "teacher-classes" }
  | { screen: "teacher-class-detail"; params: { classId: string } }
  | { screen: "teacher-students" }
  | { screen: "teacher-student-profile"; params: { studentId: string } }
  | { screen: "teacher-exams" }
  | { screen: "teacher-create-exam" }
  | { screen: "teacher-exam-detail"; params: { examId: string } }
  | { screen: "teacher-grading"; params: { examId: string } }
  | { screen: "teacher-results" }
  | { screen: "teacher-results-detail"; params: { examId: string } }
  | { screen: "student-dashboard" }
  | { screen: "student-schedule" }
  | { screen: "student-exams" }
  | { screen: "student-exam-taking"; params: { examId: string } }
  | { screen: "student-results" }
  | { screen: "student-result-detail"; params: { examId: string } };

interface StoreContextValue {
  role: Role | null;
  route: Route;
  students: Student[];
  classes: ClassInfo[];
  exams: Exam[];
  roster: RosterEntry[];
  schedules: ScheduleEntry[];
  results: ResultEntry[];
  navigate: (route: Route) => void;
  setRole: (role: Role) => void;
  logout: () => void;
  gradeStudent: (examId: string, studentId: string, score: number) => void;
  setAbsent: (examId: string, studentId: string, absent: boolean) => void;
  finalizeGrades: (examId: string) => void;
  createExam: (input: {
    title: string;
    classId: string;
    date: string;
    time: string;
    durationMinutes: number;
  }) => string;
  saveExamAnswer: (examId: string, questionId: string, answerIndex: number) => void;
  submitExam: (examId: string) => void;
  getStudent: (id: string) => Student | undefined;
  getClass: (id: string) => ClassInfo | undefined;
  getExam: (id: string) => Exam | undefined;
  getRosterForExam: (examId: string) => RosterEntry[];
  getStudentResult: (examId: string, studentId: string) => ResultEntry | undefined;
  getStudentExams: (studentId: string) => Exam[];
  getStudentResults: (studentId: string) => ResultEntry[];
  getClassesForStudent: (studentId: string) => ClassInfo[];
}

const StoreContext = createContext<StoreContextValue | null>(null);

function computeScore(answers: Record<string, number>, questions: { id: string; correctIndex: number }[]): number {
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctIndex) correct++;
  }
  return Math.round((correct / questions.length) * 100);
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [route, setRoute] = useState<Route>({ screen: "role-login" });
  const [studentsData] = useState<Student[]>(initialStudents);
  const [classesData] = useState<ClassInfo[]>(initialClasses);
  const [examsData, setExamsData] = useState<Exam[]>(initialExams);
  const [rosterData, setRosterData] = useState<RosterEntry[]>(initialRoster);
  const [schedulesData] = useState<ScheduleEntry[]>(initialSchedules);
  const [resultsData, setResultsData] = useState<ResultEntry[]>(initialResults);

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const handleSetRole = useCallback((newRole: Role) => {
    setRole(newRole);
    if (newRole === "teacher") {
      setRoute({ screen: "teacher-dashboard" });
    } else {
      setRoute({ screen: "student-dashboard" });
    }
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setRoute({ screen: "role-login" });
  }, []);

  const gradeStudent = useCallback(
    (examId: string, studentId: string, score: number) => {
      const exam = examsData.find((e) => e.id === examId);
      if (!exam) return;
      setRosterData((prev) =>
        prev.map((r) =>
          r.classId === exam.classId && r.studentId === studentId
            ? { ...r, score, gradingStatus: "graded" as const, absent: false }
            : r
        )
      );
    },
    [examsData]
  );

  const setAbsent = useCallback(
    (examId: string, studentId: string, absent: boolean) => {
      const exam = examsData.find((e) => e.id === examId);
      if (!exam) return;
      setRosterData((prev) =>
        prev.map((r) =>
          r.classId === exam.classId && r.studentId === studentId
            ? {
                ...r,
                absent,
                gradingStatus: absent ? ("absent" as const) : ("pending" as const),
                score: absent ? undefined : r.score,
              }
            : r
        )
      );
    },
    [examsData]
  );

  const createExam = useCallback(
    (input: {
      title: string;
      classId: string;
      date: string;
      time: string;
      durationMinutes: number;
    }) => {
      const newExam: Exam = {
        id: `e${Date.now()}`,
        title: input.title,
        classId: input.classId,
        date: input.date,
        time: input.time,
        durationMinutes: input.durationMinutes,
        status: "upcoming",
        questions: [],
        totalStudents: 0,
        submittedCount: 0,
      };
      setExamsData((prev) => [...prev, newExam]);
      return newExam.id;
    },
    []
  );

  const finalizeGrades = useCallback(
    (examId: string) => {
      setExamsData((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, status: "finalized" as const } : e))
      );
    },
    []
  );

  const saveExamAnswer = useCallback(
    (examId: string, questionId: string, answerIndex: number) => {
      const studentId = "s1";
      setResultsData((prev) => {
        const existing = prev.find(
          (r) => r.examId === examId && r.studentId === studentId
        );
        if (existing) {
          return prev.map((r) =>
            r.examId === examId && r.studentId === studentId
              ? { ...r, answers: { ...r.answers, [questionId]: answerIndex } }
              : r
          );
        }
        return [
          ...prev,
          {
            examId,
            studentId,
            answers: { [questionId]: answerIndex },
            submitted: false,
          },
        ];
      });
    },
    []
  );

  const submitExam = useCallback(
    (examId: string) => {
      const studentId = "s1";
      const exam = examsData.find((e) => e.id === examId);
      setResultsData((prev) => {
        const existing = prev.find(
          (r) => r.examId === examId && r.studentId === studentId
        );
        const answers = existing?.answers ?? {};
        const score = exam ? computeScore(answers, exam.questions) : 0;
        const submittedAt = new Date().toISOString();
        if (!existing) {
          return [
            ...prev,
            { examId, studentId, answers, score, submitted: true, submittedAt },
          ];
        }
        return prev.map((r) =>
          r.examId === examId && r.studentId === studentId
            ? { ...r, score, submitted: true, submittedAt }
            : r
        );
      });
    },
    [examsData]
  );

  const getStudent = useCallback((id: string) => studentsData.find((s) => s.id === id), [studentsData]);
  const getClass = useCallback((id: string) => classesData.find((c) => c.id === id), [classesData]);
  const getExam = useCallback((id: string) => examsData.find((e) => e.id === id), [examsData]);

  const getRosterForExam = useCallback(
    (examId: string) => {
      const exam = examsData.find((e) => e.id === examId);
      if (!exam) return [];
      return rosterData.filter((r) => r.classId === exam.classId);
    },
    [examsData, rosterData]
  );

  const getStudentResult = useCallback(
    (examId: string, studentId: string) =>
      resultsData.find((r) => r.examId === examId && r.studentId === studentId),
    [resultsData]
  );

  const getStudentExams = useCallback(
    (studentId: string) => {
      const classIds = classesData
        .filter((c) => c.studentIds.includes(studentId))
        .map((c) => c.id);
      return examsData.filter((e) => classIds.includes(e.classId));
    },
    [examsData, classesData]
  );

  const getStudentResults = useCallback(
    (studentId: string) => resultsData.filter((r) => r.studentId === studentId),
    [resultsData]
  );

  const getClassesForStudent = useCallback(
    (studentId: string) => classesData.filter((c) => c.studentIds.includes(studentId)),
    [classesData]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      role,
      route,
      students: studentsData,
      classes: classesData,
      exams: examsData,
      roster: rosterData,
      schedules: schedulesData,
      results: resultsData,
      navigate,
      setRole: handleSetRole,
      logout,
      gradeStudent,
      setAbsent,
      finalizeGrades,
      createExam,
      saveExamAnswer,
      submitExam,
      getStudent,
      getClass,
      getExam,
      getRosterForExam,
      getStudentResult,
      getStudentExams,
      getStudentResults,
      getClassesForStudent,
    }),
    [
      role,
      route,
      studentsData,
      classesData,
      examsData,
      rosterData,
      schedulesData,
      resultsData,
      navigate,
      handleSetRole,
      logout,
      gradeStudent,
      setAbsent,
      finalizeGrades,
      createExam,
      saveExamAnswer,
      submitExam,
      getStudent,
      getClass,
      getExam,
      getRosterForExam,
      getStudentResult,
      getStudentExams,
      getStudentResults,
      getClassesForStudent,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within DemoDataProvider");
  return ctx;
}
