import { useRef, useState } from "react";
import { Card, Button } from "../components/index.js";
import { useAuth } from "../store/auth.js";

export function RoleLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Username and password are required");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setSubmitting(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid username or password"
      );
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="s-role-login">
      <div className="s-role-login__inner">
        <h1 className="display">SchoolDesk</h1>
        <p className="s-role-login__subtitle">Sign in to continue</p>
        <Card padding="lg" className="s-role-login__card">
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                ref={errorRef}
                className="s-role-login__error"
                role="alert"
                tabIndex={-1}
              >
                {error}
              </div>
            )}
            <label htmlFor="username" className="s-role-login__label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="s-role-login__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
            />
            <label htmlFor="password" className="s-role-login__label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="s-role-login__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
            <Button
              type="submit"
              className="s-role-login__submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
