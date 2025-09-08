// src/app/components/AuthModal.tsx
"use client";

import { useEffect, useRef } from "react";
import BrandGradientPanel from "@/app/components/ui/BrandGradientPanel";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";

export default function AuthModal({
  open,
  onClose,
  mode = "login",
}: {
  open: boolean;
  onClose: () => void;
  mode?: "login" | "register";
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

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
            {mode === "login" ? (
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
