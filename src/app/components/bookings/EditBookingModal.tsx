// src/app/components/EditBookingModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { BookingWithVenue } from "@/app/lib/types";
import CalendarRange from "./CalenderRange";
import GuestsRow from "./GuestRow";
import type { DateRange, Matcher } from "react-day-picker";
import { differenceInCalendarDays, formatISO, startOfToday } from "date-fns";

const EMPTY_RANGE: DateRange = { from: undefined, to: undefined };

export default function EditBookingModal({
  open,
  onClose,
  booking,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  booking: BookingWithVenue;
  onSaved?: () => void | Promise<void>;
}) {
  const [range, setRange] = useState<DateRange>(EMPTY_RANGE);
  const [guests, setGuests] = useState<number>(booking.guests);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const maxGuests = booking.venue?.maxGuests ?? 1;

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setGuests(booking.guests);
    setRange({
      from: new Date(booking.dateFrom),
      to: new Date(booking.dateTo),
    });
  }, [open, booking]);

  const disabled: Matcher[] = useMemo(() => {
    const others = (
      (booking.venue as typeof booking.venue & { bookings?: BookingWithVenue[] })?.bookings ?? []
    ).filter((b) => b.id !== booking.id);
    return [
      { before: startOfToday() },
      ...others.map((b) => ({
        from: new Date(b.dateFrom),
        to: new Date(b.dateTo),
      })),
    ];
  }, [booking]);

  const summary = useMemo(() => {
    if (!range.from || !range.to) return "Pick dates";
    const nights = Math.max(1, differenceInCalendarDays(range.to, range.from));
    return `${nights} night${nights === 1 ? "" : "s"}`;
  }, [range]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!range.from || !range.to) {
      setErr("Please select a date range.");
      return;
    }
    if (range.to < range.from) {
      setErr("End date must be after start date.");
      return;
    }
    if (guests < 1 || guests > maxGuests) {
      setErr(`Guests must be between 1 and ${maxGuests}.`);
      return;
    }

    setLoading(true);
    setErr(null);
    try {
      const payload = {
        dateFrom: formatISO(range.from, { representation: "date" }),
        dateTo: formatISO(range.to, { representation: "date" }),
        guests,
      };

      const r = await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const rd = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(rd?.errors?.[0]?.message || rd?.message || "Update failed");

      await (onSaved?.() ?? Promise.resolve());
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-amber-600/30 bg-gradient-to-r from-coffee to-wine p-6 text-amber-100 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit booking</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-amber-100/80 hover:bg-amber-500/10"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        {err && <p className="mb-3 text-sm text-red-400">{err}</p>}

        <form onSubmit={submit}>
          <CalendarRange
            value={range}
            onChange={(r) => setRange(r ?? EMPTY_RANGE)}
            disabled={disabled}
          />

          <GuestsRow maxGuests={maxGuests} guests={guests} onChange={setGuests} summary={summary} />

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded border border-amber-600/30 px-4 py-2 text-amber-100 hover:bg-amber-500/10"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="rounded bg-amber-600 px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
