import { useStore } from "./mock/store.js";
import { AppShell } from "./demo/demo-layout.js";
import { RoleLogin } from "./screens/role-login.js";
import { TeacherDashboard } from "./screens/teacher/teacher-dashboard.js";
import { ClassesList } from "./screens/teacher/classes-list.js";
import { ClassDetail } from "./screens/teacher/class-detail.js";
import { StudentsList } from "./screens/teacher/students-list.js";
import { StudentProfile } from "./screens/teacher/student-profile.js";
import { ExamsList } from "./screens/teacher/exams-list.js";
import { CreateExam } from "./screens/teacher/create-exam.js";
import { ExamDetail } from "./screens/teacher/exam-detail.js";
import { GradingView } from "./screens/teacher/grading-view.js";
import { ResultsList } from "./screens/teacher/results-list.js";
import { ResultsDetail } from "./screens/teacher/results-detail.js";
import { StudentDashboard } from "./screens/student/student-dashboard.js";
import { ScheduleView } from "./screens/student/schedule-view.js";
import { StudentExamsList } from "./screens/student/student-exams-list.js";
import { ExamTaking } from "./screens/student/exam-taking.js";
import { StudentResultsList } from "./screens/student/student-results-list.js";
import { StudentResultDetail } from "./screens/student/student-result-detail.js";
import "./demo/demo-layout.css";
import "./screens/role-login.css";
import "./screens/teacher/teacher-dashboard.css";
import "./screens/teacher/classes-list.css";
import "./screens/teacher/class-detail.css";
import "./screens/teacher/students-list.css";
import "./screens/teacher/student-profile.css";
import "./screens/teacher/exams-list.css";
import "./screens/teacher/create-exam.css";
import "./screens/teacher/exam-detail.css";
import "./screens/teacher/grading-view.css";
import "./screens/teacher/results-list.css";
import "./screens/teacher/results-detail.css";
import "./screens/student/student-dashboard.css";
import "./screens/student/schedule-view.css";
import "./screens/student/student-exams-list.css";
import "./screens/student/exam-taking.css";
import "./screens/student/student-results-list.css";
import "./screens/student/student-result-detail.css";

function DemoRouter() {
  const { route, role } = useStore();

  if (role === null || route.screen === "role-login") {
    return <RoleLogin />;
  }

  let content: React.ReactNode = null;

  switch (route.screen) {
    case "teacher-dashboard":
      content = <TeacherDashboard />;
      break;
    case "teacher-classes":
      content = <ClassesList />;
      break;
    case "teacher-class-detail":
      content = <ClassDetail classId={route.params.classId} />;
      break;
    case "teacher-students":
      content = <StudentsList />;
      break;
    case "teacher-student-profile":
      content = <StudentProfile studentId={route.params.studentId} />;
      break;
    case "teacher-exams":
      content = <ExamsList />;
      break;
    case "teacher-create-exam":
      content = <CreateExam />;
      break;
    case "teacher-exam-detail":
      content = <ExamDetail examId={route.params.examId} />;
      break;
    case "teacher-grading":
      content = <GradingView examId={route.params.examId} />;
      break;
    case "teacher-results":
      content = <ResultsList />;
      break;
    case "teacher-results-detail":
      content = <ResultsDetail examId={route.params.examId} />;
      break;
    case "student-dashboard":
      content = <StudentDashboard />;
      break;
    case "student-schedule":
      content = <ScheduleView />;
      break;
    case "student-exams":
      content = <StudentExamsList />;
      break;
    case "student-exam-taking":
      content = <ExamTaking examId={route.params.examId} />;
      break;
    case "student-results":
      content = <StudentResultsList />;
      break;
    case "student-result-detail":
      content = <StudentResultDetail examId={route.params.examId} />;
      break;
  }

  if (route.screen === "student-exam-taking") {
    return <>{content}</>;
  }

  return <AppShell>{content}</AppShell>;
}

export function App() {
  return <DemoRouter />;
}
