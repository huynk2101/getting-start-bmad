import { useStore } from "../mock/store.js";
import { Card, Button } from "../components/index.js";

export function RoleLogin() {
  const { setRole } = useStore();

  return (
    <div className="s-role-login">
      <div className="s-role-login__inner">
        <h1 className="display">SchoolDesk</h1>
        <p className="s-role-login__subtitle">Choose your role to continue</p>
        <div className="s-role-login__cards">
          <Card
            padding="lg"
            className="s-role-login__card"
            onClick={() => setRole("teacher")}
            style={{ cursor: "pointer" }}
          >
            <h2 className="display-sm">Mr. Chen</h2>
            <p className="s-role-login__role">Teacher</p>
            <p className="s-role-login__desc">Manage classes, grade exams, track students</p>
            <Button>Sign in as Teacher</Button>
          </Card>
          <Card
            padding="lg"
            className="s-role-login__card"
            onClick={() => setRole("student")}
            style={{ cursor: "pointer" }}
          >
            <h2 className="display-sm">Alex Rivera</h2>
            <p className="s-role-login__role">Student</p>
            <p className="s-role-login__desc">Take exams, view results, follow schedule</p>
            <Button>Sign in as Student</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
