"use client";

import { useEffect, useState } from "react";
import type { Venue } from "@/app/lib/types";
import { getVenues } from "@/app/lib/api";
import { isPinnedOwner } from "@/app/lib/pin";
import { useVenueSearch } from "@/hooks/useVenueSearch";
import FeaturedVenues from "../components/venue/FeaturedVenues";
import SearchFilters from "../components/venue/SearchFilters";
import VenueGrid from "../components/venue/VenueGrid";
import Spinner from "../components/ui/Spinner";

const CONTAINER = "mx-auto w-full max-w-6xl px-4";

export default function VenuesPage() {
  const [pinned, setPinned] = useState<Venue[]>([]);
  const { venues, meta, loading, error, q, setQ, setPage, filters, setFilters } =
    useVenueSearch(16);

  useEffect(() => {
    getVenues(1, 100)
      .then((res) => {
        setPinned(res.data.filter(isPinnedOwner));
      })
      .catch(() => {});
  }, []);

  if (error) {
    return <p className={`${CONTAINER} text-red-500`}>Error: {error}</p>;
  }

  return (
    <>
      <FeaturedVenues pinned={pinned} />

      <div className="my-8 text-center">
        <h1 className="text-wine text-2xl font-extrabold tracking-tight md:text-3xl">
          Explore All Venues
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          Discover places across the globe, from hidden gems to iconic retreats
        </p>
      </div>

      <SearchFilters q={q} setQ={setQ} filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Spinner size={64} />
          <span className="sr-only">Loading venues…</span>
        </div>
      ) : (
        <VenueGrid venues={venues} meta={meta} setPage={setPage} />
      )}
    </>
  );
}
