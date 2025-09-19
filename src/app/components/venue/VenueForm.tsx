"use client";

import { useVenueForm } from "../../../hooks/useVenueForm";
import type { VenueFormValues } from "@/app/lib/venueForm";
import {
  Tag,
  DollarSign,
  Users,
  FileText,
  Star,
  MapPin,
  ImageIcon,
  X,
  Wifi,
  Car,
  Coffee,
  PawPrint,
} from "lucide-react";

export default function VenueForm({
  initial,
  submitLabel = "Save",
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: Partial<VenueFormValues>;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (data: VenueFormValues) => Promise<void> | void;
  onCancel: () => void;
}) {
  const {
    values,
    set,
    setLocation,
    setMeta,
    setMediaItem,
    addMedia,
    removeMedia,
    validate,
    error,
  } = useVenueForm(initial);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = validate();
    if (!ok) return;
    await onSubmit(ok);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 text-slate-700 md:grid-cols-2 ">
      {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}

      <label className="text-sm">
        <span className="mb-1 block">Name *</span>
        <div className="relative">
          <Tag className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pr-3 pl-9 focus:border-amber-500 focus:ring-amber-500"
            placeholder="Venue name"
          />
        </div>
      </label>

      <label className="text-sm">
        <span className="mb-1 block">Price (USD) *</span>
        <div className="relative">
          <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            min={0}
            value={values.price}
            onChange={(e) => set("price", Number(e.target.value))}
            className="w-full rounded-md border border-slate-300  py-2 pr-3 pl-9 focus:border-amber-500 focus:ring-amber-500"
            placeholder="0.00"
          />
        </div>
      </label>

      <label className="text-sm">
        <span className="mb-1 block">Max guests *</span>
        <div className="relative">
          <Users className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            min={1}
            value={values.maxGuests}
            onChange={(e) => set("maxGuests", Number(e.target.value))}
            className="w-full rounded-md border border-slate-300 py-2 pr-3 pl-9 focus:border-amber-500 focus:ring-amber-500"
            placeholder="1"
          />
        </div>
      </label>

      <label className="text-sm md:col-span-2">
        <span className="mb-1 block">Description *</span>
        <div className="relative">
          <FileText className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className="h-24 w-full rounded-md border border-slate-300  py-2 pr-3 pl-9 focus:border-amber-500 focus:ring-amber-500"
            placeholder="Write a short description"
          />
        </div>
      </label>

      <label className="text-sm">
        <span className="mb-1 block">Rating (0–5)</span>
        <div className="relative">
          <Star className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={values.rating ?? ""}
            onChange={(e) =>
              set("rating", e.target.value === "" ? undefined : Number(e.target.value))
            }
            className="w-full rounded-md border border-slate-300 py-2 pr-3 pl-9 focus:border-amber-500 focus:ring-amber-500"
            placeholder="e.g. 4.5"
          />
        </div>
      </label>

      <div className="space-y-2">
        <span className="block text-sm font-medium">Amenities</span>
        <label className="flex items-center gap-2 text-sm">
          <Wifi className="h-4 w-4 text-slate-500" />
          <input
            type="checkbox"
            checked={values.meta.wifi}
            onChange={(e) => setMeta("wifi", e.target.checked)}
          />
          Wi-Fi
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Car className="h-4 w-4 text-slate-500" />
          <input
            type="checkbox"
            checked={values.meta.parking}
            onChange={(e) => setMeta("parking", e.target.checked)}
          />
          Parking
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Coffee className="h-4 w-4 text-slate-500" />
          <input
            type="checkbox"
            checked={values.meta.breakfast}
            onChange={(e) => setMeta("breakfast", e.target.checked)}
          />
          Breakfast
        </label>
        <label className="flex items-center gap-2 text-sm">
          <PawPrint className="h-4 w-4 text-slate-500" />
          <input
            type="checkbox"
            checked={values.meta.pets}
            onChange={(e) => setMeta("pets", e.target.checked)}
          />
          Pets
        </label>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium">Location (optional)</span>
        <div className="relative">
          <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Address"
            value={values.location.address ?? ""}
            onChange={(e) => setLocation("address", e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pr-3 pl-9 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="City"
            value={values.location.city ?? ""}
            onChange={(e) => setLocation("city", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          <input
            placeholder="ZIP"
            value={values.location.zip ?? ""}
            onChange={(e) => setLocation("zip", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Country"
            value={values.location.country ?? ""}
            onChange={(e) => setLocation("country", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          <input
            placeholder="Continent"
            value={values.location.continent ?? ""}
            onChange={(e) => setLocation("continent", e.target.value)}
            className="w-full rounded-md border border-slate-300  px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={values.location.lat ?? ""}
            onChange={(e) =>
              setLocation("lat", e.target.value === "" ? undefined : Number(e.target.value))
            }
            className="w-full rounded-md border border-slate-300  px-3 py-2"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={values.location.lng ?? ""}
            onChange={(e) =>
              setLocation("lng", e.target.value === "" ? undefined : Number(e.target.value))
            }
            className="w-full rounded-md border border-slate-300  px-3 py-2"
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Images</span>
          <button
            type="button"
            onClick={addMedia}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
          >
            <ImageIcon className="h-4 w-4" />
            Add image
          </button>
        </div>
        <div className="space-y-2">
          {values.media.map((m, i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-2">
              <input
                className="col-span-7 rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="https://image.url"
                value={m.url}
                onChange={(e) => setMediaItem(i, "url", e.target.value)}
              />
              <input
                className="col-span-4 rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Alt text"
                value={m.alt ?? ""}
                onChange={(e) => setMediaItem(i, "alt", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeMedia(i)}
                className="col-span-1 flex items-center justify-center rounded-md border border-slate-300  p-2 hover:bg-red-50"
              >
                <X className="h-5 w-5 text-red-500" />
              </button>
              {m.url ? (
                <div className="col-span-12 h-24 overflow-hidden rounded-md border border-slate-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.alt ?? ""} className="h-full w-full object-cover" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 md:col-span-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300  px-4 py-2 text-sm hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
