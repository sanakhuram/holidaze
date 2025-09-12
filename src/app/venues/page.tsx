"use client";

import { useEffect, useState } from "react";
import VenueCard from "../components/venue/VenueCard";
import BackgroundSection from "../components/ui/BackgroundSection";
import PaginationControls from "../components/PaginationControls";
import { getVenues } from "../lib/api";
import { isPinnedOwner } from "../lib/pin";
import type { Venue } from "@/app/lib/types";
import { useVenueSearch } from "@/hooks/useVenueSearch";
import HorizontalScroller from "../components/ui/Scroll";

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

  if (loading && page === 1) {
  return (
    <div className={`${CONTAINER} flex justify-center items-center py-20`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
    </div>
  );
}

  if (error) return <p className={`${CONTAINER} text-red-500`}>Error: {error}</p>;

  return (
    <>
{pinned.length > 0 && (
  <BackgroundSection bg="/images/featured-bg.jpg" dim={0.6}>
    <div className={CONTAINER}>
      <h2 className="mb-6 text-2xl font-semibold text-amber-400 drop-shadow">Sunset Retreats</h2>
      <HorizontalScroller>
        {pinned.map((v) => (
          <div key={v.id} className="min-w-[250px] max-w-[280px] snap-start">
            <VenueCard venue={v} />
          </div>
        ))}
      </HorizontalScroller>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {others.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>

        {meta && (
          <PaginationControls meta={meta} onPageChange={(n) => setPage(n)} className="mb-10" />
        )}
      </div>
    </>
  );
}
