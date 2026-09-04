import type { LoginRequest, LoginResponse } from "sms-shared";

export async function loginRequest(
  username: string,
  password: string
): Promise<LoginResponse> {
  const body: LoginRequest = { username, password };

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message =
      payload?.error?.message || "Login failed. Please try again.";
    const err = new Error(message) as Error & { code?: string };
    err.code = payload?.error?.code;
    throw err;
  }

  return (await res.json()) as LoginResponse;
}

export async function meRequest(): Promise<LoginResponse["data"]["user"] | null> {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const payload = (await res.json().catch(() => null)) as LoginResponse | null;
  if (!payload?.data?.user) {
    return null;
  }
  return payload.data.user;
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).catch(() => undefined);
}
