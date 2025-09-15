"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { BookingWithVenue } from "@/app/lib/types";
import BookingCard from "../bookings/BookingCard";

export default function BookingsList({
  bookings,
  readonly = false,
}: {
  bookings: BookingWithVenue[];
  readonly?: boolean;
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

  if (!upcoming.length) {
    return <p className="text-sm text-slate-600">No upcoming bookings.</p>;
  }

  return (
    <div className="space-y-4">
      {upcoming.map((b) => (
        <BookingCard key={b.id} b={b} readonly={readonly} onCancelled={() => router.refresh()} />
      ))}
    </div>
  );
}
