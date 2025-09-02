// src/app/venues/page.tsx
"use client";

import { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard";
import PaginationControls, { type PaginationMeta } from "../components/PaginationControls";
import { getVenues } from "../lib/api";
import type { Venue } from "../lib/types";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 24; 

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await getVenues(page, limit);
        type VenuesResponse = { data: Venue[]; meta?: PaginationMeta };
        const { data: items = [], meta: m } = res as VenuesResponse;

        if (mounted) {
          setVenues(items);
          if (m) {
            setMeta({
              currentPage: m.currentPage,
              pageCount: m.pageCount,
              isFirstPage: m.isFirstPage,
              isLastPage: m.isLastPage,
            });
          } else {
            setMeta({
              currentPage: page,
              pageCount: items.length < limit ? page : page + 1, 
              isFirstPage: page === 1,
              isLastPage: items.length < limit,
            });
          }
        }
      } catch (e) {
        if (mounted) setErr(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [page, limit]);

  if (loading) {
    return (
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-md bg-neutral-200/70" />
        ))}
      </div>
    );
  }

  if (err) return <p className="p-6 text-red-500">Error: {err}</p>;
  if (!venues.length) return <p className="p-6">No venues found.</p>;

  return (
    <>
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
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
