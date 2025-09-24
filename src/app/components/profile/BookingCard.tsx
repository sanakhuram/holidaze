"use client";

import { Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/app/components/ui/SafeImage";
import CancelBookingButton from "../bookings/CancelBookingButton";
import EditBookingButton from "../bookings/EditBookingButton";
import type { BookingWithVenue } from "@/app/lib/types";

export default function BookingCard({
  b,
  onCancelled,
  onEdited,
  readonly = false,
}: {
  b: BookingWithVenue;
  onCancelled?: () => void;
  onEdited?: () => void;
  readonly?: boolean;
}) {
  const v = b.venue ?? undefined;
  const img = v?.media?.[0]?.url ?? null;
  const alt = v?.media?.[0]?.alt ?? v?.name ?? "Venue";
  const city = v?.location?.city ?? "";
  const price = v?.price ?? 0;

  return (
    <div className="from-wine to-coffee w-full rounded-xl border border-amber-600/25 bg-gradient-to-r p-3 text-amber-500 shadow-sm md:p-4">
      <div className="flex flex-wrap justify-between gap-3">
        <Link
          href={v ? `/venues/${v.id}` : "#"}
          aria-label={`View booking for ${v?.name ?? "venue"}`}
          className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28"
        >
          <SafeImage src={img} alt={alt} className="h-full w-full object-cover" />
        </Link>

        {!readonly && (
          <div className="flex items-start gap-2">
            <EditBookingButton booking={b} onEdited={onEdited}>
              <span className="bg-coffee/40 hover:bg-coffee/60 inline-flex h-8 w-8 items-center justify-center rounded-md border border-amber-400">
                <Pencil className="h-4 w-4 text-amber-400" />
              </span>
            </EditBookingButton>

            <CancelBookingButton bookingId={b.id} onCancelled={onCancelled}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-400 bg-rose-500/10 hover:bg-rose-500/20">
                <Trash2 className="h-4 w-4 text-red-500" />
              </span>
            </CancelBookingButton>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Link
            href={v ? `/venues/${v.id}` : "#"}
            className="flex items-center gap-2 hover:underline"
          >
            <h3 className="truncate text-base font-semibold md:text-lg">
              {v?.name ?? "Unknown venue"}
            </h3>
            {city && (
              <span className="truncate text-xs text-amber-200/70 md:text-sm">• {city}</span>
            )}
          </Link>

          <div className="mt-1 grid gap-1 text-sm md:text-[15px]">
            <div>
              <span className="font-medium text-emerald-300">Check-in:</span>{" "}
              <span>{new Date(b.dateFrom).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium text-rose-300">Check-out:</span>{" "}
              <span>{new Date(b.dateTo).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-amber-200/80">
              <Users className="h-4 w-4" />
              <span>
                {b.guests} guest{b.guests === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs text-amber-200/70">
            Booking ref: <span className="font-mono">{b.id}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-amber-200/70">Total</div>
          <div className="text-lg font-bold text-amber-100">€{price}</div>
        </div>
      </div>
    </div>
  );
}
