"use client";

import { useMemo, useState } from "react";
import { venueFormSchema, type VenueFormValues } from "@/app/lib/venueForm";

function sanitizeNulls<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_k, v) => (v === null ? undefined : v))) as T;
}

export function useVenueForm(initial?: Partial<VenueFormValues>) {
  const defaults: VenueFormValues = useMemo(() => {
    const base: VenueFormValues = {
      name: "",
      description: "",
      price: 0,
      maxGuests: 1,
      rating: undefined,
      media: [{ url: "", alt: undefined }],
      meta: { wifi: false, parking: false, breakfast: false, pets: false },
      location: {},
    };

    const clean = sanitizeNulls<Partial<VenueFormValues>>(initial ?? {});

    const media: VenueFormValues["media"] =
      Array.isArray(clean.media) && clean.media.length > 0
        ? clean.media.map((m): VenueFormValues["media"][number] => ({
            url: m?.url ?? "",
            alt: m?.alt ?? undefined,
          }))
        : base.media;

    return {
      ...base,
      ...clean,
      media,
    };
  }, [initial]);

  const [values, setValues] = useState<VenueFormValues>(defaults);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof VenueFormValues>(k: K, val: VenueFormValues[K]) =>
    setValues((v) => ({ ...v, [k]: val }));

  const setLocation = <K extends keyof VenueFormValues["location"]>(
    k: K,
    val: VenueFormValues["location"][K]
  ) =>
    setValues((v) => ({
      ...v,
      location: { ...v.location, [k]: val },
    }));

  const setMeta = <K extends keyof VenueFormValues["meta"]>(
    k: K,
    val: VenueFormValues["meta"][K]
  ) =>
    setValues((v) => ({
      ...v,
      meta: { ...v.meta, [k]: val },
    }));

  const setMediaItem = (
    i: number,
    k: "url" | "alt",
    val: VenueFormValues["media"][number][typeof k]
  ) =>
    setValues((v) => ({
      ...v,
      media: v.media.map((m, idx) => (idx === i ? { ...m, [k]: val } : m)),
    }));

  const addMedia = () =>
    setValues((v) => ({
      ...v,
      media: [...v.media, { url: "", alt: undefined }],
    }));

  const removeMedia = (i: number) =>
    setValues((v) => ({
      ...v,
      media: v.media.filter((_, idx) => idx !== i),
    }));

  const validate = () => {
    const parsed = venueFormSchema.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? "Invalid form");
      return null;
    }
    setError(null);
    return parsed.data;
  };

  return {
    values,
    set,
    setLocation,
    setMeta,
    setMediaItem,
    addMedia,
    removeMedia,
    validate,
    error,
    setError,
    loading,
    setLoading,
  };
}
