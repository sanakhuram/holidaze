//src/app/components/profile/VenuesList.tsx
"use client";

import { useState } from "react";
import type { Venue } from "@/app/lib/types";
import VenueManageCard from "../venue/VenueManagerCard";

export default function VenuesList({
  venues,
  readonly = false,
  isVenueManager = false, 
  initialCount = 3,
  step = 3,
}: {
  venues: Venue[];
  readonly?: boolean;
  isVenueManager?: boolean; 
  initialCount?: number;
  step?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  if (!venues?.length) {
    return <p className="text-sm text-slate-600">No venues yet.</p>;
  }

  const visibleVenues = venues.slice(0, visibleCount);
  const hasMore = visibleCount < venues.length;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleVenues.map((v) => (
          <VenueManageCard
            key={v.id}
            venue={v}
            readonly={readonly}
            isVenueManager={isVenueManager} 
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + step)}
            className="bg-wine hover:bg-wine/90 rounded-lg px-4 py-2 text-white shadow"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

