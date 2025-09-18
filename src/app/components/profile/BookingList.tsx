"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingWithVenue } from "@/app/lib/types";
import BookingCard from "../bookings/BookingCard";

export default function BookingsList({
  bookings,
  readonly = false,
  initialCount = 3,
  step = 3,
}: {
  bookings: BookingWithVenue[];
  readonly?: boolean;
  initialCount?: number;
  step?: number;
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
  const hasMore = visibleCount < upcoming.length;

  if (!upcoming.length) {
    return <p className="text-sm text-slate-600">No upcoming bookings.</p>;
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleBookings.map((b) => (
          <BookingCard key={b.id} b={b} readonly={readonly} onCancelled={() => router.refresh()} />
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
