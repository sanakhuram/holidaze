/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/venues/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

const BASE = process.env.NOROFF_API_URL ?? "https://v2.api.noroff.dev";
const API_KEY = process.env.NOROFF_API_KEY;

const strip = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null)) as Partial<T>;

const s = z.string().trim().optional().nullable();
const n = z.coerce.number().optional().nullable();
const b = z.boolean().optional();

const Media = z.object({ url: s, alt: s });
const UpdateSchema = z.object({
  name: s,
  description: s,
  price: n,
  maxGuests: n,
  rating: n,
  media: z.array(Media).optional(),
  meta: z.object({ wifi: b, parking: b, breakfast: b, pets: b }).optional(),
  location: z
    .object({
      address: s,
      city: s,
      zip: s,
      country: s,
      continent: s,
      lat: n,
      lng: n,
    })
    .optional(),
});

type RouteCtx = { params: Promise<{ id: string }> };

// PUT /api/venues/:id
export async function PUT(req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params; // await params
  const jar = await cookies(); // await cookies()
  const token = jar.get("noroff_token")?.value;
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const json = (await req.json().catch(() => ({}))) as unknown;
  const parsed = UpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid input",
        errors: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 }
    );
  }

  const v = parsed.data;
  const payload: Record<string, unknown> = strip({
    name: v.name ?? undefined,
    description: v.description ?? undefined,
    price: v.price ?? undefined,
    maxGuests: v.maxGuests ?? undefined,
    rating: v.rating ?? undefined,
    meta: v.meta ? strip(v.meta) : undefined,
    location: v.location ? strip(v.location) : undefined,
    media: v.media
      ? v.media
          .filter((m) => (m.url ?? "").length > 0)
          .map((m) => strip({ url: m.url ?? undefined, alt: m.alt ?? undefined }))
      : undefined,
  });

  const up = await fetch(`${BASE}/holidaze/venues/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await up.json().catch(() => ({}));
  if (!up.ok) {
    return NextResponse.json(
      { message: (data as any)?.message || "Update failed", errors: (data as any)?.errors ?? [] },
      { status: up.status }
    );
  }
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(_req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params; 
  const jar = await cookies(); 
  const token = jar.get("noroff_token")?.value;
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const del = await fetch(`${BASE}/holidaze/venues/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!del.ok && del.status !== 204) {
    const data = await del.json().catch(() => ({}));
    return NextResponse.json(
      { message: (data as any)?.message || "Delete failed", errors: (data as any)?.errors ?? [] },
      { status: del.status }
    );
  }
  return new NextResponse(null, { status: 204 });
}
