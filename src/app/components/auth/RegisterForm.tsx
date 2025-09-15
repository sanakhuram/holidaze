// src/app/components/auth/RegisterForm.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import toast from "react-hot-toast";
import { auth } from "@/app/services/authService";

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
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
      await auth.register({ name, email, password, venueManager });
      await auth.login(email, password);
      await refresh();
      router.refresh();
      toast.success("Account created — you’re in! 🎉");
      onSuccess();
    } catch (e: unknown) {
      const msg =
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof (e as { message?: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Registration failed";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <h2 id="auth-title" className="text-xl font-semibold text-amber-500">
        Create account
      </h2>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <label className="block text-sm">
        <span className="mb-1 block text-amber-500">Username</span>
        <input
          ref={firstFieldRef}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-coffee w-full rounded-md border border-amber-600/30 bg-white px-3 py-2"
          placeholder="my_username"
          pattern="^[A-Za-z0-9_]+$"
          title="Only letters, numbers, and _"
          disabled={loading}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-amber-500">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-coffee w-full rounded-md border border-amber-600/30 bg-white px-3 py-2"
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
          className="text-coffee w-full rounded-md border border-amber-600/30 bg-white px-3 py-2"
          placeholder="Min 8 characters"
          disabled={loading}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-amber-400">
        <input
          type="checkbox"
          checked={venueManager}
          onChange={(e) => {
            setVenueManager(e.target.checked);
            void (e.target.checked
              ? toast.success("Venue Manager enabled 🚀")
              : toast("Venue Manager disabled", { icon: "⚠️" }));
          }}
          disabled={loading}
        />
        Venue manager
      </label>

      <button
        disabled={loading}
        className="w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white"
      >
        {loading ? "Registering…" : "Create account"}
      </button>
    </form>
  );
}
