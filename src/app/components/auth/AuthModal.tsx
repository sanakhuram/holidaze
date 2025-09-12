"use client";

import { useEffect, useRef, useState } from "react";
import BrandGradientPanel from "@/app/components/ui/BrandGradientPanel";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal({
  open,
  onClose,
  mode = "login",
}: {
  open: boolean;
  onClose: () => void;
  mode?: "login" | "register";
}) {
  const [currentMode, setCurrentMode] = useState<"login" | "register">(mode);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentMode(mode); 
  }, [mode]);

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
            <div className="mb-4 flex  gap-4">
              <button
                type="button"
                onClick={() => setCurrentMode("login")}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  currentMode === "login"
                    ? "bg-amber-900 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setCurrentMode("register")}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  currentMode === "register"
                    ? "bg-amber-900 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                Register
              </button>
            </div>

            {currentMode === "login" ? (
              <LoginForm onSuccess={onClose} />
            ) : (
              <RegisterForm onSuccess={onClose} />
            )}
          </div>
        </BrandGradientPanel>
      </div>
    </div>
  );
}
