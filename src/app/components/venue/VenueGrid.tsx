"use client";
import VenueCard from "../venue/VenueCard";
import PaginationControls from "../PaginationControls";
import type { Venue } from "@/app/lib/types";
import type { PaginationMeta } from "../PaginationControls";

const CONTAINER = "mx-auto w-full max-w-6xl px-4";

export default function VenueGrid({
  venues,
  meta,
  setPage,
}: {
  venues: Venue[];
  meta: PaginationMeta | null;
  setPage: (page: number) => void;
}) {
  return (
    <div className={CONTAINER}>
      <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {venues.map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </div>
      {meta && <PaginationControls meta={meta} onPageChange={setPage} className="mb-10" />}
    </div>
  );
}
