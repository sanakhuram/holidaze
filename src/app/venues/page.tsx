// src/app/venues/page.tsx
"use client";

import { useMemo } from "react";
import { Search, Users, Star } from "lucide-react";
import VenueCard from "../components/VenueCard";
import PaginationControls from "../components/PaginationControls";
import { useVenueSearch } from "@/hooks/useVenueSearch";
import BackgroundSection from "../components/ui/BackgroundSection";
import { pinByOwner } from "../lib/pin";

const CONTAINER = "mx-auto w-full max-w-6xl px-4";

export default function VenuesPage() {
  const { venues, meta, loading, error, q, setQ, setPage, filters, setFilters } =
    useVenueSearch(24);

  const { pinned, others } = useMemo(() => pinByOwner(venues), [venues]);

  if (loading) {
    return (
      <div className={`${CONTAINER}`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-md bg-neutral-200/70" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className={`${CONTAINER} text-red-500 py-6`}>Error: {error}</p>;
  if (!venues.length) return <p className={`${CONTAINER} py-6`}>No venues found.</p>;

  return (
    <>
      {pinned.length > 0 && (
        <BackgroundSection bg="/images/featured-bg.jpg" dim={0.6}>
          <div className={CONTAINER}>
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-semibold text-amber-400 drop-shadow">Nordic Gems</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {pinned.map((v) => (
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          </div>
        </BackgroundSection>
      )}

      <div className={`${CONTAINER} m-8`}>
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 items-center">
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
            <Search className="w-5 h-5 text-amber-600 shrink-0" />
            <input
              type="text"
              placeholder="Search venues..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600 shrink-0" />
            <input
              type="number"
              min={1}
              placeholder="Guests"
              value={filters.guests ?? ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({ ...filters, guests: val });
              }}
              className="w-full sm:w-28 rounded-md border border-neutral-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-600 shrink-0" />
            <select
              value={filters.minRating ?? ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setFilters({ ...filters, minRating: val });
              }}
              className="w-full sm:w-32 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="">Rating</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`${CONTAINER}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {others.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      </div>

      {meta && (
        <div className={CONTAINER}>
          <PaginationControls className="mb-10" meta={meta} onPageChange={(p) => setPage(p)} />
        </div>
      )}
    </>
  );
}
