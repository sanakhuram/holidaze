// src/app/services/authService.ts
export const auth = {
  async login(email: string, password: string) {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Login failed");
    return data;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    venueManager: boolean;
  }) {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Register failed");
    return data;
  },
};
