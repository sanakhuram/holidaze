// src/app/components/ui/ModalShell.tsx
"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

export default function ModalShell({
  title,
  open,
  onClose,
  children,
  className,
  maxWidth = "max-w-3xl",
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!open) return;

    if (typeof window === "undefined") return;

    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = "hidden";

    return () => {
      style.overflow = prev || "";
    };
  }, [open]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={clsx(
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4">
        <div
          className={clsx(
            "w-full",
            maxWidth,
            "bg-gradient-to-b from-coffee to-wine rounded-2xl border border-amber-500/30 text-amber-600 shadow-xl",
            "transition-all",
            open ? "scale-100 opacity-100" : "scale-95 opacity-0",
            "max-h-[85vh] overflow-hidden",
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-coffee sticky top-0 z-[1] flex items-center justify-between px-6 pt-6 pb-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded px-2 py-1 text-amber-600/90 hover:bg-amber-500/10 focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="modal-scroll px-6 pb-6">
            <div className="text-coffee rounded-xl border border-amber-500/20 bg-white/95 p-4 shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
