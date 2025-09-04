"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ease-out
        ${enabled ? "bg-gradient-to-r from-coffee to-wine" : "bg-[var(--background)] border border-wine"}
        ${loading ? "opacity-50 cursor-wait" : "cursor-pointer"}
        `}
            aria-pressed={enabled}
        >
            <span
                className={`absolute left-1 h-5 w-5 transform rounded-full bg-amber-500 shadow-md transition duration-300 ease-out
            ${enabled ? "translate-x-7" : "translate-x-0"}
        `}
            />
            <span className="sr-only">Toggle Venue Manager</span>
        </button>
    );
}
