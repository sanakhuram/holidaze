"use client";
import { Search, Star, Users } from "lucide-react";
import type { VenueFilters } from "@/hooks/useVenueFilters";

const CONTAINER = "mx-auto w-full max-w-6xl px-4";

export default function SearchFilters({
  q,
  setQ,
  filters,
  setFilters,
}: {
  q: string;
  setQ: (q: string) => void;
  filters: VenueFilters;
  setFilters: React.Dispatch<React.SetStateAction<VenueFilters>>;
}) {
  return (
    <div className={`${CONTAINER} my-8 grid gap-4 md:grid-cols-3`}>
      <div className="relative">
        <Search className="absolute top-2.5 left-2 h-4 w-4 text-red-800" />
        <input
          type="text"
          placeholder="Search by name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-md border border-neutral-300 py-2 pr-3 pl-8 text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
        />
      </div>

      <div className="relative">
        <Star className="absolute top-2.5 left-2 h-4 w-4 text-amber-600 fill-amber-200" />
        <input
          type="number"
          placeholder="Min rating"
          min={0}
          max={5}
          value={filters.minRating || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              minRating: Number(e.target.value) || 0,
            }))
          }
          className="w-full rounded-md border border-neutral-300 py-2 pr-3 pl-8 text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
        />
      </div>

      <div className="relative">
        <Users className="absolute top-2.5 left-2 h-4 w-4 text-wine fill-wine" />
        <input
          type="number"
          placeholder="Min guests"
          min={0}
          value={filters.minGuests || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              minGuests: Number(e.target.value) || 0,
            }))
          }
          className="w-full rounded-md border border-neutral-300 py-2 pr-3 pl-8 text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
        />
      </div>
    </div>
  );
}
