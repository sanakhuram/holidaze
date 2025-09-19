"use client";

import { useState } from "react";
import type { Venue } from "@/app/lib/types";
import VenueManageCard from "./VenueManagerCard";
import ViewMoreButton from "../ui/ViewMoreButton";

export default function VenuesList({
  venues,
  readonly = false,
  isVenueManager = false,
  initialCount = 3,
}: {
  venues: Venue[];
  readonly?: boolean;
  isVenueManager?: boolean;
  initialCount?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  if (!venues?.length) {
    return <p className="text-sm text-slate-600">No venues yet.</p>;
  }

  const visibleVenues = venues.slice(0, visibleCount);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleVenues.map((v) => (
          <VenueManageCard
            key={v.id}
            venue={v}
            readonly={readonly}
            isVenueManager={isVenueManager}
          />
        ))}
      </div>

      {venues.length > initialCount && (
        <div className="mt-4 flex justify-center">
          <ViewMoreButton
            onExpand={() => setVisibleCount(venues.length)}
            onCollapse={() => setVisibleCount(initialCount)}
          />
        </div>
      )}
    </div>
  );
}
