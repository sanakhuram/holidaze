// src/app/component/AuthModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import toast from "react-hot-toast";
import BrandGradientPanel from "@/app/components/ui/BrandGradientPanel";

export default function AuthModal({
  open,
  onClose,
  onAuthSuccess,
  mode: externalMode,
}: {
  open: boolean;
  onClose: () => void;
  onAuthSuccess?: () => Promise<void> | void;
  mode?: "login" | "register";
}) {
  const [mode, setMode] = useState<"login" | "register">(externalMode ?? "login");
  useEffect(() => {
    if (externalMode) setMode(externalMode);
  }, [externalMode]);

  const router = useRouter();
  const { refresh } = useSession();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regVenueManager, setRegVenueManager] = useState(false);

  // Focus handling
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const getMsg = (e: unknown, fb = "Something went wrong") =>
    e instanceof Error ? e.message : typeof e === "string" ? e : fb;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 0);
    }
  }, [open, mode]);

  async function afterAuth(action: "login" | "register") {
    try {
      await (onAuthSuccess?.() ?? Promise.resolve());
      await refresh();
      router.refresh();
      toast.success(action === "login" ? "Welcome back 👋" : "Account created — you’re in! 🎉");
    } finally {
      onClose();
    }
  }

  async function submitLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Login failed");
      await afterAuth("login");
    } catch (e: unknown) {
      const msg = getMsg(e, "Login failed");
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const payload = {
        name: regName,
        email: regEmail,
        password: regPassword,
        venueManager: regVenueManager,
      };
      const r = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const rd = await r.json();
      if (!r.ok) throw new Error(rd?.error ?? "Register failed");

      const l = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      });
      const ld = await l.json();
      if (!l.ok) throw new Error(ld?.error ?? "Auto-login failed");

      await afterAuth("register");
    } catch (e: unknown) {
      const msg = getMsg(e, "Registration failed");
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const onToggleVenueManager = (checked: boolean) => {
    setRegVenueManager(checked);
    void (checked
      ? toast.success("Venue Manager enabled 🚀")
      : toast("Venue Manager disabled", { icon: "⚠️" }));
  };

  if (!open) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        ref={panelRef}
        className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
        onClick={stop}
      >
        <BrandGradientPanel className="p-0">
          <div className="rounded-2xl p-6 text-foreground">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="auth-title" className="text-xl font-semibold text-amber-500">
                {mode === "login" ? "Login" : "Create account"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-2 py-1 text-sm text-amber-500 hover:bg-black/5"
                aria-label="Close authentication modal"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                className={`rounded-md px-3 py-2 text-sm ${mode === "login" ? "bg-amber-600 text-white" : "bg-amber-900 text-white"}`}
                onClick={() => setMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={`rounded-md px-3 py-2 text-sm ${mode === "register" ? "bg-amber-600 text-white" : "bg-amber-600/20 text-white"}`}
                onClick={() => setMode("register")}
                type="button"
              >
                Register
              </button>
            </div>

            {err && (
              <p className="mb-3 text-sm text-red-600" aria-live="polite">
                {err}
              </p>
            )}

            {mode === "login" ? (
              <form className="space-y-3" onSubmit={submitLogin}>
                <label className="block text-sm">
                  <span className="mb-1 block text-amber-500">Email</span>
                  <input
                    ref={firstFieldRef}
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
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
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-md border border-amber-600/30 bg-white px-3 py-2 text-coffee"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </label>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white transition hover:brightness-110 active:brightness-95 disabled:opacity-50"
                >
                  {loading ? "Logging in…" : "Login"}
                </button>
              </form>
            ) : (
              <form className="space-y-3" onSubmit={submitRegister}>
                <label className="block text-sm">
                  <span className="mb-1 block text-amber-500">Username</span>
                  <input
                    ref={firstFieldRef}
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full rounded-md border border-amber-600/30 bg-white px-3 py-2 text-coffee"
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
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
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
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full rounded-md border border-amber-600/30 bg-white px-3 py-2 text-coffee"
                    placeholder="Min 8 characters"
                    disabled={loading}
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-amber-400">
                  <input
                    type="checkbox"
                    checked={regVenueManager}
                    onChange={(e) => onToggleVenueManager(e.target.checked)}
                    disabled={loading}
                  />
                  Venue manager
                </label>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white transition hover:brightness-110 active:brightness-95 disabled:opacity-50"
                >
                  {loading ? "Registering…" : "Create account"}
                </button>
              </form>
            )}
          </div>
        </BrandGradientPanel>
      </div>
    </div>
  );
}
