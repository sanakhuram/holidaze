"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackToVenues({
  label = "Back",
  className = "",
  fallback = "/venues",
}: {
  label?: string;
  className?: string;
  fallback?: string;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex items-center gap-1 text-amber-700 transition hover:underline ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </button>
  );
}
