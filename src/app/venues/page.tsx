"use client";

import { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import BackgroundSection from "../components/ui/BackgroundSection";
import PaginationControls from "../components/PaginationControls";
import { getVenues } from "../lib/api";
import { isPinnedOwner } from "../lib/pin";
import type { Venue } from "@/app/lib/types";
import { useVenueSearch } from "@/hooks/useVenueSearch";

const CONTAINER = "mx-auto w-full max-w-6xl px-4";

export default function VenuesPage() {
  const [pinned, setPinned] = useState<Venue[]>([]);
  const { venues, meta, loading, error, q, setQ, page, setPage } = useVenueSearch(16);

  const others = venues.filter((v) => !isPinnedOwner(v));

  useEffect(() => {
    getVenues(1, 100)
      .then((res) => {
        const pinnedItems = res.data.filter(isPinnedOwner);
        setPinned(pinnedItems);
      })
      .catch(() => {});
  }, []);

  if (loading && page === 1) return <p className={CONTAINER}>Loading…</p>;
  if (error) return <p className={`${CONTAINER} text-red-500`}>Error: {error}</p>;

  return (
    <>
      {pinned.length > 0 && (
        <BackgroundSection bg="/images/featured-bg.jpg" dim={0.6}>
          <div className={CONTAINER}>
            <h2 className="mb-6 text-2xl font-semibold text-amber-400 drop-shadow">
              Nordic Gems
            </h2>
            <div className="grid grid-cols-4 gap-6">
              {pinned.map((v) => (
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          </div>
        </BackgroundSection>
      )}

      <div className={`${CONTAINER} my-8`}>
        <input
          type="text"
          placeholder="Search venues..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      <div className={CONTAINER}>
        <div className="grid grid-cols-4 gap-6">
          {others.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>

        {meta && (
          <PaginationControls
            meta={meta}
            onPageChange={(n) => setPage(n)}
            className="mb-10"
          />
        )}
      </div>
    </>
  );
}
