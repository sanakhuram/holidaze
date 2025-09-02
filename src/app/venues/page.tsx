"use client";

import { Search, Users, Star } from "lucide-react";
import VenueCard from "../components/VenueCard";
import PaginationControls from "../components/PaginationControls";
import { useVenueSearch } from "@/hooks/useVenueSearch";

export default function VenuesPage() {
  const { venues, meta, loading, error, q, setQ, setPage, filters, setFilters } = useVenueSearch(24);

  if (loading) {
    return (
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-md bg-neutral-200/70" />
        ))}
      </div>
    );
  }

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!venues.length) return <p className="p-6">No venues found.</p>;

  return (
    <>

      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mb-8 px-4">
        <div className="flex items-center gap-2 w-full sm:w-1/2 lg:w-1/3">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            placeholder="Search venues..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
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
            className="w-24 rounded-md border border-neutral-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Star className="w-5 h-5 text-amber-600 shrink-0" />
          <select
            value={filters.minRating ?? ""}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              setFilters({ ...filters, minRating: val });
            }}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
        {venues.map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </div>

      {meta && (
        <PaginationControls
          className="mb-10"
          meta={meta}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </>
  );
}
