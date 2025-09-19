"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingWithVenue } from "@/app/lib/types";
import BookingCard from "./BookingCard";
import ViewMoreButton from "../ui/ViewMoreButton";

export default function BookingsList({
  bookings,
  readonly = false,
  initialCount = 3,
}: {
  bookings: BookingWithVenue[];
  readonly?: boolean;
  initialCount?: number;
}) {
  const router = useRouter();
  const now = Date.now();

  const upcoming = useMemo(
    () =>
      (bookings || [])
        .filter((b) => new Date(b.dateFrom).getTime() >= now)
        .sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()),
    [bookings, now]
  );

  const [visibleCount, setVisibleCount] = useState(initialCount);
  const visibleBookings = upcoming.slice(0, visibleCount);

  if (!upcoming.length) {
    return <p className="text-sm text-slate-600">No upcoming bookings.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleBookings.map((b) => (
          <BookingCard key={b.id} b={b} readonly={readonly} onCancelled={() => router.refresh()} />
        ))}
      </div>

      {upcoming.length > initialCount && (
        <div className="mt-4 flex justify-center">
          <ViewMoreButton
            onExpand={() => setVisibleCount(upcoming.length)}
            onCollapse={() => setVisibleCount(initialCount)}
          />
        </div>
      )}
    </div>
  );
}
