// src/app/venues/page.tsx
"use client";

import { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import { getVenues } from "../lib/api";
import type { Venue } from "../lib/type";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await getVenues;
        const items = Array.isArray(res) ? res : (res as any)?.data ?? [];
        if (mounted) setVenues(items);
      } catch (e) {
        if (mounted) setErr(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-md bg-neutral-200/70" />
        ))}
      </div>
    );
  }

  if (err) return <p className="p-6 text-red-500">Error: {err}</p>;
  if (!venues.length) return <p className="p-6">No venues found.</p>;

  return (
    <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {venues.map((v) => (
        <VenueCard key={v.id} venue={v} />
      ))}
    </div>
  );
}
