// src/app/components/ui/BrandGradientPanel.tsx
"use client";

import { ReactNode } from "react";

export default function BrandGradientPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-amber-600/40 p-6 text-white shadow-2xl ${className}`}
      style={{ background: "var(--brand-gradient)" }}
    >
      {children}
    </div>
  );
}
