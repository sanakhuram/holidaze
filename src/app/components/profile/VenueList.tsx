"use client";

import type { Venue } from "@/app/lib/types";
import VenueManageCard from "../venue/VenueManagerCard";

export default function VenuesList({
  venues,
  readonly = false,
}: {
  venues: Venue[];
  readonly?: boolean;
}) {
  if (!venues?.length) {
    return <p className="text-sm text-slate-600">No venues yet.</p>;
  }

  return (
    <div className="space-y-4">
      {venues.map((v) => (
        <VenueManageCard key={v.id} venue={v} readonly={readonly} />
      ))}
    </div>
  );
}
