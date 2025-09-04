// src/app/lib/auth.ts
export type User = {
  name: string | null;
  email: string | null;
  avatar: { url?: string; alt?: string } | null;
  venueManager: boolean;
};

export async function login(payload: { email: string; password: string }) {
  const r = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error ?? "Login failed");
  return true;
}

export async function logout() {
  await fetch("/auth/logout", { method: "POST" });
}

export async function getSession() {
  const r = await fetch("/auth/session", { method: "GET", cache: "no-store" });
  return r.json() as Promise<{ authenticated: boolean; user: User | null }>;
}
