// src/app/components/ui/IconCircle.tsx
"use client";
import type { LucideIcon } from "lucide-react";

export default function IconCircle({
  active,
  Icon,
  label,
}: {
  active: boolean;
  Icon: LucideIcon;
  label: string;
}) {
  const base =
    "inline-grid h-14 w-14 place-items-center rounded-full border transition-all duration-200";
  const on = "bg-amber-100 border-amber-500 text-amber-600 ";
  const off = "bg-transparent border-amber-600/25 text-amber-600/70 ";

  return (
    <span className={`${base} ${active ? on : off}`} title={label} aria-label={label}>
      <Icon className="h-6 w-6" />
    </span>
  );
}
