//src/app/auth/AuthModalContext.tsx

"use client";

import { createContext, useContext, useState, useMemo } from "react";
import AuthModal from "../components/AuthModal";

type AuthMode = "login" | "register";

type Ctx = {
  open: boolean;
  mode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
};

const AuthModalContext = createContext<Ctx | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const value = useMemo<Ctx>(
    () => ({
      open,
      mode,
      openAuth: (m = "login") => {
        setMode(m);
        setOpen(true);
      },
      closeAuth: () => setOpen(false),
    }),
    [open, mode]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal open={open} onClose={() => setOpen(false)} mode={mode} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
