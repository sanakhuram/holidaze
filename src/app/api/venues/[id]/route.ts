// src/app/api/venues/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { noroffFetch, strip } from "../../_utils/noroff";

// Zod schema
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
    .object({ address: s, city: s, zip: s, country: s, continent: s, lat: n, lng: n })
    .optional(),
});

type RouteCtx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const json = await req.json();

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
  const payload = strip({
    name: v.name,
    description: v.description,
    price: v.price,
    maxGuests: v.maxGuests,
    rating: v.rating,
    meta: v.meta ? strip(v.meta) : undefined,
    location: v.location ? strip(v.location) : undefined,
    media: v.media?.filter((m) => m.url?.length).map((m) => strip({ url: m.url, alt: m.alt })),
  });

  const { resp, data } = await noroffFetch(`/holidaze/venues/${encodeURIComponent(id)}`, {
    method: "PUT",
    json: payload,
  });

  return NextResponse.json(data, { status: resp.status });
}

export async function DELETE(_req: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const { resp, data } = await noroffFetch(`/holidaze/venues/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  return resp.status === 204
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json(data, { status: resp.status });
}
