// src/app/lib/venueForm.ts
import { z } from "zod";

export const mediaSchema = z.object({
  url: z.string().url("Must be a valid URL (http/https)").or(z.literal("")),
  alt: z.string().nullable().optional(),
});

export const venueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().nonnegative("Price must be ≥ 0"),
  maxGuests: z.number().int().min(1, "At least 1 guest"),
  rating: z.number().min(0).max(5).nullable().optional(),
  media: z.array(mediaSchema),

  meta: z.object({
    wifi: z.boolean(),
    parking: z.boolean(),
    breakfast: z.boolean(),
    pets: z.boolean(),
  }),

  location: z.object({
    address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    zip: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    continent: z.string().nullable().optional(),
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
  }),
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;

export const parseNumber = (v: string) => (v === "" ? undefined : Number(v));

export function toCreatePayload(v: VenueFormValues) {
  return {
    ...v,
    rating: v.rating ?? 0,
    media: v.media.filter((m) => m.url),
    location: {
      ...v.location,
      address: v.location.address || null,
      city: v.location.city || null,
      zip: v.location.zip || null,
      country: v.location.country || null,
      continent: v.location.continent || null,
      lat: v.location.lat ?? 0,
      lng: v.location.lng ?? 0,
    },
  };
}

export function toUpdatePayload(v: VenueFormValues) {
  return {
    ...v,
    media: v.media.filter((m) => m.url),
    location: {
      ...v.location,
      address: v.location.address || undefined,
      city: v.location.city || undefined,
      zip: v.location.zip || undefined,
      country: v.location.country || undefined,
      continent: v.location.continent || undefined,
      lat: v.location.lat ?? undefined,
      lng: v.location.lng ?? undefined,
    },
  };
}
