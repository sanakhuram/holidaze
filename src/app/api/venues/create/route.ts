/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/venues/create/route.ts
import { NextResponse } from "next/server";
import { noroffFetch } from "../../_utils/noroff";

/**
 *
 * @param req -Incoming request containing JSON body of type `Partial<CreateVenuePayload>`
 * @returns -JSON response with created venue data or validation / server errors
 */

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<{
      name: string;
      description: string;
      media: { url: string; alt?: string }[];
      price: number;
      maxGuests: number;
      rating?: number;
      meta?: Record<string, unknown>;
      location?: {
        address?: string;
        city?: string;
        zip?: string;
        country?: string;
        continent?: string;
        lat?: number;
        lng?: number;
      };
    }>;

    const errors: string[] = [];
    if (!body.name?.trim()) errors.push("name is required");
    if (!body.description?.trim()) errors.push("description is required");
    if (body.price == null || body.price < 0) errors.push("price must be a positive number");
    if (body.maxGuests == null || body.maxGuests < 1) errors.push("maxGuests must be >= 1");
    if (errors.length)
      return NextResponse.json({ message: "Invalid input", errors }, { status: 400 });

    const payload = {
      name: body.name!,
      description: body.description!,
      media: Array.isArray(body.media) ? body.media : [],
      price: Number(body.price),
      maxGuests: Number(body.maxGuests),
      rating: Number(body.rating ?? 0),
      meta: body.meta ?? {},
      location: {
        address: body.location?.address ?? null,
        city: body.location?.city ?? null,
        zip: body.location?.zip ?? null,
        country: body.location?.country ?? null,
        continent: body.location?.continent ?? null,
        lat: Number(body.location?.lat ?? 0),
        lng: Number(body.location?.lng ?? 0),
      },
    };

    const { resp, data } = await noroffFetch("/holidaze/venues", { method: "POST", json: payload });

    if (!resp.ok) {
      return NextResponse.json(
        { message: (data as any)?.message ?? "Create failed", errors: (data as any)?.errors ?? [] },
        { status: resp.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unexpected server error" },
      { status: 500 }
    );
  }
}
