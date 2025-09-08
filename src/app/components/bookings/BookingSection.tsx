"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { VenueWithExtras } from "@/app/lib/types";
import { MapPin, Star, User, Users } from "lucide-react";
import Amenities from "./Amenities";
import CalendarRange from "./CalenderRange";
import MapCard from "./MapCard";
import { differenceInCalendarDays, startOfToday, formatISO } from "date-fns";
import toast from "react-hot-toast";
import type { DateRange, Matcher } from "react-day-picker";

const EMPTY_RANGE: DateRange = { from: undefined, to: undefined };

export default function BookingSection({ venue }: { venue: VenueWithExtras }) {
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

  const hasCoords = !!venue.location?.lat && !!venue.location?.lng;
  const q =
    venue.location?.address || venue.location?.city || venue.location?.country || venue.name;

  async function handleBooking() {
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
    <section className="rounded-sm border border-amber-500 p-5 shadow-sm md:p-6">
      <h2 className="mb-4 text-center text-xl font-semibold text-wine md:mb-6">Book Now</h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-sm border border-amber-500 p-5 shadow-sm">
          <h3 className="mb-3 text-center text-amber-600 font-semibold text-lg">Info</h3>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-coffee">€{venue.price}</div>
              <div className="text-xs text-neutral-500">per night</div>
            </div>
            <div className="flex items-center gap-1 text-sm text-neutral-700">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{venue.rating ?? 0}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-wine">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {venue.location?.address ||
                venue.location?.city ||
                venue.location?.country ||
                "Location"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-neutral-700">
            <User className="h-4 w-4 text-yellow-500" />
            <span>
              {typeof venue.owner === "object" && venue.owner !== null
                ? (venue.owner.name ?? "Owner")
                : (venue.owner ?? "Owner")}
            </span>
          </div>

          <div className="mt-1 text-sm text-neutral-700">Max guests: {venue.maxGuests}</div>

          <div className="my-5 h-px w-full bg-amber-600/25" />

          <h3 className="mb-2 text-center text-amber-600 font-semibold text-lg">Amenities</h3>
          <Amenities meta={venue.meta} />
        </div>

        <div className="rounded-sm border border-amber-500 p-5 shadow-sm">
          <div className="flex items-end justify-between">
            <div className="text-sm text-neutral-700">
              <div className="font-medium text-coffee">Your stay</div>
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
                  className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-coffee"
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
              disabled={!nights || guests < 1 || submitting}
              onClick={handleBooking}
            >
              {submitting ? "Booking…" : booked ? "Booked!" : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border text-wine border-amber-500 p-3 shadow-sm">
        <MapCard
          hasCoords={hasCoords}
          lat={venue.location?.lat}
          lng={venue.location?.lng}
          query={q || venue.name}
          label="Location"
        />
      </div>
    </section>
  );
}
