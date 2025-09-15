// src/app/components/venue/VenueForm.tsx
"use client";

import { useVenueForm } from "./useVenueForm";
import type { VenueFormValues } from "@/app/lib/venueForm";

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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}

      <label className="text-sm">
        <span className="mb-1 block text-slate-600">Name *</span>
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="text-sm md:col-span-1">
        <span className="mb-1 block text-slate-600">Price (EUR) *</span>
        <input
          type="number"
          min={0}
          value={values.price}
          onChange={(e) => set("price", Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block text-slate-600">Max guests *</span>
        <input
          type="number"
          min={1}
          value={values.maxGuests}
          onChange={(e) => set("maxGuests", Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="text-sm md:col-span-2">
        <span className="mb-1 block text-slate-600">Description *</span>
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="h-24 w-full rounded-md border px-3 py-2"
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block text-slate-600">Rating (0–5)</span>
        <input
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={values.rating ?? ""}
          onChange={(e) =>
            set("rating", e.target.value === "" ? undefined : Number(e.target.value))
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </label>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-slate-700">Amenities</span>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.meta.wifi}
            onChange={(e) => setMeta("wifi", e.target.checked)}
          />{" "}
          Wi-Fi
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.meta.parking}
            onChange={(e) => setMeta("parking", e.target.checked)}
          />{" "}
          Parking
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.meta.breakfast}
            onChange={(e) => setMeta("breakfast", e.target.checked)}
          />{" "}
          Breakfast
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.meta.pets}
            onChange={(e) => setMeta("pets", e.target.checked)}
          />{" "}
          Pets
        </label>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-slate-700">Location (optional)</span>
        <input
          placeholder="Address"
          value={values.location.address ?? ""}
          onChange={(e) => setLocation("address", e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="City"
            value={values.location.city ?? ""}
            onChange={(e) => setLocation("city", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          <input
            placeholder="ZIP"
            value={values.location.zip ?? ""}
            onChange={(e) => setLocation("zip", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Country"
            value={values.location.country ?? ""}
            onChange={(e) => setLocation("country", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          <input
            placeholder="Continent"
            value={values.location.continent ?? ""}
            onChange={(e) => setLocation("continent", e.target.value)}
            className="w-full rounded-md border px-3 py-2"
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
            className="w-full rounded-md border px-3 py-2"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={values.location.lng ?? ""}
            onChange={(e) =>
              setLocation("lng", e.target.value === "" ? undefined : Number(e.target.value))
            }
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Images</span>
          <button
            type="button"
            onClick={addMedia}
            className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
          >
            + Add image
          </button>
        </div>
        <div className="space-y-2">
          {values.media.map((m, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                className="col-span-7 rounded-md border px-3 py-2 text-sm"
                placeholder="https://image.url"
                value={m.url}
                onChange={(e) => setMediaItem(i, "url", e.target.value)}
              />
              <input
                className="col-span-4 rounded-md border px-3 py-2 text-sm"
                placeholder="Alt text"
                value={m.alt ?? ""}
                onChange={(e) => setMediaItem(i, "alt", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeMedia(i)}
                className="col-span-1 rounded-md border px-2 py-2 text-xs hover:bg-slate-50"
              >
                ✕
              </button>
              {m.url ? (
                <div className="col-span-12 h-24 overflow-hidden rounded-md border">
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
          className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
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
