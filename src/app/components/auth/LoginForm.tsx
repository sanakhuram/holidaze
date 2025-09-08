// src/app/components/auth/LoginForm.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import toast from "react-hot-toast";
import { auth } from "@/app/services/authService";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { refresh } = useSession();
  const router = useRouter();
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    try {
      await auth.login(email, password);
      await refresh();
      router.refresh();
      toast.success("Welcome back 👋");
      onSuccess();
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: string }).message)
          : "Login failed";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <h2 id="auth-title" className="text-xl font-semibold text-amber-500">
        Login
      </h2>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <label className="block text-sm">
        <span className="mb-1 block text-amber-500">Email</span>
        <input
          ref={firstFieldRef}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-amber-600/30 bg-white px-3 py-2 text-coffee"
          placeholder="you@stud.noroff.no"
          pattern="^[^@]+@stud\.noroff\.no$"
          title="Use your stud.noroff.no email"
          disabled={loading}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-amber-500">Password</span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-amber-600/30 bg-white px-3 py-2 text-coffee"
          placeholder="••••••••"
          disabled={loading}
        />
      </label>

      <button
        disabled={loading}
        className="w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white"
      >
        {loading ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
