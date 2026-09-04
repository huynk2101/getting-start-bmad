import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { useStore, type Route } from "../mock/store.js";
import { useToast } from "../components/index.js";
import "./demo-layout.css";

interface NavItem {
  label: string;
  route: Route;
}

const teacherNav: NavItem[] = [
  { label: "Dashboard", route: { screen: "teacher-dashboard" } },
  { label: "Classes", route: { screen: "teacher-classes" } },
  { label: "Students", route: { screen: "teacher-students" } },
  { label: "Exams", route: { screen: "teacher-exams" } },
  { label: "Results", route: { screen: "teacher-results" } },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", route: { screen: "student-dashboard" } },
  { label: "Schedule", route: { screen: "student-schedule" } },
  { label: "Exams", route: { screen: "student-exams" } },
  { label: "Results", route: { screen: "student-results" } },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { role, route, navigate, logout } = useStore();
  const h1Ref = useRef<HTMLHeadingElement>(null);

  const navItems = role === "teacher" ? teacherNav : studentNav;

  useEffect(() => {
    h1Ref.current?.focus();
  }, [route.screen]);

  const handleNavClick = useCallback(
    (item: NavItem) => {
      navigate(item.route);
    },
    [navigate]
  );

  const isActive = (item: NavItem): boolean => {
    return item.route.screen === route.screen;
  };

  const screenTitle = getScreenTitle(route);

  return (
    <div className="s-app-shell">
      <nav className="s-topnav" aria-label="Primary">
        <span className="s-topnav__brand">SchoolDesk</span>
        <div className="s-topnav__items">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`s-topnav__item ${isActive(item) ? "s-topnav__item--active" : ""}`}
              onClick={() => handleNavClick(item)}
              aria-current={isActive(item) ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button className="s-topnav__logout" onClick={logout}>
          Sign out
        </button>
      </nav>
      <main className="s-app-body">
        <h1 ref={h1Ref} className="s-sr-only" tabIndex={-1}>
          {screenTitle}
        </h1>
        {children}
      </main>
    </div>
  );
}

function getScreenTitle(route: Route): string {
  switch (route.screen) {
    case "teacher-dashboard":
      return "Teacher Dashboard";
    case "teacher-classes":
      return "Classes";
    case "teacher-class-detail":
      return "Class Detail";
    case "teacher-students":
      return "Students";
    case "teacher-student-profile":
      return "Student Profile";
    case "teacher-exams":
      return "Exams";
    case "teacher-create-exam":
      return "Create Exam";
    case "teacher-exam-detail":
      return "Exam Detail";
    case "teacher-grading":
      return "Grading";
    case "teacher-results":
      return "Results";
    case "teacher-results-detail":
      return "Results Detail";
    case "student-dashboard":
      return "Student Dashboard";
    case "student-schedule":
      return "Schedule";
    case "student-exams":
      return "Exams";
    case "student-exam-taking":
      return "Exam in Progress";
    case "student-results":
      return "Results";
    case "student-result-detail":
      return "Result Detail";
    default:
      return "SchoolDesk";
  }
}
