// src/app/components/CancelBookingButton.tsx
"use client";

import { useState, type ReactNode, type MouseEvent } from "react";
import { Trash2 } from "lucide-react";

export default function CancelBookingButton({
  bookingId,
  onCancelled,
  className = "",
  variant = "text", 
  ariaLabel = "Cancel booking",
  confirm = true,
  children,
}: {
  bookingId: string;
  onCancelled?: () => void | Promise<void>;
  className?: string;
  variant?: "text" | "icon";
  ariaLabel?: string;
  confirm?: boolean;
  children?: ReactNode; 
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function cancel() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });

      if (!(res.status === 204 || res.ok)) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.errors?.[0]?.message || body?.message || `HTTP ${res.status}`);
      }

      await (onCancelled?.() ?? Promise.resolve());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    if (confirm && !window.confirm("Cancel this booking? This cannot be undone.")) return;
    await cancel();
  }

  const fallback =
    variant === "icon" ? (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20">
        <Trash2 className="h-4 w-4 text-rose-300" />
      </span>
    ) : (
      <span className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50">
        {loading ? "Cancelling…" : "Cancel"}
      </span>
    );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label={ariaLabel}
        title={ariaLabel}
        className="disabled:opacity-50"
      >
        {children ?? fallback}
      </button>
      {err && <span className="text-xs text-red-500">{err}</span>}
    </div>
  );
}
