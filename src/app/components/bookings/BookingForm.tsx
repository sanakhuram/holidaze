"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import type { VenueWithExtras } from "@/app/lib/types";
import { differenceInCalendarDays, startOfToday, formatISO } from "date-fns";
import type { DateRange, Matcher } from "react-day-picker";
import CalendarRange from "./CalenderRange";
import toast from "react-hot-toast";

const EMPTY_RANGE: DateRange = { from: undefined, to: undefined };

/**
 * Booking form for a venue.
 *
 * @param venue - Venue information including price, maxGuests, and existing bookings.
 * @param authenticated - Whether the current user is signed in.
 *
 * @remarks
 * - Calculates total nights and price based on selected date range.
 * - Prevents booking on unavailable dates.
 * - Validates number of guests against `venue.maxGuests`.
 * - Displays toast notifications for errors, loading, and success.
 * - Clears selection after successful booking.
 */

export default function BookingForm({
  venue,
  authenticated,
}: {
  venue: VenueWithExtras;
  authenticated: boolean;
}) {
  const router = useRouter();
  const [range, setRange] = useState<DateRange>(EMPTY_RANGE);
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  const disabled = useMemo<Matcher[]>(
    () => [
      { before: startOfToday() },
      ...(venue.bookings ?? []).map((b) => ({
        from: new Date(b.dateFrom),
        to: new Date(b.dateTo),
      })),
    ],
    [venue.bookings]
  );

  const nights =
    range.from && range.to ? Math.max(1, differenceInCalendarDays(range.to, range.from)) : 0;

  const summary =
    nights > 0
      ? `${nights} night${nights === 1 ? "" : "s"} • €${nights * (venue.price ?? 0)}`
      : "Select dates";

  async function handleBooking() {
    if (!authenticated) {
      toast.error("Please sign in to book this venue.");
      return;
    }

    if (!range.from || !range.to) {
      toast("Pick a date range first.");
      return;
    }
    if (range.to < range.from) {
      toast.error("End date must be after start date.");
      return;
    }
    if (guests < 1 || guests > (venue.maxGuests ?? 1)) {
      toast.error(`Guests must be between 1 and ${venue.maxGuests}.`);
      return;
    }

    const payload = {
      dateFrom: formatISO(range.from, { representation: "date" }),
      dateTo: formatISO(range.to, { representation: "date" }),
      guests,
      venueId: venue.id,
    };

    setSubmitting(true);
    try {
      await toast.promise(
        (async () => {
          const r = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await r.json().catch(() => ({}));
          if (!r.ok)
            throw new Error(data?.errors?.[0]?.message || data?.message || "Booking failed");
        })(),
        {
          loading: "Booking your stay…",
          success: `Booking confirmed! ${summary}`,
          error: (e) => (e instanceof Error ? e.message : "Something went wrong"),
        }
      );

      setRange(EMPTY_RANGE);
      setBooked(true);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-sm border border-amber-500 p-5 shadow-sm">
      <div className="flex items-end justify-between">
        <div className="text-sm text-neutral-700">
          <div className="text-coffee font-medium">Your stay</div>
          <div className="text-neutral-500">{summary}</div>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <Users className="h-4 w-4" />
          <label className="flex items-center gap-2">
            <span className="sr-only">Guests</span>
            <input
              type="number"
              min={1}
              max={venue.maxGuests}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="text-coffee w-16 rounded-md border border-neutral-300 px-2 py-1"
            />
            <span className="text-neutral-500">/ {venue.maxGuests}</span>
          </label>
        </div>
      </div>

      <div className="mt-3">
        <CalendarRange
          value={range}
          onChange={(r) => setRange(r ?? EMPTY_RANGE)}
          disabled={disabled}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          disabled={!authenticated || !nights || guests < 1 || submitting}
          onClick={handleBooking}
        >
          {!authenticated
            ? "Sign in to book"
            : submitting
              ? "Booking…"
              : booked
                ? "Booked!"
                : "Book Now"}
        </button>
      </div>
    </div>
  );
}
