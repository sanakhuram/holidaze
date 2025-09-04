"use client";

import type { Venue } from "@/app/lib/types";
import VenueManageCard from "../components/venue/VenueManagerCard";

export default function VenuesList({ venues }: { venues: Venue[] }) {
  if (!venues?.length) {
    return <p className="text-sm text-slate-600">No venues yet.</p>;
  }
  return (
    <div className="space-y-4">
      {venues.map((v) => (
        <VenueManageCard key={v.id} venue={v} />
      ))}
    </div>
  );
}
