"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/**
 * Toggle button for enabling or disabling the Venue Manager role.
 *
 * @param initial - Initial enabled state of the toggle.
 *
 * @remarks
 * - Sends a PATCH request to `/api/profile/update` to update the role.
 * - Displays toast notifications for success or failure.
 * - Refreshes the router after updating.
 * - Shows a sliding toggle UI and handles loading state.
 */


export default function VenueManagerToggle({ initial }: { initial: boolean }) {
  const [enabled, setEnabled] = useState(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const r = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueManager: !enabled }),
      });
      if (!r.ok) {
        const rd = await r.json().catch(() => ({}));
        throw new Error(rd?.message || "Failed to update role");
      }
      setEnabled(!enabled);
      toast.success(!enabled ? "🎉 Venue Manager enabled!" : "Venue Manager disabled");
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ease-out ${enabled ? "from-coffee to-wine bg-gradient-to-r" : "border-wine border bg-[var(--background)]"} ${loading ? "cursor-wait opacity-50" : "cursor-pointer"} `}
      aria-pressed={enabled}
    >
      <span
        className={`absolute left-1 h-5 w-5 transform rounded-full bg-amber-500 shadow-md transition duration-300 ease-out ${enabled ? "translate-x-7" : "translate-x-0"} `}
      />
      <span className="sr-only">Toggle Venue Manager</span>
    </button>
  );
}
